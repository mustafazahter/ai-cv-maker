import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/shared/config/i18n';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">Loading...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);