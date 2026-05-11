import React, { useEffect, useRef } from 'react';

export const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const maxParticles = window.innerWidth < 768 ? 30 : 70;
    const particles: { x: number; y: number; r: number; d: number; vx: number; vy: number; targetVx: number }[] = [];

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 1,
        d: Math.random() * maxParticles,
        vx: 0,
        vy: Math.random() * 1.5 + 0.5,
        targetVx: 0,
      });
    }

    let mouseX = width / 2;
    let targetMouseX = width / 2;
    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();

      // Smooth lerp for mouse movement
      mouseX += (targetMouseX - mouseX) * 0.05;
      const mouseOffset = (mouseX - width / 2) * 0.001;

      for (let i = 0; i < maxParticles; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);

        // Calculate velocity with lerp and sub-pixel precision
        p.targetVx = mouseOffset + Math.sin(p.d) * 0.5;
        p.vx += (p.targetVx - p.vx) * 0.02;
        
        p.x += p.vx;
        p.y += p.vy;
        p.d += 0.01;

        // Reset positions
        if (p.x > width + 5 || p.x < -5 || p.y > height) {
          if (i % 3 > 0) {
            particles[i] = { ...p, x: Math.random() * width, y: -10 };
          } else {
            if (Math.sin(p.d) > 0) {
              particles[i] = { ...p, x: -5, y: Math.random() * height };
            } else {
              particles[i] = { ...p, x: width + 5, y: Math.random() * height };
            }
          }
        }
      }
      ctx.fill();
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
      }, 200);
    };

    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          targetMouseX = e.clientX;
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0 && !ticking) {
        requestAnimationFrame(() => {
          targetMouseX = e.touches[0].clientX;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10 w-full h-full block" 
      aria-hidden="true"
    />
  );
};
