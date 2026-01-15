import React, { useState, useEffect } from 'react';
import { Download, Edit3, Key, Layout, Printer, Share2, Sparkles, PanelLeftClose, PanelLeftOpen, FileText } from 'lucide-react';
import { ResumeData } from './types';
import { INITIAL_RESUME_DATA } from './constants';
import ChatAssistant from './components/ChatAssistant';
import CVPreview from './components/CVPreview';
import ManualEditor from './components/ManualEditor';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('gemini_api_key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // State for layout modes
  const [sidebarMode, setSidebarMode] = useState<'chat' | 'editor'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

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
          ${isSidebarOpen ? 'w-full md:w-[450px] lg:w-[500px]' : 'w-0'} 
          transition-all duration-300 ease-in-out
          flex-shrink-0 border-r border-slate-200 bg-white shadow-xl z-20 overflow-hidden flex flex-col relative print:hidden
        `}
      >
        <div className="h-full w-full md:w-[450px] lg:w-[500px] flex flex-col">
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
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${sidebarMode === 'editor'
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                <Edit3 className="w-4 h-4" />
                Editor
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {sidebarMode === 'chat' ? (
              <ChatAssistant
                apiKey={apiKey}
                currentResumeData={resumeData}
                onUpdateResume={setResumeData}
                onRequestApiKey={() => setIsApiKeyModalOpen(true)}
              />
            ) : (
              <div className="h-full overflow-y-auto custom-scrollbar">
                <ManualEditor data={resumeData} onChange={setResumeData} />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN PREVIEW AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100/50 relative print:bg-white">

        {/* Top Toolbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm z-10 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600 hidden sm:block" />
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                ATS Pro CV Maker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`p-2 rounded-full transition-colors ${apiKey ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title="API Key Settings"
            >
              <Key className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </header>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 flex justify-center bg-slate-200/50 print:p-0 print:bg-white print:block print:overflow-visible">
          <div className="animate-in fade-in zoom-in-95 duration-300 origin-top print:animate-none">
            <CVPreview data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;