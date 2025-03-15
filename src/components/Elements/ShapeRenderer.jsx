import React from 'react';
import PropTypes from 'prop-types';

const ShapeRenderer = ({ shape, style = 'bg-purple-100', size = 'normal', elementName }) => {
    const sizeClasses = {
        small: 'w-16 h-16',
        normal: 'w-20 h-20',
        large: 'w-24 h-24'
    };

    const baseClasses = `${style} border-2 border-gray-300 ${sizeClasses[size]} flex items-center justify-center relative`;

    const renderShape = () => {
        switch (shape) {
            /*case 'subgraph':
                return (
                    <div className={`${baseClasses} border-dashed min-w-[100px] min-h-[80px]`}>
                        <div className="absolute -top-3 left-2 bg-gray-800 px-2 text-xs">
                            <span className="transform scale-75">Node</span>
                        </div>
                        <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
                            Drop nodes here
                        </div>
                    </div>
                );*/

            case 'rectangle':
                return (
                    <div className={`${baseClasses} rounded-none`}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'rounded':
                return (
                    <div className={`${baseClasses} rounded-lg`}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'stadium':
                return (
                    <div className={`${baseClasses} rounded-3xl`}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'subroutine':
                return (
                    <div className={`${baseClasses} rounded-sm`}>
                        <div className="absolute left-1 inset-y-0 w-1 bg-gray-300" />
                        <div className="absolute right-1 inset-y-0 w-1 bg-gray-300" />
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'cylinder':
                return (
                    <div className={`${baseClasses} rounded-t-full`}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'circle':
                return (
                    <div className={`${baseClasses} rounded-full`}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'asymmetric':
                return (
                    <div className={`${baseClasses} clip-path-asymmetric`}
                        style={{ clipPath: 'polygon(100% 0, 100% 50%, 100% 100%, 0% 100%, 25% 50%, 0% 0%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'rhombus':
                return (
                    <div className={`${baseClasses}`}
                        style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'hexagon':
                return (
                    <div className={`${baseClasses}`}
                        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'parallelogram':
                return (
                    <div className={`${baseClasses}`}
                        style={{ clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'parallelogram-alt':
                return (
                    <div className={`${baseClasses}`}
                        style={{ clipPath: 'polygon(0% 0%, 75% 0%, 100% 100%, 25% 100%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'trapezoid':
                return (
                    <div className={`${baseClasses}`}
                        style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'trapezoid-alt':
                return (
                    <div className={`${baseClasses}`}
                        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)' }}>
                        <span className="transform scale-75">Node</span>
                    </div>
                );

            case 'double-circle':
                return (
                    <div className={`${baseClasses} rounded-full`}>
                        <div className="absolute inset-1 border-2 border-gray-300 rounded-full" />
                        <span className="transform scale-75">Node</span>
                    </div>
                );
        }
    };

    return renderShape();
};

ShapeRenderer.propTypes = {
    shape: PropTypes.string.isRequired,
    style: PropTypes.string,
    size: PropTypes.oneOf(['small', 'normal', 'large'])
};

ShapeRenderer.defaultProps = {
    style: 'bg-purple-100',
    size: 'normal'
};

export default ShapeRenderer;