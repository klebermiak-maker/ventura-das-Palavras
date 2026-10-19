import React, { useState, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Download,
  Printer,
  Sparkles,
  Share2,
  CheckCircle2,
  Lock,
  Star,
  Trophy,
  ArrowLeft,
  Edit3,
  Calendar,
  School,
  User,
  ShieldCheck,
  Palette,
  Eye,
  Check,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BNCCSkill, UserStats } from '../types/game';
import { BNCC_SKILLS_INFO } from '../data/bnccContent';
import { getPlayerLevelInfo } from '../utils/levels';
import { soundManager } from '../utils/audio';

interface Props {
  userStats: UserStats;
  onNavigate: (view: string) => void;
  onOpenIdentityModal?: () => void;
}

type CertificateTheme = 'ouro' | 'esmeralda' | 'galaxia' | 'rubi';

interface ThemeConfig {
  outerBg: string;
  borderOuter: string;
  borderInner: string;
  accentColor: string;
  headerGradient: string;
  sealBg: string;
  ribbonBg: string;
  badgeBg: string;
  isDark?: boolean;
}

export const CertificadoConquista: React.FC<Props> = ({
  userStats,
  onNavigate,
  onOpenIdentityModal,
}) => {
  // Extract student details and stats
  const { score, starsEarned, badgesEarned, skillStats } = userStats;
  const levelInfo = getPlayerLevelInfo(score);
  const currentTier = levelInfo.currentTier;

  // Customization state
  const [studentName, setStudentName] = useState(
    userStats.studentName && userStats.studentName.trim() !== ''
      ? userStats.studentName
      : 'Estudante Exemplar'
  );
  const [schoolName, setSchoolName] = useState('Escola Municipal Educandário Nossa Senhora Aparecida');
  const [classroomName, setClassroomName] = useState(
    userStats.classroomName || '4º Ano A'
  );
  const [educatorName, setEducatorName] = useState('Profª. de Língua Portuguesa');
  const [theme, setTheme] = useState<CertificateTheme>('ouro');
  const [showBnccGrid, setShowBnccGrid] = useState(true);
  const [showSignatures, setShowSignatures] = useState(true);
  const [isDemonstrationMode, setIsDemonstrationMode] = useState(false);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(true);

  const certificateRef = useRef<HTMLDivElement>(null);

  // Proficiency threshold: Level 2 (200 pts) is the official starting proficiency
  const PROFICIENCY_MIN_POINTS = 200;
  const isProficiencyReached = score >= PROFICIENCY_MIN_POINTS || isDemonstrationMode;

  // Unique certificate code
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const certCode = `BNCC-AVP-${(Math.abs(score * 31 + studentName.length * 7 + 1042) % 9000 + 1000)}-${today.getFullYear()}`;

  // Complete list of 5 badges
  const allBadges = [
    {
      id: 'EF15LP03',
      name: 'Detetive dos Fatos',
      skillCode: 'EF15LP03',
      icon: '🔍',
      desc: 'Informações Explícitas',
      unlocked: badgesEarned.includes('EF15LP03') || isDemonstrationMode,
    },
    {
      id: 'EF35LP03',
      name: 'Mestre da Ideia Central',
      skillCode: 'EF35LP03',
      icon: '🧭',
      desc: 'Tema & Ideia Global',
      unlocked: badgesEarned.includes('EF35LP03') || isDemonstrationMode,
    },
    {
      id: 'EF35LP04',
      name: 'Mago das Entrelinhas',
      skillCode: 'EF35LP04',
      icon: '🕵️',
      desc: 'Inferências Implícitas',
      unlocked: badgesEarned.includes('EF35LP04') || isDemonstrationMode,
    },
    {
      id: 'EF05LP03',
      name: 'Campeão da Acentuação',
      skillCode: 'EF05LP03',
      icon: '⚡',
      desc: 'Sílabas Tônicas & Acentos',
      unlocked: badgesEarned.includes('EF05LP03') || isDemonstrationMode,
    },
    {
      id: 'MESTRE',
      name: 'Mestre das Palavras',
      skillCode: 'BNCC-4EF',
      icon: '🏆',
      desc: 'Estrelas & Conquistas Supremas',
      unlocked: badgesEarned.includes('MESTRE') || starsEarned >= 5 || isDemonstrationMode,
    },
  ];

  const unlockedBadgesCount = allBadges.filter(b => b.unlocked).length;

  // Trigger celebration confetti
  const triggerConfetti = () => {
    soundManager.playFanfare();
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Generate & Download PDF
  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    try {
      setIsGeneratingPdf(true);
      soundManager.playClick();

      // Trigger celebration
      triggerConfetti();

      // Render canvas at 2x resolution for clean text
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Create landscape A4 PDF (297mm x 210mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      const safeName = studentName.trim().replace(/[^a-zA-Z0-9À-ÿ]/g, '_') || 'Estudante';
      pdf.save(`Certificado_Conquista_${safeName}_BNCC.pdf`);
    } catch (err) {
      console.error('Erro ao gerar certificado PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleCopyCode = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(certCode);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  // Theme styling definitions
  const themeStyles: Record<CertificateTheme, ThemeConfig> = {
    ouro: {
      outerBg: 'bg-gradient-to-br from-amber-50 via-amber-100/40 to-yellow-50',
      borderOuter: 'border-amber-600/70',
      borderInner: 'border-amber-500/50',
      accentColor: 'text-amber-800',
      headerGradient: 'from-amber-700 via-amber-600 to-yellow-700',
      sealBg: 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-amber-950',
      ribbonBg: 'bg-amber-600 text-white',
      badgeBg: 'bg-amber-100/80 border-amber-300 text-amber-900',
    },
    esmeralda: {
      outerBg: 'bg-gradient-to-br from-emerald-50 via-teal-50/50 to-green-50',
      borderOuter: 'border-emerald-700/70',
      borderInner: 'border-emerald-500/50',
      accentColor: 'text-emerald-800',
      headerGradient: 'from-emerald-800 via-teal-700 to-emerald-600',
      sealBg: 'bg-gradient-to-tr from-emerald-600 via-teal-400 to-green-300 text-emerald-950',
      ribbonBg: 'bg-emerald-700 text-white',
      badgeBg: 'bg-emerald-100/80 border-emerald-300 text-emerald-900',
    },
    galaxia: {
      outerBg: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900',
      borderOuter: 'border-indigo-400/70',
      borderInner: 'border-indigo-500/40',
      accentColor: 'text-indigo-300',
      headerGradient: 'from-indigo-300 via-purple-200 to-sky-200',
      sealBg: 'bg-gradient-to-tr from-indigo-500 via-purple-400 to-sky-300 text-slate-950',
      ribbonBg: 'bg-indigo-600 text-white',
      badgeBg: 'bg-indigo-900/60 border-indigo-700/60 text-indigo-100',
      isDark: true,
    },
    rubi: {
      outerBg: 'bg-gradient-to-br from-rose-50 via-rose-100/30 to-amber-50',
      borderOuter: 'border-rose-700/70',
      borderInner: 'border-rose-500/50',
      accentColor: 'text-rose-900',
      headerGradient: 'from-rose-800 via-rose-700 to-amber-700',
      sealBg: 'bg-gradient-to-tr from-rose-600 via-amber-400 to-rose-300 text-rose-950',
      ribbonBg: 'bg-rose-700 text-white',
      badgeBg: 'bg-rose-100/80 border-rose-300 text-rose-900',
    },
  };

  const currentThemeStyle = themeStyles[theme];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Breadcrumbs (no-print) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigate('hub');
            }}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors cursor-pointer"
            title="Voltar ao Mission Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-700 uppercase">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Certificação Oficial BNCC · 3º, 4º e 5º Anos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Certificado de Conquista & Proficiência
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Reconhecimento pedagógico oficial com registro de medalhas, pontuação total e competências da BNCC.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCustomizePanel(!showCustomizePanel)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{showCustomizePanel ? 'Ocultar Painel' : 'Personalizar Dados'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg transition-colors cursor-pointer border border-slate-300 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Gerando PDF...' : 'Baixar PDF Personalizado'}</span>
          </button>
        </div>
      </motion.div>

      {/* Proficiency Level Status Card (no-print) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 sm:p-5 rounded-2xl border transition-all no-print ${
          isProficiencyReached
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/40 border-emerald-300 shadow-xs'
            : 'bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/40 border-amber-300 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                isProficiencyReached
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {isProficiencyReached ? '🏅' : '🌱'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700">
                  {currentTier.icon} Nível {currentTier.level}: {currentTier.title}
                </span>
                {isProficiencyReached ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Proficiência Atingida!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Pré-visualização Pedagógica
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 font-display mt-1">
                {isProficiencyReached
                  ? `Parabéns, ${studentName}! Seu Certificado de Proficiência está liberado!`
                  : `Em busca da Proficiência Oficial (${score}/${PROFICIENCY_MIN_POINTS} XP)`}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
                {isProficiencyReached
                  ? `Você acumulou ${score} pontos e desbloqueou ${unlockedBadgesCount} de ${allBadges.length} medalhas de honra. O documento abaixo é oficial e autenticado.`
                  : `Para a emissão definitiva, atinja 200 pontos jogando os desafios da BNCC. Você pode pré-visualizar ou ativar o modo de demonstração pedagógica.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isProficiencyReached && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsDemonstrationMode(!isDemonstrationMode);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  isDemonstrationMode
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                {isDemonstrationMode ? '✓ Modo Demonstração Ativo' : 'Ativar Modo Demonstração'}
              </button>
            )}

            <button
              onClick={triggerConfetti}
              className="px-3.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-200 hover:bg-amber-300 border border-amber-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Celebrar 🎉</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Live Customization Drawer / Panel (no-print) */}
      <AnimatePresence>
        {showCustomizePanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden no-print"
          >
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Personalização do Certificado
                  </h3>
                </div>
                <span className="text-[11px] text-slate-500">
                  As alterações refletem instantaneamente no certificado e no PDF
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Nome do Aluno */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo do Aluno
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder="Ex: Lucas Oliveira Silva"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Escola / Instituição */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Escola / Unidade Escolar
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={e => setSchoolName(e.target.value)}
                      placeholder="Ex: Escola Municipal Educandário Nossa Senhora Aparecida"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Turma Escolar */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Turma / Ano Escolar
                  </label>
                  <input
                    type="text"
                    value={classroomName}
                    onChange={e => setClassroomName(e.target.value)}
                    placeholder="Ex: 4º Ano Turma A"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  />
                </div>

                {/* Professor(a) / Assinante */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Educador(a) / Professor(a)
                  </label>
                  <input
                    type="text"
                    value={educatorName}
                    onChange={e => setEducatorName(e.target.value)}
                    placeholder="Ex: Profª. Helena Meireles"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Theme & Toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                {/* Theme selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-700">Tema Visual:</span>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'ouro', label: 'Ouro Real', bg: 'bg-amber-400' },
                      { id: 'esmeralda', label: 'Esmeralda', bg: 'bg-emerald-500' },
                      { id: 'galaxia', label: 'Galáxia', bg: 'bg-indigo-900' },
                      { id: 'rubi', label: 'Rubi Real', bg: 'bg-rose-600' },
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          soundManager.playClick();
                          setTheme(t.id as CertificateTheme);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                          theme === t.id
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${t.bg}`} />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={showBnccGrid}
                      onChange={e => setShowBnccGrid(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Exibir Matriz BNCC</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={showSignatures}
                      onChange={e => setShowSignatures(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Exibir Assinaturas Oficiais</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CERTIFICATE PREVIEW CONTAINER */}
      <div className="flex justify-center overflow-x-auto py-2">
        {/* The Certificate Element itself */}
        <div
          ref={certificateRef}
          id="certificate-print-area"
          className={`w-full max-w-4xl p-6 sm:p-10 rounded-2xl border-8 ${currentThemeStyle.borderOuter} ${currentThemeStyle.outerBg} shadow-2xl relative select-none print-only-container transition-all`}
          style={{ minHeight: '620px' }}
        >
          {/* Inner Ornate Double Border */}
          <div
            className={`w-full h-full p-4 sm:p-6 rounded-xl border-2 border-dashed ${currentThemeStyle.borderInner} relative flex flex-col justify-between space-y-6`}
          >
            {/* Ornate Corner Accents */}
            <div className="absolute top-2 left-2 text-amber-500/70 text-lg font-serif">✦</div>
            <div className="absolute top-2 right-2 text-amber-500/70 text-lg font-serif">✦</div>
            <div className="absolute bottom-2 left-2 text-amber-500/70 text-lg font-serif">✦</div>
            <div className="absolute bottom-2 right-2 text-amber-500/70 text-lg font-serif">✦</div>

            {/* TOP HEADER */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-12 bg-amber-400" />
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-amber-700">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>REPÚBLICA PEDAGÓGICA DA LEITURA · BNCC 2026</span>
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </div>
                <span className="h-px w-12 bg-amber-400" />
              </div>

              <h2
                className={`text-2xl sm:text-4xl font-extrabold tracking-wide uppercase font-display bg-gradient-to-r ${currentThemeStyle.headerGradient} bg-clip-text text-transparent`}
              >
                Certificado de Conquista & Proficiência
              </h2>
              <p
                className={`text-xs sm:text-sm font-semibold tracking-wider uppercase ${
                  currentThemeStyle.isDark ? 'text-indigo-200' : 'text-slate-600'
                }`}
              >
                Língua Portuguesa · Habilidades Fundamentais da Educação Básica
              </p>
            </div>

            {/* MAIN CERTIFICATION BODY */}
            <div className="text-center space-y-4 my-2">
              <p
                className={`text-xs sm:text-sm italic font-serif ${
                  currentThemeStyle.isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Certificamos com honra e reconhecimento pedagógico que o(a) estudante
              </p>

              {/* Student Name */}
              <div className="py-1">
                <h1
                  className={`text-3xl sm:text-5xl font-extrabold font-display tracking-tight underline decoration-amber-400/80 decoration-2 underline-offset-8 ${
                    currentThemeStyle.isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {studentName || 'Estudante Exemplar'}
                </h1>
              </div>

              <p
                className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${
                  currentThemeStyle.isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                integrante da turma <strong className="font-bold">{classroomName}</strong> da{' '}
                <strong className="font-bold">{schoolName}</strong>, concluiu com mérito as etapas de
                leitura, interpretação de textos e acentuação gráfica do programa{' '}
                <em>Aventura das Palavras</em>, atingindo com distinção o nível:
              </p>

              {/* PROFICIENCY LEVEL RIBBON */}
              <div className="flex justify-center items-center gap-3 pt-1 pb-2">
                <div
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-extrabold text-sm sm:text-base tracking-wide shadow-md uppercase ${currentThemeStyle.ribbonBg}`}
                >
                  <span className="text-lg">{currentTier.icon}</span>
                  <span>
                    NÍVEL {currentTier.level}: {currentTier.title}
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">
                    {score} XP
                  </span>
                </div>
              </div>
            </div>

            {/* SHOWCASE OF ACHIEVEMENTS: MEDALS & TOTAL SCORE */}
            <div className="space-y-4">
              {/* Badges row */}
              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-amber-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3 pb-1 border-b border-amber-200/50">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900 font-display">
                      Quadro de Medalhas de Honra Desbloqueadas ({unlockedBadgesCount}/5)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-amber-800">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {starsEarned} Estrelas
                    </span>
                    <span>·</span>
                    <span>Pontuação Total: {score} XP</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {allBadges.map(b => (
                    <div
                      key={b.id}
                      className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                        b.unlocked
                          ? `${currentThemeStyle.badgeBg} shadow-xs ring-1 ring-amber-400/40`
                          : 'bg-slate-100/60 border-slate-200 opacity-40 grayscale'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl">{b.icon}</div>
                      <div className="w-full">
                        <p className="text-[11px] font-bold truncate leading-tight">{b.name}</p>
                        <span className="text-[9px] font-mono opacity-80 block">{b.skillCode}</span>
                        <span
                          className={`inline-block mt-0.5 text-[8px] font-extrabold uppercase px-1 py-0.2 rounded ${
                            b.unlocked
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {b.unlocked ? 'Conquistada' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BNCC Competencies mini checklist */}
              {showBnccGrid && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  {(['EF15LP03', 'EF35LP03', 'EF35LP04', 'EF05LP03'] as BNCCSkill[]).map(code => {
                    const info = BNCC_SKILLS_INFO[code];
                    const stat = skillStats[code];
                    const pct = stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0;
                    return (
                      <div
                        key={code}
                        className="bg-white/80 p-2 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs"
                      >
                        <div>
                          <div className="font-mono font-bold text-slate-800">{code}</div>
                          <div className="text-[9px] text-slate-500 truncate max-w-[110px]">
                            {info.title}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-700">
                            {stat.attempted > 0 ? `${pct}%` : 'Ativa'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER: SIGNATURES, OFFICIAL SEAL & REGISTRATION CODE */}
            <div className="pt-4 border-t border-amber-300/60 mt-4">
              <div className="grid grid-cols-3 items-end gap-4 text-center">
                {/* Educator Signature */}
                {showSignatures ? (
                  <div className="space-y-1">
                    <div className="h-9 flex items-end justify-center">
                      <span className="font-serif italic text-sm text-slate-700 underline decoration-slate-400">
                        {educatorName}
                      </span>
                    </div>
                    <div className="w-4/5 mx-auto border-t border-slate-400" />
                    <p className="text-[10px] font-semibold text-slate-600">
                      Professor(a) / Orientador(a)
                    </p>
                  </div>
                ) : (
                  <div />
                )}

                {/* Golden Authenticity Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white/60 p-1 ${currentThemeStyle.sealBg}`}
                  >
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[7px] sm:text-[8px] font-extrabold uppercase tracking-tighter text-center leading-none mt-0.5">
                      SELO OFICIAL
                      <br />
                      BNCC 2026
                    </span>
                  </div>
                </div>

                {/* Date & Authentication Registry */}
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-slate-600 font-medium">
                    Emitido em: <strong className="text-slate-800">{dateFormatted}</strong>
                  </p>
                  <p className="text-[9px] font-mono text-slate-500">
                    Registro: <span className="font-bold text-slate-700">{certCode}</span>
                  </p>
                  <div className="inline-flex items-center gap-1 text-[8px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    <Check className="w-2.5 h-2.5" />
                    Autenticidade Verificada
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR (no-print) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900 font-display">
              Código de Validação do Certificado:
            </span>
            <code className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {certCode}
            </code>
            <button
              onClick={handleCopyCode}
              className="text-xs text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
            >
              {copiedId ? '✓ Copiado!' : 'Copiar'}
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Este certificado pode ser anexado ao portfólio pedagógico do aluno e impresso para apresentação aos responsáveis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Imprimir Certificado</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-60"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Criando PDF de Alta Resolução...' : 'Baixar PDF Personalizado'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
