import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Sliders,
  RotateCcw,
  Save,
  HelpCircle,
  Eye,
  ShieldCheck,
  Zap,
  Info,
  BookOpen,
} from 'lucide-react';
import {
  getPedagogicalSettings,
  savePedagogicalSettings,
  resetPedagogicalSettings,
  PedagogicalSettings,
} from '../utils/pedagogicalConfig';
import { soundManager } from '../utils/audio';

interface Props {
  onSettingsSaved?: (newSettings: PedagogicalSettings) => void;
  onNavigateToMission?: (mission: string) => void;
}

const PRESET_THRESHOLDS = [
  {
    seconds: 15,
    title: '15 segundos',
    badge: 'Apoio Ágil',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Intervenção rápida para estudantes com maior dispersão ou dificuldade em manter o foco.',
  },
  {
    seconds: 30,
    title: '30 segundos',
    badge: 'Recomendado BNCC',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Equilíbrio ideal: concede tempo suficiente para leitura atenta do texto sem gerar ansiedade ou bloqueio.',
  },
  {
    seconds: 45,
    title: '45 segundos',
    badge: 'Leitura Reflexiva',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    description: 'Estimula uma segunda releitura do parágrafo antes de oferecer pistas pedagógicas.',
  },
  {
    seconds: 60,
    title: '60 segundos (1 min)',
    badge: 'Tempo Prolongado',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Promove autonomia e persistência investigativa para alunos de ritmo mais metódico.',
  },
  {
    seconds: 90,
    title: '90 segundos (1m30s)',
    badge: 'Autonomia Máxima',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Para turmas com boa fluência leitora ou avaliações formativas mais independentes.',
  },
];

