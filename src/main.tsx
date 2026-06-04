import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const registerServiceWorker = () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('Service worker registration failed:', error);
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(registerServiceWorker, { timeout: 3000 });
  } else {
    globalThis.setTimeout(registerServiceWorker, 1800);
  }
}
