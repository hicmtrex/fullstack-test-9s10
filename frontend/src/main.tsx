import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryProvider } from './shared/providers/QueryProvider';
import { NotificationProvider } from './shared/providers/NotificationProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </QueryProvider>
  </React.StrictMode>
);
