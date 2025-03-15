import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const EdgeOverlay = ({ 
    edges, 
    onEdgeSelect,
    zoom = 1,
    pan = { x: 0, y: 0 }
}) => {
    const [edgePositions, setEdgePositions] = useState([]);

    // Calculate the edge positions directly from the SVG in the DOM
    const calculateEdgePositions = () => {
        const mermaidDiv = document.getElementById('mermaid-diagram');
        if (!mermaidDiv) return [];

        const svg = mermaidDiv.querySelector('svg');
        if (!svg) return [];

        const edgePositions = [];
        
        // Find all edge paths - try different selectors that might match
        const edgePaths = Array.from(svg.querySelectorAll('.edgePath path, .flowchart-link'));
        
        edgePaths.forEach((edgePath, index) => {
            const d = edgePath.getAttribute('d');
            if (!d) return;
            
            // Try to extract source and target from element ID or parent
            let sourceId = '';
            let targetId = '';
            let edgeId = `edge-${index}`;
            
            // Check path ID, it might contain source/target
            if (edgePath.id) {
                const pathIdParts = edgePath.id.split('-');
                if (pathIdParts.length >= 3) {
                    sourceId = pathIdParts[pathIdParts.length - 2];
                    targetId = pathIdParts[pathIdParts.length - 1];
                }
            }
            
            // If not found in path ID, check parent ID
            if (!sourceId || !targetId) {
                const edgeParent = edgePath.closest('.edgePath');
                if (edgeParent && edgeParent.id) {
                    const idParts = edgeParent.id.split('-');
                    if (idParts.length >= 3) {
                        sourceId = idParts[idParts.length - 2];
                        targetId = idParts[idParts.length - 1];
                    }
                }
            }
            
            // Try to match with known edges
            if (sourceId && targetId) {
                const matchingEdge = edges.find(edge => {
                    const edgeSourceId = edge.source.split('-').pop() || edge.source;
                    const edgeTargetId = edge.target.split('-').pop() || edge.target;
                    return edgeSourceId === sourceId && edgeTargetId === targetId;
                });
                
                if (matchingEdge) {
                    edgeId = matchingEdge.id;
                }
            }
            
            edgePositions.push({
                id: edgeId,
                pathId: edgePath.id || `path-${index}`,
                d,
                source: sourceId,
                target: targetId
            });
        });
        
        return edgePositions;
    };

    // Update edge positions when zoom, pan, or edges change
    useEffect(() => {
        const updatePositions = () => {
            setTimeout(() => {
                setEdgePositions(calculateEdgePositions());
            }, 100);
        };

        updatePositions();
        
        // Add observer for diagram changes
        const observer = new MutationObserver(updatePositions);
        const mermaidDiv = document.getElementById('mermaid-diagram');
        
        if (mermaidDiv) {
            observer.observe(mermaidDiv, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }

        return () => observer.disconnect();
    }, [edges]);

    // Create group-hover pairs for edge highlighting
    const createGroupedEdges = () => {
        return edgePositions.map((edge, index) => ({
            ...edge,
            groupId: `edge-group-${index}`
        }));
    };

    const groupedEdges = createGroupedEdges();

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                    left: 0,
                    top: 0
                }}
            >
                <g 
                    transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
                    className="pointer-events-none"
                >
                    {groupedEdges.map(edge => (
                        <g key={edge.id} id={edge.groupId} className="group">
                            {/* Invisible wider path for click detection */}
                            <path
                                d={edge.d}
                                stroke="transparent"
                                strokeWidth="20"
                                fill="none"
                                className="pointer-events-auto cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdgeSelect({
                                        id: edge.id,
                                        source: edge.source,
                                        target: edge.target
                                    });
                                }}
                            />
                            
                            {/* Visible highlight path */}
                            <path
                                d={edge.d}
                                stroke="#3b82f6"
                                strokeWidth="4"
                                fill="none"
                                className="invisible group-hover:visible opacity-50"
                                style={{ pointerEvents: 'none' }}
                            />
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
};

EdgeOverlay.propTypes = {
    edges: PropTypes.array.isRequired,
    onEdgeSelect: PropTypes.func.isRequired,
    zoom: PropTypes.number,
    pan: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    })
};

export default EdgeOverlay;