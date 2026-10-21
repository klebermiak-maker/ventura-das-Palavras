/**
 * Gerenciador de Configurações Pedagógicas do Espaço do Professor
 * Permite definir tempo limite de inatividade para acionamento de dicas pedagógicas,
 * parâmetros da BNCC e regras do diagnóstico.
 */

export interface PedagogicalSettings {
  /** Tempo em segundos de inatividade antes de sugerir a 1ª ajuda (ex: 15, 30, 45, 60s) */
  hintInactivitySeconds: number;
  /** Se o gatilho automático de dicas por inatividade está habilitado */
  autoHintsEnabled: boolean;
  /** Quantidade mínima de questões distintas para gerar diagnóstico consolidado */
  minQuestionsForDiagnostic: number;
  /** Limite percentual para classificar 'Precisa de Reforço' (< x%) */
  thresholdReinforcement: number;
  /** Limite percentual para classificar 'Objetivo Atingido' (>= x%) */
  thresholdMastered: number;
  /** Mensagem pedagógica personalizada de encorajamento */
  encouragementMessage: string;
}

export const DEFAULT_PEDAGOGICAL_SETTINGS: PedagogicalSettings = {
  hintInactivitySeconds: 30,
  autoHintsEnabled: true,
  minQuestionsForDiagnostic: 3,
  thresholdReinforcement: 60,
  thresholdMastered: 80,
  encouragementMessage: 'Leia com calma e procure palavras-chave no texto para confirmar sua resposta!',
};

const STORAGE_KEY = 'aventura_pedagogical_settings_v1';
const EVENT_KEY = 'pedagogical_settings_updated';

/**
 * Obtém as configurações pedagógicas atuais salvas pelo professor,
 * ou retorna os valores padrão recomendados pela BNCC.
 */
export function getPedagogicalSettings(): PedagogicalSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_PEDAGOGICAL_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PEDAGOGICAL_SETTINGS;

    const parsed = JSON.parse(raw);
    return {
      hintInactivitySeconds:
        typeof parsed.hintInactivitySeconds === 'number' && parsed.hintInactivitySeconds >= 0
          ? parsed.hintInactivitySeconds
          : DEFAULT_PEDAGOGICAL_SETTINGS.hintInactivitySeconds,
      autoHintsEnabled:
        typeof parsed.autoHintsEnabled === 'boolean'
          ? parsed.autoHintsEnabled
          : DEFAULT_PEDAGOGICAL_SETTINGS.autoHintsEnabled,
      minQuestionsForDiagnostic:
        typeof parsed.minQuestionsForDiagnostic === 'number' && parsed.minQuestionsForDiagnostic > 0
          ? parsed.minQuestionsForDiagnostic
          : DEFAULT_PEDAGOGICAL_SETTINGS.minQuestionsForDiagnostic,
      thresholdReinforcement:
        typeof parsed.thresholdReinforcement === 'number'
          ? parsed.thresholdReinforcement
          : DEFAULT_PEDAGOGICAL_SETTINGS.thresholdReinforcement,
      thresholdMastered:
        typeof parsed.thresholdMastered === 'number'
          ? parsed.thresholdMastered
          : DEFAULT_PEDAGOGICAL_SETTINGS.thresholdMastered,
      encouragementMessage:
        typeof parsed.encouragementMessage === 'string' && parsed.encouragementMessage.trim()
          ? parsed.encouragementMessage
          : DEFAULT_PEDAGOGICAL_SETTINGS.encouragementMessage,
    };
  } catch {
    return DEFAULT_PEDAGOGICAL_SETTINGS;
  }
}

/**
 * Salva as alterações feitas pelo professor e notifica componentes ativos.
 */
export function savePedagogicalSettings(
  updates: Partial<PedagogicalSettings>
): PedagogicalSettings {
  const current = getPedagogicalSettings();
  const next: PedagogicalSettings = {
    ...current,
    ...updates,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: next }));
    }
  } catch (error) {
    console.error('Falha ao salvar configurações pedagógicas:', error);
  }

  return next;
}

/**
 * Restaura todas as configurações pedagógicas para os padrões recomendados.
 */
export function resetPedagogicalSettings(): PedagogicalSettings {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: DEFAULT_PEDAGOGICAL_SETTINGS }));
    }
  } catch (error) {
    console.error('Falha ao redefinir configurações pedagógicas:', error);
  }
  return DEFAULT_PEDAGOGICAL_SETTINGS;
}

/**
 * Inscreve um ouvinte para receber atualizações instantâneas de configurações.
 */
export function subscribePedagogicalSettings(
  callback: (settings: PedagogicalSettings) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<PedagogicalSettings>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getPedagogicalSettings());
    }
  };

  window.addEventListener(EVENT_KEY, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(EVENT_KEY, handler);
    window.removeEventListener('storage', handler);
  };
}
