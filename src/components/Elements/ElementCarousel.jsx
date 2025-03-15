import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DraggableElement from './DraggableElement';

const ElementCarousel = ({
  currentElementIndex,
  elements,
  onNavigate,
  searchValue,
  onSearchChange
}) => {
  return (
    <div>
      {/* Search Elements */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search elements"
            className="w-full bg-gray-900 border border-gray-700 rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchValue}
            onChange={onSearchChange}
          />
          <div className="absolute right-2 top-2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Element Carousel */}
      <div className="flex items-center justify-between space-x-4 bg-gray-900 p-4 rounded-md">
        <button 
          onClick={() => onNavigate('left')}
          className="text-gray-400 hover:text-gray-200"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <DraggableElement
          element={elements[currentElementIndex] || elements[0]}
        />

        <button 
          onClick={() => onNavigate('right')}
          className="text-gray-400 hover:text-gray-200"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

ElementCarousel.propTypes = {
  currentElementIndex: PropTypes.number.isRequired,
  elements: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shape: PropTypes.string.isRequired,
    mermaidCode: PropTypes.string.isRequired,
    style: PropTypes.string,
  })).isRequired,
  onNavigate: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default ElementCarousel;