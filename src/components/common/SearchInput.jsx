import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';

const SearchInput = ({
  value,
  onChange,
  placeholder,
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full rounded-md p-2 
          focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700 text-gray-200' 
            : 'bg-white border-gray-300 text-gray-800'
        } border`}
        value={value}
        onChange={onChange}
      />
      <div className={`absolute right-2 top-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

SearchInput.defaultProps = {
  placeholder: 'Search...',
  className: ''
};

export default SearchInput;