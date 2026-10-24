import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';

interface DnaSectionMorphBridgeProps {
  fromSection: string;
  toSection: string;
  targetId: string;
  sequenceCode: string;
  locusTag: string;
  isDark: boolean;
  onTriggerNavMorph?: (targetId: string, label: string, sequence: string) => void;
}

export const DnaSectionMorphBridge: React.FC<DnaSectionMorphBridgeProps> = ({
  fromSection,
  toSection,
  targetId,
  sequenceCode,
  locusTag,
  isDark,
  onTriggerNavMorph,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [morphMode, setMorphMode] = useState<'helix' | 'unzip-morph'>('helix');
  const [hoveredBase, setHoveredBase] = useState<number | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const mouseXRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // 0 when entering bottom of viewport, 1 when reaching top third
      const raw = (vh - rect.top) / (vh * 0.85);
      scrollProgressRef.current = Math.max(0, Math.min(1, raw));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const updateDimensions = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const bases = sequenceCode.replace(/[^ATGC]/g, '').split('');
    const complementMap: Record<string, string> = {
      A: 'T',
      T: 'A',
      G: 'C',
      C: 'G',
    };

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);

      phase += 0.028;
      const scrollFactor = scrollProgressRef.current;
      // Morph factor combines scroll progress (or manual unzip toggle) across the horizontal span
      const numPairs = Math.min(28, Math.max(14, Math.floor(width / 42)));
      const centerY = height * 0.5;
      const maxAmplitude = Math.min(34, height * 0.34);

      const strand1Points: { x: number; y: number; z: number }[] = [];
      const strand2Points: { x: number; y: number; z: number }[] = [];

      for (let i = 0; i < numPairs; i++) {
        const t = i / (numPairs - 1);
        const x = 32 + t * (width - 64);

        // Determine how much this segment of the helix is morphing into the next section's grid
        const localMorph =
          morphMode === 'unzip-morph'
            ? Math.min(1, t * 1.15)
            : Math.max(0, Math.min(1, (scrollFactor - 0.35) * 1.6 * t));

        // Interactive cursor wave perturbation
        let cursorBoost = 0;
        if (mouseXRef.current !== null) {
          const dist = Math.abs(x - mouseXRef.current);
          if (dist < 140) {
            cursorBoost = (1 - dist / 140) * 12;
          }
        }

        const angle = t * Math.PI * 4.5 - phase;
        const sinVal = Math.sin(angle);
        const cosVal = Math.cos(angle);

        // When morphing into the next section, the sinusoidal twist flattens/expands into architectural section rails
        const helixY1 = centerY + sinVal * (maxAmplitude + cursorBoost);
        const helixY2 = centerY - sinVal * (maxAmplitude + cursorBoost);

        const morphedY1 = centerY - maxAmplitude * 1.18;
        const morphedY2 = centerY + maxAmplitude * 1.18;

        const y1 = helixY1 * (1 - localMorph) + morphedY1 * localMorph;
        const y2 = helixY2 * (1 - localMorph) + morphedY2 * localMorph;

        strand1Points.push({ x, y: y1, z: cosVal });
        strand2Points.push({ x, y: y2, z: -cosVal });

        // Draw base-pair hydrogen bond rungs
        const baseChar = bases[i % bases.length] || 'G';
        const compChar = complementMap[baseChar] || 'C';
        const isGC = baseChar === 'G' || baseChar === 'C';

        const midY = (y1 + y2) * 0.5;
        const gapHalf = localMorph * 9;

        // Upper half rung
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, midY - gapHalf);
        ctx.strokeStyle = isGC
          ? isDark
            ? 'rgba(6, 182, 212, 0.55)'
            : 'rgba(2, 132, 199, 0.5)'
          : isDark
          ? 'rgba(16, 185, 129, 0.55)'
          : 'rgba(13, 148, 136, 0.5)';
        ctx.lineWidth = 1.75;
        ctx.stroke();

        // Lower half rung
        ctx.beginPath();
        ctx.moveTo(x, y2);
        ctx.lineTo(x, midY + gapHalf);
        ctx.strokeStyle = isGC
          ? isDark
            ? 'rgba(16, 185, 129, 0.55)'
            : 'rgba(13, 148, 136, 0.5)'
          : isDark
          ? 'rgba(6, 182, 212, 0.55)'
          : 'rgba(2, 132, 199, 0.5)';
        ctx.lineWidth = 1.75;
        ctx.stroke();

        // Draw nucleotide nodes
        const r1 = 3.2 + (cosVal + 1) * 0.9;
        const r2 = 3.2 + (-cosVal + 1) * 0.9;

        ctx.beginPath();
        ctx.arc(x, y1, r1, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#06B6D4' : '#0284C7';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y2, r2, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? '#10B981' : '#0D9488';
        ctx.fill();

        // Show base letters on every 3rd pair or when unzipped
        if (i % 3 === 0 || localMorph > 0.4) {
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = isDark
            ? 'rgba(226, 232, 240, 0.72)'
            : 'rgba(51, 65, 85, 0.78)';
          ctx.fillText(baseChar, x, y1 - 8);
          ctx.fillText(compChar, x, y2 + 15);
        }
      }

      // Draw continuous sugar-phosphate backbone curves
      const drawBackbone = (
        pts: { x: number; y: number }[],
        strokeColor: string
      ) => {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const xc = (pts[i].x + pts[i + 1].x) * 0.5;
          const yc = (pts[i].y + pts[i + 1].y) * 0.5;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      };

      drawBackbone(
        strand1Points,
        isDark ? 'rgba(34, 211, 238, 0.85)' : 'rgba(2, 132, 199, 0.82)'
      );
      drawBackbone(
        strand2Points,
        isDark ? 'rgba(52, 211, 153, 0.85)' : 'rgba(13, 148, 136, 0.82)'
      );

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isDark, morphMode, sequenceCode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    mouseXRef.current = x;
    const idx = Math.floor((x / rect.width) * 24);
    setHoveredBase(idx);
  };

  const handleMouseLeave = () => {
    mouseXRef.current = null;
    setHoveredBase(null);
  };

  const handleMorphClick = () => {
    if (onTriggerNavMorph) {
      onTriggerNavMorph(targetId, toSection, sequenceCode);
    } else {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full border-y border-slate-200 dark:border-slate-800/90 bg-slate-100/70 dark:bg-slate-900/50 overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 max-w-full">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              LOCUS: {locusTag}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-400">
              {fromSection} → {toSection}
            </span>
            {hoveredBase !== null && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-cyan-600 dark:text-cyan-400">
                  Nucleotide Pos #{hoveredBase + 1}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center p-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/70 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setMorphMode('helix')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  morphMode === 'helix'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                B-DNA Twist
              </button>
              <button
                type="button"
                onClick={() => setMorphMode('unzip-morph')}
                className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  morphMode === 'unzip-morph'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Helicase Morph
              </button>
            </div>

            <button
              type="button"
              onClick={handleMorphClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-md transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[170px] sm:max-w-none">Morph to {toSection}</span>
              <ArrowDown className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-24 sm:h-28 cursor-crosshair block"
        />
      </div>
    </div>
  );
};

interface DnaNavigationOverlayProps {
  activeTransition: {
    targetId: string;
    label: string;
    sequence: string;
  } | null;
  isDark: boolean;
  onComplete: () => void;
}

export const DnaNavigationOverlay: React.FC<DnaNavigationOverlayProps> = ({
  activeTransition,
  isDark,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activeTransition) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    const startTime = performance.now();
    const duration = 820; // Smooth 820ms helix unzipping transition
    let animId: number;
    let scrolled = false;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Scroll to the target section halfway through the helix morph
      if (progress >= 0.45 && !scrolled) {
        scrolled = true;
        const targetEl = document.getElementById(activeTransition.targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Envelope opacity: fade in quickly (0 -> 0.25), hold while unzipping (0.25 -> 0.65), fade out cleanly (0.65 -> 1.0)
      const envelope =
        progress < 0.25
          ? progress / 0.25
          : progress < 0.65
          ? 1
          : 1 - (progress - 0.65) / 0.35;

      ctx.fillStyle = isDark
        ? `rgba(7, 11, 18, ${envelope * 0.88})`
        : `rgba(248, 250, 252, ${envelope * 0.88})`;
      ctx.fillRect(0, 0, width, height);

      // Draw central vertical/diagonal morphing DNA helix that unzips outward into the section frame
      const numRungs = 26;
      const centerX = width * 0.5;
      const maxSpread = Math.min(width * 0.42, 460);
      const unzipProgress = Math.max(0, (progress - 0.2) / 0.7);
      const unzipOffset = Math.pow(unzipProgress, 1.6) * maxSpread;

      for (let i = 0; i < numRungs; i++) {
        const t = i / (numRungs - 1);
        const y = height * 0.1 + t * (height * 0.8);
        const angle = t * Math.PI * 5 - progress * Math.PI * 6;
        const twistX = Math.sin(angle) * 90 * (1 - unzipProgress * 0.7);

        const x1 = centerX + twistX - unzipOffset;
        const x2 = centerX - twistX + unzipOffset;

        // Rung line
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = isDark
          ? `rgba(6, 182, 212, ${envelope * (1 - unzipProgress * 0.6) * 0.6})`
          : `rgba(2, 132, 199, ${envelope * (1 - unzipProgress * 0.6) * 0.55})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Left & right phosphate nodes
        ctx.beginPath();
        ctx.arc(x1, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(34, 211, 238, ${envelope})`
          : `rgba(2, 132, 199, ${envelope})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x2, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(16, 185, 129, ${envelope})`
          : `rgba(13, 148, 136, ${envelope})`;
        ctx.fill();
      }

      if (progress < 1) {
        animId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [activeTransition, isDark, onComplete]);

  if (!activeTransition) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      aria-live="polite"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 text-center px-4 sm:px-6 py-3 sm:py-4 max-w-[90vw] rounded-xl border border-cyan-500/30 bg-white/90 dark:bg-slate-900/90 shadow-lg">
        <p className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          TRANSCRIBING GENOMIC LOCUS · {activeTransition.sequence}
        </p>
        <p className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
          {activeTransition.label}
        </p>
      </div>
    </div>
  );
};
