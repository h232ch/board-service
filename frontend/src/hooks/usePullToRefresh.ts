import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export const usePullToRefresh = ({ onRefresh, threshold = 100 }: UsePullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const onRefreshRef = useRef(onRefresh);

  // onRefresh가 변경될 때마다 ref 업데이트
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && startY > 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      
      if (distance > 0) {
        setPullDistance(distance);
        e.preventDefault();
      }
    }
  }, [startY]);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > threshold) {
      setIsRefreshing(true);
      try {
        await onRefreshRef.current();
      } finally {
        setIsRefreshing(false);
      }
    }
    setStartY(0);
    setPullDistance(0);
  }, [pullDistance, threshold]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isRefreshing,
    pullDistance,
    threshold
  };
}; 