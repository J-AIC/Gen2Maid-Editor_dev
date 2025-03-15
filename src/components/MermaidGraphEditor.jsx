import React, { useState, useCallback } from 'react';
import EditorTab from './Editor/EditorTab';
import VisualTab from './Editor/VisualTab';
import Toolbar from './Toolbar/Toolbar';
import DroppableGraphPanel from './Graph/DroppableGraphPanel';
import ResizeHandle from './common/ResizeHandle';
import EditDialog from './common/EditDialog';
import ExportDialog from './common/ExportDialog';
import { FLOWCHART_ELEMENTS } from '../constants/elements';
import { useTheme } from '../context/ThemeContext';

import {
    useDiagramRenderer,
    useResizable
} from '../hooks';

import {
    DIAGRAM_TYPES,
    DIAGRAM_TEMPLATES
} from '../constants';

import {
    parseMermaidText,
    generateNodeText,
    generateUniqueId,
    validateDiagramText,
    calculateNodePosition
} from '../utils';

const MermaidGraphEditor = ({ initialCode }) => {
    const { isDarkMode } = useTheme();
    
    // Existing state
    const [currentDiagramType, setCurrentDiagramType] = React.useState('Flowchart');
    // Get code from URL when component mounts
    const [diagramText, setDiagramText] = React.useState(() => {
        return initialCode || DIAGRAM_TEMPLATES.Flowchart;
    });
    const [activeTabs, setActiveTabs] = React.useState(['editor', 'visual']);
    const [collapsedTabs, setCollapsedTabs] = React.useState({
        editor: false,
        visual: false
    });
    const [searchDiagrams, setSearchDiagrams] = React.useState('');
    const [searchElements, setSearchElements] = React.useState('');

    // Export dialog
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    // Node and edge management state
    const [nodes, setNodes] = React.useState([]);
    const [edges, setEdges] = React.useState([]);
    const [selectedNode, setSelectedNode] = React.useState(null);
    const [selectedEdge, setSelectedEdge] = React.useState(null);
    const [editingItem, setEditingItem] = React.useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    // Custom hooks
    const { renderDiagram, autoRender } = useDiagramRenderer();
    const { width, isResizing, startResizing } = useResizable(400);

    // Add this effect for initial render
    React.useEffect(() => {
        autoRender(diagramText);
    }, []); // Empty dependency array for initial render

    // Keep your existing effect for updates
    React.useEffect(() => {
        renderDiagram(diagramText);
    }, [diagramText, renderDiagram]);

    // Effect to parse diagram text and update nodes/edges
    React.useEffect(() => {
        if (currentDiagramType === 'Flowchart') {
            const { nodes: parsedNodes, edges: parsedEdges } = parseMermaidText(diagramText);
            setNodes(parsedNodes);
            setEdges(parsedEdges);
        }
    }, [diagramText, currentDiagramType]);

    // Handle edge creation (keep your original working version)
    const handleEdgeCreate = React.useCallback((sourceId, targetId) => {
        const newEdge = {
            id: `edge_${sourceId}_${targetId}`,
            source: sourceId,
            target: targetId,
            label: '',
            style: {
                color: '#6b7280'
            }
        };

        setEdges(prev => [...prev, newEdge]);

        // Update diagram text using the simple node IDs
        setDiagramText(prev => {
            const simpleSourceId = sourceId.split('-')[1];
            const simpleTargetId = targetId.split('-')[1];

            const newEdgeLine = `    ${simpleSourceId} --> ${simpleTargetId}`;
            return `${prev}\n${newEdgeLine}`;
        });
    }, []);

    // Effect to render diagram
    React.useEffect(() => {
        renderDiagram(diagramText);
    }, [diagramText, renderDiagram]);

    // Handle node selection (for edge creation)
    const handleNodeSelect = React.useCallback((nodeId) => {
        if (!selectedNode) {
            // First node selection
            setSelectedNode(nodeId);
        } else if (selectedNode === nodeId) {
            // Deselect if clicking the same node
            setSelectedNode(null);
        } else {
            // Create edge between selected node and newly clicked node
            handleEdgeCreate(selectedNode, nodeId);
            setSelectedNode(null);
        }
    }, [selectedNode, handleEdgeCreate]);

    // Handle node editing (double click)
    const handleNodeEdit = useCallback((nodeId) => {
        // Return early if nodeId is null
        if (!nodeId) return;

        const cleanNodeId = nodeId.replace('flowchart-', '').split('-')[0];
        console.log('Editing node:', cleanNodeId);

        // Find the node in the diagram text to get its current properties
        const diagramLines = diagramText.split('\n');
        const nodeLine = diagramLines.find(line =>
            line.trim().startsWith(cleanNodeId)
        );

        if (!nodeLine) return;

        // Find any existing style definition
        const styleLine = diagramLines.find(line =>
            line.trim().startsWith('style') && line.includes(cleanNodeId)
        );

        let currentLabel = 'New Node';
        let currentShape = 'rectangle';
        let currentStyle = {
            color: '#000000',
            backgroundColor: '#ffffff',
            borderColor: '#000000',
            borderWidth: '1px'
        };

        // Get the part after the node ID
        const nodeText = nodeLine.trim().substring(cleanNodeId.length).trim();
        console.log('Node text:', nodeText);

        // Check more specific patterns first, then move to simpler ones
        if (nodeText.startsWith('(((') && nodeText.endsWith(')))')) {
            currentShape = 'double-circle';
            currentLabel = nodeText.slice(3, -3);
        } else if (nodeText.startsWith('((') && nodeText.endsWith('))')) {
            currentShape = 'circle';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('([') && nodeText.endsWith('])')) {
            currentShape = 'stadium';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('[(') && nodeText.endsWith(')]')) {
            currentShape = 'cylinder';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('[[') && nodeText.endsWith(']]')) {
            currentShape = 'subroutine';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('{{') && nodeText.endsWith('}}')) {
            currentShape = 'hexagon';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('[/') && nodeText.endsWith('\\]')) {
            currentShape = 'trapezoid';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('[\\') && nodeText.endsWith('/]')) {
            currentShape = 'trapezoid-alt';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('[/') && nodeText.endsWith('/]')) {
            currentShape = 'parallelogram';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('[\\') && nodeText.endsWith('\\]')) {
            currentShape = 'parallelogram-alt';
            currentLabel = nodeText.slice(2, -2);
        } else if (nodeText.startsWith('>') && nodeText.endsWith(']')) {
            currentShape = 'asymmetric';
            currentLabel = nodeText.slice(1, -1);
        } else if (nodeText.startsWith('{') && nodeText.endsWith('}')) {
            currentShape = 'rhombus';
            currentLabel = nodeText.slice(1, -1);
        } else if (nodeText.startsWith('(') && nodeText.endsWith(')')) {
            currentShape = 'rounded';
            currentLabel = nodeText.slice(1, -1);
        } else if (nodeText.startsWith('[') && nodeText.endsWith(']')) {
            currentShape = 'rectangle';
            currentLabel = nodeText.slice(1, -1);
        }

        // Parse style if it exists
        if (styleLine) {
            const styleMatch = styleLine.match(/stroke:(#[A-Fa-f0-9]{6})/);
            const fillMatch = styleLine.match(/fill:(#[A-Fa-f0-9]{6})/);
            const colorMatch = styleLine.match(/color:(#[A-Fa-f0-9]{6})/);
            const widthMatch = styleLine.match(/stroke-width:(\d+px)/);

            if (styleMatch) currentStyle.borderColor = styleMatch[1];
            if (fillMatch) currentStyle.backgroundColor = fillMatch[1];
            if (colorMatch) currentStyle.color = colorMatch[1];
            if (widthMatch) currentStyle.borderWidth = widthMatch[1];
        }

        const editData = {
            type: 'node',
            id: cleanNodeId,
            label: currentLabel,
            shape: currentShape,
            style: currentStyle
        };

        console.log('Setting edit data:', editData);
        setEditingItem(editData);
        setIsEditDialogOpen(true);
        setSelectedNode(null);
    }, [diagramText]);

    // Handle edge selection
    const handleEdgeSelect = React.useCallback((edge) => {
        if (!edge) {
            console.log('No edge selected, clearing selection');
            return;
        }

        console.log('Edge selected:', edge);

        // Get simplified source and target IDs
        const simpleSourceId = edge.source.split('-').pop() || edge.source;
        const simpleTargetId = edge.target.split('-').pop() || edge.target;

        // Find existing edge or create new one
        const existingEdge = edges.find(e => e.id === edge.id);
        console.log('Existing edge:', existingEdge);

        const editData = {
            type: 'edge',
            id: edge.id,
            source: simpleSourceId,
            target: simpleTargetId,
            label: existingEdge?.label || edge.label || '',
            style: {
                color: existingEdge?.style?.color || '#6b7280',
                labelColor: existingEdge?.style?.labelColor || '#000000'
            }
        };

        console.log('Opening edit dialog with data:', editData);
        setEditingItem(editData);
        setIsEditDialogOpen(true);
    }, [edges]);

    // Handle edit save
    const handleEditSave = useCallback((updatedData) => {
        console.log('Handling save with updated data:', updatedData);

        if (updatedData.type === 'node') {
            // Update nodes state
            setNodes(prev => prev.map(node =>
                node.id === updatedData.id ? {
                    ...node,
                    label: updatedData.label,
                    shape: updatedData.shape,
                    style: updatedData.style
                } : node
            ));

            // Update diagram text
            setDiagramText(prev => {
                const lines = prev.split('\n');

                // Find the node line and its shape
                const nodeIndex = lines.findIndex(line =>
                    line.trim().startsWith(updatedData.id)
                );

                if (nodeIndex !== -1) {
                    // Find the element definition for the shape
                    const element = FLOWCHART_ELEMENTS.find(el => el.shape === updatedData.shape);
                    if (element) {
                        // Reconstruct the node definition with proper symbols
                        lines[nodeIndex] = `    ${updatedData.id}${element.startSymbol}${updatedData.label}${element.endSymbol}`;
                    }

                    // Update or add style definition
                    const styleIndex = lines.findIndex(line =>
                        line.trim().startsWith('style') && line.includes(updatedData.id)
                    );

                    // Build style definition
                    const styleDefinition = `    style ${updatedData.id} stroke-width:${updatedData.style.borderWidth || '1px'},` +
                        `stroke:${updatedData.style.borderColor || '#000000'},` +
                        `color:${updatedData.style.color || '#000000'},` +
                        `fill:${updatedData.style.backgroundColor || '#ffffff'}`;

                    if (styleIndex !== -1) {
                        lines[styleIndex] = styleDefinition;
                    } else {
                        lines.push(styleDefinition);
                    }
                }

                return lines.join('\n');
            });
        } else if (updatedData.type === 'edge') {
            // Update edges state
            setEdges(prev => prev.map(edge =>
                edge.id === updatedData.id ? {
                    ...edge,
                    label: updatedData.label,
                    style: updatedData.style
                } : edge
            ));

            // Update diagram text
            setDiagramText(prev => {
                // First, extract all the content from the diagram
                const lines = prev.split('\n');
                
                // We need to find all the edges in the diagram
                const edgeLines = [];
                lines.forEach((line, index) => {
                    if (line.includes('-->')) {
                        edgeLines.push({ line, index });
                    }
                });
                
                // Find the specific edge we're updating by matching source & target
                const edgeToUpdate = edgeLines.find(({ line }) => {
                    return line.includes(updatedData.source) && 
                           line.includes(updatedData.target);
                });
                
                if (!edgeToUpdate) {
                    console.error('Could not find the edge to update in the diagram text');
                    return prev;
                }
                
                // Calculate the index of this edge in the sequence of all edges
                // (0 for first edge, 1 for second, etc.)
                const edgeIndex = edgeLines.indexOf(edgeToUpdate);
                
                // Update the edge line with the new label
                let updatedLine = `    ${updatedData.source} -->`;
                if (updatedData.label) {
                    updatedLine += `|${updatedData.label}|`;
                }
                updatedLine += ` ${updatedData.target}`;
                
                lines[edgeToUpdate.index] = updatedLine;
                
                // Remove any existing linkStyle for this edge
                const linkStyleRegex = new RegExp(`linkStyle\\s+${edgeIndex}\\s+`);
                const newLines = lines.filter(line => !linkStyleRegex.test(line));
                
                // Add the new linkStyle at the appropriate location
                const styleDefinition = `    linkStyle ${edgeIndex} stroke:${updatedData.style.color},color:${updatedData.style.labelColor}`;
                
                // Insert right after the edge definition
                newLines.splice(edgeToUpdate.index + 1, 0, styleDefinition);
                
                return newLines.join('\n');
            });
        }

        setIsEditDialogOpen(false);
        setEditingItem(null);
        setSelectedNode(null);
    }, []);

    // Handle item deletion
    const handleDelete = React.useCallback(() => {
        if (!editingItem) return;

        if (editingItem.type === 'node') {
            // For nodes, remove the node and all connected edges
            setNodes(prev => prev.filter(node => node.id !== editingItem.id));
            setEdges(prev => prev.filter(edge =>
                edge.source !== editingItem.id && edge.target !== editingItem.id
            ));

            // Update diagram text
            setDiagramText(prev => {
                const lines = prev.split('\n').filter(line => {
                    return !line.includes(editingItem.id);
                });
                return lines.join('\n');
            });
        } else if (editingItem.type === 'edge') {
            // For edges, only remove the specific edge
            setEdges(prev => prev.filter(edge => edge.id !== editingItem.id));

            // Update diagram text
            setDiagramText(prev => {
                const lines = prev.split('\n');
                
                // Find and extract all edge lines
                const edgeLines = [];
                lines.forEach((line, index) => {
                    if (line.includes('-->')) {
                        edgeLines.push({ line, index });
                    }
                });
                
                // Find the specific edge to delete
                const edgeToDelete = edgeLines.find(({ line }) => 
                    line.includes(editingItem.source) && 
                    line.includes(editingItem.target) &&
                    (editingItem.label ? line.includes(editingItem.label) : true)
                );
                
                if (!edgeToDelete) {
                    console.error('Could not find the edge to delete');
                    return prev;
                }
                
                // Calculate the index of this edge in the sequence
                const edgeIndex = edgeLines.indexOf(edgeToDelete);
                
                // Remove the edge line
                const newLines = [...lines];
                newLines.splice(edgeToDelete.index, 1);
                
                // Remove any associated linkStyle
                const linkStyleIdx = newLines.findIndex(line => 
                    line.includes(`linkStyle ${edgeIndex}`)
                );
                
                if (linkStyleIdx !== -1) {
                    newLines.splice(linkStyleIdx, 1);
                }
                
                // Update any subsequent linkStyle indices
                for (let i = 0; i < newLines.length; i++) {
                    const line = newLines[i];
                    const match = line.match(/linkStyle\s+(\d+)/);
                    if (match) {
                        const styleIndex = parseInt(match[1]);
                        if (styleIndex > edgeIndex) {
                            // Decrement the index for all subsequent linkStyles
                            newLines[i] = line.replace(
                                `linkStyle ${styleIndex}`, 
                                `linkStyle ${styleIndex - 1}`
                            );
                        }
                    }
                }
                
                return newLines.join('\n');
            });
        }

        setIsEditDialogOpen(false);
        setEditingItem(null);
        setSelectedNode(null);
    }, [editingItem]);

    const handleCloseDialog = () => {
        setIsEditDialogOpen(false);
        setEditingItem(null);
        setSelectedEdge(null);
    };

    const handleDrop = useCallback((item, offset) => {
        // Parse current diagram text to get all node IDs
        const diagramLines = diagramText.split('\n');
        const usedIds = new Set();

        diagramLines.forEach(line => {
            // Match any node definition, regardless of shape syntax
            const nodeMatch = line.match(/^\s*(node\d+)[\[{(>]/);
            if (nodeMatch) {
                usedIds.add(nodeMatch[1]);
            }
        });

        // Find the next available ID
        let counter = 1;
        let newNodeId = `node${counter}`;
        while (usedIds.has(newNodeId)) {
            counter++;
            newNodeId = `node${counter}`;
        }

        const position = calculateNodePosition(offset, document.getElementById('mermaid-diagram').getBoundingClientRect());

        const newNode = {
            id: newNodeId,
            type: item.shape,
            position,
            label: 'New Node',
            style: {
                color: '#ffffff',
                backgroundColor: '#4b5563',
                borderColor: '#6b7280'
            }
        };

        setNodes(prev => [...prev, newNode]);

        const element = FLOWCHART_ELEMENTS.find(el => el.shape === item.shape);
        const nodeText = `    ${newNodeId}${element.startSymbol}${newNode.label}${element.endSymbol}`;

        setDiagramText(prev => {
            if (!prev.trim()) {
                return `flowchart TD\n${nodeText}`;
            }
            return `${prev}\n${nodeText}`;
        });
    }, [diagramText]);

    // Add export handler
    const handleExportClick = useCallback(() => {
        console.log('export button clicked');
        setIsExportDialogOpen(true);
    }, []);


    return (
        <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-100 text-gray-800'}`}>
            {/* Toolbar */}
            <Toolbar
                activeTabs={activeTabs}
                onTabChange={setActiveTabs}
                onExportClick={handleExportClick}
            />

            {/* Edit Dialog */}
            <EditDialog
                isOpen={isEditDialogOpen}
                onClose={handleCloseDialog}
                type={editingItem?.type || 'node'}
                data={editingItem}
                onSave={handleEditSave}
                onDelete={handleDelete}
            />

            {/* Export Dialog */}
            <ExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                diagramText={diagramText}
            />

            {/* Main Content Area */}
            <div className="flex flex-grow">
                {/* Resizable Sidebar */}
                <div
                    className={`flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-slate-200 border-slate-300'} border-r relative`}
                    style={{ width: `${width}px` }}
                >
                    <EditorTab
                        diagramText={diagramText}
                        onTextChange={(e) => setDiagramText(e.target.value)}
                        isCollapsed={collapsedTabs.editor}
                        onToggleCollapse={() => setCollapsedTabs(prev => ({
                            ...prev,
                            editor: !prev.editor,
                            visual: prev.editor ? prev.visual : false // Expand visual when editor collapses
                        }))}
                    />

                    <VisualTab
                        isCollapsed={collapsedTabs.visual}
                        isEditorCollapsed={collapsedTabs.editor}
                        onToggleCollapse={() => setCollapsedTabs(prev => ({
                            ...prev,
                            visual: !prev.visual,
                            editor: prev.visual ? prev.editor : false // Expand editor when visual collapses
                        }))}
                        currentDiagramType={currentDiagramType}
                        onDiagramTypeSelect={setCurrentDiagramType}
                        diagramTypes={DIAGRAM_TYPES}
                        searchDiagrams={searchDiagrams}
                        onSearchDiagrams={(e) => setSearchDiagrams(e.target.value)}
                        searchElements={searchElements}
                        onSearchElements={(e) => setSearchElements(e.target.value)}
                        elements={FLOWCHART_ELEMENTS}
                    />

                    <ResizeHandle onResizeStart={startResizing} />
                </div>

                {/* Graph Panel */}
                <DroppableGraphPanel
                    onDrop={handleDrop}
                    currentDiagram={currentDiagramType}
                    diagramText={diagramText}
                    nodes={nodes}
                    edges={edges}
                    selectedNode={selectedNode}
                    selectedEdge={selectedEdge}
                    onNodeSelect={handleNodeSelect}
                    onNodeEdit={handleNodeEdit}
                    onEdgeCreate={handleEdgeCreate}
                    onEdgeSelect={handleEdgeSelect}
                />
            </div>
        </div>
    );
};

export default MermaidGraphEditor;