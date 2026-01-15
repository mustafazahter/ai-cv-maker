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
    Search as SearchIcon,
    Menu,
    X
} from 'lucide-react';
import {
    ATSGuideSection,
    ApiConfigSection,
    AIThemesSection,
    CVAnalyzerSection
} from '../widgets';
import { CVThemeId } from '@/shared/types';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../features/language-switcher';

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
    onNavigateToEditor: (themeId?: CVThemeId) => void;
    onRequestApiKey: () => void;
    currentTheme: CVThemeId;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
    apiKey,
    onSaveApiKey,
    onNavigateToEditor,
    onRequestApiKey,
    currentTheme
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabId>('api-settings');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems: MenuItem[] = [
        {
            id: 'ats-guide',
            label: t('dashboard.items.atsGuide'),
            icon: <BookOpen className="w-5 h-5" />,
            description: t('dashboard.items.atsGuideDesc')
        },
        {
            id: 'api-settings',
            label: t('dashboard.items.apiSettings'),
            icon: <Settings className="w-5 h-5" />,
            description: t('dashboard.items.apiSettingsDesc')
        },
        {
            id: 'ai-themes',
            label: t('dashboard.items.aiThemes'),
            icon: <Palette className="w-5 h-5" />,
            description: t('dashboard.items.aiThemesDesc')
        },
        {
            id: 'cv-analyzer',
            label: t('dashboard.items.cvAnalyzer'),
            icon: <SearchIcon className="w-5 h-5" />,
            description: t('dashboard.items.cvAnalyzerDesc')
        }
    ];

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
                return <AIThemesSection onSelectTheme={onNavigateToEditor} currentTheme={currentTheme} />;
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
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>

                    <img src="/favicon.png" alt="Logo" className="w-9 h-9 object-contain" />
                    <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:inline">CV Maker AI</span>
                    <span className="text-xl font-bold text-slate-800 tracking-tight sm:hidden">CV AI</span>
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />

                    <button
                        onClick={() => onNavigateToEditor()}
                        className="px-4 md:px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="hidden sm:inline">{t('dashboard.openEditor')}</span>
                        <span className="sm:hidden">{t('dashboard.editorShort')}</span>
                    </button>

                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        U
                    </div>
                </div>
            </header>

            <div className="flex flex-1 relative">

                {/* Mobile Backdrop */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Left Sidebar (Responsive) */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform duration-300 ease-out
                    md:static md:translate-x-0
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
                `}>
                    {/* Menu Section */}
                    {/* Only show "Ayarlar" title on desktop to save space on mobile drawer top */}
                    <div className="p-4 pt-6 md:pt-4">
                        <div className="flex items-center justify-between mb-6 px-3 md:hidden">
                            <span className="font-bold text-lg text-slate-800">{t('dashboard.menuTitle')}</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-3 hidden md:block">
                            {t('dashboard.settingsTitle')}
                        </p>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false); // Close menu on selection
                                    }}
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
