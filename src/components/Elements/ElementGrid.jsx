import React from 'react';
import PropTypes from 'prop-types';
import DraggableElement from './DraggableElement';
import SearchInput from '../common/SearchInput';
import { useTheme } from '../../context/ThemeContext';

const ElementGrid = ({
  elements,
  searchValue,
  onSearchChange
}) => {
  const { isDarkMode } = useTheme();
  
  const filteredElements = elements?.filter(element =>
    element.name.toLowerCase().includes(searchValue.toLowerCase())
  ) || [];

  return (
    <div className="h-full flex flex-col">
      {/* Search Box */}
      <div className="flex-shrink-0 px-4 mb-4">
        <SearchInput
          value={searchValue}
          onChange={(e) => onSearchChange(e)}
          placeholder="Search elements..."
          className="w-full"
        />
      </div>

      {/* Elements Grid - Now properly scrollable */}
      <div className="flex-grow overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-3 gap-4 auto-rows-max">
          {filteredElements.map((element) => (
            <div 
              key={element.id} 
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700/50' 
                  : 'hover:bg-gray-200/70'
              }`}
            >
              <div className="w-full aspect-square flex items-center justify-center">
                <DraggableElement element={element} />
              </div>
              <span className={`text-sm mt-2 text-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {element.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ElementGrid.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shape: PropTypes.string.isRequired,
    startSymbol: PropTypes.string.isRequired,
    endSymbol: PropTypes.string.isRequired
  })).isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired
};

export default ElementGrid;