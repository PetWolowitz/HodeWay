import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotificationStore, type NotificationType } from '../lib/notifications';
import { cn } from '../lib/utils';

const icons: Record<NotificationType, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
};

const styles: Record<NotificationType, string> = {
  info: 'bg-blue-50 text-blue-800',
  warning: 'bg-yellow-50 text-yellow-800',
  error: 'bg-red-50 text-red-800',
  success: 'bg-green-50 text-green-800',
};

export function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'flex items-center p-4 rounded-lg shadow-lg max-w-md',
            styles[notification.type]
          )}
        >
          <div className="flex-shrink-0">
            {icons[notification.type]}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-auto flex-shrink-0 flex"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
}