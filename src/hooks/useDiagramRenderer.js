import { useEffect, useCallback, useRef } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../context/ThemeContext';

const useDiagramRenderer = (containerId = 'mermaid-diagram') => {
  const { isDarkMode } = useTheme();
  const currentDiagramRef = useRef('');
  
  // Initialize mermaid with theme-dependent configuration
  useEffect(() => {
    // Set the theme and colors based on the current UI theme
    mermaid.initialize({
      startOnLoad: true,
      theme: isDarkMode ? 'dark' : 'base',
      securityLevel: 'loose',
      flowchart: {
        curve: 'linear',
        padding: 20,
        htmlLabels: true
      },
      themeVariables: isDarkMode ? {
        // Dark theme variables (default)
      } : {
        // Light theme variables
        primaryColor: '#4B5563',         // Softer gray for primary elements
        primaryBorderColor: '#6B7280',   // Border color for nodes
        primaryTextColor: '#F9FAFB',     // Text color inside primary nodes
        secondaryColor: '#64748B',       // Softer color for secondary elements
        tertiaryColor: '#E2E8F0',        // Background for tertiary elements
        noteBackgroundColor: '#FEF3C7',  // Amber tint for notes
        noteBorderColor: '#F59E0B',      // Amber border for notes
        edgeLabelBackground: '#F3F4F6',  // Background for edge labels
        lineColor: '#64748B',            // Line/edge color
        textColor: '#1F2937'             // General text color
      }
    });
    
    // Re-render when theme changes if we have diagram content
    if (currentDiagramRef.current) {
      renderDiagram(currentDiagramRef.current);
    }
  }, [isDarkMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // Render function
  const renderDiagram = useCallback(async (diagramText) => {
    // Store the current diagram text in a ref so we can access it when theme changes
    currentDiagramRef.current = diagramText;
    
    const element = document.getElementById(containerId);
    if (!element || !diagramText) return;

    // Clear the previous diagram
    element.innerHTML = '';

    try {
      const { svg } = await mermaid.render(`graph-div-${Date.now()}`, diagramText);
      element.innerHTML = svg;
      return true;
    } catch (error) {
      console.error('Failed to render diagram:', error);
      element.innerHTML = '<div class="text-red-500">Failed to render diagram</div>';
      return false;
    }
  }, [containerId]);

  // Add automatic initial render functionality
  const autoRender = useCallback(async (diagramText) => {
    if (!diagramText) return;
    
    // Store the diagram text in the ref
    currentDiagramRef.current = diagramText;
    
    // Small delay to ensure DOM is ready
    setTimeout(async () => {
      await renderDiagram(diagramText);
    }, 100);
  }, [renderDiagram]);

  return {
    renderDiagram,
    autoRender
  };
};

export default useDiagramRenderer;