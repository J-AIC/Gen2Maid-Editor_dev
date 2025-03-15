import { useState, useCallback } from 'react';

const useResizable = (initialWidth = 400, minWidth = 200, maxWidth = 800) => {
  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e) => {
      setWidth(prev => {
        const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
        return newWidth;
      });
    };

    const stopResizing = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  }, [minWidth, maxWidth]);

  return {
    width,
    isResizing,
    startResizing
  };
};

export default useResizable;