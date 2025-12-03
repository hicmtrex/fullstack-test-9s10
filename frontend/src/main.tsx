import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryProvider } from './shared/providers/QueryProvider';
import { NotificationProvider } from './shared/providers/NotificationProvider';
import { AuthProvider } from './shared/providers/AuthProvider';
import './index.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <NotificationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationProvider>
    </QueryProvider>
  </React.StrictMode>
);
