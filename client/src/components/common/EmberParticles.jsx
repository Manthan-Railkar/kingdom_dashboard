import React, { useEffect, useRef } from 'react';

export default function EmberParticles() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const embersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createEmber = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2.5 + 0.5,
      speedY: -(Math.random() * 0.6 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      decay: Math.random() * 0.003 + 0.001,
      color: Math.random() > 0.5 ? '#ff6600' : '#c9a227',
      flicker: Math.random() * Math.PI * 2,
    });

    // Seed initial embers
    for (let i = 0; i < 25; i++) {
      const e = createEmber();
      e.y = Math.random() * canvas.height;
      embersRef.current.push(e);
    }

    let spawnTimer = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnTimer++;
      if (spawnTimer % 8 === 0) embersRef.current.push(createEmber());

      embersRef.current = embersRef.current.filter((e) => e.opacity > 0.02);

      embersRef.current.forEach((e) => {
        e.y += e.speedY;
        e.x += e.speedX + Math.sin(e.flicker) * 0.2;
        e.flicker += 0.05;
        e.opacity -= e.decay;
        const flicker = 0.8 + Math.sin(e.flicker * 3) * 0.2;

        ctx.save();
        ctx.globalAlpha = e.opacity * flicker;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * flicker, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
