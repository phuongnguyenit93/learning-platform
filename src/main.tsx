import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { logBackendTopics } from './data/backendHealth';
import { LanguageProvider } from './state/LanguageContext';
import { ThemeProvider } from './state/ThemeContext';
import './styles/index.css';

if (window.location.hash.startsWith('#/')) {
  const legacyPath = window.location.hash.slice(1);
  window.history.replaceState(null, '', legacyPath);
}

// Run once per page load, outside React StrictMode (which replays effects in development).
void logBackendTopics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
);
