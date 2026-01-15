import React, { useRef } from 'react';
import {
    ATSGuideSection,
    ApiConfigSection,
    AIThemesSection,
    CVAnalyzerSection
} from '../widgets';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../features/language-switcher';

interface LandingPageProps {
    apiKey: string | null;
    onSaveApiKey: (key: string) => void;
    onNavigateToEditor: () => void;
    onRequestApiKey: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
    apiKey,
    onSaveApiKey,
    onNavigateToEditor,
    onRequestApiKey
}) => {
    const { t } = useTranslation();
    const analyzerRef = useRef<HTMLDivElement>(null);

    const scrollToAnalyzer = () => {
        analyzerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CV</span>
                        </div>
                        <span className="text-lg font-bold text-white">Maker AI</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#ats-guide" className="text-sm text-slate-300 hover:text-white transition-colors">{t('nav.atsGuide')}</a>
                        <a href="#api-config" className="text-sm text-slate-300 hover:text-white transition-colors">{t('nav.apiConfig')}</a>
                        <a href="#themes" className="text-sm text-slate-300 hover:text-white transition-colors">{t('nav.themes')}</a>
                        <a href="#analyzer" className="text-sm text-slate-300 hover:text-white transition-colors">{t('nav.cvAnalyzer')}</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitcher />
                        </div>
                        <button
                            onClick={onNavigateToEditor}
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors"
                        >
                            {t('nav.goToEditor')}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <HeroSection
                onStartEditor={onNavigateToEditor}
                onStartAnalyzer={scrollToAnalyzer}
            />

            {/* ATS Guide */}
            <div id="ats-guide">
                <ATSGuideSection />
            </div>

            {/* API Config */}
            <div id="api-config">
                <ApiConfigSection
                    apiKey={apiKey}
                    onSaveApiKey={onSaveApiKey}
                />
            </div>

            {/* AI Themes */}
            <div id="themes">
                <AIThemesSection
                    onOpenEditor={onNavigateToEditor}
                />
            </div>

            {/* CV Analyzer */}
            <div id="analyzer" ref={analyzerRef}>
                <CVAnalyzerSection
                    apiKey={apiKey}
                    onRequestApiKey={onRequestApiKey}
                />
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CV</span>
                            </div>
                            <span className="text-lg font-bold">Maker AI</span>
                        </div>

                        <p className="text-slate-400 text-sm text-center">
                            {t('footer.description')}
                        </p>

                        <div className="flex items-center gap-4">
                            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">
                                {t('footer.poweredBy')}
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
                        © 2026 {t('nav.cvMakerAi')}. {t('footer.rights')}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
