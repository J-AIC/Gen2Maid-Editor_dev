// exportUtils.js

/**
 * Converts an SVG element to a PNG data URL
 * @param {SVGElement} svg - The SVG element to convert
 * @param {Object} options - Conversion options
 * @returns {Promise<string>} - The PNG data URL
 */

const svgToPng = async (svg, options = {}) => {
  const {
    scale = 2,
    backgroundColor = 'transparent',
    isTransparent = true
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Clone the SVG and add the background if needed
      const clonedSvg = svg.cloneNode(true);
      
      // Set dimensions based on viewBox or bbox
      const bbox = svg.getBBox();
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, bbox.width, bbox.height];
      const width = viewBox[2] * scale;
      const height = viewBox[3] * scale;
      
      // Set explicit width and height on the SVG
      clonedSvg.setAttribute('width', width);
      clonedSvg.setAttribute('height', height);
      
      // Add background if not transparent
      if (!isTransparent) {
        const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bgRect.setAttribute('width', '100%');
        bgRect.setAttribute('height', '100%');
        bgRect.setAttribute('fill', backgroundColor);
        clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);
      }

      // Convert SVG to base64 string
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(clonedSvg);
      const svgBase64 = btoa(unescape(encodeURIComponent(svgStr)));
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;
      
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          
          // Clear canvas
          if (isTransparent) {
            ctx.clearRect(0, 0, width, height);
          } else {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
          }
          
          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/png'));
        } catch (err) {
          reject(new Error(`PNG conversion failed: ${err.message}`));
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load SVG for PNG conversion'));
      };
      
      // Use the data URL directly instead of createObjectURL
      img.src = dataUrl;
    } catch (err) {
      reject(new Error(`SVG processing failed: ${err.message}`));
    }
  });
};
  
  /**
   * Creates a PDF from an SVG element
   * @param {SVGElement} svg - The SVG element to convert
   * @param {Object} options - PDF options
   * @returns {Promise<Blob>} - The PDF blob
   */
  const svgToPdf = async (svg, options = {}) => {
    const {
      title = 'Mermaid Diagram',
      pageSize = 'a4',
      orientation = 'landscape',
      margin = 40
    } = options;
  
    // We'll need to add the jsPDF library to the project
    // This is a placeholder for the implementation
    throw new Error('PDF export not implemented - requires jsPDF library');
  };
  
  /**
   * Enhanced export function for Mermaid diagrams
   * @param {string} diagramText - The Mermaid diagram text
   * @param {Object} options - Export options
   * @returns {Promise<Object>} - Export result with data and metadata
   */
  export const exportDiagram = async (diagramText, options = {}) => {
    const {
      format = 'svg',
      fileName = 'diagram',
      scale = 2,
      backgroundColor = 'transparent',
      isTransparent = true,
      includeStyles = true,
      width = null,
      height = null
    } = options;
  
    try {
      const element = document.getElementById('mermaid-diagram');
      if (!element) {
        throw new Error('Diagram container not found');
      }
  
      const svg = element.querySelector('svg');
      if (!svg) {
        throw new Error('SVG element not found in diagram');
      }
  
      // Clone SVG to avoid modifying the displayed diagram
      const clonedSvg = svg.cloneNode(true);
  
      // Apply custom dimensions if specified
      if (width) clonedSvg.setAttribute('width', width);
      if (height) clonedSvg.setAttribute('height', height);
  
      // Include CSS styles if requested
      if (includeStyles) {
        const styleSheet = document.createElement('style');
        const cssRules = Array.from(document.styleSheets)
          .filter(sheet => sheet.href === null || sheet.href.startsWith(window.location.origin))
          .reduce((acc, sheet) => {
            try {
              return acc.concat(Array.from(sheet.cssRules).map(rule => rule.cssText));
            } catch (e) {
              console.warn('Could not read stylesheet rules', e);
              return acc;
            }
          }, []);
        
        styleSheet.textContent = cssRules.join('\n');
        clonedSvg.insertBefore(styleSheet, clonedSvg.firstChild);
      }
  
      switch (format.toLowerCase()) {
        case 'svg': {
          const serializer = new XMLSerializer();
          const svgData = serializer.serializeToString(clonedSvg);
          return {
            data: svgData,
            mimeType: 'image/svg+xml',
            extension: 'svg',
            fileName: `${fileName}.svg`
          };
        }
  
        case 'png': {
            const pngData = await svgToPng(clonedSvg, { 
              scale, 
              backgroundColor,
              isTransparent 
            });
            return {
              data: pngData,
              mimeType: 'image/png',
              extension: 'png',
              fileName: `${fileName}.png`
            };
        }
  
        case 'pdf': {
          const pdfBlob = await svgToPdf(clonedSvg, options);
          return {
            data: pdfBlob,
            mimeType: 'application/pdf',
            extension: 'pdf',
            fileName: `${fileName}.pdf`
          };
        }
  
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  };
  
  /**
   * Downloads the exported diagram
   * @param {Object} exportData - The export data from exportDiagram
   */
  export const downloadDiagram = (exportData) => {
    const { data, mimeType, fileName } = exportData;
  
    // If data is already a data URL, use it directly
    if (typeof data === 'string' && data.startsWith('data:image/png')) {
      // For PNG output, assign the data URL directly to the link
      const link = document.createElement('a');
      link.href = data; 
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For SVG, PDF, etc., where data is a raw string or Blob, create a Blob as before
      const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(url);
    }
  };
  
  // Usage example:
  // const exportOptions = {
  //   format: 'png',
  //   fileName: 'my-diagram',
  //   scale: 2,
  //   backgroundColor: '#ffffff',
  //   includeStyles: true,
  //   width: '1920',
  //   height: '1080'
  // };
  // 
  // try {
  //   const exportData = await exportDiagram(diagramText, exportOptions);
  //   downloadDiagram(exportData);
  // } catch (error) {
  //   console.error('Export failed:', error);
  // }