export const ConfiguracoesPedagogicas: React.FC<Props> = ({
  onSettingsSaved,
  onNavigateToMission,
}) => {
  const [settings, setSettings] = useState<PedagogicalSettings>(() => getPedagogicalSettings());
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const [previewTestTriggered, setPreviewTestTriggered] = useState(false);
  const [previewSeconds, setPreviewSeconds] = useState(0);

  // Sincroniza estado com o armazenamento ao montar
  useEffect(() => {
    setSettings(getPedagogicalSettings());
  }, []);

  // Simulação interativa no card de prévia
  useEffect(() => {
    if (!previewTestTriggered) {
      setPreviewSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setPreviewSeconds(prev => {
        if (prev >= (settings.hintInactivitySeconds || 30)) {
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [previewTestTriggered, settings.hintInactivitySeconds]);

  const handleSelectThreshold = (secs: number) => {
    soundManager.playClick();
    setSettings(prev => ({
      ...prev,
      hintInactivitySeconds: secs,
      autoHintsEnabled: true,
    }));
  };

  const handleToggleAutoHints = () => {
    soundManager.playClick();
    setSettings(prev => ({
      ...prev,
      autoHintsEnabled: !prev.autoHintsEnabled,
    }));
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSettings(prev => ({
      ...prev,
      hintInactivitySeconds: val,
    }));
  };

  const handleSave = () => {
    soundManager.playCorrect();
    const updated = savePedagogicalSettings(settings);
    setSettings(updated);
    if (onSettingsSaved) {
      onSettingsSaved(updated);
    }
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 3500);
  };

  const handleReset = () => {
    soundManager.playClick();
    const def = resetPedagogicalSettings();
    setSettings(def);
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Feedback Toast Banner */}
      <AnimatePresence>
        {showSavedFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            className="p-4 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold">Configurações Pedagógicas Salvas com Sucesso!</h4>
                <p className="text-xs text-emerald-100">
                  O tempo de inatividade de {settings.autoHintsEnabled ? `${settings.hintInactivitySeconds}s` : 'Desativado'} já está ativo em todas as missões (Detetive dos Fatos, Bússola e Mago das Palavras).
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSavedFeedback(false)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 font-semibold cursor-pointer shrink-0"
            >
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card: Configuração de Inatividade & useMissionTips */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hook de Apoio Pedagógico: useMissionTips</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-2">
              Tempo Limite de Inatividade para Dica Automática
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Define quanto tempo o aluno pode refletir na questão de leitura antes que o jogo ofereça suavemente o primeiro nível de apoio pedagógico, prevenindo bloqueio e frustração sem tirar sua autonomia.
            </p>
          </div>

          {/* Master Toggle */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
            <span className="text-xs font-bold text-slate-700">
              {settings.autoHintsEnabled ? 'Ajuda Automática Ativa' : 'Ajuda Apenas Manual'}
            </span>
            <button
              type="button"
              onClick={handleToggleAutoHints}
              role="switch"
              aria-checked={settings.autoHintsEnabled}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                settings.autoHintsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  settings.autoHintsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Informative Callout */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-semibold text-amber-950">
              Como funciona o apoio progressivo na missão Detetive dos Fatos (ExplicitasGame):
            </p>
            <p className="leading-relaxed text-amber-800">
              Ao atingir o tempo limite configurado, um aviso amigável pergunta: <em>"Percebemos que você está pensando há mais de {settings.hintInactivitySeconds}s nesta pergunta. Gostaria de uma dica inicial para orientar sua busca no texto?"</em>. O estudante pode aceitar ou clicar em <em>"Continuar pensando sozinho"</em>.
            </p>
          </div>
        </div>

        {/* Preset Cards Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block">
            Selecione o Tempo Limite Recomendado
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_THRESHOLDS.map(preset => {
              const isSelected =
                settings.autoHintsEnabled && settings.hintInactivitySeconds === preset.seconds;

              return (
                <button
                  key={preset.seconds}
                  type="button"
                  onClick={() => handleSelectThreshold(preset.seconds)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{preset.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${preset.badgeColor}`}>
                        {preset.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-2 border-t border-indigo-200/60 flex items-center gap-1.5 text-indigo-700 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Configuração Selecionada</span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Option to disable auto suggestion */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSettings(prev => ({
                  ...prev,
                  autoHintsEnabled: false,
                }));
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                !settings.autoHintsEnabled
                  ? 'border-rose-600 bg-rose-50/40 shadow-md ring-2 ring-rose-500/20'
                  : 'border-slate-200 bg-white hover:border-rose-200 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Zap className={`w-4 h-4 ${!settings.autoHintsEnabled ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>Apenas Manual</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-300">
                    Sem Inatividade
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Desativa o gatilho automático por inatividade. O aluno só receberá dicas ao clicar explicitamente no botão "Preciso de uma dica".
                </p>
              </div>

              {!settings.autoHintsEnabled && (
                <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center gap-1.5 text-rose-700 text-[11px] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Modo Manual Selecionado</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Custom Fine-Tuning Slider */}
        {settings.autoHintsEnabled && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="inactivity-slider" className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Ajuste Fino do Tempo Limite:</span>
                <span className="font-mono text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-lg text-sm font-extrabold">
                  {settings.hintInactivitySeconds} segundos
                </span>
              </label>

              <span className="text-[11px] text-slate-500 font-medium">
                (Entre 10s e 120s)
              </span>
            </div>

            <input
              id="inactivity-slider"
              type="range"
              min={10}
              max={120}
              step={5}
              value={settings.hintInactivitySeconds}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10s (Muito rápido)</span>
              <span>30s (Padrão)</span>
              <span>60s (1 min)</span>
              <span>90s (1m30s)</span>
              <span>120s (2 min)</span>
            </div>
          </div>
        )}

        {/* Live Preview Box of the Student Hint Modal */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200 font-mono">
                Pré-visualização Pedagógica: Como o Estudante Verá na Missão
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setPreviewTestTriggered(prev => !prev);
              }}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
            >
              {previewTestTriggered ? 'Reiniciar Simulação' : 'Testar Simulação'}
            </button>
          </div>

          {settings.autoHintsEnabled ? (
            <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-100 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                  <span className="text-base" aria-hidden="true">🕵️‍♂️</span>
                  <span>Apoio Pedagógico Sugerido ({settings.hintInactivitySeconds}s de reflexão)</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-400/30">
                  {previewTestTriggered ? `${previewSeconds}s decorridos` : `${settings.hintInactivitySeconds}s limite`}
                </span>
              </div>

              <p className="text-xs leading-relaxed text-amber-100/90">
                Percebemos que você está pensando há mais de{' '}
                <strong className="text-amber-300 font-bold">{settings.hintInactivitySeconds} segundos</strong> nesta pergunta. Gostaria de uma dica inicial para orientar sua busca no texto?
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs">
                  <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Sim, ver primeira ajuda</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 text-slate-200 font-semibold text-xs border border-white/20">
                  Continuar pensando sozinho
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs flex items-center gap-3">
              <Zap className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                A ajuda automática está desativada. O estudante não receberá alertas de inatividade; poderá solicitar pistas exclusivamente através do botão manual.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Card: Critérios Pedagógicos da BNCC */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Critérios de Amostragem & Diagnóstico BNCC
            </h3>
            <p className="text-xs text-slate-500">
              Regras unificadas aplicadas ao cálculo de desempenho, relatórios e certificados.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
              Amostra Mínima
            </span>
            <div className="text-sm font-bold text-slate-900">
              {settings.minQuestionsForDiagnostic} Questões Distintas
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Exigência para sair do status "Em avaliação". Impede classificar o aluno precipitadamente com apenas 1 acerto ou erro casual.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md">
              Em Desenvolvimento
            </span>
            <div className="text-sm font-bold text-slate-900">
              {settings.thresholdReinforcement}% a {settings.thresholdMastered - 1}% de acertos
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              O estudante demonstra compreensão global do texto com oscilações em itens mais detalhados.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md">
              Objetivo Atingido
            </span>
            <div className="text-sm font-bold text-slate-900">
              ≥ {settings.thresholdMastered}% de acertos
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Consolidação pedagógica da habilidade segundo as diretrizes curriculares do 4º ano do Ensino Fundamental.
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white block">
              Configurações prontas para aplicar
            </span>
            <span className="text-slate-300">
              Tempo de inatividade: <strong>{settings.autoHintsEnabled ? `${settings.hintInactivitySeconds}s` : 'Desativado'}</strong> · BNCC: Mínimo <strong>{settings.minQuestionsForDiagnostic} questões</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-300" />
            <span>Restaurar Padrões</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </div>
    </div>
  );
};
