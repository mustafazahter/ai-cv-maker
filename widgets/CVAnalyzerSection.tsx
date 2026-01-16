import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Image as ImageIcon, Loader2, Sparkles, X, CheckCircle } from 'lucide-react';
import { GradientButton } from '@/shared/ui';
import { analyzeCV, CVAnalysisResult, CVAnalysisResultView } from '../features/cv-analyzer';
import { useTranslation } from 'react-i18next';

interface CVAnalyzerSectionProps {
    apiKey: string | null;
    onRequestApiKey: () => void;
}

const CVAnalyzerSection: React.FC<CVAnalyzerSectionProps> = ({ apiKey, onRequestApiKey }) => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<CVAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const features = [
        {
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
            title: t('cvAnalyzer.features.detailedScoring'),
            description: t('cvAnalyzer.features.detailedScoringDesc'),
            color: 'bg-emerald-100'
        },
        {
            icon: <Sparkles className="w-6 h-6 text-amber-600" />,
            title: t('cvAnalyzer.features.aiSuggestions'),
            description: t('cvAnalyzer.features.aiSuggestionsDesc'),
            color: 'bg-amber-100'
        },
        {
            icon: <FileText className="w-6 h-6 text-indigo-600" />,
            title: t('cvAnalyzer.features.keywordAnalysis'),
            description: t('cvAnalyzer.features.keywordAnalysisDesc'),
            color: 'bg-indigo-100'
        }
    ];

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
            setFile(droppedFile);
            setError(null);
        } else {
            setError(t('cvAnalyzer.errorType'));
        }
    }, [t]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
                setFile(selectedFile);
                setError(null);
            } else {
                setError(t('cvAnalyzer.errorType'));
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAnalyze = async () => {
        if (!file) return;

        if (!apiKey) {
            onRequestApiKey();
            return;
        }

        setIsAnalyzing(true);
        setProgress(0);
        setError(null);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setProgress(prev => Math.min(prev + Math.random() * 15, 90));
        }, 500);

        try {
            // Convert file to base64
            const reader = new FileReader();
            const base64Data = await new Promise<string>((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            });

            const analysisResult = await analyzeCV(apiKey, {
                base64: base64Data,
                mimeType: file.type
            }, t('common.languageCode') === 'en' ? 'en' : 'tr');

            setProgress(100);
            setTimeout(() => {
                setResult(analysisResult);
                setIsAnalyzing(false);
            }, 500);

        } catch (err: any) {
            // Friendly error messages for common API issues
            const errorMessage = err.message?.toLowerCase() || '';

            if (errorMessage.includes('api key') || errorMessage.includes('apikey') || errorMessage.includes('401') || errorMessage.includes('invalid')) {
                setError(t('cvAnalyzer.apiKeyError', 'API anahtarınızı kontrol edin. Geçersiz veya eksik olabilir.'));
            } else if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('rate')) {
                setError(t('cvAnalyzer.quotaError', 'API kullanım limitine ulaşıldı. Lütfen biraz bekleyin.'));
            } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
                setError(t('cvAnalyzer.networkError', 'Bağlantı hatası. İnternet bağlantınızı kontrol edin.'));
            } else {
                setError(t('cvAnalyzer.genericError', 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.'));
            }
            setIsAnalyzing(false);
        } finally {
            clearInterval(progressInterval);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('cvAnalyzer.title')}</h1>
                <p className="text-slate-600">
                    {t('cvAnalyzer.subtitle')}
                </p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                {!file ? (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-300
              ${isDragging
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
            `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        <div className={`
              mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-colors
              ${isDragging ? 'bg-indigo-100' : 'bg-slate-100'}
            `}>
                            <Upload className={`w-10 h-10 ${isDragging ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {t('cvAnalyzer.dragDropTitle')}
                        </h3>
                        <p className="text-slate-500 mb-4">
                            {t('cvAnalyzer.orClick')}
                        </p>

                        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                PDF
                            </span>
                            <span className="flex items-center gap-1">
                                <ImageIcon className="w-4 h-4" />
                                PNG, JPG
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* File Preview */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 rounded-xl">
                                    {file.type === 'application/pdf'
                                        ? <FileText className="w-6 h-6 text-indigo-600" />
                                        : <ImageIcon className="w-6 h-6 text-indigo-600" />
                                    }
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{file.name}</p>
                                    <p className="text-sm text-slate-500">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                disabled={isAnalyzing}
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        {isAnalyzing && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">{t('cvAnalyzer.analyzing')}</span>
                                    <span className="font-semibold text-indigo-600">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 text-center">
                                    {t('cvAnalyzer.analyzingDesc')}
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Analyze Button */}
                        {!isAnalyzing && (
                            <div className="flex justify-center">
                                <GradientButton
                                    onClick={handleAnalyze}
                                    size="lg"
                                    icon={<Sparkles className="w-5 h-5" />}
                                >
                                    {t('cvAnalyzer.analyzeBtn')}
                                </GradientButton>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
                {features.map((feature, idx) => (
                    <div key={idx} className="text-center bg-white rounded-xl border border-slate-200 p-5">
                        <div className={`mx-auto w-12 h-12 rounded-2xl flex items-center justify-center mb-3 ${feature.color}`}>
                            {feature.icon}
                        </div>
                        <h4 className="font-semibold text-slate-800 mb-1">{feature.title}</h4>
                        <p className="text-sm text-slate-500">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Analysis Result Modal */}
            {result && (
                <CVAnalysisResultView
                    result={result}
                    onClose={() => setResult(null)}
                />
            )}
        </div>
    );
};

export default CVAnalyzerSection;
