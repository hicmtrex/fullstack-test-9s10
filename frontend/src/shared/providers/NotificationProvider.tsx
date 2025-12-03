import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

/**
 * Notification context interface
 */
interface NotificationContextType {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string, duration?: number) => string;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  removeNotification: (id: string) => void;
}

/**
 * Notification context
 */
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider component
 * Provides notification state and functions to all child components
 */
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /**
   * Remove a notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Show a notification
   */
  const showNotification = useCallback(
    (type: NotificationType, message: string, duration = 5000) => {
      const id = Math.random().toString(36).substring(7);
      const notification: Notification = { id, type, message, duration };

      setNotifications(prev => [...prev, notification]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    [removeNotification]
  );

  /**
   * Show success notification
   */
  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      return showNotification('success', message, duration);
    },
    [showNotification]
  );

  /**
   * Show error notification
   */
  const showError = useCallback(
    (message: string, duration?: number) => {
      return showNotification('error', message, duration);
    },
    [showNotification]
  );

  /**
   * Show warning notification
   */
  const showWarning = useCallback(
    (message: string, duration?: number) => {
      return showNotification('warning', message, duration);
    },
    [showNotification]
  );

  /**
   * Show info notification
   */
  const showInfo = useCallback(
    (message: string, duration?: number) => {
      return showNotification('info', message, duration);
    },
    [showNotification]
  );

  const value: NotificationContextType = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

/**
 * Custom hook to use notification context
 * @returns Notification context value
 * @throws Error if used outside NotificationProvider
 */
export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
