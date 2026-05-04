import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Languages, Eye, ArrowRight, Check } from 'lucide-react';

export default function LanguageSelection() {
  const { user } = useAuth();
  const { language, blindMode, changeLanguage, toggleBlindMode, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-gray-50 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-primary to-secondary px-6 py-12">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
          <Languages className="w-8 h-8 text-primary" />
        </div>
        <h1 className={`text-2xl font-bold text-white text-center ${blindMode ? 'text-3xl' : ''}`}>
          {t.selectLanguage}
        </h1>
      </div>

      <div className="px-6 py-8 space-y-6 max-w-md mx-auto">
        <div className="space-y-4">
          <h2 className={`font-semibold text-gray-700 ${blindMode ? 'text-xl' : ''}`}>
            {t.selectLanguage}
          </h2>
          
          <button
            onClick={() => changeLanguage('tamil')}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              language === 'tamil' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🇮🇳</span>
              <div className="text-left">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-2xl' : ''}`}>
                  {t.tamil}
                </p>
                <p className={`text-gray-500 font-tamil ${blindMode ? 'text-xl' : ''}`}>
                  {t.tamilDesc}
                </p>
              </div>
            </div>
            {language === 'tamil' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>

          <button
            onClick={() => changeLanguage('english')}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              language === 'english' ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">🇬🇧</span>
              <div className="text-left">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-2xl' : ''}`}>
                  {t.englishLang}
                </p>
                <p className={`text-gray-500 ${blindMode ? 'text-xl' : ''}`}>
                  {t.englishDesc}
                </p>
              </div>
            </div>
            {language === 'english' && (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className={`font-semibold text-gray-700 ${blindMode ? 'text-xl' : ''}`}>
            {t.blindMode}
          </h2>
          
          <button
            onClick={toggleBlindMode}
            className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
              blindMode ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${blindMode ? 'bg-primary' : 'bg-gray-100'}`}>
                <Eye className={`w-6 h-6 ${blindMode ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <div className="text-left">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-2xl' : ''}`}>
                  {t.blindMode}
                </p>
                <p className={`text-gray-500 ${blindMode ? 'text-lg' : ''}`}>
                  {t.blindModeDesc}
                </p>
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${blindMode ? 'bg-primary' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${blindMode ? 'translate-x-5' : ''}`} />
            </div>
          </button>
        </div>

        <button
          onClick={() => navigate('/location')}
          className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
        >
          <span>{t.continue}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
