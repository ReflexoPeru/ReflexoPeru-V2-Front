import Dashboard from './pages/Dashboard/Dashboard';
import { AuthProvider } from './routes/AuthContext';
import Router from './routes/Router';
import { ToastProvider } from './services/toastify/ToastContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
