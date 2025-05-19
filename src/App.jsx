import NewPatient from './features/appointments/ui/Register-Appointment/NewAppointment';
import Dashboard from './pages/Dashboard/Dashboard';
import Router from './routes/Router';
import { ToastProvider } from './services/toastify/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router />
    </ToastProvider>
  );
}

export default App;
