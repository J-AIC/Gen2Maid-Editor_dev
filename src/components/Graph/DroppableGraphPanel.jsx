import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { MinusIcon, PlusIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import NodeOverlay from './NodeOverlay';
import EdgeOverlay from './EdgeOverlay';
import { useTheme } from '../../context/ThemeContext';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

const DroppableGraphPanel = ({ 
  onDrop, 
  currentDiagram,
  diagramText,
  isLoading = false,
  onNodeSelect,
  onNodeEdit,
  selectedNode,
  onEdgeCreate,
  onEdgeSelect,
  nodes,
  edges
}) => {
  const { isDarkMode } = useTheme();
  
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanningLocked, setIsPanningLocked] = useState(false);

  // Center the graph initially
  useEffect(() => {
    const centerGraph = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const mermaidDiv = document.getElementById('mermaid-diagram');
        if (mermaidDiv) {
          const svg = mermaidDiv.querySelector('svg');
          if (svg) {
            const containerRect = container.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            
            setPan({
              x: (containerRect.width - svgRect.width) / 2,
              y: (containerRect.height - svgRect.height) / 2
            });
          }
        }
      }
    };

    // Wait for the diagram to render
    setTimeout(centerGraph, 100);
  }, [diagramText]);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Drag and drop setup
  const [{ isOver }, drop] = useDrop({
    accept: 'FLOWCHART_ELEMENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      // Adjust drop position based on zoom and pan
      const adjustedOffset = {
        x: (offset.x - pan.x) / zoom,
        y: (offset.y - pan.y) / zoom
      };
      onDrop(item, adjustedOffset);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  });

  // Handle zoom with buttons or wheel
  const handleZoom = (direction, clientX = null, clientY = null) => {
    setZoom(prevZoom => {
      // Calculate new zoom level
      const newZoom = direction === 'in' 
        ? Math.min(prevZoom + ZOOM_STEP, MAX_ZOOM)
        : Math.max(prevZoom - ZOOM_STEP, MIN_ZOOM);

      // Get the container and diagram elements
      const container = containerRef.current;
      const diagram = document.getElementById('mermaid-diagram');
      
      if (!container || !diagram) return newZoom;

      // Get the container's bounds
      const containerRect = container.getBoundingClientRect();
      
      // Calculate the center point of the container if no specific point provided
      const pointX = clientX ?? (containerRect.left + containerRect.width / 2);
      const pointY = clientY ?? (containerRect.top + containerRect.height / 2);

      // Calculate the point's position relative to the container
      const relativeX = pointX - containerRect.left - pan.x;
      const relativeY = pointY - containerRect.top - pan.y;

      // Calculate how much the point will move due to the zoom change
      const scale = newZoom / prevZoom;
      const dx = relativeX - relativeX * scale;
      const dy = relativeY - relativeY * scale;

      // Update pan to maintain the center point
      setPan(prevPan => ({
        x: prevPan.x + dx,
        y: prevPan.y + dy
      }));

      return newZoom;
    });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const direction = e.deltaY < 0 ? 'in' : 'out';
      handleZoom(direction, e.clientX, e.clientY);
    }
  };

  // Handle panning
  const handleMouseDown = (e) => {
    // Only start panning if not locked and using middle mouse button or when holding space
    if (!isPanningLocked && (e.button === 1 || e.button === 0)) {
      setIsPanning(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;
      
      setPan(prevPan => ({
        x: prevPan.x + dx,
        y: prevPan.y + dy
      }));
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        document.body.style.cursor = 'grab';
      }
      // Ctrl/Cmd + '+' for zoom in
      if ((e.ctrlKey || e.metaKey) && e.key === '+') {
        e.preventDefault();
        handleZoom('in');
      }
      // Ctrl/Cmd + '-' for zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoom('out');
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') {
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      ref={(node) => {
        drop(node);
        containerRef.current = node;
      }}
      className={`flex-grow ${isDarkMode ? 'bg-gray-900' : 'bg-slate-100'} p-6 relative`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Control Bar */}
      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 ${
        isDarkMode 
          ? 'bg-gray-800 text-gray-300' 
          : 'bg-blue-50 text-gray-700 border border-blue-200 shadow-sm'
      } p-2 rounded-lg shadow-lg pointer-events-auto z-50`}>
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoom('out');
            }}
            className={`p-2 rounded-md ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-blue-100'
            }`}
            title="Zoom Out (Ctrl/Cmd -)"
          >
            <MinusIcon className="w-5 h-5" />
          </button>
          <div className="text-sm min-w-[4rem] text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleZoom('in');
            }}
            className={`p-2 rounded-md ${
              isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-blue-100'
            }`}
            title="Zoom In (Ctrl/Cmd +)"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Separator */}
        <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-200'}`} />

        {/* Pan Lock Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPanningLocked(!isPanningLocked);
          }}
          className={`p-2 rounded-md ${
            isPanningLocked 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-blue-100'
          }`}
          title={isPanningLocked ? "Unlock Panning" : "Lock Panning"}
        >
          {isPanningLocked ? (
            <LockClosedIcon className="w-5 h-5" />
          ) : (
            <LockOpenIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div 
        className={`h-full border rounded-lg relative overflow-hidden ${
          isDarkMode 
            ? 'border-gray-700 bg-gray-800/50' 
            : 'border-slate-300 bg-white/80'
        }`}
        style={{
          cursor: isPanning ? 'grabbing' : 'default'
        }}
      >
        {isLoading && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 ${
            isDarkMode ? 'bg-gray-900/50' : 'bg-slate-100/50'
          }`}>
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Loading diagram...
            </div>
          </div>
        )}

        <div
          id="mermaid-diagram"
          className="w-full h-full absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        />

        <NodeOverlay
          nodes={nodes}
          selectedNode={selectedNode}
          onNodeSelect={onNodeSelect}
          onNodeEdit={onNodeEdit}
          zoom={zoom}
          pan={pan}
        />

        <EdgeOverlay
          edges={edges}
          onEdgeSelect={onEdgeSelect}
          zoom={zoom}
          pan={pan}
        />

        {isOver && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg pointer-events-none" />
        )}

        {!diagramText && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            No diagram content
          </div>
        )}
      </div>
    </div>
  );
};

DroppableGraphPanel.propTypes = {
  onDrop: PropTypes.func.isRequired,
  currentDiagram: PropTypes.string.isRequired,
  diagramText: PropTypes.string,
  isLoading: PropTypes.bool,
  onNodeSelect: PropTypes.func.isRequired,
  onNodeEdit: PropTypes.func.isRequired,
  selectedNode: PropTypes.string,
  onEdgeCreate: PropTypes.func.isRequired,
  onEdgeSelect: PropTypes.func.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })
  })).isRequired,
  edges: PropTypes.array.isRequired
};

export default DroppableGraphPanel;