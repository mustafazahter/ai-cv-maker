import React, { useState, useRef } from 'react';
import {
    User,
    Settings,
    FileText as FileTextIcon,
    CreditCard,
    BookOpen,
    Sparkles,
    ChevronRight,
    Palette,
    Search as SearchIcon
} from 'lucide-react';
import {
    ATSGuideSection,
    ApiConfigSection,
    AIThemesSection,
    CVAnalyzerSection
} from '../widgets';

type TabId = 'ats-guide' | 'api-settings' | 'ai-themes' | 'cv-analyzer';

interface MenuItem {
    id: TabId;
    label: string;
    icon: React.ReactNode;
    description: string;
}

interface DashboardPageProps {
    apiKey: string | null;
    onSaveApiKey: (key: string) => void;
    onNavigateToEditor: () => void;
    onRequestApiKey: () => void;
}

const menuItems: MenuItem[] = [
    {
        id: 'ats-guide',
        label: 'CV Nasıl Olmalı',
        icon: <BookOpen className="w-5 h-5" />,
        description: 'ATS rehberi ve CV ipuçları'
    },
    {
        id: 'api-settings',
        label: 'API Ayarları',
        icon: <Settings className="w-5 h-5" />,
        description: 'Gemini API yapılandırması'
    },
    {
        id: 'ai-themes',
        label: 'AI Temaları',
        icon: <Palette className="w-5 h-5" />,
        description: 'CV tema şablonları'
    },
    {
        id: 'cv-analyzer',
        label: 'CV Analiz',
        icon: <SearchIcon className="w-5 h-5" />,
        description: 'CV değerlendirme ve puanlama'
    }
];

const DashboardPage: React.FC<DashboardPageProps> = ({
    apiKey,
    onSaveApiKey,
    onNavigateToEditor,
    onRequestApiKey
}) => {
    const [activeTab, setActiveTab] = useState<TabId>('api-settings');

    const renderContent = () => {
        switch (activeTab) {
            case 'ats-guide':
                return <ATSGuideSection />;
            case 'api-settings':
                return (
                    <ApiConfigSection
                        apiKey={apiKey}
                        onSaveApiKey={onSaveApiKey}
                    />
                );
            case 'ai-themes':
                return <AIThemesSection onOpenEditor={onNavigateToEditor} />;
            case 'cv-analyzer':
                return (
                    <CVAnalyzerSection
                        apiKey={apiKey}
                        onRequestApiKey={onRequestApiKey}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight">CV Maker AI</span>
                </div>

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    U
                </div>
            </header>

            <div className="flex flex-1">
                {/* Left Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    {/* Menu Section */}
                    <div className="p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
                            Ayarlar
                        </p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200
                    ${activeTab === item.id
                                            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                                >
                                    <span className={`
                    ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}
                  `}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm">{item.label}</span>
                                    {activeTab === item.id && (
                                        <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="min-h-full">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
