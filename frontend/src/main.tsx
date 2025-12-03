import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryProvider } from './shared/providers/QueryProvider';
import { NotificationProvider } from './shared/providers/NotificationProvider';
import { AuthProvider } from './shared/providers/AuthProvider';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <NotificationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationProvider>
    </QueryProvider>
  </React.StrictMode>
);
