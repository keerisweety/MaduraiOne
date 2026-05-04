import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import LanguageSelection from './pages/LanguageSelection';
import LocationPermission from './pages/LocationPermission';
import TransportSelection from './pages/TransportSelection';
import GovernmentBus from './pages/GovernmentBus';
import PrivateBus from './pages/PrivateBus';
import Auto from './pages/Auto';
import Car from './pages/Car';
import Bike from './pages/Bike';
import Train from './pages/Train';
import Ticket from './pages/Ticket';
import Payment from './pages/Payment';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/language" element={<LanguageSelection />} />
            <Route path="/location" element={<LocationPermission />} />
            <Route path="/transport" element={<TransportSelection />} />
            <Route path="/bus/government" element={<GovernmentBus />} />
            <Route path="/bus/private" element={<PrivateBus />} />
            <Route path="/auto" element={<Auto />} />
            <Route path="/car" element={<Car />} />
            <Route path="/bike" element={<Bike />} />
            <Route path="/train" element={<Train />} />
            <Route path="/ticket/:id" element={<Ticket />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/send-money" element={<Payment />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
