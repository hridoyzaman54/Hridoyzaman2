import React, { useState, useMemo } from 'react';
import { RESEARCH_PROJECTS, ResearchProject } from '../data/cvData';
import { ArrowUpRight, X, Sliders, Play, RotateCcw } from 'lucide-react';
import { InteractiveCard } from './InteractiveCard';

interface InteractiveResearchLabsProps {
  isDark: boolean;
}

const MONTHS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

// Baseline South Asia seasonal dengue incidence per 100,000 (peaks in Aug/Sep monsoon)
const BASELINE_MONSOON_CURVE = [
  14, 11, 16, 28, 64, 145, 310, 480, 520, 390, 195, 62,
];

interface GelLane {
  id: string;
  laneNumber: number;
  label: string;
  sampleCode: string;
  bandsBp: { bp: number; intensity: number; label: string }[];
  clinicalNote: string;
}

const GEL_LANES: GelLane[] = [
  {
    id: 'ladder',
    laneNumber: 1,
    label: '100 bp Molecular Weight Ladder',
    sampleCode: 'M-LADDER',
    bandsBp: [
      { bp: 1500, intensity: 0.95, label: '1500 bp Reference' },
      { bp: 1000, intensity: 1.0, label: '1000 bp High-Intensity' },
      { bp: 700, intensity: 0.8, label: '700 bp Marker' },
      { bp: 500, intensity: 1.0, label: '500 bp High-Intensity' },
      { bp: 300, intensity: 0.8, label: '300 bp Marker' },
      { bp: 100, intensity: 0.75, label: '100 bp Front' },
    ],
    clinicalNote:
      'Calibrated dsDNA size standard (100 bp – 1500 bp) in 1.8% TBE agarose gel stained with ethidium bromide / SYBR Safe.',
  },
  {
    id: 'brca1',
    laneNumber: 2,
    label: 'Oncology Biopsy #A21 — BRCA1 Exon 11',
    sampleCode: 'NICRH-ONC-21',
    bandsBp: [
      { bp: 642, intensity: 0.94, label: '642 bp Target Amplicon' },
      { bp: 220, intensity: 0.65, label: '220 bp ACTB Internal Ctrl' },
    ],
    clinicalNote:
      'Extracted genomic DNA (OD260/280 = 1.86) amplified via 35-cycle endpoint PCR. Clear 642 bp target band with intact beta-actin housekeeping control.',
  },
  {
    id: 'egfr',
    laneNumber: 3,
    label: 'Oncology Biopsy #B09 — EGFR Exon 21',
    sampleCode: 'NICRH-ONC-09',
    bandsBp: [
      { bp: 410, intensity: 0.92, label: '410 bp EGFR Amplicon' },
      { bp: 220, intensity: 0.68, label: '220 bp ACTB Internal Ctrl' },
    ],
    clinicalNote:
      'Clinical specimen processed under NICRH Department of Immunology & Molecular Biology SOPs; verified alongside immunohistochemistry (IHC) staining.',
  },
  {
    id: 'denv-rt',
    laneNumber: 4,
    label: 'Serum Sample #D04 — DENV NS5 RT-PCR',
    sampleCode: 'DENV-SA-04',
    bandsBp: [
      { bp: 290, intensity: 0.96, label: '290 bp DENV-2 Consensus' },
      { bp: 220, intensity: 0.62, label: '220 bp Host RNA Ctrl' },
    ],
    clinicalNote:
      'Viral RNA extracted during acute febrile phase (<5 days onset); reverse-transcribed and amplified targeting conserved 290 bp NS5 region.',
  },
  {
    id: 'ntc',
    laneNumber: 5,
    label: 'No-Template Biosafety Control (NTC)',
    sampleCode: 'QA-NTC-00',
    bandsBp: [],
    clinicalNote:
      'Nuclease-free water negative control verifying zero aerosol or reagent cross-contamination across the PCR master mix batch (95% QC compliance).',
  },
];

