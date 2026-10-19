import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, BookOpen, CheckCircle, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechService } from '../utils/speech';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RegrasAcentuacaoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleRead = (text: string) => {
    soundManager.playClick();
    speechService.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => {
          soundManager.playClick();
          speechService.stop();
          onClose();
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs cursor-pointer"
      />

      {/* Modal Dialog Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Manual dos Acentos: Segredo da Sílaba Tônica
              </h2>
              <p className="text-xs text-slate-500">
                Guia prático para dominar a habilidade EF05LP03 da BNCC
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              speechService.stop();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Quick introductory concept */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">
                O que é a Sílaba Tônica?
              </p>
              <p className="text-xs text-slate-600 mt-1">
                É a sílaba pronunciada com mais força e intensidade na palavra! Conte sempre as sílabas de trás para frente: <strong>última</strong>, <strong>penúltima</strong> e <strong>antepenúltima</strong>.
              </p>
            </div>
          </div>

          {/* Rule 1: Proparoxítonas */}
          <div className="border border-purple-200 rounded-xl p-5 bg-purple-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-purple-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-bold text-purple-950 font-display text-base">
                  Proparoxítonas (A Regra Mais Fácil do Mundo!)
                </h3>
              </div>
              <button
                onClick={() => handleRead("Regra de ouro das proparoxítonas: a antepenúltima sílaba é a mais forte. E todas, absolutamente todas as proparoxítonas levam acento gráfico! Exemplos: lâmpada, árvore, matemática, pássaro.")}
                className="text-xs text-purple-700 hover:text-purple-900 flex items-center gap-1 font-medium cursor-pointer"
                title="Ouvir explicação"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir</span>
              </button>
            </div>
            <p className="text-slate-700 text-xs">
              A <strong>antepenúltima</strong> sílaba é a mais forte.
            </p>
            <div className="bg-white/80 p-3 rounded-lg border border-purple-200/60 text-xs space-y-1.5">
              <p className="text-purple-900 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-600 shrink-0" />
                REGRA DE OURO: TODAS as palavras proparoxítonas são acentuadas!
              </p>
              <p className="text-slate-600">
                Exemplos: <strong>LÂM</strong>-pa-da, <strong>ÁR</strong>-vo-re, <strong>MÚ</strong>-si-ca, <strong>PÁS</strong>-sa-ro, re-<strong>LÂM</strong>-pa-go.
              </p>
            </div>
          </div>

          {/* Rule 2: Oxítonas */}
          <div className="border border-emerald-200 rounded-xl p-5 bg-emerald-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-bold text-emerald-950 font-display text-base">
                  Oxítonas
                </h3>
              </div>
              <button
                onClick={() => handleRead("Oxítonas: a última sílaba é a mais forte. Acentuam-se quando terminam em: a, e, o, em e ens. Exemplos com acento: café, cipó, você, parabéns. Se terminar em r ou u, não leva acento: tambor, caju.")}
                className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-medium cursor-pointer"
                title="Ouvir explicação"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir</span>
              </button>
            </div>
            <p className="text-slate-700 text-xs">
              A <strong>última</strong> sílaba é a mais forte.
            </p>
            <div className="bg-white/80 p-3 rounded-lg border border-emerald-200/60 text-xs space-y-1.5">
              <p className="text-emerald-900 font-semibold">
                Quando acentuar?
              </p>
              <p className="text-slate-600">
                Quando terminam em: <strong>-A(s)</strong>, <strong>-E(s)</strong>, <strong>-O(s)</strong>, <strong>-EM</strong> ou <strong>-ENS</strong>.
              </p>
              <div className="pt-1 text-slate-600 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-emerald-700 font-medium">Com acento:</span> ca-<strong>fé</strong>, ci-<strong>pó</strong>, vo-<strong>cê</strong>, pa-ra-<strong>béns</strong>.
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Sem acento:</span> tam-<strong>bor</strong>, ca-<strong>ju</strong>, pa-<strong>pel</strong>, sa-<strong>ci</strong>.
                </div>
              </div>
            </div>
          </div>

          {/* Rule 3: Paroxítonas */}
          <div className="border border-sky-200 rounded-xl p-5 bg-sky-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-sky-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-bold text-sky-950 font-display text-base">
                  Paroxítonas
                </h3>
              </div>
              <button
                onClick={() => handleRead("Paroxítonas: a penúltima sílaba é a mais forte. A grande maioria das palavras em português é paroxítona e não tem acento, como janela, caderno, escola. Levam acento aquelas com finais especiais: l, r, x, n, um e ditongos. Exemplos: fácil, tórax, álbum.")}
                className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 font-medium cursor-pointer"
                title="Ouvir explicação"
              >
                <Volume2 className="w-4 h-4" />
                <span>Ouvir</span>
              </button>
            </div>
            <p className="text-slate-700 text-xs">
              A <strong>penúltima</strong> sílaba é a mais forte. Mais de 70% das palavras do português são paroxítonas!
            </p>
            <div className="bg-white/80 p-3 rounded-lg border border-sky-200/60 text-xs space-y-1.5">
              <p className="text-sky-900 font-semibold">
                Quando acentuar?
              </p>
              <p className="text-slate-600">
                Apenas quando terminam em terminações especiais: <strong>-L</strong>, <strong>-R</strong>, <strong>-X</strong>, <strong>-N</strong>, <strong>-UM</strong>, <strong>-Ã(s)</strong>, <strong>-I(s)</strong>, <strong>ditongo</strong>.
              </p>
              <div className="pt-1 text-slate-600 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-sky-700 font-medium">Com acento:</span> <strong>fá</strong>-cil, <strong>tó</strong>-rax, <strong>ál</strong>-bum, <strong>lá</strong>-pis.
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Sem acento:</span> ja-<strong>ne</strong>-la, ca-<strong>der</strong>-no, a-<strong>mi</strong>-go.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              speechService.stop();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Entendi as Regras!
          </button>
        </div>
      </motion.div>
    </div>
  );
};
