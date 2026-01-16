import React, { useState, useEffect } from 'react';
import { Edit3, Key, Printer, Sparkles, PanelLeftClose, PanelLeftOpen, FileText, Home, Palette, Eye, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ResumeData, CVThemeId } from '@/shared/types';
import { INITIAL_RESUME_DATA, getInitialResumeData, INITIAL_RESUME_DATA_EN, INITIAL_RESUME_DATA_TR } from '@/shared/constants';
import { ChatAssistant } from '@/widgets/chat-panel';
import { CVPreview } from '@/entities/resume';
import { ManualEditor } from '@/widgets/resume-editor';
import { ApiKeyModal } from '@/features/api-key';
import { DashboardPage } from '@/pages';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/features/language-switcher';

type AppView = 'dashboard' | 'editor';

const THEME_OPTIONS: { id: CVThemeId; name: string; color: string }[] = [
  { id: 'classic', name: 'Classic', color: 'bg-indigo-500' },
  { id: 'executive', name: 'Executive', color: 'bg-slate-700' },
  { id: 'modern', name: 'Modern', color: 'bg-cyan-500' },
  { id: 'sidebar', name: 'Sidebar', color: 'bg-amber-500' },
  { id: 'professional', name: 'Professional', color: 'bg-blue-700' },
  { id: 'elegant', name: 'Elegant', color: 'bg-black' },
  { id: 'creative', name: 'Creative', color: 'bg-violet-600' },
];

