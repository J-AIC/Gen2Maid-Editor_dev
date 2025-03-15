import React from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import ShapeRenderer from './ShapeRenderer';

const DraggableElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'FLOWCHART_ELEMENT',
    item: { type: 'FLOWCHART_ELEMENT', ...element },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`cursor-move ${isDragging ? 'opacity-50' : ''}`}
    >
      <ShapeRenderer shape={element.shape} style={element.style} elementName={element.name} />
    </div>
  );
};

DraggableElement.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    shape: PropTypes.string.isRequired,
    mermaidCode: PropTypes.string.isRequired,
    style: PropTypes.string,
  }).isRequired,
};

export default DraggableElement;