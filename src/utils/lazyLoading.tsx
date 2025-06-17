import React, { Suspense } from 'react';

interface LazyLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LazyLoadingBoundary: React.FC<LazyLoadingProps> = ({
  children,
  fallback = <div className="w-full h-full flex items-center justify-center">読み込み中...</div>
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

// 遅延ロード用のラッパー関数
export function lazyLoad(importFactory: () => Promise<{ default: React.ComponentType<any> }>) {
  const LazyComponent = React.lazy(importFactory);
  
  return function WithLazyLoading(props: any) {
    return (
      <LazyLoadingBoundary>
        <LazyComponent {...props} />
      </LazyLoadingBoundary>
    );
  };
}
