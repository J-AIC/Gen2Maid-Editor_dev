// Toolbar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import ToolbarButton from './ToolbarButton';
import { useTheme } from '../../context/ThemeContext';

const Toolbar = ({
  activeTabs,
  onTabChange,
  onExportClick
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const buttons = [
    {
      id: 'editor',
      title: 'Editor',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" 
        />
      )
    },
    {
      id: 'visual',
      title: 'Visual',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 6h16M4 12h16m-7 6h7" 
        />
      )
    },
    {
      id: 'ai',
      title: 'AI',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 10V3L4 14h7v7l9-11h-7z" 
        />
      )
    },
    {
      id: 'export',
      title: 'Export',
      icon: (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
        />
      ),
      onClick: onExportClick
    },
    {
      id: 'theme',
      title: isDarkMode ? 'Light Mode' : 'Dark Mode',
      icon: isDarkMode ? (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
        />
      ) : (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
        />
      ),
      onClick: toggleTheme
    }
  ];

  return (
    <div className={`w-16 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-slate-300'} border-r flex flex-col items-center py-4 space-y-4 shadow-sm`}>
      {buttons.map(button => (
        <ToolbarButton
          key={button.id}
          isActive={activeTabs.includes(button.id)}
          onClick={() => {
            if (button.onClick) {
              button.onClick();
            } else if (button.id === 'editor' || button.id === 'visual') {
              onTabChange(['editor', 'visual']);
            }
          }}
          title={button.title}
          icon={button.icon}
        />
      ))}
    </div>
  );
};

Toolbar.propTypes = {
  activeTabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTabChange: PropTypes.func.isRequired,
  onExportClick: PropTypes.func.isRequired
};

export default Toolbar;