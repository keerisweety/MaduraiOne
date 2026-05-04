import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function Car() {
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const carServices = [
    {
      id: 'gozo',
      name: t.gozoCabs,
      url: 'https://www.gozocabs.com/',
      icon: '🚗',
      color: 'bg-yellow-500'
    },
    {
      id: 'fasttrack',
      name: t.fastTrackTaxi,
      url: 'https://fasttrackcalltaxi.in/madurai',
      icon: '🚕',
      color: 'bg-blue-500'
    },
    {
      id: 'bharat',
      name: t.bharatTaxi,
      url: 'https://www.bharattaxi.com/madurai',
      icon: '🚙',
      color: 'bg-blue-500'
    },
    {
      id: 'savaari',
      name: t.savaari,
      url: 'https://www.savaari.com/Madurai/book-taxi',
      icon: '🚘',
      color: 'bg-red-500'
    },
    {
      id: 'threebest',
      name: t.threeBestRated,
      url: 'https://threebestrated.in/cab-services-in-madurai-tn',
      icon: '⭐',
      color: 'bg-purple-500'
    },
    {
      id: 'srt',
      name: t.srtCarRentals,
      url: 'https://srtcarrentals.com/',
      icon: '🚖',
      color: 'bg-indigo-500'
    }
  ];

  const openWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/transport')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-4xl">🚗</div>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {t.car}
          </h1>
        </div>
        <p className={`text-white/80 ${blindMode ? 'text-lg' : ''}`}>
          {t.bookCab}
        </p>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="space-y-4">
          {carServices.map((service) => (
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
