import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function Bike() {
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const bikeServices = [
    {
      id: 'rapido',
      name: t.rapido,
      url: 'https://rapido.bike/Home',
      icon: '🏍️',
      color: 'bg-yellow-500'
    }
  ];

  const openWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-red-500 to-red-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/transport')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-4xl">🏍️</div>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {t.bike}
          </h1>
        </div>
        <p className={`text-white/80 ${blindMode ? 'text-lg' : ''}`}>
          {t.bookBike}
        </p>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="space-y-4">
          {bikeServices.map((service) => (
            <button
              key={service.id}
              onClick={() => openWebsite(service.url)}
              className="website-card w-full"
            >
              <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center text-2xl`}>
                {service.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-xl' : ''}`}>
                  {service.name}
                </p>
                <p className={`text-gray-500 text-sm ${blindMode ? 'text-lg' : ''}`}>
                  {service.url.replace('https://', '').replace('www.', '')}
                </p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => navigate('/transport')}
          className={`w-full py-3 text-primary font-semibold ${blindMode ? 'text-xl' : ''}`}
        >
          {t.back}
        </button>
      </div>
    </div>
  );
}
