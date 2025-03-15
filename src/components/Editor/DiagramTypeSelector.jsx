import React from 'react';
import PropTypes from 'prop-types';

const DiagramTypeSelector = ({
  currentDiagramType,
  diagramTypes,
  onDiagramTypeSelect,
  searchValue,
  onSearchChange
}) => {
  return (
    <div>
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search diagrams"
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchValue}
            onChange={onSearchChange}
          />
          <div className="absolute right-2 top-2 text-gray-400">
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

      {/* Diagram Type Grid */}
      <div className="grid grid-cols-2 gap-2">
        {diagramTypes.map(type => (
          <button
            key={type}
            className={`p-2 rounded-md text-sm ${
              type === currentDiagramType 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
            }`}
            onClick={() => onDiagramTypeSelect(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
};

DiagramTypeSelector.propTypes = {
  currentDiagramType: PropTypes.string.isRequired,
  diagramTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDiagramTypeSelect: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default DiagramTypeSelector;