import { useState, useEffect, useRef, useCallback } from 'react';
import { getPedagogicalSettings, subscribePedagogicalSettings } from '../utils/pedagogicalConfig';

export interface UseMissionTipsOptions {
  questionId: string;
  hasSubmitted: boolean;
  hintLevel: number;
  completedQuestions?: Record<string, boolean>;
  /** Limite em segundos de inatividade configurado. Se omitido, usa a configuração do Espaço do Professor. */
  thresholdSeconds?: number;
  /** Se o gatilho automático está habilitado. Se omitido, usa a configuração do Espaço do Professor. */
  enabled?: boolean;
  onAutoSuggest?: () => void;
}

export interface UseMissionTipsReturn {
  secondsElapsed: number;
  isTipSuggested: boolean;
  dismissTip: () => void;
  acceptTip: () => void;
  isPreviouslyCompleted: boolean;
  tipMessage: string;
  configuredThreshold: number;
  isAutoEnabled: boolean;
}

/**
 * Hook customizado que monitora o tempo de inatividade e reflexão do estudante
 * na questão de leitura atual.
 * Se o aluno demorar mais que o tempo limite configurado pelo professor (ex: 30s, 60s)
 * sem responder ou solicitar dica, sugere suavemente a primeira ajuda pedagógica.
 */
export function useMissionTips({
  questionId,
  hasSubmitted,
  hintLevel,
  completedQuestions = {},
  thresholdSeconds,
  enabled,
  onAutoSuggest,
}: UseMissionTipsOptions): UseMissionTipsReturn {
  // Configurações pedagógicas atuais
  const [config, setConfig] = useState(() => getPedagogicalSettings());

  useEffect(() => {
    // Inscreve para ouvir mudanças instantâneas feitas no Espaço do Professor
    const unsubscribe = subscribePedagogicalSettings(updated => {
      setConfig(updated);
    });
    return unsubscribe;
  }, []);

  // Limite efetivo: prop prioritária sobre configuração global salva
  const effectiveThreshold = thresholdSeconds !== undefined ? thresholdSeconds : config.hintInactivitySeconds;
  const isAutoEnabled =
    (enabled !== undefined ? enabled : config.autoHintsEnabled) &&
    effectiveThreshold > 0 &&
    config.autoHintsEnabled;

  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTipSuggested, setIsTipSuggested] = useState<boolean>(false);
  const [dismissedForQuestionId, setDismissedForQuestionId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onAutoSuggestRef = useRef(onAutoSuggest);

  useEffect(() => {
    onAutoSuggestRef.current = onAutoSuggest;
  }, [onAutoSuggest]);

  // Verifica se o aluno já completou esta questão em sessões anteriores
  const isPreviouslyCompleted = Boolean(completedQuestions[questionId]);

  // Reinicia o cronômetro ao mudar de questão ou após submeter resposta
  useEffect(() => {
    setSecondsElapsed(0);
    setIsTipSuggested(false);
  }, [questionId]);

  // Efeito do cronômetro de inatividade
  useEffect(() => {
    // Para contagem se ajuda automática estiver desativada, se já submeteu,
    // se já abriu dica manualmente, ou se descartou a sugestão nesta questão
    if (
      !isAutoEnabled ||
      hasSubmitted ||
      hintLevel > 0 ||
      dismissedForQuestionId === questionId
    ) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsElapsed(prev => {
        const next = prev + 1;
        if (next >= effectiveThreshold && !isTipSuggested) {
          setIsTipSuggested(true);
          if (onAutoSuggestRef.current) {
            onAutoSuggestRef.current();
          }
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    isAutoEnabled,
    hasSubmitted,
    hintLevel,
    questionId,
    effectiveThreshold,
    isTipSuggested,
    dismissedForQuestionId,
  ]);

  const dismissTip = useCallback(() => {
    setIsTipSuggested(false);
    setDismissedForQuestionId(questionId);
  }, [questionId]);

  const acceptTip = useCallback(() => {
    setIsTipSuggested(false);
  }, []);

  // Formata o tempo de inatividade em texto amigável
  const formatTimeLabel = (secs: number) => {
    if (secs >= 60) {
      const minutes = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      if (remainingSecs === 0) {
        return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
      }
      return `${minutes}m ${remainingSecs}s`;
    }
    return `${secs} segundos`;
  };

  const tipMessage = isPreviouslyCompleted
    ? 'Você já respondeu a esta questão antes! Se quiser relembrar as pistas do texto para responder com segurança, podemos liberar uma dica.'
    : `Percebemos que você está pensando há mais de ${formatTimeLabel(effectiveThreshold)} nesta pergunta. Gostaria de uma dica inicial para orientar sua busca no texto?`;

  return {
    secondsElapsed,
    isTipSuggested: isTipSuggested && hintLevel === 0 && !hasSubmitted && isAutoEnabled,
    dismissTip,
    acceptTip,
    isPreviouslyCompleted,
    tipMessage,
    configuredThreshold: effectiveThreshold,
    isAutoEnabled,
  };
}
