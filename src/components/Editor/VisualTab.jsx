import React from 'react';
import PropTypes from 'prop-types';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import ElementGrid from '../Elements/ElementGrid';
import { useTheme } from '../../context/ThemeContext';

const VisualTab = ({
  isCollapsed,
  onToggleCollapse,
  isEditorCollapsed,
  currentDiagramType,
  onDiagramTypeSelect,
  diagramTypes,
  searchDiagrams,
  onSearchDiagrams,
  searchElements,
  onSearchElements,
  elements
  
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div 
      className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'h-12' : isEditorCollapsed ? 'h-[calc(100%-3rem)]' : 'h-[60%]'
      } flex flex-col overflow-hidden`}
    >
      <div className="flex-shrink-0 p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} font-semibold`}>Visual Editor</h3>
          <button 
            onClick={onToggleCollapse}
            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <ChevronUpIcon 
              className="h-5 w-5 transform transition-transform duration-300"
              style={{
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </button>
        </div>

        {/* Search Diagrams */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search diagrams"
              className={`w-full rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700 text-gray-200' 
                  : 'bg-white border-slate-300 text-gray-800'
              } border shadow-sm`}
              value={searchDiagrams}
              onChange={onSearchDiagrams}
            />
            <div className={`absolute right-2 top-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Diagram Types */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2">
            {diagramTypes.map(type => (
              <button
                key={type}
                className={`p-2 rounded-md text-sm ${
                  type === currentDiagramType 
                    ? 'bg-green-600 text-white' 
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-blue-50 text-gray-800 hover:bg-blue-100 border border-slate-300 shadow-sm'
                }`}
                onClick={() => onDiagramTypeSelect(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Elements Grid */}
      {!isCollapsed && (
        <div className="flex-grow overflow-y-auto">
          <ElementGrid
            elements={elements}
            searchValue={searchElements}
            onSearchChange={onSearchElements}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
};

VisualTab.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  isEditorCollapsed: PropTypes.bool.isRequired,
  currentDiagramType: PropTypes.string.isRequired,
  onDiagramTypeSelect: PropTypes.func.isRequired,
  diagramTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchDiagrams: PropTypes.string.isRequired,
  onSearchDiagrams: PropTypes.func.isRequired,
  searchElements: PropTypes.string.isRequired,
  onSearchElements: PropTypes.func.isRequired,
  elements: PropTypes.array.isRequired
};

export default VisualTab;