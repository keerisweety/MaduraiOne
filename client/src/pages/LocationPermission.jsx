import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Navigation, Search, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LocationPermission() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualEntry, setManualEntry] = useState(false);
  const { updateProfile, user } = useAuth();
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.location?.lat) {
      setLocation(user.location);
    }
  }, [user]);

  const getCurrentLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = {
          lat: latitude,
          lng: longitude,
          address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        };
        setLocation(locationData);
        try {
          await updateProfile({ location: locationData });
          toast.success(t.locationSet);
        } catch (error) {
          console.error('Failed to save location:', error);
        }
        setLoading(false);
      },
      (error) => {
        toast.error('Location permission denied');
        setLoading(false);
        setManualEntry(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualEntry = async () => {
    const locationData = {
      lat: 9.9252,
      lng: 78.1198,
      address: 'Madurai, Tamil Nadu'
    };
    setLocation(locationData);
    try {
      await updateProfile({ location: locationData });
      toast.success(t.locationSet);
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const handleContinue = () => {
    if (location) {
      navigate('/transport');
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${blindMode ? 'blind-mode' : ''}`}>
      <div className="bg-gradient-to-br from-secondary to-blue-700 px-6 py-12">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
          <MapPin className="w-8 h-8 text-secondary" />
        </div>
        <h1 className={`text-2xl font-bold text-white text-center ${blindMode ? 'text-3xl' : ''}`}>
          {t.enableLocation}
        </h1>
        <p className={`text-white/90 text-center mt-2 ${blindMode ? 'text-lg' : ''}`}>
          {t.locationDesc}
        </p>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto">
        {location ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Navigation className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-xl' : ''}`}>
                  {t.locationSet}
                </p>
                <p className={`text-gray-500 ${blindMode ? 'text-lg' : ''}`}>
                  {location.address}
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className={`text-gray-600 ${blindMode ? 'text-lg' : ''}`}>
                  {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className={`w-full bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 transition-all hover:shadow-xl ${
                blindMode ? 'p-8' : ''
              }`}
            >
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center">
                <Navigation className="w-7 h-7 text-secondary" />
              </div>
              <div className="text-left flex-1">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-xl' : ''}`}>
                  {t.useCurrentLocation}
                </p>
                <p className={`text-gray-500 ${blindMode ? 'text-lg' : ''}`}>
                  {loading ? t.processing : 'GPS coordinates'}
                </p>
              </div>
            </button>

            <button
              onClick={handleManualEntry}
              className={`w-full bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 transition-all hover:shadow-xl ${
                blindMode ? 'p-8' : ''
              }`}
            >
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-7 h-7 text-gray-600" />
              </div>
              <div className="text-left flex-1">
                <p className={`font-semibold text-gray-800 ${blindMode ? 'text-xl' : ''}`}>
                  {t.enterManually}
                </p>
                <p className={`text-gray-500 ${blindMode ? 'text-lg' : ''}`}>
                  Madurai, Tamil Nadu
                </p>
              </div>
            </button>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!location}
          className={`btn-primary mt-6 flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
        >
          <span>{t.continue}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
