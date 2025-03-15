import React from 'react';
import PropTypes from 'prop-types';

const ResizeHandle = ({
  onResizeStart,
  className = '',
  minWidth = 200,
  maxWidth = 800
}) => {
  const handleMouseDown = (e) => {
    e.preventDefault();
    onResizeStart(e, minWidth, maxWidth);
  };

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize 
        bg-gray-700 hover:bg-blue-500 transition-colors duration-200 ${className}`}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-label="Resize panel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleMouseDown(e);
        }
      }}
    />
  );
};

ResizeHandle.propTypes = {
  onResizeStart: PropTypes.func.isRequired,
  className: PropTypes.string,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number
};

ResizeHandle.defaultProps = {
  className: '',
  minWidth: 200,
  maxWidth: 800
};

// Custom hook for resize functionality
export const useResize = (initialWidth = 400) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [isResizing, setIsResizing] = React.useState(false);

  const handleResizeStart = React.useCallback((e, minWidth, maxWidth) => {
    setIsResizing(true);
    
    const handleMouseMove = (e) => {
      setWidth(prev => {
        const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
        return newWidth;
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  return {
    width,
    isResizing,
    handleResizeStart
  };
};

export default ResizeHandle;