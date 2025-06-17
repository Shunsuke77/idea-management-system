import React, { createContext, useContext } from 'react';
import { useError } from '../hooks/useError';
import { useLoading } from '../hooks/useLoading';
import { ErrorNotification } from '../components/ErrorNotification';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface AppStateContextType {
  addError: (message: string, type?: 'error' | 'warning') => void;
  clearErrors: () => void;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  withLoading: <T,>(operation: () => Promise<T>, message?: string) => Promise<T>;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const { errors, addError, clearErrors } = useError();
  const { isLoading, loadingMessage, startLoading, stopLoading, withLoading } = useLoading();

  const value = {
    addError,
    clearErrors,
    startLoading,
    stopLoading,
    withLoading,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
      {isLoading && <LoadingSpinner message={loadingMessage} />}
      <ErrorNotification errors={errors} />
    </AppStateContext.Provider>
  );
};
