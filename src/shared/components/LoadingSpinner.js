import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = props => {
    return (
        <div className={`${props.asOverlay && 'loading-overlay'}`}>
            <div className="loading-spinner"></div>
        </div>
    );
};

export default LoadingSpinner;