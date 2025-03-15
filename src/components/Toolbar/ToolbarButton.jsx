import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const ToolbarButton = ({
  isActive,
  onClick,
  title,
  icon
}) => {
  const { isDarkMode } = useTheme();

  return (
    <button
      className={`p-2 rounded-md flex flex-col items-center ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : isDarkMode 
            ? 'text-gray-300 hover:bg-gray-700' 
            : 'text-gray-600 hover:bg-blue-100'
      }`}
      onClick={onClick}
      title={title}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
      <span className="text-xs mt-1">{title}</span>
    </button>
  );
};

ToolbarButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

export default ToolbarButton;