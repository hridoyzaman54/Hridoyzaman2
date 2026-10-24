import React, { useState } from 'react';
import {
  BIOTECH_COMPETENCIES,
  COMPUTER_IT_SKILLS,
  CompetencyItem,
} from '../data/cvData';
import { InteractiveCard } from './InteractiveCard';

interface CompetencyRadarProps {
  isDark: boolean;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ isDark }) => {
  const [selectedSkill, setSelectedSkill] = useState<CompetencyItem>(
    BIOTECH_COMPETENCIES[0]
  );
  const [domainFilter, setDomainFilter] = useState<
    'all' | 'wet-lab' | 'analytical' | 'quality'
  >('all');

  // Compute 6-axis hexagonal radar polygon coordinates
  const size = 320;
  const center = size / 2;
  const radius = 108;

  const axes = BIOTECH_COMPETENCIES.map((item, idx) => {
    const angle = (Math.PI * 2 * idx) / BIOTECH_COMPETENCIES.length - Math.PI / 2;
    const xOuter = center + Math.cos(angle) * radius;
    const yOuter = center + Math.sin(angle) * radius;
    const valRadius = (item.score / 100) * radius;
    const xVal = center + Math.cos(angle) * valRadius;
    const yVal = center + Math.sin(angle) * valRadius;
    const xLabel = center + Math.cos(angle) * (radius + 32);
    const yLabel = center + Math.sin(angle) * (radius + 22);

    return {
      item,
      angle,
      xOuter,
      yOuter,
      xVal,
      yVal,
      xLabel,
      yLabel,
    };
  });

  const radarPolygonPoints = axes.map((a) => `${a.xVal},${a.yVal}`).join(' ');

  const filteredCompetencies =
    domainFilter === 'all'
      ? BIOTECH_COMPETENCIES
      : BIOTECH_COMPETENCIES.filter((c) => c.domain === domainFilter);

  return (
    <div className="space-y-12">
      {/* Top Split: Hexagonal Radar Calibration + Quantified Biotech Competency Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Polygonal Radar Chart */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              EMPIRICAL PROFICIENCY CALIBRATION
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
              6-Axis Biotech Competency Spider
            </h3>
          </div>

          <div className="my-4 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full max-w-[310px] h-auto overflow-visible"
            >
              {/* Concentric Polygonal Reference Rings (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1].map((scale) => {
                const pts = axes
                  .map((a) => {
                    const rx = center + Math.cos(a.angle) * (radius * scale);
                    const ry = center + Math.sin(a.angle) * (radius * scale);
                    return `${rx},${ry}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={scale}
                    points={pts}
                    fill="none"
                    stroke={isDark ? '#1E293B' : '#E2E8F0'}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Radial Axis Spokes */}
              {axes.map((a) => (
                <line
                  key={a.item.id}
                  x1={center}
                  y1={center}
                  x2={a.xOuter}
                  y2={a.yOuter}
                  stroke={isDark ? '#1E293B' : '#E2E8F0'}
                  strokeWidth={1}
                />
              ))}

              {/* Active Competency Polygon Area */}
              <polygon
                points={radarPolygonPoints}
                fill={
                  isDark
                    ? 'rgba(6, 182, 212, 0.20)'
                    : 'rgba(2, 132, 199, 0.16)'
                }
                stroke={isDark ? '#06B6D4' : '#0284C7'}
                strokeWidth={2.2}
              />

              {/* Interactive Vertex Nodes & Labels */}
              {axes.map((a) => {
                const active = selectedSkill.id === a.item.id;
                return (
                  <g
                    key={a.item.id}
                    onClick={() => setSelectedSkill(a.item)}
                    onMouseEnter={() => setSelectedSkill(a.item)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={a.xVal}
                      cy={a.yVal}
                      r={active ? 6.5 : 4.5}
                      fill={
                        active
                          ? '#F59E0B'
                          : isDark
                          ? '#22D3EE'
                          : '#0284C7'
                      }
                    />
                    <text
                      x={a.xLabel}
                      y={a.yLabel}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`font-mono text-[9.5px] uppercase ${
                        active
                          ? 'fill-cyan-600 dark:fill-cyan-300 font-bold'
                          : 'fill-slate-500 dark:fill-slate-400'
                      }`}
                    >
                      {a.item.shortName} ({a.item.score}%)
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Vertex Detail Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                {selectedSkill.name.toUpperCase()}
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedSkill.score}.0%
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              {selectedSkill.description}
            </p>
          </div>
        </div>

        {/* Right: Quantified Laboratory Competency Matrix */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  WET-LAB &amp; BIOANALYTICAL BENCHMARKS
                </div>
                <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-0.5">
                  Biotech Competencies Breakdown
                </h3>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {[
                  { id: 'all', label: 'All (6)' },
                  { id: 'wet-lab', label: 'Wet-Lab' },
                  { id: 'analytical', label: 'Bio-Analytical' },
                  { id: 'quality', label: 'Biosafety QC' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() =>
                      setDomainFilter(
                        tab.id as 'all' | 'wet-lab' | 'analytical' | 'quality'
                      )
                    }
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      domainFilter === tab.id
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800/80 mt-2">
              {filteredCompetencies.map((comp) => {
                const isSelected = selectedSkill.id === comp.id;
                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedSkill(comp)}
                    onMouseEnter={() => setSelectedSkill(comp)}
                    className={`py-3.5 px-3 -mx-3 rounded-xl transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/5 dark:bg-cyan-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {comp.name}
                      </span>
                      <span className="text-base font-mono font-bold text-cyan-600 dark:text-cyan-400 shrink-0">
                        {comp.score}
                        <span className="text-xs font-mono text-slate-400 ml-0.5">
                          {comp.unit}
                        </span>
                      </span>
                    </div>

                    {/* Calibrated Linear Telemetry Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 mt-2 overflow-hidden">
                      <div
                        style={{ width: `${comp.score}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                      />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">
                      {comp.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>MEAN BIOTECH COMPETENCY INDEX: 89.7%</span>
            <span>VALIDATED: BRACU &amp; NICRH LABS</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Computer, AI & Digital Engineering Skills */}
      <div className="space-y-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
            COMPUTATIONAL, AI &amp; FULL-STACK ENGINEERING
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white mt-0.5">
            Computer, AI Integration &amp; Digital Fluency Stack
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {COMPUTER_IT_SKILLS.map((skill, idx) => (
            <InteractiveCard
              key={skill.id}
              tiltIntensity={7}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-5 hover:border-cyan-500/70 transition-colors cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                    0{idx + 1}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{skill.category}</span>
                </div>
                <h4 className="text-base font-display font-bold text-slate-900 dark:text-white mt-2">
                  {skill.title}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400">
                {skill.tools}
              </div>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </div>
  );
};
