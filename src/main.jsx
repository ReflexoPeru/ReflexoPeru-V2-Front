import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/normalize.css';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';
import { CompanyProvider } from './context/CompanyContext.jsx';
import { ToastProvider } from './services/toastify/ToastContext.jsx';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <CompanyProvider>
    <UserProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </UserProvider>
  </CompanyProvider>,
  // </StrictMode>,
);
