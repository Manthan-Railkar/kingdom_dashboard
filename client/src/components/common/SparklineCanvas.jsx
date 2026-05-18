import React, { useEffect, useRef } from 'react';

export default function SparklineCanvas({ data = [], color = '#c9a227', width = 100, height = 30, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const points = data.map((d) => (typeof d === 'object' ? d.points : d));
    if (points.length < 2) return;

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const pad = 2;
    const w = width - pad * 2;
    const h = height - pad * 2;

    const toX = (i) => pad + (i / (points.length - 1)) * w;
    const toY = (v) => pad + h - ((v - min) / range) * h;

    // Fill gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, color + '55');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(points[0]));
    for (let i = 1; i < points.length; i++) {
      const cpX = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpX, toY(points[i - 1]), cpX, toY(points[i]), toX(i), toY(points[i]));
    }
    ctx.lineTo(toX(points.length - 1), height);
    ctx.lineTo(toX(0), height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(points[0]));
    for (let i = 1; i < points.length; i++) {
      const cpX = (toX(i - 1) + toX(i)) / 2;
      ctx.bezierCurveTo(cpX, toY(points[i - 1]), cpX, toY(points[i]), toX(i), toY(points[i]));
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 4;
    ctx.stroke();

    // End dot
    const lastX = toX(points.length - 1);
    const lastY = toY(points[points.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 8;
    ctx.fill();
  }, [data, color, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px`, display: 'block' }}
      className={className}
    />
  );
}
