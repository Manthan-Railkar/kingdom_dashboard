import React from 'react';
import './PageTransition.css';

export default function PageTransition({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="page-transition-overlay">
      <div className="pt-content">
        <div className="pt-emblem">
          <span className="pt-crown"></span>
          <div className="pt-shield">
            <span className="pt-q">Q</span>
          </div>
        </div>
        <div className="pt-text">LOADING</div>
      </div>
    </div>
  );
}
