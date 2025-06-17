import React, { useRef, useEffect } from 'react';
import { useTrapFocus } from '../hooks/accessibility';
import { Button } from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useTrapFocus(dialogRef);

  // ESCキーでダイアログを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // ダイアログが開いているときはスクロールを無効にする
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="flex min-h-screen items-center justify-center">
        {/* オーバーレイ */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* ダイアログ本体 */}
        <div
          ref={dialogRef}
          className="relative bg-white rounded-lg shadow-xl max-w-lg w-full m-4 p-6"
        >
          {/* ヘッダー */}
          <div className="mb-4">
            <h2 id="dialog-title" className="text-xl font-semibold">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              aria-label="閉じる"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* コンテンツ */}
          <div className="mb-6">{children}</div>

          {/* アクション */}
          {actions && (
            <div className="flex justify-end space-x-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
