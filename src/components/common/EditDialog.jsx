import React from 'react';
import PropTypes from 'prop-types';
import { FLOWCHART_ELEMENTS } from '../../constants/elements';
import { useTheme } from '../../context/ThemeContext';

function EditDialog({
  isOpen,
  onClose,
  type,
  data,
  onSave,
  onDelete
}) {
  const { isDarkMode } = useTheme();
  
  const [dialogState, setDialogState] = React.useState({
    // Node properties
    label: '',
    color: '#000000',
    backgroundColor: '#ffffff',
    shape: 'rectangle',
    borderColor: '#000000',
    borderWidth: '1',
    borderStyle: 'solid',
    // Edge properties
    edgeLabel: '',
    edgeLabelColor: '#000000',
    edgeColor: '#000000'
  });

  // Initialize dialog state when dialog opens
  React.useEffect(() => {
    if (data && isOpen) {
      if (type === 'node') {
        setDialogState({
          ...dialogState,
          label: data.label || '',
          color: data.style?.color || '#000000',
          backgroundColor: data.style?.backgroundColor || '#ffffff',
          shape: data.shape || 'rectangle',
          borderColor: data.style?.borderColor || '#000000',
          borderWidth: data.style?.borderWidth || '1',
          borderStyle: data.style?.borderStyle || 'solid'
        });
      } else {
        // Edge initialization
        setDialogState({
          ...dialogState,
          edgeLabel: data.label || '',
          edgeLabelColor: data.style?.labelColor || '#000000',
          edgeColor: data.style?.color || '#000000'
        });
      }
    }
  }, [data, isOpen, type]);

  const handleSave = () => {
    if (type === 'node') {
      // Node save handling
      onSave({
        id: data?.id,
        type: 'node',
        label: dialogState.label,
        shape: dialogState.shape,
        style: {
          color: dialogState.color,
          backgroundColor: dialogState.backgroundColor,
          borderColor: dialogState.borderColor,
          borderWidth: dialogState.borderWidth,
          borderStyle: dialogState.borderStyle
        }
      });
    } else {
      // Edge save handling
      onSave({
        id: data?.id,
        type: 'edge',
        source: data?.source,
        target: data?.target,
        label: dialogState.edgeLabel,
        style: {
          color: dialogState.edgeColor,
          labelColor: dialogState.edgeLabelColor
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-slate-100 text-gray-800'} rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Edit {type === 'node' ? 'Node' : 'Edge'}
          </h3>
          <button 
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} text-xl`}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {type === 'node' ? (
            // Node editing controls
            <>
              {/* Label */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                  Label
                </label>
                <input
                  type="text"
                  value={dialogState.label}
                  onChange={(e) => setDialogState(prev => ({ ...prev, label: e.target.value }))}
                  className={`w-full rounded-md p-2 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-slate-300 text-gray-800'
                  } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                />
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={dialogState.color}
                    onChange={(e) => setDialogState(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Background
                  </label>
                  <input
                    type="color"
                    value={dialogState.backgroundColor}
                    onChange={(e) => setDialogState(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
              </div>

              {/* Border Controls */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Border Color
                  </label>
                  <input
                    type="color"
                    value={dialogState.borderColor}
                    onChange={(e) => setDialogState(prev => ({ ...prev, borderColor: e.target.value }))}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Border Width
                  </label>
                  <select
                    value={dialogState.borderWidth}
                    onChange={(e) => setDialogState(prev => ({ ...prev, borderWidth: e.target.value }))}
                    className={`w-full rounded-md p-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-slate-300 text-gray-800'
                    } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                  >
                    <option value="0">None</option>
                    <option value="0.5">Thin (0.5px)</option>
                    <option value="1">Normal (1px)</option>
                    <option value="2">Thick (2px)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                    Border Style
                  </label>
                  <select
                    value={dialogState.borderStyle}
                    onChange={(e) => setDialogState(prev => ({ ...prev, borderStyle: e.target.value }))}
                    className={`w-full rounded-md p-2 ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-slate-300 text-gray-800'
                    } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                  >
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                  </select>
                </div>
              </div>

              {/* Shape Selection */}
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                  Shape
                </label>
                <select
                  value={dialogState.shape}
                  onChange={(e) => setDialogState(prev => ({ ...prev, shape: e.target.value }))}
                  className={`w-full rounded-md p-2 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-slate-300 text-gray-800'
                  } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                >
                  {FLOWCHART_ELEMENTS.map(element => (
                    <option key={element.id} value={element.shape}>
                      {element.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            // Edge editing controls
            <>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                  Edge Label
                </label>
                <input
                  type="text"
                  value={dialogState.edgeLabel}
                  onChange={(e) => setDialogState(prev => ({ ...prev, edgeLabel: e.target.value }))}
                  className={`w-full rounded-md p-2 ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-slate-300 text-gray-800'
                  } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                  placeholder="Enter edge label..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                  Label Color
                </label>
                <input
                  type="color"
                  value={dialogState.edgeLabelColor}
                  onChange={(e) => setDialogState(prev => ({ ...prev, edgeLabelColor: e.target.value }))}
                  className="w-full h-8 rounded-md cursor-pointer"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                  Edge Color
                </label>
                <input
                  type="color"
                  value={dialogState.edgeColor}
                  onChange={(e) => setDialogState(prev => ({ ...prev, edgeColor: e.target.value }))}
                  className="w-full h-8 rounded-md cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm"
            >
              Delete
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

EditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['node', 'edge']).isRequired,
  data: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EditDialog;