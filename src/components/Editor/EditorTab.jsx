import React from 'react';
import PropTypes from 'prop-types';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const EditorTab = ({ 
  diagramText, 
  onTextChange, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'h-12' : 'h-[40%]'  // Fixed height percentage
      } ${isDarkMode ? 'border-gray-700' : 'border-slate-300'} border-b overflow-hidden`}
    >
      <div className="h-full p-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>Editor</h3>
          <button 
            onClick={onToggleCollapse}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'} transform transition-transform duration-300`}
            style={{
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <ChevronUpIcon className="h-5 w-5" />
          </button>
        </div>
        <div className={`h-[calc(100%-2rem)] transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          <textarea
            className={`w-full h-full rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-gray-900 border-gray-700 text-gray-200' 
                : 'bg-slate-50 border-slate-300 text-gray-800'
            } border shadow-sm`}
            value={diagramText}
            onChange={onTextChange}
            placeholder="Enter your Mermaid diagram text here..."
          />
        </div>
      </div>
    </div>
  );
};

// PropTypes for better development experience and documentation
EditorTab.propTypes = {
  diagramText: PropTypes.string.isRequired,
  onTextChange: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired
};

export default EditorTab;