import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors font-medium text-sm"
            aria-label="Change Language"
            title="Switch Language (TR/EN)"
        >
            <Globe size={16} />
            <span className="uppercase">{i18n.language === 'tr' ? 'TR' : 'EN'}</span>
        </button>
    );
};
