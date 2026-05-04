import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Bus, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TransportSelection() {
  const { t, blindMode } = useLanguage();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const transportOptions = [
    { id: 'government', icon: '🚌', route: '/bus/government', color: 'from-blue-500 to-blue-600' },
    { id: 'private', icon: '🚍', route: '/bus/private', color: 'from-blue-500 to-blue-600' },
    { id: 'auto', icon: '🛺', route: '/auto', color: 'from-green-500 to-green-600' },
    { id: 'car', icon: '🚗', route: '/car', color: 'from-purple-500 to-purple-600' },
    { id: 'bike', icon: '🏍️', route: '/bike', color: 'from-red-500 to-red-600' },
    { id: 'train', icon: '🚆', route: '/train', color: 'from-indigo-500 to-indigo-600' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className={`bg-gradient-to-br from-primary to-secondary px-6 py-8 ${blindMode ? 'py-12' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/language')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={logout}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
        
        <h1 className={`text-2xl font-bold text-white text-center ${blindMode ? 'text-3xl' : ''}`}>
          {t.selectTransport}
        </h1>
        <p className={`text-white/80 text-center mt-2 ${blindMode ? 'text-lg' : ''}`}>
          +91 {user?.phone?.slice(0, 3)}****{user?.phone?.slice(7)}
        </p>
      </div>

      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {transportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => navigate(option.route)}
              className={`transport-card aspect-square ${blindMode ? 'p-6' : ''}`}
            >
              <span className="text-5xl mb-2">{option.icon}</span>
              <p className={`font-semibold text-gray-800 text-center ${blindMode ? 'text-xl' : ''}`}>
                {t[option.id === 'government' ? 'governmentBus' : option.id]}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-md mx-auto flex items-center justify-center gap-2 text-gray-500">
          <Bus className="w-5 h-5" />
          <span className="text-sm">Madurai One</span>
        </div>
      </div>
    </div>
  );
}
