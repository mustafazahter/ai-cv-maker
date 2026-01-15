
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'tr',
        // lng: 'tr', // Removed to allow detector to work
        debug: import.meta.env.DEV,

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'], // persist language in localStorage
        },

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },

        backend: {
            loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
        }
    });

export default i18n;
