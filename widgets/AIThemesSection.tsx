import React from 'react';
import { Palette, ArrowRight, Sparkles, Check } from 'lucide-react';
import { GradientButton } from '../shared/ui';

interface AIThemesSectionProps {
    onOpenEditor: () => void;
}

const AIThemesSection: React.FC<AIThemesSectionProps> = ({ onOpenEditor }) => {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">AI CV Temaları</h1>
                <p className="text-slate-600">
                    Profesyonel ve ATS uyumlu CV şablonlarından birini seçin.
                </p>
            </div>

            {/* Themes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {themes.map((theme, idx) => (
                    <ThemeCard
                        key={idx}
                        theme={theme}
                        isActive={idx === 0}
                        onSelect={onOpenEditor}
                    />
                ))}
            </div>
        </div>
    );
};

interface ThemeCardProps {
    theme: typeof themes[0];
    isActive: boolean;
    onSelect: () => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ theme, isActive, onSelect }) => {
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
            <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-50 p-4 overflow-hidden">
                {/* Mini CV Preview */}
                <div className="bg-white rounded-lg shadow-xl h-full p-3 transform group-hover:scale-[1.02] transition-transform duration-300">
                    {/* Header */}
                    <div className={`h-2 rounded-full mb-2 ${theme.accentColor}`} />
                    <div className="h-1.5 bg-slate-200 rounded-full w-2/3 mb-1" />
                    <div className="h-1 bg-slate-100 rounded-full w-1/2 mb-3" />

                    {/* Content Lines */}
                    <div className="space-y-2">
                        <div className={`h-1 rounded-full w-1/3 ${theme.accentColor} opacity-70`} />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-1 bg-slate-100 rounded-full" style={{ width: `${85 - i * 10}%` }} />
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className={`h-1 rounded-full w-1/4 ${theme.accentColor} opacity-70`} />
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-1 bg-slate-100 rounded-full" style={{ width: `${75 - i * 15}%` }} />
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className={`h-1 rounded-full w-1/5 ${theme.accentColor} opacity-70`} />
                        <div className="flex gap-1">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-3 bg-slate-100 rounded flex-1" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Active Badge */}
                {isActive && (
                    <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Aktif
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
                    <span className="text-sm font-semibold text-slate-700">Kullan</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600" />
                </div>
            </div>
        </div>
    );
};

const themes = [
    {
        name: 'Modern Minimal',
        description: 'Temiz ve profesyonel, ATS için optimize edilmiş.',
        accentColor: 'bg-indigo-500',
        tags: ['ATS Uyumlu', 'Tek Sütun', 'Minimal']
    },
    {
        name: 'Executive Pro',
        description: 'Yönetici pozisyonları için ideal.',
        accentColor: 'bg-slate-700',
        tags: ['Üst Düzey', 'Profesyonel']
    },
    {
        name: 'Tech Creative',
        description: 'Teknoloji sektörü için modern görünüm.',
        accentColor: 'bg-cyan-500',
        tags: ['Teknoloji', 'Modern']
    },
    {
        name: 'Classic Elegant',
        description: 'Geleneksel sektörler için klasik görünüm.',
        accentColor: 'bg-amber-600',
        tags: ['Klasik', 'Güvenilir']
    },
    {
        name: 'Fresh Graduate',
        description: 'Yeni mezunlar için beceri odaklı.',
        accentColor: 'bg-emerald-500',
        tags: ['Yeni Mezun', 'Temiz']
    },
    {
        name: 'Bold Impact',
        description: 'Dikkat çekici ve etkileyici tasarım.',
        accentColor: 'bg-rose-500',
        tags: ['Etkileyici', 'Cesur']
    }
];

export default AIThemesSection;
