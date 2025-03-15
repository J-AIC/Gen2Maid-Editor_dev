import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { exportDiagram, downloadDiagram } from '../../utils/exportUtils';
import { useTheme } from '../../context/ThemeContext';

const ExportDialog = ({ isOpen, onClose, diagramText }) => {
  const { isDarkMode } = useTheme();
  
  const [exportOptions, setExportOptions] = useState({
    format: 'svg',
    fileName: 'diagram',
    scale: 2,
    backgroundColor: '#ffffff',
    isTransparent: true,
    includeStyles: true,
    width: '',
    height: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      const exportData = await exportDiagram(diagramText, exportOptions);
      await downloadDiagram(exportData);
      onClose();
    } catch (err) {
      console.error('Export error:', err);
      setError(err.message || 'Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-slate-100 text-gray-800'} rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Export Diagram</h3>
          <button 
            onClick={onClose}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} text-xl`}
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Format
            </label>
            <select
              value={exportOptions.format}
              onChange={(e) => setExportOptions(prev => ({ 
                ...prev, 
                format: e.target.value 
              }))}
              className={`w-full rounded-md p-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-slate-300 text-gray-800'
              } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            >
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
              <option value="pdf">PDF (Coming Soon)</option>
            </select>
          </div>

          {/* File Name */}
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              File Name
            </label>
            <input
              type="text"
              value={exportOptions.fileName}
              onChange={(e) => setExportOptions(prev => ({ 
                ...prev, 
                fileName: e.target.value 
              }))}
              className={`w-full rounded-md p-2 ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-slate-300 text-gray-800'
              } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
            />
          </div>

          {/* Background Controls (for PNG) */}
          {exportOptions.format === 'png' && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                  Background
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      checked={exportOptions.isTransparent}
                      onChange={() => setExportOptions(prev => ({
                        ...prev,
                        isTransparent: true,
                        backgroundColor: 'transparent'
                      }))}
                    />
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Transparent</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio text-blue-600"
                      checked={!exportOptions.isTransparent}
                      onChange={() => setExportOptions(prev => ({
                        ...prev,
                        isTransparent: false,
                        backgroundColor: '#ffffff'
                      }))}
                    />
                    <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Custom Color</span>
                  </label>
                </div>
              </div>

              {/* Only show color picker when custom color is selected */}
              {!exportOptions.isTransparent && (
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={exportOptions.backgroundColor}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      backgroundColor: e.target.value
                    }))}
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* Width and Height inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Width (px)
              </label>
              <input
                type="text"
                value={exportOptions.width}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  width: e.target.value
                }))}
                placeholder="Auto"
                className={`w-full rounded-md p-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-slate-300 text-gray-800'
                } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                Height (px)
              </label>
              <input
                type="text"
                value={exportOptions.height}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  height: e.target.value
                }))}
                placeholder="Auto"
                className={`w-full rounded-md p-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-slate-300 text-gray-800'
                } border shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
              />
            </div>
          </div>

          {/* Include Styles Checkbox */}
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={exportOptions.includeStyles}
                onChange={(e) => setExportOptions(prev => ({
                  ...prev,
                  includeStyles: e.target.checked
                }))}
                className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Include Styles</span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${
              isDarkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-slate-300 text-gray-800 hover:bg-slate-400'
            } shadow-sm`}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              isExporting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            } shadow-sm`}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

ExportDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  diagramText: PropTypes.string.isRequired
};

export default ExportDialog;