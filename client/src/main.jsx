import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DarkModeProvider } from './context/DarkMode';
import App from './App';
import './styles/globals.css';
import { initSentry } from './utils/sentry';
initSentry();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>
);
