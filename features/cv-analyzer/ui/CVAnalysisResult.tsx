import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Target, FileText, Zap, X } from 'lucide-react';
import { CVAnalysisResult } from '../model/types';
import { CircularProgress, GlassCard } from '../../../shared/ui';
import { useTranslation } from 'react-i18next';

interface CVAnalysisResultProps {
    result: CVAnalysisResult;
    onClose: () => void;
}

const CVAnalysisResultView: React.FC<CVAnalysisResultProps> = ({ result, onClose }) => {
    const { t } = useTranslation();
    const { scores, strengths, improvements, summary, keywordsFound, keywordsMissing, atsWarnings } = result;

    const getScoreColor = (score: number): 'emerald' | 'amber' | 'rose' => {
        if (score >= 75) return 'emerald';
        if (score >= 50) return 'amber';
        return 'rose';
    };

    const priorityColors = {
        high: 'bg-rose-50 text-rose-700 border-rose-200',
        medium: 'bg-amber-50 text-amber-700 border-amber-200',
        low: 'bg-slate-50 text-slate-600 border-slate-200'
    };

    const categoryIcons = {
        format: <FileText className="w-4 h-4" />,
        content: <Target className="w-4 h-4" />,
        keywords: <Zap className="w-4 h-4" />,
        structure: <TrendingUp className="w-4 h-4" />
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-0 md:p-4 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-50 to-white md:rounded-3xl shadow-2xl w-full max-w-5xl h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 md:p-6 flex items-center justify-between shrink-0 z-10">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800">{t('cvAnalyzer.resultTitle')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                <div className="p-4 md:p-6 space-y-6 md:space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Summary Section - Moved from Header */}
                    <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                            {summary}
                        </p>
                    </div>
                    {/* Score Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="col-span-2 md:col-span-1 lg:col-span-2 flex justify-center">
                            <div className="text-center">
                                <CircularProgress
                                    value={scores.overall}
                                    size={140}
                                    strokeWidth={10}
                                    label={t('cvAnalyzer.scoreGeneral')}
                                    sublabel={t('cvAnalyzer.scoreLabel')}
                                    color={getScoreColor(scores.overall)}
                                />
                            </div>
                        </div>

                        <ScoreItem label={t('cvAnalyzer.scoreFormat')} value={scores.format} />
                        <ScoreItem label={t('cvAnalyzer.scoreContent')} value={scores.content} />
                        <ScoreItem label={t('cvAnalyzer.scoreAtsCompatibility')} value={scores.atsCompatibility} />
                        <ScoreItem label={t('cvAnalyzer.scoreKeywords')} value={scores.keywords} />
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <GlassCard hover={false} className="bg-emerald-50/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-emerald-100 rounded-xl">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">{t('cvAnalyzer.strengthsTitle')}</h3>
                            </div>
                            <div className="space-y-3">
                                {strengths.map((strength) => (
                                    <div
                                        key={strength.id}
                                        className="bg-white/80 rounded-xl p-4 border border-emerald-100"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-emerald-600">{categoryIcons[strength.category]}</span>
                                            <h4 className="font-medium text-slate-800">{strength.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-600">{strength.description}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Improvements */}
                        <GlassCard hover={false} className="bg-amber-50/50">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-amber-100 rounded-xl">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800">{t('cvAnalyzer.improvementsTitle')}</h3>
                            </div>
                            <div className="space-y-3">
                                {improvements.map((improvement) => (
                                    <div
                                        key={improvement.id}
                                        className="bg-white/80 rounded-xl p-4 border border-amber-100"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-amber-600">{categoryIcons[improvement.category]}</span>
                                                <h4 className="font-medium text-slate-800">{improvement.title}</h4>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[improvement.priority]}`}>
                                                {improvement.priority === 'high' ? t('cvAnalyzer.priorityHigh') : improvement.priority === 'medium' ? t('cvAnalyzer.priorityMedium') : t('cvAnalyzer.priorityLow')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600">{improvement.description}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Keywords Section */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <GlassCard hover={false}>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">{t('cvAnalyzer.keywordsFoundTitle')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {keywordsFound.map((keyword, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard hover={false}>
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">{t('cvAnalyzer.keywordsMissingTitle')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {keywordsMissing.map((keyword, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100"
                                    >
                                        + {keyword}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* ATS Warnings */}
                    {atsWarnings.length > 0 && (
                        <GlassCard hover={false} className="bg-rose-50/50">
                            <h3 className="text-lg font-semibold text-slate-800 mb-3">{t('cvAnalyzer.atsWarningsTitle')}</h3>
                            <ul className="space-y-2">
                                {atsWarnings.map((warning, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-rose-700">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
};

const ScoreItem: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const getColor = (v: number) => {
        if (v >= 75) return 'text-emerald-600 bg-emerald-50';
        if (v >= 50) return 'text-amber-600 bg-amber-50';
        return 'text-rose-600 bg-rose-50';
    };

    return (
        <div className={`rounded-2xl p-4 text-center ${getColor(value)}`}>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs font-medium mt-1 opacity-80">{label}</p>
        </div>
    );
};

export default CVAnalysisResultView;
