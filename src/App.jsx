import Dashboard from './pages/Dashboard/Dashboard';
import { AuthProvider } from './routes/AuthContext';
import { UserProvider } from './context/UserContext';
import { CompanyProvider } from './context/CompanyContext';
import { ThemeProvider } from './context/ThemeContext';
import Router from './routes/Router';
import { ToastProvider } from './services/toastify/ToastContext';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES';
import { useTheme } from './context/ThemeContext';

// Componente interno que usa el tema
function AppContent() {
  const { antdTheme } = useTheme();

  return (
    <ConfigProvider theme={antdTheme} locale={esES}>
      <Router />
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CompanyProvider>
          <UserProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </UserProvider>
        </CompanyProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