export const InteractiveResearchLabs: React.FC<InteractiveResearchLabsProps> = () => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] =
    useState<ResearchProject | null>(null);

  // Interactive Lab Workbench Mode
  const [activeBench, setActiveBench] = useState<'dengue-sim' | 'nicrh-gel'>(
    'dengue-sim'
  );

  // Dengue Epidemiology Simulator States
  const [serotype, setSerotype] = useState<'denv2' | 'denv3' | 'co-circ'>(
    'denv2'
  );
  const [wolbachiaPct, setWolbachiaPct] = useState<number>(45);
  const [rapidTriagePct, setRapidTriagePct] = useState<number>(70);
  const [larvalControlPct, setLarvalControlPct] = useState<number>(55);
  const [hoveredMonthIdx, setHoveredMonthIdx] = useState<number>(8); // SEP peak default

  // NICRH Gel Electrophoresis Simulator States
  const [uvMode, setUvMode] = useState<boolean>(true);
  const [migrationPct, setMigrationPct] = useState<number>(100);
  const [selectedLane, setSelectedLane] = useState<GelLane>(GEL_LANES[1]);

  const filteredProjects = useMemo(() => {
    if (categoryFilter === 'all') return RESEARCH_PROJECTS;
    return RESEARCH_PROJECTS.filter((p) => p.category === categoryFilter);
  }, [categoryFilter]);

  // Calculate Dengue epidemiological curves based on user parameters
  const dengueSimulation = useMemo(() => {
    const serotypeMultiplier =
      serotype === 'denv2' ? 1.0 : serotype === 'denv3' ? 1.12 : 1.24;

    // Combined mitigation efficacy (Wolbachia + Early NS1/PCR Triage + Larval Source Reduction)
    const mitigationFactor = Math.min(
      0.86,
      (wolbachiaPct / 100) * 0.42 +
        (rapidTriagePct / 100) * 0.24 +
        (larvalControlPct / 100) * 0.28
    );

    const baselineSeries = BASELINE_MONSOON_CURVE.map((val) =>
      Math.round(val * serotypeMultiplier)
    );
    const mitigatedSeries = baselineSeries.map((val, idx) => {
      // Monsoon months respond strongly to combined vector + diagnostic triage
      const seasonalWeight = idx >= 4 && idx <= 10 ? 1.05 : 0.85;
      const reduction = Math.min(0.88, mitigationFactor * seasonalWeight);
      return Math.max(4, Math.round(val * (1 - reduction)));
    });

    const baselinePeak = Math.max(...baselineSeries);
    const mitigatedPeak = Math.max(...mitigatedSeries);
    const peakReductionPct = Math.round(
      ((baselinePeak - mitigatedPeak) / baselinePeak) * 100
    );
    const effectiveRt = (
      2.65 *
      serotypeMultiplier *
      (1 - mitigationFactor * 0.78)
    ).toFixed(2);

    return {
      baselineSeries,
      mitigatedSeries,
      baselinePeak,
      mitigatedPeak,
      peakReductionPct,
      effectiveRt,
    };
  }, [serotype, wolbachiaPct, rapidTriagePct, larvalControlPct]);

  const triggerGelRun = () => {
    setMigrationPct(15);
    let current = 15;
    const interval = window.setInterval(() => {
      current += 17;
      if (current >= 100) {
        setMigrationPct(100);
        window.clearInterval(interval);
      } else {
        setMigrationPct(current);
      }
    }, 90);
  };

  return (
    <div className="space-y-12">
      {/* Part 1: Interactive Scientific Workbench (Dengue Simulator + NICRH PCR Gel Bench) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] overflow-hidden">
        {/* Workbench Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              INTERACTIVE RESEARCH TELEMETRY &amp; WET-LAB SIMULATOR
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
              {activeBench === 'dengue-sim'
                ? 'South Asia Dengue Epidemiology & Mitigation Model (BRACU Thesis)'
                : 'NICRH Clinical PCR Amplification & Agarose Gel Electrophoresis'}
            </h3>
          </div>

          {/* Interactive Workbench Switcher */}
          <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-2 gap-1 p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveBench('dengue-sim')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors text-center cursor-pointer ${
                activeBench === 'dengue-sim'
                  ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              01. Dengue Epidemiology Lab
            </button>
            <button
              type="button"
              onClick={() => setActiveBench('nicrh-gel')}
              className={`px-3 py-1.5 text-xs font-mono rounded-md transition-colors text-center cursor-pointer ${
                activeBench === 'nicrh-gel'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              02. NICRH Gel Electrophoresis
            </button>
          </div>
        </div>

        {/* Bench 1: Dengue Epidemiology Simulator */}
        {activeBench === 'dengue-sim' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Left Parameter Column */}
            <div className="lg:col-span-4 p-5 sm:p-6 space-y-5 bg-slate-50/40 dark:bg-slate-900/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                  <span>INTERVENTION PARAMETERS</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSerotype('denv2');
                    setWolbachiaPct(45);
                    setRapidTriagePct(70);
                    setLarvalControlPct(55);
                  }}
                  className="text-xs font-mono text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer whitespace-nowrap shrink-0"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Serotype Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Circulating Lineage Profile
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-800/90">
                  <button
                    type="button"
                    onClick={() => setSerotype('denv2')}
                    className={`px-2 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      serotype === 'denv2'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    DENV-2
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerotype('denv3')}
                    className={`px-2 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      serotype === 'denv3'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    DENV-3 Shift
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerotype('co-circ')}
                    className={`px-2 py-1.5 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      serotype === 'co-circ'
                        ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ADE Co-Circ
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Wolbachia Aedes Introgression
                    </span>
                    <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                      {wolbachiaPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={85}
                    value={wolbachiaPct}
                    onChange={(e) => setWolbachiaPct(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Early NS1 &amp; RT-PCR Clinical Triage
                    </span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {rapidTriagePct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={95}
                    value={rapidTriagePct}
                    onChange={(e) => setRapidTriagePct(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Monsoon Larval Source Reduction
                    </span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {larvalControlPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={larvalControlPct}
                    onChange={(e) => setLarvalControlPct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Computed Telemetry Readouts */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    EFFECTIVE R_t
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                    {dengueSimulation.effectiveRt}
                    <span className="text-xs font-mono text-slate-400 ml-1">
                      R0
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    PEAK SURGE SUPPRESSION
                  </div>
                  <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    -{dengueSimulation.peakReductionPct}
                    <span className="text-xs font-mono text-slate-400 ml-1">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Dual-Curve Epidemiological Time Series */}
            <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono">
                  <span className="text-rose-500 dark:text-rose-400">
                    --- Unmitigated Monsoon Baseline
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                    ─── Integrated South Asia Mitigation Curve
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  MONTH: {MONTHS[hoveredMonthIdx]} · BASELINE:{' '}
                  {dengueSimulation.baselineSeries[hoveredMonthIdx]} vs
                  MITIGATED: {dengueSimulation.mitigatedSeries[hoveredMonthIdx]}{' '}
                  / 100k
                </div>
              </div>

              {/* SVG Chart with Crosshair Inspection */}
              <div className="relative w-full h-64 sm:h-72 select-none">
                <svg
                  viewBox="0 0 660 240"
                  className="w-full h-full overflow-visible"
                >
                  {/* Horizontal Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((step, i) => {
                    const y = 20 + step * 185;
                    const val = Math.round((1 - step) * 650);
                    return (
                      <g key={i}>
                        <line
                          x1={42}
                          y1={y}
                          x2={640}
                          y2={y}
                          stroke="currentColor"
                          className="text-slate-200 dark:text-slate-800"
                          strokeWidth={1}
                        />
                        <text
                          x={34}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 font-mono text-[10px]"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Baseline Dashed Curve */}
                  <polyline
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="2"
                    strokeDasharray="5 4"
                    points={dengueSimulation.baselineSeries
                      .map((v, idx) => {
                        const x = 48 + (idx / 11) * 584;
                        const y = 205 - (v / 650) * 185;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Mitigated Solid Curve */}
                  <polyline
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="3"
                    points={dengueSimulation.mitigatedSeries
                      .map((v, idx) => {
                        const x = 48 + (idx / 11) * 584;
                        const y = 205 - (v / 650) * 185;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Interactive Month Columns & Data Nodes */}
                  {MONTHS.map((m, idx) => {
                    const x = 48 + (idx / 11) * 584;
                    const baseV = dengueSimulation.baselineSeries[idx];
                    const mitV = dengueSimulation.mitigatedSeries[idx];
                    const yBase = 205 - (baseV / 650) * 185;
                    const yMit = 205 - (mitV / 650) * 185;
                    const isHovered = hoveredMonthIdx === idx;

                    return (
                      <g
                        key={m}
                        onMouseEnter={() => setHoveredMonthIdx(idx)}
                        onClick={() => setHoveredMonthIdx(idx)}
                        className="cursor-pointer"
                      >
                        {isHovered && (
                          <line
                            x1={x}
                            y1={20}
                            x2={x}
                            y2={205}
                            stroke="#06B6D4"
                            strokeWidth={1}
                            strokeDasharray="2 2"
                          />
                        )}
                        <circle
                          cx={x}
                          cy={yBase}
                          r={isHovered ? 5 : 3}
                          fill="#F43F5E"
                        />
                        <circle
                          cx={x}
                          cy={yMit}
                          r={isHovered ? 6 : 4}
                          fill="#06B6D4"
                        />
                        <text
                          x={x}
                          y={226}
                          textAnchor="middle"
                          className={`font-mono text-[10px] ${
                            isHovered
                              ? 'fill-cyan-600 dark:fill-cyan-400 font-bold'
                              : 'fill-slate-400'
                          }`}
                        >
                          {m}
                        </text>
                        {/* Invisible wide hit target for easy hover/tap */}
                        <rect
                          x={x - 24}
                          y={15}
                          width={48}
                          height={215}
                          fill="transparent"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span>
                  Research Context: Final Year B.Sc. Biotechnology Thesis at BRAC
                  University examining monsoon vector surges &amp; diagnostic triage.
                </span>
                <span className="font-mono text-slate-500">
                  Click or hover any month node to inspect incidence delta
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Bench 2: NICRH Gel Electrophoresis Simulator */
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
            {/* Left Lane Inspector & Controls */}
            <div className="lg:col-span-5 p-5 sm:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-900/20">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  AGAROSE GEL LANES (1.8% TBE)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={triggerGelRun}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run 110V Electrophoresis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUvMode((prev) => !prev)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{uvMode ? 'UV 312nm ON' : 'White Light'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {GEL_LANES.map((lane) => {
                  const isSelected = selectedLane.id === lane.id;
                  return (
                    <button
                      key={lane.id}
                      type="button"
                      onClick={() => setSelectedLane(lane)}
                      className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-500/10'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                        <span>
                          LANE 0{lane.laneNumber} · {lane.sampleCode}
                        </span>
                        <span>{lane.bandsBp.length} BANDS</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {lane.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70">
                <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                  DIAGNOSTIC INTERPRETATION · LANE 0{selectedLane.laneNumber}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {selectedLane.clinicalNote}
                </p>
              </div>
            </div>

            {/* Right Interactive UV Transilluminator Gel Chamber */}
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
                <span>
                  CHAMBER: NICRH MOLECULAR DIAGNOSTICS · CATHODE (−) → ANODE (+)
                </span>
                <span>MIGRATION: {migrationPct}%</span>
              </div>

              <div
                className={`relative flex-1 min-h-[280px] rounded-xl border p-4 transition-colors duration-300 ${
                  uvMode
                    ? 'bg-[#070B14] border-cyan-500/40 text-slate-200'
                    : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {/* Reference Base-Pair Scale on Left */}
                <div className="grid grid-cols-6 gap-3 h-full">
                  <div className="col-span-1 flex flex-col justify-between py-6 text-[11px] font-mono opacity-75 border-r border-slate-700/40 pr-2">
                    <span>1500 bp</span>
                    <span>1000 bp</span>
                    <span>700 bp</span>
                    <span>500 bp</span>
                    <span>300 bp</span>
                    <span>100 bp</span>
                  </div>

                  {/* 5 Electrophoresis Lanes */}
                  {GEL_LANES.map((lane) => {
                    const isSelected = selectedLane.id === lane.id;
                    return (
                      <div
                        key={lane.id}
                        onClick={() => setSelectedLane(lane)}
                        className={`col-span-1 relative rounded-lg border transition-colors cursor-pointer px-1.5 py-2 ${
                          isSelected
                            ? uvMode
                              ? 'border-cyan-400/70 bg-cyan-950/25'
                              : 'border-cyan-600 bg-cyan-500/10'
                            : uvMode
                            ? 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                            : 'border-slate-300/80 bg-white/60'
                        }`}
                      >
                        {/* Loading Well at Top */}
                        <div className="w-4/5 mx-auto h-2 rounded-xs bg-slate-700/70 mb-1" />
                        <div className="text-center text-[10px] font-mono opacity-75">
                          L{lane.laneNumber}
                        </div>

                        {/* Migrated DNA Amplicon Bands */}
                        {lane.bandsBp.map((band, bIdx) => {
                          // Smaller bp migrates further down the agarose gel
                          const normPos =
                            1 - Math.log(band.bp / 85) / Math.log(1700 / 85);
                          const topPercent =
                            14 + normPos * 76 * (migrationPct / 100);

                          return (
                            <div
                              key={bIdx}
                              style={{ top: `${topPercent}%` }}
                              title={`${band.label}`}
                              className={`absolute left-2 right-2 h-2 rounded-full transition-all duration-150 ${
                                uvMode
                                  ? lane.id === 'ladder'
                                    ? 'bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.85)]'
                                    : 'bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.9)]'
                                  : 'bg-indigo-700'
                              }`}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span>
                  Selected Bands:{' '}
                  {selectedLane.bandsBp.length > 0
                    ? selectedLane.bandsBp.map((b) => b.label).join(' · ')
                    : 'No amplicon bands (Clean Negative Control)'}
                </span>
                <span className="font-mono text-slate-500">
                  Click any lane or press &ldquo;Run 110V Electrophoresis&rdquo;
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part 2: Filterable Research & Engineering Portfolio Bento Cards */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              EMPIRICAL RESEARCH &amp; APPLIED BIOTECH SYSTEMS
            </p>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
              Selected Research &amp; Technical Case Studies
            </h3>
          </div>

          {/* Interactive Filter Controls (Functional Buttons) */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-200/75 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 max-w-full overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Work (4)' },
              { id: 'epidemiology', label: 'Epidemiology' },
              { id: 'diagnostics', label: 'Clinical Lab' },
              { id: 'biotech-ai', label: 'Biotech & AI' },
              { id: 'education', label: 'STEM EdTech' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategoryFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  categoryFilter === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <InteractiveCard
              key={project.id}
              as="article"
              tiltIntensity={7}
              onClick={() => setActiveModalProject(project)}
              className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 hover:border-cyan-500/70 dark:hover:border-cyan-400/70 shadow-xs hover:shadow-md transition-colors cursor-pointer"
            >
              <div>
                {/* Unboxed Clean Metadata Header (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                      {project.code}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{project.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.period}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    <span>Inspect Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                <h4 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h4>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  {project.institution}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {project.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-3 gap-3">
                  {project.metrics.map((m, idx) => (
                    <div key={idx}>
                      <div className="text-[10px] font-mono uppercase text-slate-400">
                        {m.label}
                      </div>
                      <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                        {m.value}{' '}
                        <span className="text-[10px] font-normal text-slate-400">
                          {m.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>

      {/* Fullscreen / Modal Case Study Monograph Viewer */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-xs"
          onClick={() => setActiveModalProject(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 dark:text-cyan-400">
                  <span>{activeModalProject.code}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalProject.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalProject.period}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
                  {activeModalProject.title}
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  {activeModalProject.institution}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalProject(null)}
                aria-label="Close case study modal"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-6">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  01. EXECUTIVE ABSTRACT
                </h4>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  {activeModalProject.summary}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  02. EXPERIMENTAL &amp; TECHNICAL METHODOLOGY
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {activeModalProject.methodology.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">
                        0{i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  03. KEY FINDINGS &amp; REAL-WORLD IMPACT
                </h4>
                <ul className="mt-2 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {activeModalProject.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ✓
                      </span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
                <span>REFERENCE OLIGO TAG: {activeModalProject.sequenceTag}</span>
                <button
                  type="button"
                  onClick={() => setActiveModalProject(null)}
                  className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-sans font-medium cursor-pointer"
                >
                  Close Monograph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
