import React from 'react';
import { ErrorState } from '../hooks/useError';

interface ErrorNotificationProps {
  errors: ErrorState[];
}

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {errors.map((error) => (
        <div
          key={error.timestamp}
          className={`p-4 rounded-lg shadow-lg ${
            error.type === 'error'
              ? 'bg-red-100 border-l-4 border-red-500 text-red-700'
              : 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700'
          }`}
          role="alert"
        >
          <p className="font-bold">
            {error.type === 'error' ? 'エラー' : '警告'}
          </p>
          <p>{error.message}</p>
        </div>
      ))}
    </div>
  );
};
