/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

interface StarsBackgroundProps {
  intensity?: number;
  showHearts?: boolean;
}

export const StarsBackground: React.FC<StarsBackgroundProps> = ({
  intensity = 80,
  showHearts = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates for subtle interactions
    const mouse = { x: -1000, y: -1000, radius: 120 };

    // Set up stars
    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
      twinkleSpeed: number;
    }

    const stars: Star[] = Array.from({ length: intensity }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.05 + 0.01,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    // Set up floating romantic hearts
    interface Heart {
      x: number;
      y: number;
      size: number;
      speedY: number;
      amplitude: number;
      waveSpeed: number;
      offset: number;
      alpha: number;
      color: string;
    }

    const hearts: Heart[] = [];
    const heartColors = [
      "rgba(244, 63, 94, 0.5)",   // Rose 500
      "rgba(251, 113, 133, 0.4)", // Rose 400
      "rgba(225, 29, 72, 0.45)",  // Rose 600
      "rgba(253, 164, 186, 0.35)" // Light Rose
    ];

    const spawnHeart = (xPos?: number, yPos?: number): Heart => {
      return {
        x: xPos ?? Math.random() * width,
        y: yPos ?? height + 20,
        size: Math.random() * 10 + 6,
        speedY: Math.random() * 0.6 + 0.4,
        amplitude: Math.random() * 20 + 10,
        waveSpeed: Math.random() * 0.02 + 0.01,
        offset: Math.random() * 100,
        alpha: Math.random() * 0.5 + 0.3,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
      };
    };

    // Pre-populate some hearts across the screen
    if (showHearts) {
      for (let i = 0; i < 15; i++) {
        hearts.push(spawnHeart(Math.random() * width, Math.random() * height));
      }
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.globalAlpha = alpha;
      c.fillStyle = color;
      c.beginPath();
      // Draw standard SVG-like path using bezier curves for perfect romantic hearts
      const topCurveHeight = size * 0.3;
      c.moveTo(x, y + topCurveHeight);
      c.bezierCurveTo(x - size / 2, y - topCurveHeight, x - size, y + topCurveHeight, x, y + size);
      c.bezierCurveTo(x + size, y + topCurveHeight, x + size / 2, y - topCurveHeight, x, y + topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Handle clicks to spawn spontaneous bursts of hearts!
    const handleClick = (e: MouseEvent) => {
      if (!showHearts) return;
      for (let i = 0; i < 5; i++) {
        hearts.push({
          x: e.clientX + (Math.random() * 40 - 20),
          y: e.clientY + (Math.random() * 40 - 20),
          size: Math.random() * 12 + 8,
          speedY: Math.random() * 1.2 + 0.8,
          amplitude: Math.random() * 30 + 15,
          waveSpeed: Math.random() * 0.04 + 0.02,
          offset: Math.random() * 100,
          alpha: 0.8,
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
        });
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    // Core render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Create beautiful dark romantic space gradient (Deep Midnight to Soft Violet Black)
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#08050e"); // Rich midnight space black
      grad.addColorStop(0.5, "#0e091a"); // Mystical purple tint
      grad.addColorStop(1, "#180a1e"); // Deep rose-violet-tinged night sky
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render & Twinkle stars
      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }
        
        // Star drift
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Mouse interaction (gravity push)
        let drawX = star.x;
        let drawY = star.y;
        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          drawX += (dx / dist) * force * 15;
          drawY += (dy / dist) * force * 15;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(1, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render & Animate hearts
      if (showHearts) {
        for (let i = hearts.length - 1; i >= 0; i--) {
          const heart = hearts[i];
          heart.y -= heart.speedY;
          heart.offset += heart.waveSpeed;
          // Sine wave sideways drift
          const currentX = heart.x + Math.sin(heart.offset) * heart.amplitude;

          // Fade out as it approaches the top
          if (heart.y < 80) {
            heart.alpha -= 0.008;
          }

          // Remove or draw
          if (heart.y < -20 || heart.alpha <= 0) {
            hearts.splice(i, 1);
            // Spawn replacements from bottom to maintain atmosphere
            if (hearts.length < 20) {
              hearts.push(spawnHeart());
            }
          } else {
            drawHeart(ctx, currentX, heart.y, heart.size, heart.color, heart.alpha);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [intensity, showHearts]);

  return (
    <canvas
      ref={canvasRef}
      id="stars-canvas"
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
