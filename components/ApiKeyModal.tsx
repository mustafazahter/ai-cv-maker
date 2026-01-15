import React, { useState } from 'react';
import { Key, Lock, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSave: (key: string) => void;
  savedKey: string | null;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, savedKey }) => {
  const { t } = useTranslation();
  const [inputKey, setInputKey] = useState(savedKey || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4 text-primary">
          <div className="p-3 bg-blue-50 rounded-full">
            <Key className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">{t('apiKeyModal.title')}</h2>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {t('apiKeyModal.description')}
        </p>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder={t('apiKeyModal.placeholder')}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <button
            onClick={() => onSave(inputKey)}
            disabled={!inputKey.trim()}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {savedKey ? t('apiKeyModal.update') : t('apiKeyModal.save')}
            <CheckCircle className="w-4 h-4" />
          </button>

          <div className="text-center">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              {t('apiKeyModal.getFreeKey')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
