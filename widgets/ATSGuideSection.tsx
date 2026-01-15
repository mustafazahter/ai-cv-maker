import React from 'react';
import { CheckCircle, FileText, Target, Scan, AlertTriangle, Lightbulb } from 'lucide-react';

const ATSGuideSection: React.FC = () => {
    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">CV Nasıl Olmalı?</h1>
                <p className="text-slate-600">
                    ATS (Applicant Tracking System) nedir ve CV'niz nasıl olmalı öğrenin.
                </p>
            </div>

            {/* What is ATS */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">
                        ATS (Applicant Tracking System) Nedir?
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        ATS, şirketlerin iş başvurularını yönetmek için kullandığı yazılımlardır.
                        Bu sistemler CV'leri otomatik olarak tarar, anahtar kelimeleri analiz eder
                        ve adayları puanlar. Eğer CV'niz ATS uyumlu değilse, insan gözüne hiç ulaşmadan
                        elenebilir.
                    </p>
                    <div className="space-y-3">
                        {[
                            'CV\'lerin %75\'i ATS tarafından elenir',
                            'Robot yazılımlar anahtar kelimeleri tarar',
                            'Format hataları otomatik elemeye neden olur'
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
                            <h4 className="font-bold text-slate-800">ATS Tarama Simülasyonu</h4>
                            <p className="text-sm text-slate-500">Örnek CV analizi</p>
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
                    ATS Uyumlu CV için Altın Kurallar
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
                        <h4 className="font-bold text-slate-800 mb-2">Pro İpucu</h4>
                        <p className="text-slate-600 leading-relaxed">
                            İş ilanındaki anahtar kelimeleri CV'nize ekleyin. Örneğin ilan "React" ve
                            "TypeScript" gerektiriyorsa, bu kelimelerin CV'nizde geçtiğinden emin olun.
                            Ancak keyword stuffing yapmaktan kaçının - içerik doğal olmalı.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const atsRules = [
    {
        icon: <FileText className="w-5 h-5 text-indigo-600" />,
        title: 'Basit Format Kullanın',
        description: 'Tablolar, grafikler ve görsellerden kaçının. ATS bunları okuyamaz.',
        color: 'bg-indigo-50'
    },
    {
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        title: 'Standart Başlıklar',
        description: '"Deneyim", "Eğitim", "Beceriler" gibi standart başlıklar kullanın.',
        color: 'bg-emerald-50'
    },
    {
        icon: <Target className="w-5 h-5 text-amber-600" />,
        title: 'Anahtar Kelimeler',
        description: 'İş ilanındaki anahtar kelimeleri CV\'nize stratejik olarak ekleyin.',
        color: 'bg-amber-50'
    },
    {
        icon: <Scan className="w-5 h-5 text-cyan-600" />,
        title: 'PDF veya DOCX',
        description: 'CV\'nizi PDF veya Word formatında kaydedin.',
        color: 'bg-cyan-50'
    },
    {
        icon: <AlertTriangle className="w-5 h-5 text-violet-600" />,
        title: 'Action Verb\'ler',
        description: '"Geliştirdim", "Yönettim" gibi aksiyon fiilleri kullanın.',
        color: 'bg-violet-50'
    },
    {
        icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
        title: 'Header/Footer Yok',
        description: 'İletişim bilgilerinizi header/footer\'a koymayın.',
        color: 'bg-rose-50'
    }
];

export default ATSGuideSection;
