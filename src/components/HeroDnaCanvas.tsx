import React, { useEffect, useRef, useState } from 'react';
import { DNA_HELIX_MILESTONES, DnaMilestoneNode } from '../data/cvData';
import { RotateCcw, Play, Pause, Sparkles } from 'lucide-react';

export type DnaConformation = 'b-dna' | 'denature-94c' | 'anneal-58c';

interface HeroDnaCanvasProps {
  isDark: boolean;
}

export const HeroDnaCanvas: React.FC<HeroDnaCanvasProps> = ({ isDark }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [conformation, setConformation] = useState<DnaConformation>('b-dna');
  const [selectedMilestone, setSelectedMilestone] = useState<DnaMilestoneNode>(
    DNA_HELIX_MILESTONES[1]
  );
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number }>({
    x: 340,
    y: 160,
  });

  const [parallax, setParallax] = useState<{
    rx: number;
    ry: number;
    px: number;
    py: number;
  }>({
    rx: 0,
    ry: 0,
    px: 0,
    py: 0,
  });

  const dragRef = useRef<{
    isDragging: boolean;
    lastX: number;
    rotationOffset: number;
  }>({
    isDragging: false,
    lastX: 0,
    rotationOffset: 0,
  });

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setParallax({
      rx: -ny * 5,
      ry: nx * 5,
      px: nx * 18,
      py: ny * 18,
    });
  };

  const handleStageMouseLeave = () => {
    setParallax({ rx: 0, ry: 0, px: 0, py: 0 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let timePhase = 0;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      if (isSpinning && !dragRef.current.isDragging) {
        timePhase += 0.024;
      }

      // Subtle calibration grid lines that shift with mouse parallax
      ctx.strokeStyle = isDark
        ? 'rgba(30, 41, 59, 0.55)'
        : 'rgba(226, 232, 240, 0.75)';
      ctx.lineWidth = 1;
      const gridStep = 36;
      const offsetX = (parallax.px * 0.5) % gridStep;
      const offsetY = (parallax.py * 0.5) % gridStep;

      for (let gx = offsetX; gx < width; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = offsetY; gy < height; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Wide horizontal 3D-projected double helix spanning across the widened viewport
      const numBasePairs = 28;
      const leftMargin = 48;
      const usableWidth = width - leftMargin * 2;
      const centerY = height * 0.5 + parallax.py * 0.35;
      const baseRadius = Math.min(height * 0.34, 98);

      const strandA: { x: number; y: number; z: number }[] = [];
      const strandB: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < numBasePairs; i++) {
        const norm = i / (numBasePairs - 1);
        const x = leftMargin + norm * usableWidth;
        const angle =
          norm * Math.PI * 4.5 +
          timePhase +
          dragRef.current.rotationOffset +
          parallax.ry * 0.05;

        const midDist = Math.abs(norm - 0.5) * 2;
        const bubbleProfile = Math.max(0, 1 - midDist * midDist * 1.6);

        let extraSeparation = 0;
        let twistDampen = 1;
        if (conformation === 'denature-94c') {
          extraSeparation = bubbleProfile * 42;
          twistDampen = 1 - bubbleProfile * 0.75;
        } else if (conformation === 'anneal-58c') {
          extraSeparation = bubbleProfile * 22;
          twistDampen = 1 - bubbleProfile * 0.45;
        }

        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);

        const yOffset = sinA * baseRadius * twistDampen;
        const y1 =
          centerY +
          yOffset -
          (sinA >= 0 ? -extraSeparation : extraSeparation);
        const y2 =
          centerY -
          yOffset +
          (sinA >= 0 ? -extraSeparation : extraSeparation);

        const xTilt1 = x + cosA * 5;
        const xTilt2 = x - cosA * 5;

        strandA.push({ x: xTilt1, y: y1, z: cosA });
        strandB.push({ x: xTilt2, y: y2, z: -cosA });

        const milestoneIdx = Math.floor(
          (i / numBasePairs) * DNA_HELIX_MILESTONES.length
        );
        const isSelectedCol =
          Math.abs(
            i -
              Math.round(
                (selectedMilestone.index / (DNA_HELIX_MILESTONES.length - 1)) *
                  (numBasePairs - 5) +
                  2
              )
          ) === 0;

        const midX = (xTilt1 + xTilt2) * 0.5;
        const midY = (y1 + y2) * 0.5;

        if (conformation === 'denature-94c' && bubbleProfile > 0.35) {
          ctx.beginPath();
          ctx.moveTo(xTilt1, y1);
          ctx.lineTo(midX, y1 + (midY - y1) * 0.55);
          ctx.strokeStyle = isDark
            ? 'rgba(244, 63, 94, 0.75)'
            : 'rgba(225, 29, 72, 0.75)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(xTilt2, y2);
          ctx.lineTo(midX, y2 + (midY - y2) * 0.55);
          ctx.strokeStyle = isDark
            ? 'rgba(245, 158, 11, 0.75)'
            : 'rgba(217, 119, 6, 0.75)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(xTilt1, y1);
          ctx.lineTo(xTilt2, y2);
          ctx.strokeStyle = isSelectedCol
            ? isDark
              ? '#22D3EE'
              : '#0284C7'
            : milestoneIdx % 2 === 0
            ? isDark
              ? 'rgba(6, 182, 212, 0.52)'
              : 'rgba(2, 132, 199, 0.45)'
            : isDark
            ? 'rgba(16, 185, 129, 0.52)'
            : 'rgba(13, 148, 136, 0.45)';
          ctx.lineWidth = isSelectedCol ? 3.2 : 1.8;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(midX, midY, isSelectedCol ? 4 : 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isSelectedCol
            ? '#F59E0B'
            : isDark
            ? 'rgba(148, 163, 184, 0.55)'
            : 'rgba(100, 116, 139, 0.5)';
          ctx.fill();
        }

        const rA = (isSelectedCol ? 6.4 : 4.2) + (cosA + 1) * 1.3;
        const rB = (isSelectedCol ? 6.4 : 4.2) + (-cosA + 1) * 1.3;

        ctx.beginPath();
        ctx.arc(xTilt1, y1, rA, 0, Math.PI * 2);
        ctx.fillStyle = isSelectedCol
          ? '#F59E0B'
          : isDark
          ? '#06B6D4'
          : '#0284C7';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(xTilt2, y2, rB, 0, Math.PI * 2);
        ctx.fillStyle = isSelectedCol
          ? '#F59E0B'
          : isDark
          ? '#10B981'
          : '#0D9488';
        ctx.fill();

        if (isSelectedCol) {
          const labelY = Math.min(y1, y2) - 14;
          ctx.font = '600 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = isDark ? '#22D3EE' : '#0369A1';
          ctx.fillText(
            `${selectedMilestone.codon} [${selectedMilestone.basePair}]`,
            midX,
            Math.max(22, labelY)
          );
        }
      }

      const drawSpline = (
        pts: { x: number; y: number }[],
        color: string
      ) => {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) * 0.5;
          const yc = (pts[i].y + pts[i + 1].y) * 0.5;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.6;
        ctx.stroke();
      };

      drawSpline(
        strandA,
        isDark ? 'rgba(34, 211, 238, 0.9)' : 'rgba(2, 132, 199, 0.85)'
      );
      drawSpline(
        strandB,
        isDark ? 'rgba(52, 211, 153, 0.9)' : 'rgba(13, 148, 136, 0.85)'
      );

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    isDark,
    conformation,
    selectedMilestone,
    isSpinning,
    parallax.px,
    parallax.py,
    parallax.ry,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.isDragging = true;
    dragRef.current.lastX = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.round(e.clientX - rect.left);
    const relY = Math.round(e.clientY - rect.top);
    setCursorCoords({ x: relX, y: relY });

    if (dragRef.current.isDragging) {
      const deltaX = e.clientX - dragRef.current.lastX;
      dragRef.current.rotationOffset += deltaX * 0.025;
      dragRef.current.lastX = e.clientX;
    }
  };

  const handlePointerUp = () => {
    dragRef.current.isDragging = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(0.99, clickX / rect.width));
    const idx = Math.floor(ratio * DNA_HELIX_MILESTONES.length);
    setSelectedMilestone(DNA_HELIX_MILESTONES[idx]);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleStageMouseMove}
      onMouseLeave={handleStageMouseLeave}
      style={{
        transform: `perspective(1400px) rotateX(${(parallax.rx * 0.25).toFixed(
          2
        )}deg) rotateY(${(parallax.ry * 0.25).toFixed(2)}deg)`,
        transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="w-full max-w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B101B]/95 p-4 sm:p-7 shadow-lg overflow-hidden"
    >
      {/* Top Wide Instrument Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            INTERACTIVE 3D NUCLEOTIDE CONFORMATION STAGE
          </div>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
            ● Nominal · Drag horizontally to rotate 3D helix · Click any rung or
            codon to inspect locus
          </div>
        </div>

        {/* Conformation & Playback Controls */}
        <div className="flex flex-wrap items-center gap-2 max-w-full">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 max-w-full overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setConformation('b-dna')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                conformation === 'b-dna'
                  ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Native B-DNA (37°C)
            </button>
            <button
              type="button"
              onClick={() => setConformation('denature-94c')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                conformation === 'denature-94c'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PCR Melt (94°C)
            </button>
            <button
              type="button"
              onClick={() => setConformation('anneal-58c')}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-mono rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                conformation === 'anneal-58c'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Annealing (58°C)
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsSpinning((prev) => !prev)}
              title={isSpinning ? 'Pause rotation' : 'Resume rotation'}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isSpinning ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                dragRef.current.rotationOffset = 0;
                setConformation('b-dna');
              }}
              title="Reset helix orientation"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Wide 3D DNA Double-Helix Viewport */}
      <div className="relative w-full h-[260px] sm:h-[290px] my-4 rounded-xl border border-slate-200 dark:border-slate-800/90 bg-slate-50/70 dark:bg-[#070B12] overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair block touch-none"
        />

        <div className="absolute top-3 left-4 right-4 pointer-events-none text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
          3D HELIX · PITCH 3.40 nm/turn · PARALLAX ({Math.round(parallax.px)},
          {Math.round(parallax.py)})
        </div>
      </div>

      {/* Bottom Wide Codon Selector Strip + Selected Milestone Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pt-2 border-t border-slate-200 dark:border-slate-800">
        {/* Horizontal Codon Selector Buttons */}
        <div className="lg:col-span-7 flex flex-wrap items-center gap-1.5">
          {DNA_HELIX_MILESTONES.map((node) => {
            const active = selectedMilestone.index === node.index;
            return (
              <button
                key={node.index}
                type="button"
                onClick={() => setSelectedMilestone(node)}
                className={`px-2.5 py-1.5 text-xs font-mono rounded-lg border transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-cyan-600 text-white border-cyan-500 font-semibold shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                {node.codon}
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Readout */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3.5">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>CODON {selectedMilestone.codon}</span>
            <span aria-hidden="true">·</span>
            <span>PAIR {selectedMilestone.basePair}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedMilestone.metric}</span>
          </div>
          <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
            {selectedMilestone.label}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {selectedMilestone.detail}
          </p>
        </div>
      </div>
    </div>
  );
};
