import React, { memo, useMemo } from 'react';

type EqualityFn<P> = (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean;

// デフォルトの比較関数
const defaultCompare = <P extends object>(prev: P, next: P) => {
  if (Object.keys(prev).length !== Object.keys(next).length) return false;
  return Object.keys(prev).every(key => prev[key as keyof P] === next[key as keyof P]);
};

// メモ化されたコンポーネントを作成するための高階コンポーネント
export function withMemo<P extends object>(
  Component: React.ComponentType<P>,
  compareProps: EqualityFn<P> = defaultCompare,
  displayName?: string
) {
  const MemodComponent = memo(Component, compareProps);
  if (displayName) {
    MemodComponent.displayName = displayName;
  }
  return MemodComponent;
}

// プロパティの一部をメモ化するためのヘルパー関数
export function useMemoizedProps<T extends object, K extends keyof T>(
  props: T,
  keys: K[]
): Pick<T, K> {
  return useMemo(
    () => {
      const memoized: Partial<T> = {};
      keys.forEach(key => {
        memoized[key] = props[key];
      });
      return memoized as Pick<T, K>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    keys.map(key => props[key])
  );
}
