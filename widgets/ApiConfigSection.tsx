import React, { useState, useEffect } from 'react';
import { Key, Shield, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Eye, EyeOff, Sparkles, ChevronUp, ChevronDown, Target } from 'lucide-react';
import { GradientButton } from '../shared/ui';
import { useTranslation, Trans } from 'react-i18next';

interface ApiConfigSectionProps {
    apiKey: string | null;
    onSaveApiKey: (key: string) => void;
}

const ApiConfigSection: React.FC<ApiConfigSectionProps> = ({ apiKey, onSaveApiKey }) => {
    const { t } = useTranslation();
    const [inputKey, setInputKey] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        if (apiKey) {
            setStatus('valid');
            setInputKey(apiKey);
        }
    }, [apiKey]);

    const handleSave = async () => {
        if (!inputKey.trim()) return;

        setStatus('validating');
        // Simple validation simulation
        setTimeout(() => {
            if (inputKey.startsWith('AIza')) {
                onSaveApiKey(inputKey);
                setStatus('valid');
            } else {
                setStatus('invalid');
            }
        }, 1000);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('apiConfig.title')}</h1>
                <p className="text-slate-600">
                    {t('apiConfig.subtitle')}
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Config Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl ${status === 'valid' ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                            <Key className={`w-6 h-6 ${status === 'valid' ? 'text-emerald-600' : 'text-slate-500'}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{t('apiConfig.statusTitle')}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${status === 'valid' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                <span className={`text-sm font-medium ${status === 'valid' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                    {status === 'valid' ? t('apiConfig.statusConnected') : t('apiConfig.statusNotConnected')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-slate-700">
                            {t('apiConfig.inputLabel')}
                        </label>
                        <div className="relative">
                            <input
                                type={isVisible ? 'text' : 'password'}
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className={`
                  w-full pl-4 pr-12 py-3 bg-slate-50 border rounded-xl outline-none transition-all
                  ${status === 'invalid'
                                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'}
                `}
                            />
                            <button
                                onClick={() => setIsVisible(!isVisible)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {status === 'invalid' && (
                            <p className="text-sm text-rose-600 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {t('apiConfig.errorInvalid')}
                            </p>
                        )}

                        <div className="flex justify-end mt-4">
                            <GradientButton
                                onClick={handleSave}
                                disabled={status === 'validating' || !inputKey.trim()}
                                icon={status === 'validating' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            >
                                {status === 'validating' ? t('common.loading') : t('apiConfig.verifyAndSave')}
                            </GradientButton>
                        </div>

                        {/* Expandable Guide */}
                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <button
                                onClick={() => setShowGuide(!showGuide)}
                                className="flex items-center justify-between w-full text-left group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                        <Sparkles className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <span className="font-semibold text-slate-700">{t('apiConfig.guideTitle')}</span>
                                </div>
                                {showGuide ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>

                            {showGuide && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl animate-in slide-in-from-top-2 duration-200">
                                    <p className="text-sm text-slate-600 mb-4">
                                        {t('apiConfig.guideIntro')}
                                    </p>
                                    <ol className="space-y-3 text-sm">
                                        {[
                                            { step: 1, text: '', link: 'https://aistudio.google.com/app/apikey' },
                                            { step: 2, text: t('apiConfig.guideStep2') },
                                            { step: 3, text: t('apiConfig.guideStep3') },
                                            { step: 4, text: t('apiConfig.guideStep4') }
                                        ].map((item) => (
                                            <li key={item.step} className="flex items-start gap-3">
                                                <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold shrink-0">
                                                    {item.step}
                                                </span>
                                                <span className="text-slate-600">
                                                    {item.step === 1 ? (
                                                        <Trans i18nKey="apiConfig.guideStep1WithLink">
                                                            <a
                                                                href={item.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-indigo-600 hover:underline font-medium"
                                                            >
                                                                Google AI Studio
                                                            </a>
                                                        </Trans>
                                                    ) : item.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* ATS Tips Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-100 rounded-xl">
                                <Target className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h4 className="font-bold text-slate-800">{t('apiConfig.optimTipsTitle')}</h4>
                        </div>
                        <ul className="space-y-3">
                            {[
                                t('apiConfig.tip1'),
                                t('apiConfig.tip2'),
                                t('apiConfig.tip3')
                            ].map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiConfigSection;

