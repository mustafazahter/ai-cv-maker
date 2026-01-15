import React from 'react';
import { CheckCircle, FileText, Target, Scan, AlertTriangle, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ATSGuideSection: React.FC = () => {
    const { t } = useTranslation();

    const atsRules = [
        {
            icon: <FileText className="w-5 h-5 text-indigo-600" />,
            title: t('atsGuide.rules.simpleFormat'),
            description: t('atsGuide.rules.simpleFormatDesc'),
            color: 'bg-indigo-50'
        },
        {
            icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
            title: t('atsGuide.rules.standardTitles'),
            description: t('atsGuide.rules.standardTitlesDesc'),
            color: 'bg-emerald-50'
        },
        {
            icon: <Target className="w-5 h-5 text-amber-600" />,
            title: t('atsGuide.rules.keywords'),
            description: t('atsGuide.rules.keywordsDesc'),
            color: 'bg-amber-50'
        },
        {
            icon: <Scan className="w-5 h-5 text-cyan-600" />,
            title: t('atsGuide.rules.fileFormat'),
            description: t('atsGuide.rules.fileFormatDesc'),
            color: 'bg-cyan-50'
        },
        {
            icon: <AlertTriangle className="w-5 h-5 text-violet-600" />,
            title: t('atsGuide.rules.actionVerbs'),
            description: t('atsGuide.rules.actionVerbsDesc'),
            color: 'bg-violet-50'
        },
        {
            icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
            title: t('atsGuide.rules.noHeaderFooter'),
            description: t('atsGuide.rules.noHeaderFooterDesc'),
            color: 'bg-rose-50'
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('atsGuide.title')}</h1>
                <p className="text-slate-600">
                    {t('atsGuide.subtitle')}
                </p>
            </div>

            {/* What is ATS */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        {t('atsGuide.whatIsAtsTitle')}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        {t('atsGuide.whatIsAtsDesc')}
                    </p>
                    <div className="space-y-3">
                        {[
                            t('atsGuide.stat1'),
                            t('atsGuide.stat2'),
                            t('atsGuide.stat3')
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                <span className="text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl border border-rose-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-rose-100 rounded-xl">
                            <Target className="w-6 h-6 text-rose-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">{t('atsGuide.simulationTitle')}</h4>
                            <p className="text-sm text-slate-500">{t('atsGuide.simulationSubtitle')}</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm font-mono bg-slate-900 rounded-xl p-4 text-emerald-400">
                        <p>Scanning: resume.pdf</p>
                        <p>→ Extracting text... <span className="text-emerald-300">✓</span></p>
                        <p>→ Parsing sections... <span className="text-emerald-300">✓</span></p>
                        <p>→ Keywords found: 12/20</p>
                        <p>→ Format score: 85%</p>
                        <p className="text-amber-400">⚠ Warning: Missing skills section</p>
                        <p className="text-cyan-400 mt-2">Result: 68% ATS Score</p>
                    </div>
                </div>
            </div>

            {/* Best Practices */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">
                    {t('atsGuide.rulesTitle')}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {atsRules.map((rule, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                        >
                            <div className={`p-3 rounded-xl ${rule.color} w-fit mb-4`}>
                                {rule.icon}
                            </div>
                            <h4 className="font-bold text-slate-800 mb-2">{rule.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{rule.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-2xl border border-indigo-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl shrink-0">
                        <Lightbulb className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-2">{t('atsGuide.proTipTitle')}</h4>
                        <p className="text-slate-600 leading-relaxed">
                            {t('atsGuide.proTipDesc')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATSGuideSection;
