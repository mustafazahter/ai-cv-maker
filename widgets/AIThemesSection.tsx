import React from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { CVThemeId } from '@/shared/types';
import { GradientButton } from '@/shared/ui';
import { useTranslation } from 'react-i18next';

interface AIThemesSectionProps {
    onSelectTheme: (themeId: CVThemeId) => void;
    currentTheme: CVThemeId;
}

const AIThemesSection: React.FC<AIThemesSectionProps> = ({ onSelectTheme, currentTheme }) => {
    const { t } = useTranslation();

    const themes: { id: CVThemeId; name: string; description: string; accentColor: string; tags: string[] }[] = [
        {
            id: 'classic',
            name: t('aiThemes.themes.classic'),
            description: t('aiThemes.themes.classicDesc'),
            accentColor: 'bg-indigo-500',
            tags: [t('aiThemes.tags.atsFriendly'), t('aiThemes.tags.minimal')]
        },
        {
            id: 'executive',
            name: t('aiThemes.themes.executive'),
            description: t('aiThemes.themes.executiveDesc'),
            accentColor: 'bg-slate-700',
            tags: [t('aiThemes.tags.professional'), t('aiThemes.tags.corporate')]
        },
        {
            id: 'modern',
            name: t('aiThemes.themes.modern'),
            description: t('aiThemes.themes.modernDesc'),
            accentColor: 'bg-cyan-500',
            tags: [t('aiThemes.tags.modern'), t('aiThemes.tags.tech')]
        },
        {
            id: 'sidebar',
            name: t('aiThemes.themes.sidebar'),
            description: t('aiThemes.themes.sidebarDesc'),
            accentColor: 'bg-amber-500',
            tags: [t('aiThemes.tags.twoColumn'), t('aiThemes.tags.detailed')]
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('aiThemes.title')}</h1>
                <p className="text-slate-600">
                    {t('aiThemes.subtitle')}
                </p>
            </div>

            {/* Themes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {themes.map((theme) => (
                    <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isActive={currentTheme === theme.id}
                        onSelect={() => onSelectTheme(theme.id)}
                        t={t}
                    />
                ))}
            </div>

            {/* CTA */}
            <div className="text-center">
                <GradientButton
                    onClick={() => onSelectTheme(currentTheme)}
                    size="lg"
                    icon={<Sparkles className="w-5 h-5" />}
                >
                    {t('aiThemes.editInEditor')}
                </GradientButton>
            </div>
        </div>
    );
};

interface ThemeCardProps {
    theme: { id: CVThemeId; name: string; description: string; accentColor: string; tags: string[] };
    isActive: boolean;
    onSelect: () => void;
    t: any;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onSelect, t }) => {
    return (
        <div
            onClick={onSelect}
            className={`
        relative group cursor-pointer bg-white rounded-2xl border shadow-sm overflow-hidden
        transition-all duration-200 hover:shadow-lg
        ${isActive ? 'ring-2 ring-indigo-500 border-indigo-200' : 'border-slate-200 hover:border-indigo-200'}
      `}
        >
            {/* Preview */}
            <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 p-3 overflow-hidden">
                {/* Mini CV Preview based on theme */}
                {theme.id === 'classic' && (
                    <div className="bg-white rounded-lg shadow-lg h-full p-2.5 transform group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="text-center border-b border-slate-200 pb-2 mb-2">
                            <div className="h-1.5 bg-slate-700 rounded-full w-16 mx-auto mb-1" />
                            <div className="h-1 bg-slate-200 rounded-full w-24 mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-0.5 bg-slate-300 rounded-full w-1/3 border-b border-slate-300" />
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-0.5 bg-slate-100 rounded-full" style={{ width: `${90 - i * 10}%` }} />
                            ))}
                        </div>
                    </div>
                )}

                {theme.id === 'executive' && (
                    <div className="bg-white rounded-lg shadow-lg h-full p-2.5 transform group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="text-center mb-3">
                            <div className="h-1.5 bg-slate-800 rounded-full w-20 mx-auto mb-1" />
                            <div className="h-0.5 bg-slate-300 rounded-full w-12 mx-auto" />
                        </div>
                        <div className="flex items-center gap-1 justify-center mb-2">
                            <div className="h-px bg-slate-300 flex-1" />
                            <div className="h-1 bg-slate-400 rounded-full w-10" />
                            <div className="h-px bg-slate-300 flex-1" />
                        </div>
                        <div className="space-y-1.5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <div className="w-1 h-1 bg-amber-500" style={{ transform: 'rotate(45deg)' }} />
                                    <div className="h-0.5 bg-slate-100 rounded-full flex-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {theme.id === 'modern' && (
                    <div className="bg-white rounded-lg shadow-lg h-full p-2.5 transform group-hover:scale-[1.02] transition-transform duration-300">
                        <div className="text-center border-b border-slate-200 pb-2 mb-2">
                            <div className="h-1.5 bg-slate-800 rounded-full w-24 mx-auto" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-0.5 bg-slate-300 rounded-full w-1/4" />
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="grid grid-cols-[20px_1fr] gap-1">
                                    <div className="h-0.5 bg-slate-200 rounded-full mt-0.5" />
                                    <div className="space-y-0.5">
                                        <div className="h-0.5 bg-cyan-500 rounded-full w-1/2" />
                                        <div className="h-0.5 bg-slate-100 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {theme.id === 'sidebar' && (
                    <div className="bg-white rounded-lg shadow-lg h-full p-2 transform group-hover:scale-[1.02] transition-transform duration-300 grid grid-cols-[30px_1fr] gap-2">
                        <div className="border-r border-amber-100 pr-1 space-y-2">
                            <div className="w-4 h-4 bg-slate-200 rounded-full mx-auto" />
                            <div className="h-0.5 bg-amber-500 rounded-full" />
                            <div className="h-0.5 bg-slate-100 rounded-full" />
                            <div className="h-0.5 bg-slate-100 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-1 bg-amber-500 rounded-full w-16" />
                            <div className="space-y-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-0.5 bg-slate-100 rounded-full" style={{ width: `${90 - i * 15}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Badge */}
                {isActive && (
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {t('aiThemes.active')}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-800">{theme.name}</h4>
                    <div className={`w-4 h-4 rounded-full ${theme.accentColor}`} />
                </div>
                <p className="text-sm text-slate-500 mb-3">{theme.description}</p>

                <div className="flex flex-wrap gap-1">
                    {theme.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <span className="text-sm font-semibold text-slate-700">{t('aiThemes.use')}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                </div>
            </div>
        </div>
    );
};

export default AIThemesSection;
