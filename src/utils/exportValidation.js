/**
 * Validates export options and provides detailed error messages
 * @param {Object} options - Export options to validate
 * @returns {Object} - Validation result
 */
export const validateExportOptions = (options) => {
    const errors = [];
    
    // Validate format
    const validFormats = ['svg', 'png', 'pdf'];
    if (!validFormats.includes(options.format?.toLowerCase())) {
      errors.push(`Invalid format: ${options.format}. Must be one of: ${validFormats.join(', ')}`);
    }
  
    // Validate file name
    if (!options.fileName?.trim()) {
      errors.push('File name is required');
    } else if (!/^[\w\-. ]+$/.test(options.fileName)) {
      errors.push('File name contains invalid characters');
    }
  
    // Validate scale
    if (options.scale && (options.scale < 0.1 || options.scale > 10)) {
      errors.push('Scale must be between 0.1 and 10');
    }
  
    // Validate dimensions if provided
    if (options.width && (options.width < 1 || options.width > 10000)) {
      errors.push('Width must be between 1 and 10000 pixels');
    }
    if (options.height && (options.height < 1 || options.height > 10000)) {
      errors.push('Height must be between 1 and 10000 pixels');
    }
  
    // Validate color format
    if (options.backgroundColor && !/^#[0-9A-Fa-f]{6}$/.test(options.backgroundColor)) {
      errors.push('Invalid background color format');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Enhanced error handling for export process
   * @param {Function} exportFunction - The export function to wrap
   * @returns {Function} - Wrapped function with error handling
   */
  export const withErrorHandling = (exportFunction) => {
    return async (...args) => {
      try {
        // Validate options before proceeding
        const options = args[1] || {};
        const validation = validateExportOptions(options);
        
        if (!validation.isValid) {
          throw new Error(`Invalid export options:\n${validation.errors.join('\n')}`);
        }
  
        // Validate diagram presence
        const element = document.getElementById('mermaid-diagram');
        if (!element) {
          throw new Error('Diagram container not found');
        }
  
        const svg = element.querySelector('svg');
        if (!svg) {
          throw new Error('No diagram found to export');
        }
  
        // Check for minimum diagram size
        const bbox = svg.getBBox();
        if (bbox.width < 1 || bbox.height < 1) {
          throw new Error('Diagram has invalid dimensions');
        }
  
        // Proceed with export
        const result = await exportFunction(...args);
  
        // Validate export result
        if (!result || !result.data) {
          throw new Error('Export failed to generate data');
        }
  
        return result;
      } catch (error) {
        // Log error for debugging
        console.error('Export error:', error);
  
        // Enhance error message for user
        let userMessage = 'Failed to export diagram. ';
        if (error.message.includes('Invalid export options')) {
          userMessage += error.message;
        } else if (error.message.includes('container not found')) {
          userMessage += 'Please ensure a diagram is loaded.';
        } else {
          userMessage += 'An unexpected error occurred. Please try again.';
        }
  
        // Throw enhanced error
        throw new Error(userMessage);
      }
    };
  };
  
  // Apply error handling to export function
  export const safeExportDiagram = withErrorHandling(exportDiagram);