// Simple hash-based routing
const getViewFromHash = (): AppView => {
  const hash = window.location.hash;
  if (hash === '#/editor') return 'editor';
  return 'dashboard';
};

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState<AppView>(getViewFromHash());

  // Apply correct initial data based on current language
  // We use lazy initialization to only run this once on mount
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    return getInitialResumeData(i18n.language);
  });
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<CVThemeId>('classic');

  // State for layout modes
  const [sidebarMode, setSidebarMode] = useState<'chat' | 'editor'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  // Zoom State
  const [zoom, setZoom] = useState(1);

  // Switch Resume Content when Language Changes (ONLY IF using default template)
  useEffect(() => {
    // If current data is English template AND we switched to TR -> Switch to TR Template
    // Equality check is shallow (reference) or deep?
    // Constants are objects, so reference check works if we set state directly from constants.

    // Check if we are currently holding the Default English Data
    const isDefaultEnglish = JSON.stringify(resumeData) === JSON.stringify(INITIAL_RESUME_DATA_EN);

    // Check if we are currently holding the Default Turkish Data
    const isDefaultTurkish = JSON.stringify(resumeData) === JSON.stringify(INITIAL_RESUME_DATA_TR);

    if (i18n.language === 'tr' && isDefaultEnglish) {
      setResumeData(INITIAL_RESUME_DATA_TR);
    } else if (i18n.language === 'en' && isDefaultTurkish) {
      setResumeData(INITIAL_RESUME_DATA_EN);
    }
  }, [i18n.language]);

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(getViewFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when view changes
  const navigateToEditor = (themeId?: CVThemeId) => {
    if (themeId) {
      setCurrentTheme(themeId);
    }
    window.location.hash = '#/editor';
  };

  const navigateToDashboard = () => {
    window.location.hash = '#/';
  };

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const adjustZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(0.5, prev + delta), 2.0));
  };

  // Dashboard Page View
  if (currentView === 'dashboard') {
    return (
      <>
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onSave={handleSaveApiKey}
          savedKey={apiKey}
        />
        <DashboardPage
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          onNavigateToEditor={navigateToEditor}
          onRequestApiKey={() => setIsApiKeyModalOpen(true)}
          currentTheme={currentTheme}
        />
      </>
    );
  }

  // Editor View
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans print:bg-white print:overflow-visible print:h-auto">
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onSave={handleSaveApiKey}
        savedKey={apiKey}
      />

      {/* DYNAMIC LEFT SIDEBAR (Chat or Editor) */}
      <aside
        className={`
          ${isSidebarOpen ? 'w-full min-[1110px]:w-[500px]' : 'w-0'} 
          transition-all duration-300 ease-in-out
          flex-shrink-0 border-r border-slate-200 bg-white shadow-xl z-20 overflow-hidden flex flex-col relative print:hidden
        `}
      >
        <div className="h-full w-full min-[1110px]:w-[500px] flex flex-col">
          {/* Mode Switcher Header inside Sidebar */}
          <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSidebarMode('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${sidebarMode === 'chat'
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Agent
              </button>
              <button
                onClick={() => setSidebarMode('editor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${sidebarMode === 'editor' && isSidebarOpen
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                <Edit3 className="w-4 h-4" />
                Editor
              </button>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all min-[1110px]:hidden ${!isSidebarOpen
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            <div className={`h-full flex flex-col ${sidebarMode === 'chat' ? 'block' : 'hidden'}`}>
              <ChatAssistant
                apiKey={apiKey}
                currentResumeData={resumeData}
                onUpdateResume={setResumeData}
                onRequestApiKey={() => setIsApiKeyModalOpen(true)}
                onResetCV={() => setResumeData(getInitialResumeData(i18n.language))}
              />
            </div>

            <div className={`h-full overflow-y-auto custom-scrollbar ${sidebarMode === 'editor' ? 'block' : 'hidden'}`}>
              <ManualEditor data={resumeData} onChange={setResumeData} />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN PREVIEW AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100/50 relative print:bg-white">

        {/* Top Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 shadow-sm z-10 print:hidden">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600 hidden md:block" />
              <h1 className="hidden md:block text-lg font-bold text-slate-800 tracking-tight whitespace-nowrap">
                AI CV Maker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Picker */}
            <div className="relative">
              <button
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className="flex items-center gap-2 px-2 md:px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title={t('app.themeSelect')}
              >
                <Palette className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700 hidden md:inline">
                  {THEME_OPTIONS.find(t => t.id === currentTheme)?.name}
                </span>
                <div className={`w-3 h-3 rounded-full ${THEME_OPTIONS.find(t => t.id === currentTheme)?.color}`} />
              </button>

              {isThemePickerOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[160px] z-50">
                  {THEME_OPTIONS.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => {
                        setCurrentTheme(theme.id);
                        setIsThemePickerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${currentTheme === theme.id ? 'bg-indigo-50' : ''
                        }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                      <span className={`text-sm ${currentTheme === theme.id ? 'font-semibold text-indigo-700' : 'text-slate-700'}`}>
                        {theme.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Back to Dashboard */}
            <button
              onClick={navigateToDashboard}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title={t('app.backToDashboard')}
            >
              <Home className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`p-2 rounded-full transition-colors ${apiKey ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title={t('app.apiKeySettings')}
            >
              <Key className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-3 md:px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden md:inline">{t('app.exportPdf')}</span>
            </button>
          </div>
        </header>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-auto custom-scrollbar p-4 lg:p-8 flex bg-slate-200/50 print:p-0 print:bg-white print:block print:overflow-visible relative">
          <div
            className="m-auto animate-in fade-in zoom-in-95 duration-300 origin-top print:animate-none print:!transform-none print:!m-0 print:!p-0"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}
          >
            <CVPreview data={resumeData} theme={currentTheme} />
          </div>

          {/* Floating Zoom Controls */}
          <div className="fixed bottom-6 right-6 flex items-center gap-1 bg-white/90 backdrop-blur shadow-xl border border-slate-200 p-1.5 rounded-full z-50 print:hidden animate-in slide-in-from-bottom-4">
            <button
              onClick={() => adjustZoom(-0.1)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 active:scale-95 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium text-slate-500 w-12 text-center select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => adjustZoom(0.1)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 active:scale-95 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button
              onClick={() => setZoom(1)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-600 active:scale-95 transition-all"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;