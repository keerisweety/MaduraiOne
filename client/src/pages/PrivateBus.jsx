import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function PrivateBus() {
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const travelAgencies = [
    {
      id: 'egloo',
      name: t.eglooTravels,
      url: 'https://www.eglootravels.in/',
      icon: '🚌',
      color: 'bg-blue-500'
    },
    {
      id: 'madurai-travels',
      name: t.maduraiTravels,
      url: 'https://www.madurai-travels.com/',
      icon: '🚍',
      color: 'bg-green-500'
    },
    {
      id: 'griffin',
      name: t.griffinTravels,
      url: 'https://griffintravels.com/best-tour-and-travel-agency-in-madurai/',
      icon: '🏢',
      color: 'bg-purple-500'
    },
    {
      id: 'sairoad',
      name: t.sairoadTravels,
      url: 'https://maduraisaitourstravels.com/',
      icon: '🛣️',
      color: 'bg-blue-500'
    },
    {
      id: 'radha',
      name: t.radhaTravels,
      url: 'https://www.madurairadhatravels.in/',
      icon: '🌟',
      color: 'bg-red-500'
    }
  ];

  const openWebsite = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`min-h-screen bg-gray-50 pb-20 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/transport')}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="text-4xl">🚍</div>
          <h1 className={`text-xl font-bold text-white ${blindMode ? 'text-2xl' : ''}`}>
            {t.privateBus}
          </h1>
        </div>
        <p className={`text-white/80 ${blindMode ? 'text-lg' : ''}`}>
          {t.bookNow}
        </p>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto">
        <div className="space-y-4">
          {travelAgencies.map((agency) => (
            <button
              key={agency.id}
              onClick={() => openWebsite(agency.url)}
              className="website-card w-full"
            >
              <div className={`w-14 h-14 ${agency.color} rounded-xl flex items-center justify-center text-2xl`}>
                {agency.icon}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-xl' : ''}`}>
                  {agency.name}
                </p>
                <p className={`text-gray-500 text-sm ${blindMode ? 'text-lg' : ''}`}>
                  {agency.url.replace('https://', '').replace('www.', '')}
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
