import React, { useEffect, useState } from 'react';
import './SparklineSvg.css';

export default function SparklineSvg({ data = [], color = '#c9a227', width = 100, height = 30, animate = true }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  let points = data.map((d) => (typeof d === 'object' ? d.points : d));
  
  if (points.length === 0) {
    points = [0, 0];
  } else if (points.length === 1) {
    points = [points[0], points[0]];
  }

  let min = Math.min(...points);
  let max = Math.max(...points);
  if (min === max) {
    min -= 10;
    max += 10;
  }
  const range = max - min;
  const pad = 3;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const toX = (i) => pad + (i / (points.length - 1)) * w;
  const toY = (v) => pad + h - ((v - min) / range) * h;

  let pathD = `M ${toX(0)} ${toY(points[0])} `;
  for (let i = 1; i < points.length; i++) {
    const cpX = (toX(i - 1) + toX(i)) / 2;
    pathD += `C ${cpX} ${toY(points[i - 1])}, ${cpX} ${toY(points[i])}, ${toX(i)} ${toY(points[i])} `;
  }

  // Polygon for fill
  const fillD = `${pathD} L ${toX(points.length - 1)} ${height} L ${toX(0)} ${height} Z`;

  // Last point for dot
  const lastX = toX(points.length - 1);
  const lastY = toY(points[points.length - 1]);

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className={`sparkline-svg ${animate && show ? 'animate' : ''}`} 
      style={{ overflow: 'visible', width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id={`glow-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Fill Area */}
      <path
        d={fillD}
        fill={`url(#grad-${color.replace('#', '')})`}
        className="sparkline-fill"
      />
      
      {/* Stroke Line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter={`url(#glow-${color.replace('#', '')})`}
        className="sparkline-path"
      />
      
      {/* End Dot */}
      <circle
        cx={lastX}
        cy={lastY}
        r="3"
        fill={color}
        filter={`url(#glow-${color.replace('#', '')})`}
        className="sparkline-dot"
      />
    </svg>
  );
}
