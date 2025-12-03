import { useState, useCallback } from 'react';

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
 * Custom hook for managing notifications
 * Returns functions to show different types of notifications
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
    []
  );

  /**
   * Remove a notification
   */
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

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

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};
