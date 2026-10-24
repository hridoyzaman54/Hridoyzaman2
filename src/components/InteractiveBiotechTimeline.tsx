import React, { useEffect, useRef, useState } from 'react';
import {
  EXPERIENCE_TIMELINE,
  EDUCATION_HISTORY,
  EXTRACURRICULAR_HIGHLIGHTS,
} from '../data/cvData';
import { Play, RotateCcw } from 'lucide-react';
import { InteractiveCard } from './InteractiveCard';

interface TimelineMilestone {
  id: string;
  yearLabel: string;
  category: 'clinical' | 'academic' | 'innovation';
  categoryName: string;
  title: string;
  organization: string;
  location: string;
  summary: string;
  details: string[];
  protocolsOrTags: string[];
  bioAnimationType: 'protein-folding' | 'cell-growth' | 'receptor-docking';
  bioAnimationLabel: string;
  bioMetric: string;
}

const UNIFIED_TIMELINE: TimelineMilestone[] = [
  {
    id: 'tl-bsc-2026',
    yearLabel: '2025 – 2026',
    category: 'academic',
    categoryName: 'B.Sc. Biotechnology & Thesis',
    title: 'B.Sc. in Biotechnology (Final Semester) & Dengue Epidemiology Research',
    organization: 'BRAC University',
    location: 'Dhaka, Bangladesh',
    summary:
      'Culminating undergraduate biotechnology degree with final-year thesis on Dengue epidemiology, challenges, and mitigation strategies in South Asia.',
    details: [
      'Investigating hyper-endemic DENV 1–4 transmission dynamics, climate correlates, and integrated vector/diagnostic mitigation in South Asia.',
      'Completed advanced coursework and wet-lab practicals in genetic engineering, cell culture, biochemistry, and bioinformatics.',
      'Organized hands-on molecular biology workshops for junior cohorts and volunteered in community blood donation drives.',
    ],
    protocolsOrTags: [
      'Dengue Epidemiology',
      'Genetic Engineering',
      'Bioinformatics',
      'Molecular Workshops',
    ],
    bioAnimationType: 'receptor-docking',
    bioAnimationLabel: 'NS1 Antigen & Neutralizing Antibody Docking',
    bioMetric: 'ΔG = -11.4 kcal/mol · High-Affinity Binding',
  },
  {
    id: 'tl-nicrh-2025',
    yearLabel: 'Feb 2025 – May 2025',
    category: 'clinical',
    categoryName: 'Clinical Oncology Internship',
    title: 'Intern — Department of Immunology & Molecular Biology',
    organization: 'National Institute of Cancer Research and Hospital (NICRH)',
    location: 'Mohakhali, Dhaka',
    summary:
      'Hands-on clinical diagnostic and molecular oncology training inside Bangladesh’s national cancer research institute.',
    details: [
      'Assisted in ongoing clinical laboratory diagnostics and molecular sample analysis for oncology patients.',
      'Performed DNA/RNA extraction, endpoint PCR amplification, and agarose gel electrophoresis.',
      'Gained practical proficiency in cancer cell biology and immunohistochemistry (IHC) tissue staining.',
      'Maintained detailed laboratory records and clinical trial data compilation alongside pathologists, oncologists, and research fellows.',
      'Mastered institutional SOPs for BSL-2 biosafety, specimen handling, and quality assurance (95% proficiency).',
    ],
    protocolsOrTags: [
      'DNA/RNA Extraction',
      'PCR Amplification',
      'Gel Electrophoresis',
      'Immunohistochemistry (IHC)',
      'Biosafety SOPs',
    ],
    bioAnimationType: 'protein-folding',
    bioAnimationLabel: 'Chaperone-Assisted Tertiary Protein Folding (p53 / BRCA1 Domain)',
    bioMetric: 'RMSD: 0.82 Å · Native Tertiary Conformation',
  },
  {
    id: 'tl-hsc-2018',
    yearLabel: '2018',
    category: 'academic',
    categoryName: 'Higher Secondary Education',
    title: 'HSC — Science (Biology Major & Higher Mathematics)',
    organization: 'Dhaka Megacity College',
    location: 'Dhaka, Bangladesh',
    summary:
      'Completed Higher Secondary Certificate in the Science group with Biology as major and Higher Mathematics as additional subject.',
    details: [
      'Specialized in Biological Sciences (Botany & Zoology), Organic & Inorganic Chemistry, Physics, and Higher Mathematics.',
      'Completed intensive upper-secondary laboratory practicals in microscopy, specimen dissection, and qualitative chemical analysis.',
    ],
    protocolsOrTags: [
      'Biology Major',
      'Higher Mathematics',
      'Chemistry & Physics Labs',
      'HSC Science 2018',
    ],
    bioAnimationType: 'cell-growth',
    bioAnimationLabel: 'Eukaryotic Cell Cycle & Mitotic Spindle Assembly',
    bioMetric: 'HSC Cohort 2018 · Science Group',
  },
  {
    id: 'tl-ssc-2016',
    yearLabel: '2016',
    category: 'academic',
    categoryName: 'Secondary School Education',
    title: 'SSC — Science (English Version Curriculum)',
    organization: 'Laboratory English Version School & College',
    location: 'Dhaka, Bangladesh',
    summary:
      'Completed Secondary School Certificate in the English-version Science group with Biology major and Higher Mathematics as additional subject.',
    details: [
      'Built a strong foundation in English-medium scientific terminology, experimental biology, and quantitative problem solving.',
      'Participated actively in school-level science exhibitions, analytical mathematics, and laboratory demonstrations.',
    ],
    protocolsOrTags: [
      'English Version Curriculum',
      'Biology Major',
      'Higher Mathematics',
      'SSC Science 2016',
    ],
    bioAnimationType: 'cell-growth',
    bioAnimationLabel: 'Progenitor Cell Growth & Organelle Biogenesis',
    bioMetric: 'SSC Cohort 2016 · English Version',
  },
  {
    id: 'tl-national-olympiads',
    yearLabel: 'National Distinctions',
    category: 'innovation',
    categoryName: 'Olympiads & Nationwide Honours',
    title: 'National Physics & Mathematics Olympiads & 100+ Competition Distinctions',
    organization: 'National Science Olympiads & Dhruboparishad Bangladesh',
    location: 'Bangladesh (Nationwide)',
    summary:
      'Earned top distinctions in Physics and Mathematics Olympiads, 100+ competition prizes, and highest marks nationwide in Dhruboparishad Bangladesh.',
    details: [
      'Achieved top distinctions in regional and national Physics & Mathematics Olympiads demonstrating quantitative analytical rigor.',
      'Awarded 100+ prizes across arts, crafts, and creative competitions.',
      'Secured the highest marks nationwide in Dhruboparishad Bangladesh (7th Year).',
    ],
    protocolsOrTags: [
      'Physics Olympiad',
      'Mathematics Olympiad',
      '100+ Competition Prizes',
      'Nationwide Rank #1 (Dhruboparishad)',
    ],
    bioAnimationType: 'receptor-docking',
    bioAnimationLabel: 'High-Affinity Molecular Recognition & Signal Transduction',
    bioMetric: '100+ Distinctions · Nationwide Top Marks',
  },
  {
    id: 'tl-mentorship-2021',
    yearLabel: '2021 – Present',
    category: 'academic',
    categoryName: 'STEM Mentorship & EdTech',
    title: 'Teaching, Mentorship & Gamified E-Learning Specialist',
    organization: 'Private Academic Institutions',
    location: 'Dhaka, Bangladesh',
    summary:
      'Delivering student-centered English-version science curricula, gamified digital learning modules, and science fair mentorship.',
    details: [
      'Delivered comprehensive English-version Biology, Chemistry, Physics, and Mathematics curricula.',
      'Created gamified e-learning content and mentored students in experimental science fair projects.',
      'Commended for teaching dedication, knowledge transfer, and compelling educational materials.',
    ],
    protocolsOrTags: [
      'English-Version Curricula',
      'Gamified E-Learning',
      'Science Fair Mentorship',
      'Project Management',
    ],
    bioAnimationType: 'cell-growth',
    bioAnimationLabel: 'Mitotic Cell Cycle & Clonal Colony Expansion (G1 → S → M Phase)',
    bioMetric: 'Doubling Time: 24.0 h · Confluency: 92%',
  },
  {
    id: 'tl-ai-biotech-2023',
    yearLabel: '2023 – Present',
    category: 'innovation',
    categoryName: 'Biotech AI & Web Engineering',
    title: 'Freelance Web Developer & AI Biomedical Application Architect',
    organization: 'Independent Software & Biotech R&D',
    location: 'Dhaka, Bangladesh (Remote)',
    summary:
      'Building deployed client web applications and developing an AI-driven biotechnology platform to streamline biomedical processes.',
    details: [
      'Engineered custom AI agent pipelines for automated scientific data processing, anomaly detection, and laboratory reporting.',
      'Developed full-stack responsive web applications addressing real-world operational challenges for clients.',
      'Designed scientific UI elements, educational multimedia, and AI-assisted animated visual explanations.',
    ],
    protocolsOrTags: [
      'AI-Driven Biotech App',
      'Custom AI Agents',
      'Full-Stack Web Dev',
      'Scientific UI Design',
    ],
    bioAnimationType: 'protein-folding',
    bioAnimationLabel: 'In-Silico Alpha-Helix & Beta-Sheet Folding Prediction',
    bioMetric: 'pLDDT Confidence: 94.2 · Folding Converged',
  },
];

