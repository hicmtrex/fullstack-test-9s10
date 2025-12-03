import React from 'react';
import { Toast } from './Toast';
import { useNotification } from '../../providers/NotificationProvider';

/**
 * ToastContainer component
 * Displays all active notifications
 */
export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      {notifications.map(notification => (
        <Toast key={notification.id} notification={notification} onClose={removeNotification} />
      ))}
    </div>
  );
};
