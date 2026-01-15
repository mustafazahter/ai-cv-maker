import React from 'react';
import { Sparkles, FileText, Zap, ArrowRight } from 'lucide-react';
import { GradientButton } from '../shared/ui';

interface HeroSectionProps {
    onStartEditor: () => void;
    onStartAnalyzer: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartEditor, onStartAnalyzer }) => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Glowing Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-white/90">AI Destekli CV Oluşturucu</span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    <span className="block">Profesyonel CV'nizi</span>
                    <span className="block bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                        AI ile Oluşturun
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    ATS uyumlu, profesyonel CV'ler oluşturun. Gemini AI ile CV'nizi analiz edin,
                    güçlü yönlerinizi öne çıkarın ve hayalinizdeki işe bir adım daha yaklaşın.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <GradientButton
                        onClick={onStartEditor}
                        size="lg"
                        icon={<FileText className="w-5 h-5" />}
                    >
                        CV Oluşturmaya Başla
                    </GradientButton>

                    <GradientButton
                        onClick={onStartAnalyzer}
                        variant="outline"
                        size="lg"
                        icon={<Zap className="w-5 h-5" />}
                        className="!border-white/30 !text-white hover:!bg-white/10"
                    >
                        CV'ni Analiz Et
                    </GradientButton>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
                    <StatItem value="100%" label="ATS Uyumlu" />
                    <StatItem value="AI" label="Destekli" />
                    <StatItem value="∞" label="Ücretsiz" />
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                <span className="text-xs text-white/50 uppercase tracking-widest">Keşfet</span>
                <ArrowRight className="w-4 h-4 text-white/50 rotate-90" />
            </div>
        </section>
    );
};

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
    </div>
);

export default HeroSection;
