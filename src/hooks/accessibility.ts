import { useEffect } from 'react';

export const useAriaLive = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  useEffect(() => {
    if (message) {
      const element = document.createElement('div');
      element.setAttribute('aria-live', priority);
      element.setAttribute('role', 'status');
      element.classList.add('sr-only'); // screen reader only
      document.body.appendChild(element);
      
      // 少し遅延を入れてスクリーンリーダーが確実に読み上げるようにする
      setTimeout(() => {
        element.textContent = message;
      }, 100);

      return () => {
        document.body.removeChild(element);
      };
    }
  }, [message, priority]);
};

export const useTrapFocus = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  }, [containerRef]);
};

// キーボードユーザー向けのフォーカス表示制御
export const useKeyboardFocus = () => {
  useEffect(() => {
    const handleFirstTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-user');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };

    window.addEventListener('keydown', handleFirstTab);
    return () => window.removeEventListener('keydown', handleFirstTab);
  }, []);
};
