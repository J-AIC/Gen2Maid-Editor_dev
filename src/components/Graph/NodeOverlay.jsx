import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const NodeOverlay = ({ 
    nodes, 
    selectedNode, 
    onNodeSelect, 
    onNodeEdit,
    zoom = 1,
    pan = { x: 0, y: 0 }
}) => {
    // We'll recalculate nodes on every zoom and pan change
    const [nodePositions, setNodePositions] = useState([]);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [lastClickId, setLastClickId] = useState(null);

    const calculateNodePositions = () => {
        const mermaidDiv = document.getElementById('mermaid-diagram');
        if (!mermaidDiv) return [];

        const nodeElements = mermaidDiv.querySelectorAll('.node');
        const mermaidRect = mermaidDiv.getBoundingClientRect();
        
        return Array.from(nodeElements).map(nodeEl => {
            const id = nodeEl.id;
            const rect = nodeEl.getBoundingClientRect();
            
            return {
                id,
                position: {
                    x: (rect.x - mermaidRect.x) / zoom,
                    y: (rect.y - mermaidRect.y) / zoom,
                    width: rect.width / zoom,
                    height: rect.height / zoom
                }
            };
        });
    };

    // Update positions after render and when zoom/pan changes
    useEffect(() => {
        const updatePositions = () => {
            setTimeout(() => {
                setNodePositions(calculateNodePositions());
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
    }, [zoom, pan, nodes]);

    const handleNodeClick = (id, e) => {
        e.stopPropagation();
        const currentTime = Date.now();

        if (currentTime - lastClickTime < 300 && id === lastClickId) {
            onNodeEdit(id);
        } else {
            onNodeSelect(id);
        }

        setLastClickTime(currentTime);
        setLastClickId(id);
    };

    return (
        <div className="absolute inset-0 pointer-events-none">
            {nodePositions.map(node => (
                <div
                    key={node.id}
                    className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 rounded-md ${
                        selectedNode === node.id
                            ? 'ring-4 ring-blue-500 ring-opacity-70'
                            : 'hover:ring-4 hover:ring-blue-400 hover:ring-opacity-40'
                    }`}
                    style={{
                        left: `${node.position.x * zoom + pan.x}px`,
                        top: `${node.position.y * zoom + pan.y}px`,
                        width: `${node.position.width * zoom}px`,
                        height: `${node.position.height * zoom}px`
                    }}
                    onClick={(e) => handleNodeClick(node.id, e)}
                />
            ))}
        </div>
    );
};

NodeOverlay.propTypes = {
    nodes: PropTypes.array.isRequired,
    selectedNode: PropTypes.string,
    onNodeSelect: PropTypes.func.isRequired,
    onNodeEdit: PropTypes.func.isRequired,
    zoom: PropTypes.number,
    pan: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
    })
};

export default NodeOverlay;