import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);
  const { verifyOTP } = useAuth();
  const { t, blindMode } = useLanguage();
  const navigate = useNavigate();
  const phone = localStorage.getItem('pendingPhone');

  useEffect(() => {
    if (!phone) {
      navigate('/');
      return;
    }
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phone, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpValue = otp.join('')) => {
    setLoading(true);
    try {
      await verifyOTP(phone, otpValue);
      navigate('/language');
    } catch (error) {
      toast.error(t.invalidOTP);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      const { sendOTP } = useAuth();
      await sendOTP(phone);
      toast.success(t.otpSent);
      setResendTimer(30);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className={`page-container ${blindMode ? 'page-container-dark' : ''}`}>
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center z-10"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-20">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-fade-in">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className={`text-2xl font-bold text-white mb-2 text-center animate-fade-in ${blindMode ? 'text-3xl' : ''}`}>
          {t.enterOTP}
        </h1>
        <p className={`text-white/90 text-center mb-8 animate-fade-in ${blindMode ? 'text-lg' : ''}`}>
          {t.otpSent} +91 {phone?.slice(0, 3)}****{phone?.slice(7)}
        </p>

        <div className={`w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 animate-slide-in ${blindMode ? 'p-8' : ''}`}>
          <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ${blindMode ? 'w-14 h-16 text-3xl' : ''}`}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={loading || otp.join('').length !== 6}
            className={`btn-primary flex items-center justify-center gap-2 ${blindMode ? 'h-16 text-xl' : ''}`}
          >
            {loading ? (
              <span className="animate-pulse">{t.processing}</span>
            ) : (
              <>
                <span>{t.verify}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="text-center mt-4">
            {resendTimer > 0 ? (
              <p className={`text-gray-500 ${blindMode ? 'text-lg' : ''}`}>
                {t.resendOTP} {resendTimer} {t.seconds}
              </p>
            ) : (
              <button
                onClick={handleResend}
                className={`text-primary font-semibold ${blindMode ? 'text-xl' : ''}`}
              >
                {t.resendOTP}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