interface InteractiveBiotechTimelineProps {
  isDark: boolean;
}

export const InteractiveBiotechTimeline: React.FC<
  InteractiveBiotechTimelineProps
> = ({ isDark }) => {
  const [filter, setFilter] = useState<'all' | 'clinical' | 'academic' | 'innovation'>('all');
  const [activeId, setActiveId] = useState<string>(UNIFIED_TIMELINE[0].id);
  const [foldProgress, setFoldProgress] = useState<number>(0.85);
  const [isAutoAnimating, setIsAutoAnimating] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const visibleMilestones =
    filter === 'all'
      ? UNIFIED_TIMELINE
      : UNIFIED_TIMELINE.filter((m) => m.category === filter);

  const activeMilestone =
    UNIFIED_TIMELINE.find((m) => m.id === activeId) || UNIFIED_TIMELINE[0];

  // Scroll-triggered IntersectionObserver: automatically activates the milestone in view and triggers its biotech animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-milestone-id');
            if (id) {
              setActiveId(id);
            }
          }
        });
      },
      {
        rootMargin: '-25% 0px -35% 0px',
        threshold: 0.25,
      }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filter]);

  // Interactive Canvas rendering Protein Folding, Mitotic Cell Growth, or Antibody-Antigen Docking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let clock = 0;

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

      if (isAutoAnimating) {
        clock += 0.018;
      }

      // Subtle laboratory coordinate grid
      ctx.strokeStyle = isDark
        ? 'rgba(30, 41, 59, 0.5)'
        : 'rgba(226, 232, 240, 0.75)';
      ctx.lineWidth = 1;
      for (let gx = 32; gx < width; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 32; gy < height; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Effective progress combines manual scrubber with gentle breathing wave
      const dynamicMorph = isAutoAnimating
        ? Math.max(
            0.15,
            Math.min(1, foldProgress * (0.82 + Math.sin(clock) * 0.18))
          )
        : foldProgress;

      const cx = width * 0.5;
      const cy = height * 0.5;

      if (activeMilestone.bioAnimationType === 'protein-folding') {
        // PROTEIN FOLDING SIMULATION:
        // Unfolded linear polypeptide chain (dynamicMorph = 0) -> Folded compact tertiary alpha-helix / beta-core (dynamicMorph = 1)
        const residueCount = 28;
        const residues: { x: number; y: number; hydrophobic: boolean }[] = [];

        for (let i = 0; i < residueCount; i++) {
          const norm = i / (residueCount - 1);
          // Unfolded state: extended wavy chain across canvas
          const unfoldedX = 36 + norm * (width - 72);
          const unfoldedY =
            cy + Math.sin(norm * Math.PI * 3 + clock) * 26;

          // Folded tertiary state: compact multi-loop globular domain around center
          const loopAngle = norm * Math.PI * 5.5 + clock * 0.35;
          const coreRadius =
            22 +
            Math.sin(norm * Math.PI * 3) * 38 +
            (i % 2 === 0 ? 8 : -8);
          const foldedX = cx + Math.cos(loopAngle) * coreRadius;
          const foldedY = cy + Math.sin(loopAngle) * coreRadius * 0.85;

          const x = unfoldedX * (1 - dynamicMorph) + foldedX * dynamicMorph;
          const y = unfoldedY * (1 - dynamicMorph) + foldedY * dynamicMorph;
          residues.push({ x, y, hydrophobic: i % 3 === 0 });
        }

        // Draw stabilizing intramolecular hydrogen/disulfide bonds when folded
        if (dynamicMorph > 0.35) {
          for (let i = 0; i < residues.length; i++) {
            for (let j = i + 4; j < residues.length; j++) {
              const dist = Math.hypot(
                residues[j].x - residues[i].x,
                residues[j].y - residues[i].y
              );
              if (dist < 54) {
                ctx.beginPath();
                ctx.moveTo(residues[i].x, residues[i].y);
                ctx.lineTo(residues[j].x, residues[j].y);
                ctx.strokeStyle = isDark
                  ? `rgba(245, 158, 11, ${(dynamicMorph - 0.3) * 0.65})`
                  : `rgba(217, 119, 6, ${(dynamicMorph - 0.3) * 0.6})`;
                ctx.setLineDash([3, 3]);
                ctx.lineWidth = 1.3;
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }
          }
        }

        // Draw polypeptide backbone spline
        ctx.beginPath();
        ctx.moveTo(residues[0].x, residues[0].y);
        for (let i = 1; i < residues.length - 1; i++) {
          const mx = (residues[i].x + residues[i + 1].x) * 0.5;
          const my = (residues[i].y + residues[i + 1].y) * 0.5;
          ctx.quadraticCurveTo(residues[i].x, residues[i].y, mx, my);
        }
        ctx.lineTo(
          residues[residues.length - 1].x,
          residues[residues.length - 1].y
        );
        ctx.strokeStyle = isDark ? '#22D3EE' : '#0284C7';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw amino acid residue spheres
        residues.forEach((r, idx) => {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.hydrophobic ? 5.2 : 3.8, 0, Math.PI * 2);
          ctx.fillStyle = r.hydrophobic
            ? '#10B981'
            : isDark
            ? '#06B6D4'
            : '#0284C7';
          ctx.fill();
          if (idx === 0 || idx === residues.length - 1) {
            ctx.font = '600 9px "JetBrains Mono", monospace';
            ctx.fillStyle = isDark ? '#E2E8F0' : '#1E293B';
            ctx.fillText(idx === 0 ? 'N-TERM' : 'C-TERM', r.x - 16, r.y - 9);
          }
        });
      } else if (activeMilestone.bioAnimationType === 'cell-growth') {
        // MITOTIC CELL GROWTH & CLONAL EXPANSION SIMULATION:
        // Shows a progenitor stem cell undergoing cytokinesis and expanding into a thriving multicellular cluster
        const daughterCells = [
          { angle: 0, maxDist: 0, scale: 1.0 },
          { angle: 0.4, maxDist: 48, scale: 0.82 },
          { angle: 2.5, maxDist: 52, scale: 0.85 },
          { angle: 4.4, maxDist: 46, scale: 0.78 },
          { angle: 1.4, maxDist: 72, scale: 0.68 },
          { angle: 3.5, maxDist: 70, scale: 0.72 },
          { angle: 5.4, maxDist: 68, scale: 0.66 },
        ];

        daughterCells.forEach((cell, idx) => {
          const threshold = idx * 0.12;
          const localGrowth = Math.max(
            0,
            Math.min(1, (dynamicMorph - threshold) / (1 - threshold))
          );
          if (localGrowth <= 0.02) return;

          const curAngle = cell.angle + clock * 0.25;
          const dist = cell.maxDist * localGrowth;
          const x = cx + Math.cos(curAngle) * dist;
          const y = cy + Math.sin(curAngle) * dist * 0.82;
          const radius = 28 * cell.scale * (0.4 + localGrowth * 0.6);

          // Organic membrane harmonic contour
          ctx.beginPath();
          const segs = 24;
          for (let s = 0; s <= segs; s++) {
            const th = (s / segs) * Math.PI * 2;
            const r =
              radius * (1 + Math.sin(th * 3 + clock * 2 + idx) * 0.06);
            const px = x + Math.cos(th) * r;
            const py = y + Math.sin(th) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = isDark
            ? 'rgba(16, 185, 129, 0.14)'
            : 'rgba(13, 148, 136, 0.12)';
          ctx.fill();
          ctx.strokeStyle = isDark ? '#10B981' : '#0D9488';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // Nucleus
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.36, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? 'rgba(6, 182, 212, 0.45)'
            : 'rgba(2, 132, 199, 0.38)';
          ctx.fill();
        });
      } else {
        // ANTIBODY-ANTIGEN / EPIDEMIOLOGICAL RECEPTOR DOCKING:
        // Visualizes viral envelope glycoprotein (DENV NS1/E-dimer) neutralized by Y-shaped IgG antibodies
        const antigenRadius = 32;
        ctx.beginPath();
        ctx.arc(cx, cy, antigenRadius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? 'rgba(244, 63, 94, 0.18)'
          : 'rgba(225, 29, 72, 0.14)';
        ctx.fill();
        ctx.strokeStyle = '#F43F5E';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw surface epitopes on viral capsid
        for (let e = 0; e < 8; e++) {
          const ang = (e / 8) * Math.PI * 2 + clock * 0.3;
          const ex = cx + Math.cos(ang) * (antigenRadius + 6);
          const ey = cy + Math.sin(ang) * (antigenRadius + 6);
          ctx.beginPath();
          ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#F43F5E';
          ctx.fill();

          // Draw Y-shaped neutralizing IgG antibodies docking onto epitopes as dynamicMorph -> 1
          if (e % 2 === 0) {
            const dockDist =
              antigenRadius + 14 + (1 - dynamicMorph) * 58;
            const abX = cx + Math.cos(ang) * dockDist;
            const abY = cy + Math.sin(ang) * dockDist;
            const stemX = cx + Math.cos(ang) * (dockDist + 22);
            const stemY = cy + Math.sin(ang) * (dockDist + 22);

            ctx.beginPath();
            ctx.moveTo(stemX, stemY);
            ctx.lineTo(abX, abY);
            // Fab arms
            ctx.moveTo(abX, abY);
            ctx.lineTo(
              abX + Math.cos(ang + 0.5) * -12,
              abY + Math.sin(ang + 0.5) * -12
            );
            ctx.moveTo(abX, abY);
            ctx.lineTo(
              abX + Math.cos(ang - 0.5) * -12,
              abY + Math.sin(ang - 0.5) * -12
            );
            ctx.strokeStyle = isDark ? '#22D3EE' : '#0284C7';
            ctx.lineWidth = 2.4;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeMilestone, foldProgress, isAutoAnimating, isDark]);

  return (
    <div className="space-y-8">
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          SCROLL OR CLICK ANY MILESTONE TO TRIGGER BIOMOLECULAR CONFORMATION
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/75 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800">
          {[
            { id: 'all', label: 'Full Timeline (7)' },
            { id: 'clinical', label: 'Clinical Oncology (NICRH)' },
            { id: 'academic', label: 'Education & Mentorship' },
            { id: 'innovation', label: 'AI, Tech & Olympiads' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setFilter(
                  tab.id as 'all' | 'clinical' | 'academic' | 'innovation'
                )
              }
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Left Scrollable Interactive Timeline + Right Sticky Biomolecular Morphogenesis Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Chronological Timeline Nodes */}
        <div className="lg:col-span-7 relative space-y-6">
          {/* Continuous Vertical Hairline Spine */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute left-4 top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800"
          />

          {visibleMilestones.map((item, idx) => {
            const isSelected = activeMilestone.id === item.id;
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
                data-milestone-id={item.id}
                onClick={() => setActiveId(item.id)}
                className="relative sm:pl-12 cursor-pointer group"
              >
                {/* Timeline Spine Node Marker */}
                <div
                  aria-hidden="true"
                  className={`hidden sm:flex absolute left-1.5 top-6 w-5 h-5 rounded-full items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-white'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-cyan-500'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold">
                    {idx + 1}
                  </span>
                </div>

                {/* Milestone Card (3D Parallax Tilt + Cursor Spotlight) */}
                <InteractiveCard
                  as="article"
                  tiltIntensity={5.5}
                  className={`rounded-2xl border p-6 transition-colors ${
                    isSelected
                      ? 'border-cyan-500/80 dark:border-cyan-400/80 bg-white dark:bg-[#0B101B] shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-[#0B101B]/80 hover:border-cyan-500/50'
                  }`}
                >
                  {/* Clean Unboxed Metadata Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                        {item.yearLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{item.categoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.location}</span>
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      {isSelected ? '● Active Simulation' : 'Select Node'}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.organization}
                  </p>

                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {item.summary}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.details.map((d, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0">
                          0{dIdx + 1}.
                        </span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Unboxed Protocol & Competency Metadata Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      Key Protocols:
                    </span>
                    {item.protocolsOrTags.map((tag, tIdx) => (
                      <React.Fragment key={tag}>
                        <span>{tag}</span>
                        {tIdx < item.protocolsOrTags.length - 1 && (
                          <span aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </InteractiveCard>
              </div>
            );
          })}
        </div>

        {/* Right Column: Sticky Biomolecular Morphogenesis Stage (Protein Folding / Cell Growth / Antibody Docking) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                SCROLL-COUPLED BIOMOLECULAR STAGE
              </div>
              <h4 className="text-base font-display font-bold text-slate-900 dark:text-white mt-0.5">
                {activeMilestone.bioAnimationLabel}
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setIsAutoAnimating((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isAutoAnimating ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Manual Scrub</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Auto Kinetic</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Mode Switcher so user can also test all 3 biological phenomena anytime */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveId('tl-nicrh-2025')}
              className={`px-2 py-1.5 rounded transition-colors truncate cursor-pointer ${
                activeMilestone.bioAnimationType === 'protein-folding'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Protein Folding
            </button>
            <button
              type="button"
              onClick={() => setActiveId('tl-mentorship-2021')}
              className={`px-2 py-1.5 rounded transition-colors truncate cursor-pointer ${
                activeMilestone.bioAnimationType === 'cell-growth'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Cell Mitosis
            </button>
            <button
              type="button"
              onClick={() => setActiveId('tl-bsc-2026')}
              className={`px-2 py-1.5 rounded transition-colors truncate cursor-pointer ${
                activeMilestone.bioAnimationType === 'receptor-docking'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              IgG Docking
            </button>
          </div>

          {/* Live Biomolecular Canvas */}
          <div className="relative h-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070B12] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pointer-events-none">
              <span>MILESTONE: {activeMilestone.yearLabel}</span>
              <span>{activeMilestone.bioMetric}</span>
            </div>
          </div>

          {/* Interactive Conformation / Growth Scrubber */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600 dark:text-slate-400">
                {activeMilestone.bioAnimationType === 'protein-folding'
                  ? 'Folding State (Primary Chain → Tertiary Domain)'
                  : activeMilestone.bioAnimationType === 'cell-growth'
                  ? 'Mitotic Expansion (Progenitor → Clonal Colony)'
                  : 'Neutralization Kinetics (Free IgG → Epitope Complex)'}
              </span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                {Math.round(foldProgress * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(foldProgress * 100)}
              onChange={(e) => {
                setIsAutoAnimating(false);
                setFoldProgress(Number(e.target.value) / 100);
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Summary of Academic & Extracurricular Credentials */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              ACADEMIC DEGREES &amp; DISTINCTIONS SUMMARY
            </div>
            <div className="space-y-2">
              {EDUCATION_HISTORY.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-baseline justify-between gap-2 text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {edu.degree} · {edu.institution}
                  </span>
                  <span className="font-mono text-slate-500 shrink-0">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-xs text-slate-600 dark:text-slate-400">
              {EXTRACURRICULAR_HIGHLIGHTS[0].description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
