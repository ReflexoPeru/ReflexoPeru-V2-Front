import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/normalize.css';
import './css/VarColors.css';
import './css/Typography.css';
import './components/Modal/ModalTheme.css';
import './index.css';
import './utils/dayjsConfig'; // Configuración global de dayjs
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <App />,
  // </StrictMode>,
);
