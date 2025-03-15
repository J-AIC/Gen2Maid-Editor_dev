import { jsPDF } from 'jspdf';

/**
 * Convert SVG to PDF using jsPDF
 * @param {SVGElement} svg - The SVG element to convert
 * @param {Object} options - PDF options
 * @returns {Promise<Blob>} - The PDF blob
 */
export const svgToPdf = async (svg, options = {}) => {
  const {
    title = 'Mermaid Diagram',
    pageSize = 'a4',
    orientation = 'landscape',
    margin = 40,
    scale = 1
  } = options;

  return new Promise(async (resolve, reject) => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'pt',
        format: pageSize
      });

      // Get SVG dimensions
      const bbox = svg.getBBox();
      const viewBox = svg.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, bbox.width, bbox.height];

      // Calculate scaling to fit page
      const pageWidth = doc.internal.pageSize.getWidth() - (margin * 2);
      const pageHeight = doc.internal.pageSize.getHeight() - (margin * 2);
      
      const svgWidth = viewBox[2];
      const svgHeight = viewBox[3];
      
      const scaleFactor = Math.min(
        pageWidth / svgWidth,
        pageHeight / svgHeight
      ) * scale;

      // Convert SVG to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = svgWidth * scaleFactor;
      canvas.height = svgHeight * scaleFactor;

      // Create SVG data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Load SVG into image
      const img = new Image();
      img.onload = () => {
        try {
          // Draw image to canvas
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Add to PDF
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(
            imgData,
            'PNG',
            margin,
            margin,
            pageWidth,
            (pageWidth * svgHeight) / svgWidth
          );

          // Add metadata
          doc.setProperties({
            title: title,
            creator: 'Mermaid Editor',
            creationDate: new Date()
          });

          // Convert to blob
          const pdfBlob = doc.output('blob');
          resolve(pdfBlob);
        } catch (err) {
          reject(new Error(`PDF generation failed: ${err.message}`));
        } finally {
          URL.revokeObjectURL(url);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG for PDF conversion'));
      };

      img.src = url;
    } catch (err) {
      reject(new Error(`PDF conversion failed: ${err.message}`));
    }
  });
};