import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Phone, ArrowRight, Bus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOTP } = useAuth();
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast.error(t.invalidOTP);
      return;
    }

    setLoading(true);
    try {
      await sendOTP(phone);
      localStorage.setItem('pendingPhone', phone);
      toast.success(t.otpSent);
      navigate('/verify-otp');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`page-container ${blindMode ? 'page-container-dark' : ''}`}>
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-12">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-fade-in">
          <Bus className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className={`text-2xl font-bold text-white mb-2 text-center animate-fade-in ${blindMode ? 'text-3xl' : ''}`}>
          {t.welcome}
        </h1>
        <p className={`text-white/90 text-center mb-8 animate-fade-in ${blindMode ? 'text-xl' : ''}`}>
          {t.subtitle}
        </p>

        <div className={`w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 animate-slide-in ${blindMode ? 'p-8' : ''}`}>
          <label className={`block text-gray-700 font-medium mb-2 ${blindMode ? 'text-xl' : ''}`}>
            {t.enterPhone}
          </label>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-xl">
              <span className="text-xl">🇮🇳</span>
              <span className="text-gray-600 font-medium">+91</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={t.phonePlaceholder}
              className={`input-field flex-1 ${blindMode ? 'h-16 text-xl' : ''}`}
              inputMode="numeric"
            />
          </div>

          <button
            onClick={handleSendOTP}
            disabled={loading || phone.length !== 10}
            className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
          >
            {loading ? (
              <span className="animate-pulse">{t.processing}</span>
            ) : (
              <>
                <span>{t.getOTP}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
