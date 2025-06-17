import { useState, useCallback } from 'react';

export interface ErrorState {
  message: string;
  type: 'error' | 'warning';
  timestamp: number;
}

export const useError = () => {
  const [errors, setErrors] = useState<ErrorState[]>([]);

  const addError = useCallback((message: string, type: ErrorState['type'] = 'error') => {
    setErrors(prev => [...prev, {
      message,
      type,
      timestamp: Date.now()
    }]);

    // 5秒後にエラーを自動的に削除
    setTimeout(() => {
      setErrors(prev => prev.filter(error => error.timestamp !== Date.now()));
    }, 5000);
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    clearErrors
  };
};
