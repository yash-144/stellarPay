'use client';

import { useEffect, useRef } from 'react';

const ParticleWave = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        // Grid configuration
        const COLS = 40;
        const ROWS = 25;
        const BASE_DOT_SIZE = 1.2;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const spacingX = canvas.width / (COLS - 1);
            const spacingY = canvas.height / (ROWS - 1);

            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    // Base grid position
                    const baseX = col * spacingX;
                    const baseY = row * spacingY;

                    // Normalized position (0–1)
                    const nx = col / COLS;
                    const ny = row / ROWS;

                    // Wave displacement — multiple sine waves for organic feel
                    const wave1 = Math.sin(nx * 4 + time * 0.6) * 20;
                    const wave2 = Math.sin(ny * 3 + time * 0.4) * 15;
                    const wave3 = Math.sin((nx + ny) * 3 + time * 0.5) * 12;
                    const wave4 = Math.cos(nx * 2 - time * 0.3) * Math.sin(ny * 5 + time * 0.7) * 18;

                    const dx = wave1 + wave3 * 0.5;
                    const dy = wave2 + wave4 * 0.6;

                    const x = baseX + dx;
                    const y = baseY + dy;

                    // Depth-based opacity and size — center is brighter
                    const distFromCenter = Math.sqrt(
                        Math.pow((x / canvas.width) - 0.5, 2) +
                        Math.pow((y / canvas.height) - 0.5, 2)
                    );

                    const brightness = Math.max(0.08, 0.6 - distFromCenter * 0.8);
                    const dotSize = BASE_DOT_SIZE + (0.5 - distFromCenter) * 1.5;

                    ctx.beginPath();
                    ctx.arc(x, y, Math.max(0.5, dotSize), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
                    ctx.fill();
                }
            }

            time += 0.015;
            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.9 }}
        />
    );
};

export default ParticleWave;
