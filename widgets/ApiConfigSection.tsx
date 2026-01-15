import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, XCircle, Loader2, ExternalLink, ChevronDown, ChevronUp, Sparkles, Zap, Target, FileText } from 'lucide-react';
import { GlassCard, GradientButton } from '../shared/ui';

interface ApiConfigSectionProps {
    apiKey: string | null;
    onSaveApiKey: (key: string) => void;
}

const ApiConfigSection: React.FC<ApiConfigSectionProps> = ({ apiKey, onSaveApiKey }) => {
    const [inputKey, setInputKey] = useState(apiKey || '');
    const [showKey, setShowKey] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'verifying'>('disconnected');
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        if (apiKey) {
            setConnectionStatus('connected');
            setInputKey(apiKey);
        }
    }, [apiKey]);

    const handleVerifyAndSave = async () => {
        if (!inputKey.trim()) return;

        setIsVerifying(true);
        setConnectionStatus('verifying');

        // Simulate API verification
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In real app, we'd verify the key here
        onSaveApiKey(inputKey);
        setConnectionStatus('connected');
        setIsVerifying(false);
    };

    const handleClear = () => {
        setInputKey('');
        setConnectionStatus('disconnected');
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">API Yapılandırması</h1>
                        <p className="text-slate-600">
                            Gelişmiş ATS optimizasyon özellikleri için Gemini AI hesabınızı bağlayın.
                        </p>
                    </div>

                    {/* System Status Badge */}
                    <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
            ${connectionStatus === 'connected'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'}
          `}>
                        <span className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {connectionStatus === 'connected' ? 'Sistem Çevrimiçi' : 'Bağlantı Yok'}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Config Card */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-lg shadow-indigo-500/30">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">Gemini AI Bağlantısı</h3>
                                    <p className="text-sm text-slate-500">AI özelliklerini etkinleştirmek için API anahtarınızı yönetin</p>
                                </div>
                            </div>

                            {/* Connection Status Badge */}
                            <div className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                ${connectionStatus === 'connected'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : connectionStatus === 'verifying'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'}
              `}>
                                {connectionStatus === 'connected' && <CheckCircle className="w-3.5 h-3.5" />}
                                {connectionStatus === 'verifying' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                {connectionStatus === 'disconnected' && <XCircle className="w-3.5 h-3.5" />}
                                {connectionStatus === 'connected' ? 'Bağlı' : connectionStatus === 'verifying' ? 'Doğrulanıyor' : 'Bağlı Değil'}
                            </div>
                        </div>

                        {/* API Key Input */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700">Gemini API Anahtarı</label>
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
                                >
                                    Nasıl alınır? <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Key className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type={showKey ? 'text' : 'password'}
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    placeholder="AIza ile başlayan anahtarınızı girin..."
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700 placeholder-slate-400"
                                />
                                <button
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                Anahtarınız tarayıcınızda yerel olarak saklanır ve asla sunucularımıza gönderilmez.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end gap-3 mt-6">
                            <button
                                onClick={handleClear}
                                className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-all"
                            >
                                Temizle
                            </button>
                            <GradientButton
                                onClick={handleVerifyAndSave}
                                disabled={!inputKey.trim() || isVerifying}
                                icon={isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            >
                                {isVerifying ? 'Doğrulanıyor...' : 'Doğrula & Kaydet'}
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
                                    <span className="font-semibold text-slate-700">Gemini API Anahtarı Nasıl Alınır?</span>
                                </div>
                                {showGuide ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </button>

                            {showGuide && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl animate-in slide-in-from-top-2 duration-200">
                                    <p className="text-sm text-slate-600 mb-4">
                                        AI özelliklerini kullanmak için Google'dan ücretsiz bir API anahtarı almanız gerekiyor:
                                    </p>
                                    <ol className="space-y-3 text-sm">
                                        {[
                                            { step: 1, text: 'Google AI Studio\'ya gidin ve Google hesabınızla giriş yapın.', link: 'https://aistudio.google.com/app/apikey' },
                                            { step: 2, text: 'Sol kenar çubuğundan "Get API key" seçeneğine tıklayın.' },
                                            { step: 3, text: '"Create API key in new project" butonuna tıklayın.' },
                                            { step: 4, text: 'Oluşturulan anahtarı kopyalayıp yukarıya yapıştırın.' }
                                        ].map((item) => (
                                            <li key={item.step} className="flex items-start gap-3">
                                                <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold shrink-0">
                                                    {item.step}
                                                </span>
                                                <span className="text-slate-600">
                                                    {item.link ? (
                                                        <>
                                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">
                                                                Google AI Studio
                                                            </a>
                                                            'ya gidin ve Google hesabınızla giriş yapın.
                                                        </>
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
                            <h4 className="font-bold text-slate-800">ATS Optimizasyon İpuçları</h4>
                        </div>
                        <ul className="space-y-3">
                            {[
                                'AI, iş ilanlarından anahtar becerileri otomatik olarak çıkarır.',
                                'Daha iyi ayrıştırma için "Deneyim" gibi standart başlıklar kullanın.',
                                'AI\'mız CV\'nizin aktif ses ve ölçülebilir başarılar kullandığından emin olur.'
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

