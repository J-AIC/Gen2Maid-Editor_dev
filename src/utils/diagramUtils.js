// Format diagram text with proper indentation
export const formatDiagramText = (text) => {
  const lines = text.split('\n');
  return lines
    .map((line, index) => {
      if (index === 0) return line;
      return `    ${line.trim()}`; // 4 spaces indentation for all lines except first
    })
    .join('\n');
};

// Parse Mermaid text to extract nodes and edges
export const parseMermaidText = (text) => {
  const nodes = [];
  const edges = [];
  const lines = text.split('\n');

  lines.forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('flowchart') || line.startsWith('graph')) return;

    // Match node definitions
    const nodeMatch = line.match(/^(\w+)([\[\{\(\(])(.*?)([\]\}\)\)])$/);
    if (nodeMatch) {
      const [, id, startSymbol, label] = nodeMatch;
      const shape = getShapeFromSymbols(startSymbol);
      nodes.push({ id, label, shape });
    }

    // Match edge definitions
    const edgeMatch = line.match(/(\w+)\s*-->((?:\|[^|]*\|)?)\s*(\w+(?:[\[\{\(\<][^\]\}\)\>]*[\]\}\)\>])?)/);
    if (edgeMatch) {
      const [, source, labelPart, targetFull] = edgeMatch;
      // Extract just the node ID from the target if it has a shape definition
      const target = targetFull.replace(/[\[\{\(\<].*[\]\}\)\>]$/, '');
      const label = labelPart ? labelPart.replace(/^\||\|$/g, '') : '';
      const edgeId = `edge_${source}_${target}`;
      edges.push({
        id: edgeId,
        source: source,
        target: target,
        label: label,
        style: {
          color: '#6b7280'
        }
      });
    }
  });

  return { nodes, edges };
};

// Get shape type from Mermaid symbols
export const getShapeFromSymbols = (startSymbol) => {
  switch (startSymbol) {
    case '[': return 'rectangle';
    case '(': return 'circle';
    case '{': return 'diamond';
    default: return 'rectangle';
  }
};

// Generate Mermaid node text
export const generateNodeText = (id, label, shape) => {
  switch (shape) {
    case 'circle':
      return `${id}((${label}))`;
    case 'diamond':
      return `${id}{${label}}`;
    case 'rectangle':
    default:
      return `${id}[${label}]`;
  }
};

// Generate unique node ID
export const generateUniqueId = (prefix = 'node', existingIds = []) => {
  let counter = 1;
  let newId = `${prefix}${counter}`;

  while (existingIds.includes(newId)) {
    counter++;
    newId = `${prefix}${counter}`;
  }

  return newId;
};

// Position calculation for new nodes
export const calculateNodePosition = (mousePosition, containerBounds) => {
  return {
    x: mousePosition.x - containerBounds.left,
    y: mousePosition.y - containerBounds.top
  };
};

// Validate diagram text
export const validateDiagramText = (text, diagramType) => {
  try {
    // Basic validation
    if (!text.trim()) {
      return { isValid: false, error: 'Diagram text cannot be empty' };
    }

    // Check for correct diagram type declaration
    const firstLine = text.trim().split('\n')[0];
    switch (diagramType.toLowerCase()) {
      case 'flowchart':
        if (!firstLine.toLowerCase().startsWith('flowchart')) {
          return { isValid: false, error: 'Flowchart must start with "flowchart" declaration' };
        }
        break;
      case 'sequence':
        if (!firstLine.toLowerCase().startsWith('sequencediagram')) {
          return { isValid: false, error: 'Sequence diagram must start with "sequenceDiagram" declaration' };
        }
        break;
      // Add more diagram type validations as needed
    }

    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Handle diagram export
export const exportDiagram = async (diagramText, format = 'svg') => {
  try {
    const element = document.getElementById('mermaid-diagram');
    if (!element) throw new Error('Diagram container not found');

    switch (format.toLowerCase()) {
      case 'svg':
        return {
          data: element.innerHTML,
          mime: 'image/svg+xml'
        };
      case 'png':
        // Convert SVG to PNG using canvas
        const svgData = element.querySelector('svg');
        if (!svgData) throw new Error('SVG not found');

        // Implementation for PNG conversion would go here
        break;
      default:
        throw new Error('Unsupported export format');
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};