import React, { useEffect, useRef } from 'react';

export type MicroscopyMode = 'fluorescence' | 'phase-contrast' | 'ihc-stain';

interface CellularBackgroundProps {
  isDark: boolean;
  microscopyMode: MicroscopyMode;
  isPaused: boolean;
  cellCount?: number;
}

interface CellEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  depth: number; // Parallax depth factor (0.35 to 1.0)
  nucleusRadius: number;
  nucleusOffsetX: number;
  nucleusOffsetY: number;
  phase: number;
  phaseSpeed: number;
  wobbleAmp: number;
  excitation: number;
  type: 'lymphocyte' | 'epithelial' | 'macrophage';
  organelles: { angle: number; dist: number; size: number }[];
}

interface MicroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  base: 'A' | 'T' | 'G' | 'C';
}

interface SignalPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export const CellularBackground: React.FC<CellularBackgroundProps> = ({
  isDark,
  microscopyMode,
  isPaused,
  cellCount = 26,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    normX: number;
    normY: number;
    active: boolean;
  }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    normX: 0,
    normY: 0,
    active: false,
  });
  const scrollYRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const pulses: SignalPulse[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      const vx = prevX > -500 ? (e.clientX - prevX) * 0.12 : 0;
      const vy = prevY > -500 ? (e.clientY - prevY) * 0.12 : 0;

      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        vx,
        vy,
        normX: (e.clientX / width - 0.5) * 2,
        normY: (e.clientY / height - 0.5) * 2,
        active: true,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      pulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 8,
        maxRadius: 340,
        alpha: 0.55,
      });
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize biological cells with multi-plane parallax depth
    const types: CellEntity['type'][] = [
      'lymphocyte',
      'epithelial',
      'macrophage',
    ];
    const cells: CellEntity[] = Array.from({ length: cellCount }, (_, i) => {
      const depth = 0.38 + (i % 5) * 0.15;
      const radius = (22 + (i % 5) * 10) * depth;
      const organelleCount = 4 + (i % 4);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45 * depth,
        vy: (Math.random() - 0.5) * 0.45 * depth,
        radius,
        depth,
        nucleusRadius: radius * 0.36,
        nucleusOffsetX: (Math.random() - 0.5) * radius * 0.18,
        nucleusOffsetY: (Math.random() - 0.5) * radius * 0.18,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.01 + Math.random() * 0.014,
        wobbleAmp: 0.08 + Math.random() * 0.06,
        excitation: 0,
        type: types[i % types.length],
        organelles: Array.from({ length: organelleCount }, (_, oIdx) => ({
          angle: (oIdx / organelleCount) * Math.PI * 2 + Math.random() * 0.5,
          dist: radius * (0.48 + Math.random() * 0.28),
          size: (1.8 + Math.random() * 2.2) * depth,
        })),
      };
    });

    // Floating extracellular vesicles / nucleotide micro-particles for parallax depth
    const baseChars: ('A' | 'T' | 'G' | 'C')[] = ['A', 'T', 'G', 'C'];
    const microParticles: MicroParticle[] = Array.from(
      { length: 38 },
      (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        depth: 0.25 + (i % 4) * 0.22,
        base: baseChars[i % 4],
      })
    );

    const getPalette = () => {
      if (microscopyMode === 'ihc-stain') {
        return isDark
          ? {
              membrane: 'rgba(244, 114, 182, 0.22)',
              cytoplasm: 'rgba(244, 114, 182, 0.045)',
              nucleus: 'rgba(167, 139, 250, 0.22)',
              organelle: 'rgba(251, 191, 36, 0.28)',
              tether: '244, 114, 182',
            }
          : {
              membrane: 'rgba(190, 24, 93, 0.18)',
              cytoplasm: 'rgba(244, 114, 182, 0.05)',
              nucleus: 'rgba(109, 40, 217, 0.16)',
              organelle: 'rgba(180, 83, 9, 0.22)',
              tether: '190, 24, 93',
            };
      }
      if (microscopyMode === 'phase-contrast') {
        return isDark
          ? {
              membrane: 'rgba(148, 163, 184, 0.22)',
              cytoplasm: 'rgba(148, 163, 184, 0.04)',
              nucleus: 'rgba(226, 232, 240, 0.18)',
              organelle: 'rgba(56, 189, 248, 0.24)',
              tether: '148, 163, 184',
            }
          : {
              membrane: 'rgba(71, 85, 105, 0.18)',
              cytoplasm: 'rgba(100, 116, 139, 0.045)',
              nucleus: 'rgba(51, 65, 85, 0.15)',
              organelle: 'rgba(2, 132, 199, 0.2)',
              tether: '71, 85, 105',
            };
      }
      return isDark
        ? {
            membrane: 'rgba(6, 182, 212, 0.24)',
            cytoplasm: 'rgba(6, 182, 212, 0.042)',
            nucleus: 'rgba(16, 185, 129, 0.2)',
            organelle: 'rgba(34, 211, 238, 0.3)',
            tether: '6, 182, 212',
          }
        : {
            membrane: 'rgba(2, 132, 199, 0.18)',
            cytoplasm: 'rgba(14, 165, 233, 0.045)',
            nucleus: 'rgba(13, 148, 136, 0.16)',
            organelle: 'rgba(2, 132, 199, 0.24)',
            tether: '2, 132, 199',
          };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const palette = getPalette();

      // Parallax offsets based on mouse position & scroll
      const parallaxX = mouseRef.current.normX * 28;
      const parallaxY = mouseRef.current.normY * 28;
      const scrollOffset = scrollYRef.current * 0.08;

      // 1. Draw & update expanding click biochemical signaling pulses
      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
        const pulse = pulses[pIdx];
        pulse.radius += 5.5;
        pulse.alpha *= 0.96;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${palette.tether}, ${pulse.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        if (pulse.radius >= pulse.maxRadius || pulse.alpha < 0.02) {
          pulses.splice(pIdx, 1);
        }
      }

      // 2. Render background parallax micro-particles / free nucleotides
      for (const mp of microParticles) {
        if (!isPaused) {
          mp.x += mp.vx;
          mp.y += mp.vy;
          if (mp.x < 0) mp.x = width;
          if (mp.x > width) mp.x = 0;
          if (mp.y < 0) mp.y = height;
          if (mp.y > height) mp.y = 0;
        }

        const drawX = (mp.x - parallaxX * mp.depth + width) % width;
        const drawY =
          (mp.y - parallaxY * mp.depth - scrollOffset * mp.depth + height * 10) %
          height;

        if (mouseRef.current.active) {
          const md = Math.hypot(
            mouseRef.current.x - drawX,
            mouseRef.current.y - drawY
          );
          if (md < 170) {
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(${palette.tether}, ${
              (1 - md / 170) * 0.16
            })`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, 2 * mp.depth, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.tether}, ${0.22 * mp.depth})`;
        ctx.fill();
      }

      // Compute parallax-adjusted cell screen positions
      const screenPositions = cells.map((c) => {
        const sx = c.x - parallaxX * c.depth;
        const sy =
          ((c.y - scrollOffset * c.depth) % (height + 160) + (height + 160)) %
            (height + 160) -
          80;
        return { sx, sy };
      });

      // 3. Intercellular signaling filaments + cursor chemotaxis tethers
      for (let i = 0; i < cells.length; i++) {
        const p1 = screenPositions[i];
        for (let j = i + 1; j < cells.length; j++) {
          const p2 = screenPositions[j];
          const dist = Math.hypot(p2.sx - p1.sx, p2.sy - p1.sy);
          const maxDist = 230;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDark ? 0.16 : 0.12);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            const midX = (p1.sx + p2.sx) * 0.5 + Math.sin(cells[i].phase) * 12;
            const midY = (p1.sy + p2.sy) * 0.5 + Math.cos(cells[i].phase) * 12;
            ctx.quadraticCurveTo(midX, midY, p2.sx, p2.sy);
            ctx.strokeStyle = `rgba(${palette.tether}, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }

        // Direct interactive tether to mouse cursor when hovering nearby
        if (mouseRef.current.active) {
          const mDist = Math.hypot(
            mouseRef.current.x - p1.sx,
            mouseRef.current.y - p1.sy
          );
          if (mDist < 260) {
            const tAlpha = (1 - mDist / 260) * (isDark ? 0.28 : 0.22);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(${palette.tether}, ${tAlpha})`;
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1.15;
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 4. Update & draw each deformable eukaryotic cell
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const { sx, sy } = screenPositions[i];

        if (!isPaused) {
          cell.phase += cell.phaseSpeed + cell.excitation * 0.04;
          cell.excitation *= 0.95;
          cell.x += cell.vx;
          cell.y += cell.vy;

          // React to expanding click pulses
          for (const pulse of pulses) {
            const pDist = Math.hypot(sx - pulse.x, sy - pulse.y);
            if (Math.abs(pDist - pulse.radius) < 35) {
              cell.excitation = 1.0;
            }
          }

          // Interactive cursor fluid wake & chemotaxis attraction
          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - sx;
            const dy = mouseRef.current.y - sy;
            const dist = Math.hypot(dx, dy);
            if (dist < 290 && dist > 48) {
              cell.x += (dx / dist) * 0.34 * cell.depth;
              cell.y += (dy / dist) * 0.34 * cell.depth;
              cell.x += mouseRef.current.vx * 0.06 * cell.depth;
              cell.y += mouseRef.current.vy * 0.06 * cell.depth;
              cell.excitation = Math.max(
                cell.excitation,
                (1 - dist / 290) * 0.65
              );
            } else if (dist <= 48 && dist > 1) {
              // Gentle elastic membrane repulsion at very close range
              cell.x -= (dx / dist) * 0.65;
              cell.y -= (dy / dist) * 0.65;
            }
          }

          const margin = cell.radius * 2;
          if (cell.x < -margin) cell.x = width + margin;
          if (cell.x > width + margin) cell.x = -margin;
          if (cell.y < -margin) cell.y = height + margin;
          if (cell.y > height + margin) cell.y = -margin;
        }

        // Draw deformable lipid bilayer membrane
        const segments = 28;
        const activeWobble = cell.wobbleAmp * (1 + cell.excitation * 0.85);
        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const theta = (s / segments) * Math.PI * 2;
          const harmonic1 = Math.sin(theta * 3 + cell.phase) * activeWobble;
          const harmonic2 =
            Math.cos(theta * 5 - cell.phase * 1.3) * (activeWobble * 0.5);
          const r =
            cell.radius *
            (1 + cell.excitation * 0.1 + harmonic1 + harmonic2);
          const px = sx + Math.cos(theta) * r;
          const py = sy + Math.sin(theta) * r;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = palette.cytoplasm;
        ctx.fill();
        ctx.strokeStyle = palette.membrane;
        ctx.lineWidth = 1.25 + cell.excitation * 0.8;
        ctx.stroke();

        // Draw inner nuclear envelope
        const nx = sx + cell.nucleusOffsetX + Math.sin(cell.phase * 0.7) * 2.5;
        const ny = sy + cell.nucleusOffsetY + Math.cos(cell.phase * 0.7) * 2.5;
        ctx.beginPath();
        ctx.arc(nx, ny, cell.nucleusRadius, 0, Math.PI * 2);
        ctx.fillStyle = palette.nucleus;
        ctx.fill();
        ctx.strokeStyle = palette.membrane;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Draw nucleolus
        ctx.beginPath();
        ctx.arc(
          nx + cell.nucleusRadius * 0.2,
          ny - cell.nucleusRadius * 0.15,
          cell.nucleusRadius * 0.28,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = palette.organelle;
        ctx.fill();

        // Draw intracellular organelles
        for (const org of cell.organelles) {
          const curAngle = org.angle + cell.phase * 0.28;
          const ox = sx + Math.cos(curAngle) * org.dist;
          const oy = sy + Math.sin(curAngle) * org.dist;
          ctx.beginPath();
          ctx.arc(ox, oy, org.size, 0, Math.PI * 2);
          ctx.fillStyle = palette.organelle;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark, microscopyMode, isPaused, cellCount]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full max-w-full pointer-events-none z-0 transition-opacity duration-500 overflow-hidden"
    />
  );
};
