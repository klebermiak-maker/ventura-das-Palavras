import React from 'react';
import { Volume2, VolumeX, BookOpen, Star, RotateCcw, User, Users } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { getPlayerLevelInfo } from '../utils/levels';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  starsCount: number;
  score: number;
  studentName?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRules: () => void;
  onOpenIdentityModal: () => void;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  starsCount,
  score,
  studentName,
  isMuted,
  onToggleMute,
  onOpenRules,
  onOpenIdentityModal,
  onResetProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no pill badges) */}
        <button
          onClick={() => {
            soundManager.playClick();
            onNavigate('hub');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            A
          </span>
          <span>Aventura das Palavras</span>
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('hub');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              currentView === 'hub' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Missões
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('explicitas');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              currentView === 'explicitas' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Fatos Explícitos
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('central');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              currentView === 'central' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Ideia Central
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('implicitas');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              currentView === 'implicitas' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Entrelinhas
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('acentuacao');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              currentView === 'acentuacao' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Acentuação
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('sprint');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer flex items-center gap-1 ${
              currentView === 'sprint' ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : 'text-amber-700 font-medium'
            }`}
          >
            <span>Sprint ⚡</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('relatorio');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer ${
              currentView === 'relatorio' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            Relatório Aluno
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('dicionario');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer flex items-center gap-1 ${
              currentView === 'dicionario' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            <span>Dicionário 📖</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('turmas');
            }}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 transition-colors py-1 cursor-pointer flex items-center gap-1 ${
              currentView === 'turmas' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
            }`}
          >
            <span>Turmas 👥</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action + unobtrusive controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Student Profile / Identification chip */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenIdentityModal();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200"
            title="Clique para alterar seu nome e turma escolar"
          >
            <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate max-w-[100px]">{studentName || 'Identificar Aluno'}</span>
          </button>

          {/* Subtle level, star & score counter */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 font-medium font-mono tabular-nums bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <span>{getPlayerLevelInfo(score).currentTier.icon}</span>
              <span>Nív. {getPlayerLevelInfo(score).currentTier.level}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="flex items-center gap-1 text-amber-700">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{starsCount}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{score} pts</span>
          </div>

          {/* Sound mute toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title={isMuted ? 'Ativar sons' : 'Desativar sons'}
            aria-label={isMuted ? 'Ativar sons' : 'Desativar sons'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: Manual de Regras */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenRules();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual de Acentos</span>
          </button>
        </div>
      </div>
    </header>
  );
};
