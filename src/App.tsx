/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PROFILE_DATA,
  EXTRACURRICULAR_HIGHLIGHTS,
  SOFT_SKILLS_LIST,
  CLINICAL_REFERENCES,
} from './data/cvData';
import {
  CellularBackground,
  MicroscopyMode,
} from './components/CellularBackground';
import {
  DnaSectionMorphBridge,
  DnaNavigationOverlay,
} from './components/DnaSectionTransition';
import { HeroDnaCanvas } from './components/HeroDnaCanvas';
import { InteractiveResearchLabs } from './components/InteractiveResearchLabs';
import { InteractiveBiotechTimeline } from './components/InteractiveBiotechTimeline';
import { CompetencyRadar } from './components/CompetencyRadar';
import { InteractiveCard } from './components/InteractiveCard';
import {
  Sun,
  Moon,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  Smartphone,
  MapPin,
  Globe,
  Menu,
  X,
  Check,
  Copy,
  Download,
} from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [microscopyMode, setMicroscopyMode] =
    useState<MicroscopyMode>('fluorescence');
  const [cellsPaused, setCellsPaused] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Interactive Hero Mouse-Movement Parallax & Spotlight State
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [heroMouse, setHeroMouse] = useState<{
    x: number;
    y: number;
    normX: number;
    normY: number;
    active: boolean;
  }>({
    x: 400,
    y: 260,
    normX: 0,
    normY: 0,
    active: false,
  });

  // Scroll Parallax State
  const [scrollY, setScrollY] = useState<number>(0);

  // Interactive Contact Inquiry State
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquiryTopic, setInquiryTopic] = useState<string>(
    'Biotech Research Collaboration'
  );
  const [inquiryMessage, setInquiryMessage] = useState<string>('');
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);

  // Active DNA Helix Navigation Morph Overlay State
  const [activeNavTransition, setActiveNavTransition] = useState<{
    targetId: string;
    label: string;
    sequence: string;
  } | null>(null);

  // Sync dark mode class with <html> element for Tailwind v4 @custom-variant dark
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Track window scroll for subtle parallax depth
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = heroSectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;
    setHeroMouse({ x, y, normX, normY, active: true });
  };

  const handleHeroMouseLeave = () => {
    setHeroMouse((prev) => ({ ...prev, active: false, normX: 0, normY: 0 }));
  };

  const triggerSectionMorph = useCallback(
    (targetId: string, label: string, sequence: string) => {
      setMobileMenuOpen(false);
      setActiveNavTransition({ targetId, label, sequence });
    },
    []
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopiedEmail(true);
    window.setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryEmail.trim()) return;
    setInquirySubmitted(true);
  };

  return (
    <div
      className={`min-h-screen relative w-full max-w-full overflow-x-hidden transition-colors duration-300 ${
        isDark
          ? 'dark bg-[#07090E] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Interactive Cellular & Molecular Parallax Background Canvas */}
      <CellularBackground
        isDark={isDark}
        microscopyMode={microscopyMode}
        isPaused={cellsPaused}
        cellCount={26}
      />

      {/* Full-Viewport DNA Helix Navigation Morph Overlay */}
      <DnaNavigationOverlay
        activeTransition={activeNavTransition}
        isDark={isDark}
        onComplete={() => setActiveNavTransition(null)}
      />

      {/* Sticky Top Menu Header with Light/Dark Toggle & View CV */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/85 dark:bg-[#07090E]/85 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              triggerSectionMorph('home', 'Home & DNA Stage', "5'-ATG-START-3'");
            }}
            className="text-lg font-display font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            Hridoy Zaman
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a
              href="#research"
              onClick={(e) => {
                e.preventDefault();
                triggerSectionMorph(
                  'research',
                  '01. Research & Molecular Diagnostics',
                  "5'-DENV-NS5-PCR-3'"
                );
              }}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Research
            </a>
            <a
              href="#timeline"
              onClick={(e) => {
                e.preventDefault();
                triggerSectionMorph(
                  'timeline',
                  '02. Experience & Timeline',
                  "5'-NICRH-ONC-IHC-3'"
                );
              }}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Experience
            </a>
            <a
              href="#competencies"
              onClick={(e) => {
                e.preventDefault();
                triggerSectionMorph(
                  'competencies',
                  '03. Competencies & AI Stack',
                  "5'-BIOINFO-AI-92-3'"
                );
              }}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Competencies
            </a>
            <a
              href="#references"
              onClick={(e) => {
                e.preventDefault();
                triggerSectionMorph(
                  'references',
                  '04. Distinctions & References',
                  "5'-REF-CLINICAL-3'"
                );
              }}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              References
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                triggerSectionMorph(
                  'contact',
                  '05. Contact & Collaboration',
                  "5'-SYNTHESIS-END-3'"
                );
              }}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Light/Dark Theme Toggle + View CV Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Sticky Top Menu Light/Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={
                isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              }
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-cyan-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Primary View CV Button (clean label without "(New Tab)") */}
            <a
              href={PROFILE_DATA.cvPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 sm:px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>View CV</span>
              <ExternalLink className="w-3 h-3 hidden xs:inline" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] px-4 py-4 space-y-2">
            {[
              {
                id: 'research',
                label: '01. Research & Molecular Labs',
                seq: "5'-DENV-NS5-3'",
              },
              {
                id: 'timeline',
                label: '02. Experience & Timeline',
                seq: "5'-NICRH-IHC-3'",
              },
              {
                id: 'competencies',
                label: '03. Competencies & AI Stack',
                seq: "5'-BIOINFO-AI-3'",
              },
              {
                id: 'references',
                label: '04. Distinctions & References',
                seq: "5'-REF-CLINIC-3'",
              },
              {
                id: 'contact',
                label: '05. Contact & Collaboration',
                seq: "5'-CONTACT-3'",
              },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  triggerSectionMorph(item.id, item.label, item.seq)
                }
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Top Laboratory Telemetry & Cellular Optics Ribbon */}
      <div className="relative z-20 border-b border-slate-200 dark:border-slate-800/90 bg-slate-100/85 dark:bg-[#0B101B]/85">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center sm:justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
              ● INTERACTIVE BIO-FIELD ACTIVE
            </span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">MOVE CURSOR OR CLICK TO PULSE CELLS</span>
            <span aria-hidden="true" className="hidden md:inline">
              ·
            </span>
            <span className="hidden md:inline">
              NICRH IMMUNOLOGY &amp; MOLECULAR BIOLOGY
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 max-w-full overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 border border-slate-300/70 dark:border-slate-700 text-[11px] font-mono whitespace-nowrap">
              <button
                type="button"
                onClick={() => {
                  setCellsPaused(false);
                  setMicroscopyMode('fluorescence');
                }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !cellsPaused && microscopyMode === 'fluorescence'
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                GFP Cells
              </button>
              <button
                type="button"
                onClick={() => {
                  setCellsPaused(false);
                  setMicroscopyMode('phase-contrast');
                }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !cellsPaused && microscopyMode === 'phase-contrast'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Phase Contrast
              </button>
              <button
                type="button"
                onClick={() => {
                  setCellsPaused(false);
                  setMicroscopyMode('ihc-stain');
                }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !cellsPaused && microscopyMode === 'ihc-stain'
                    ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                IHC Stain
              </button>
              <button
                type="button"
                onClick={() => setCellsPaused((prev) => !prev)}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  cellsPaused
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {cellsPaused ? 'Cells Paused' : 'Pause'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10">
        {/* HERO SECTION (#home) WITH INTERACTIVE MOUSE PARALLAX & SPOTLIGHT FIELD */}
        <section
          id="home"
          ref={heroSectionRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="relative overflow-hidden"
        >
          {/* Interactive Cursor-Tracking Hero Bioluminescent Field & Parallax Grid */}
          <div
            aria-hidden="true"
            style={{
              background: heroMouse.active
                ? `radial-gradient(620px circle at ${heroMouse.x}px ${heroMouse.y}px, ${
                    isDark
                      ? 'rgba(6, 182, 212, 0.13)'
                      : 'rgba(2, 132, 199, 0.09)'
                  }, transparent 70%)`
                : 'none',
            }}
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          />

          {/* Interactive Parallax Molecular Coordinate Rings in Hero Background */}
          <div
            aria-hidden="true"
            style={{
              transform: `translate3d(${heroMouse.normX * -26}px, ${
                heroMouse.normY * -26 + scrollY * 0.12
              }px, 0)`,
              transition: 'transform 140ms ease-out',
            }}
            className="hidden sm:block pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full border border-cyan-500/10 dark:border-cyan-400/10 z-0"
          />
          <div
            aria-hidden="true"
            style={{
              transform: `translate3d(${heroMouse.normX * 34}px, ${
                heroMouse.normY * 34 - scrollY * 0.08
              }px, 0)`,
              transition: 'transform 140ms ease-out',
            }}
            className="hidden sm:block pointer-events-none absolute bottom-4 right-1/3 w-[380px] h-[380px] rounded-full border border-emerald-500/10 dark:border-emerald-400/10 z-0"
          />

          <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16">
            {/* Full-Width Hero Split: Left Wide Info & Credentials (8 cols) + Right Larger Interactive Portrait (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Wide Typographic Hierarchy, Interactive Credentials & Primary Actions */}
              <div
                style={{
                  transform: `translate3d(${heroMouse.normX * 6}px, ${
                    heroMouse.normY * 6
                  }px, 0)`,
                  transition: 'transform 160ms ease-out',
                }}
                className="lg:col-span-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-5">
                  {/* Clean Unboxed Metadata Kicker */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    {PROFILE_DATA.pillars.map((pillar, i) => (
                      <React.Fragment key={pillar}>
                        <span className="hover:text-emerald-500 transition-colors cursor-default">
                          {pillar}
                        </span>
                        {i < PROFILE_DATA.pillars.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="text-slate-400 dark:text-slate-600"
                          >
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Wide Display Headline */}
                  <h1
                    style={{ textWrap: 'balance' }}
                    className="text-4xl sm:text-5xl lg:text-[56px] font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]"
                  >
                    Bridging Molecular Science with AI-Driven Biotechnology.
                  </h1>

                  {/* Wide Mission Lead Copy from CV */}
                  <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {PROFILE_DATA.missionStatement}
                  </p>

                  {/* Interactive Institutional Credentials Cards (DEGREE, CLINICAL LAB, THESIS) */}
                  <div className="pt-2 grid grid-cols-1 gap-3">
                    {[
                      {
                        tag: 'DEGREE',
                        text: 'B.Sc. in Biotechnology · BRAC University (2026)',
                        target: 'timeline',
                        seq: "5'-BRACU-2026-3'",
                      },
                      {
                        tag: 'CLINICAL LAB',
                        text: 'National Institute of Cancer Research and Hospital (NICRH) — Immunology & Molecular Biology',
                        target: 'research',
                        seq: "5'-NICRH-PCR-3'",
                      },
                      {
                        tag: 'THESIS',
                        text: 'Dengue Epidemiology, Challenges & Mitigation Strategies in South Asia',
                        target: 'research',
                        seq: "5'-DENV-SA-3'",
                      },
                    ].map((cred) => (
                      <button
                        key={cred.tag}
                        type="button"
                        onClick={() =>
                          triggerSectionMorph(cred.target, cred.text, cred.seq)
                        }
                        className="group text-left p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-[#0B101B]/80 hover:border-cyan-500/60 dark:hover:border-cyan-400/60 hover:translate-x-1 transition-all flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                          <span className="font-mono text-xs uppercase text-cyan-600 dark:text-cyan-400 font-semibold">
                            {cred.tag}:
                          </span>
                          <span className="font-medium">{cred.text}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500 shrink-0 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Bar with View CV and Lab Explorer */}
                <div className="pt-2 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Primary View CV Button */}
                    <a
                      href={PROFILE_DATA.cvPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View CV</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Interactive Research Lab Jump */}
                    <button
                      type="button"
                      onClick={() =>
                        triggerSectionMorph(
                          'research',
                          '01. Research & Molecular Diagnostics',
                          "5'-DENV-NS5-PCR-3'"
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Explore Biotech Labs</span>
                    </button>
                  </div>

                  {/* Direct Contact Metadata Line with Icons */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                    <a
                      href={`mailto:${PROFILE_DATA.email}`}
                      className="inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span>{PROFILE_DATA.email}</span>
                    </a>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <a
                      href={`tel:${PROFILE_DATA.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span>{PROFILE_DATA.phone}</span>
                    </a>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span>{PROFILE_DATA.location}</span>
                    </span>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                    <a
                      href={PROFILE_DATA.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5 shrink-0" />
                      <span>hridoyzaman.vercel.app</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column of Hero (4 cols): Stationary Portrait with Rotating Orbital Genomic Rings */}
              <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
                <div
                  onClick={() =>
                    triggerSectionMorph(
                      'timeline',
                      '02. Experience & Timeline',
                      "5'-HZ-PROFILE-3'"
                    )
                  }
                  title="Hridoy Zaman · Click to explore Experience Timeline"
                  className="relative flex items-center justify-center group cursor-pointer select-none"
                >
                  {/* Ambient Bioluminescent Halo Behind Portrait */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-cyan-500/20 dark:bg-cyan-400/25 blur-3xl scale-95 transition-opacity duration-500"
                  />

                  {/* Larger Portrait & Rotating Dual SVG Genomic Rings */}
                  <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
                    <svg
                      viewBox="0 0 240 240"
                      className="absolute inset-0 w-full h-full pointer-events-none animate-[spin_24s_linear_infinite]"
                    >
                      <circle
                        cx="120"
                        cy="120"
                        r="114"
                        fill="none"
                        stroke={isDark ? '#06B6D4' : '#0284C7'}
                        strokeWidth="1.5"
                        strokeDasharray="14 9 4 9"
                        opacity="0.85"
                      />
                      <circle
                        cx="120"
                        cy="120"
                        r="104"
                        fill="none"
                        stroke={isDark ? '#10B981' : '#0D9488'}
                        strokeWidth="1.2"
                        strokeDasharray="5 11"
                        opacity="0.65"
                      />
                      {[0, 60, 120, 180, 240, 300].map((deg, idx) => {
                        const rad = (deg * Math.PI) / 180;
                        const cx = 120 + Math.cos(rad) * 114;
                        const cy = 120 + Math.sin(rad) * 114;
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r="4.2"
                            fill={idx % 2 === 0 ? '#22D3EE' : '#10B981'}
                          />
                        );
                      })}
                    </svg>

                    {/* Circular Portrait Image (Stationary) */}
                    <div className="relative w-44 h-44 sm:w-60 sm:h-60 lg:w-66 lg:h-66 rounded-full overflow-hidden border-2 border-cyan-500/70 dark:border-cyan-400/80 shadow-2xl bg-slate-200 dark:bg-slate-800">
                      <img
                        src="/assets/aistudio/t-modified_47e40ef4.png"
                        alt="Hridoy Zaman — Biotechnology Researcher & AI Solutions Architect"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Interactive 3D-Tilt KPI Telemetry Strip Below Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {PROFILE_DATA.heroKpis.map((kpi, idx) => (
                <InteractiveCard
                  key={kpi.label}
                  tiltIntensity={8}
                  onClick={() =>
                    triggerSectionMorph(
                      idx < 2 ? 'competencies' : 'timeline',
                      kpi.label,
                      `5'-KPI-0${idx + 1}-3'`
                    )
                  }
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#0B101B]/90 p-5 hover:border-cyan-500/70 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono tracking-wider uppercase text-slate-400">
                    {kpi.label}
                  </div>
                  <div className="mt-1.5 flex items-baseline">
                    <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
                      {kpi.value}
                    </span>
                    <span className="text-xs uppercase font-mono text-slate-400 ml-1.5">
                      {kpi.unit}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    {kpi.delta}
                  </div>
                </InteractiveCard>
              ))}
            </div>

            {/* Full-Width Widened Interactive 3D DNA Double-Helix Stage Positioned Below Hero */}
            <div className="mt-8">
              <HeroDnaCanvas isDark={isDark} />
            </div>
          </div>
        </section>

        {/* DNA HELIX TRANSITION BRIDGE #1: Home -> Research & Molecular Diagnostics */}
        <DnaSectionMorphBridge
          fromSection="00. Genomic Overview"
          toSection="01. Research & Molecular Labs"
          targetId="research"
          sequenceCode="AGTTGTTAGTCTACGTGGACCGACAAAGACAGATTCTTTG"
          locusTag="LOCUS 1p36 · DENV & ONCOLOGY"
          isDark={isDark}
          onTriggerNavMorph={triggerSectionMorph}
        />

        {/* SECTION 01: RESEARCH PROJECTS & INTERACTIVE WET-LAB SIMULATORS */}
        <section
          id="research"
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
        >
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              CHAPTER 01 · EPIDEMIOLOGY, ONCOLOGY DIAGNOSTICS &amp; BIOTECH AI
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-1"
            >
              01. Research Projects &amp; Interactive Laboratory Simulators
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Explore live interactive simulations modeled directly on my BRAC
              University final-year thesis on South Asian Dengue epidemiology
              and my clinical diagnostic internship at the National Institute of
              Cancer Research and Hospital (NICRH).
            </p>
          </div>

          <InteractiveResearchLabs isDark={isDark} />
        </section>

        {/* DNA HELIX TRANSITION BRIDGE #2: Research -> Experience & Timeline */}
        <DnaSectionMorphBridge
          fromSection="01. Research & Molecular Labs"
          toSection="02. Experience & Morphogenesis Timeline"
          targetId="timeline"
          sequenceCode="ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATG"
          locusTag="LOCUS 17q21 · CLINICAL & ACADEMIC"
          isDark={isDark}
          onTriggerNavMorph={triggerSectionMorph}
        />

        {/* SECTION 02: INTERACTIVE TIMELINE WITH SCROLL-COUPLED PROTEIN FOLDING & CELL GROWTH */}
        <section
          id="timeline"
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
        >
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              CHAPTER 02 · CLINICAL INTERNSHIP, TEACHING &amp; EDUCATION
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-1"
            >
              02. Interactive Career Timeline &amp; Biomolecular Morphogenesis
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Scroll through or select any career milestone to trigger real-time
              chaperone-assisted protein folding, mitotic cell division, and
              antibody-antigen docking simulations synchronized with my clinical
              and academic journey.
            </p>
          </div>

          <InteractiveBiotechTimeline isDark={isDark} />
        </section>

        {/* DNA HELIX TRANSITION BRIDGE #3: Timeline -> Competencies & AI Stack */}
        <DnaSectionMorphBridge
          fromSection="02. Experience Timeline"
          toSection="03. Competencies & AI Engineering"
          targetId="competencies"
          sequenceCode="CGTACGTAGCTAGCTAGCTAGCTAGCATCGATCGATCGAT"
          locusTag="LOCUS 7q31 · WET-LAB & AI MATRIX"
          isDark={isDark}
          onTriggerNavMorph={triggerSectionMorph}
        />

        {/* SECTION 03: BIOTECH COMPETENCIES & COMPUTER/IT SKILLS */}
        <section
          id="competencies"
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
        >
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              CHAPTER 03 · EMPIRICAL ASSAY PROFICIENCY &amp; COMPUTATIONAL TOOLS
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-1"
            >
              03. Biotech Competencies &amp; AI Engineering Stack
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Calibrated across wet-lab molecular biology protocols (DNA/RNA
              extraction, PCR, Gel Electrophoresis, Cell Culture, IHC) and
              modern software automation (Web Development, Custom AI Agents, and
              Bioinformatics).
            </p>
          </div>

          <CompetencyRadar isDark={isDark} />
        </section>

        {/* DNA HELIX TRANSITION BRIDGE #4: Competencies -> Distinctions, References & Contact */}
        <DnaSectionMorphBridge
          fromSection="03. Competencies & AI Stack"
          toSection="04. Distinctions, References & Contact"
          targetId="references"
          sequenceCode="GCTAGCTAGCATCGATCGATCGATATGCTAGCTAGCTAGC"
          locusTag="LOCUS 12p13 · CREDENTIALS & CONTACT"
          isDark={isDark}
          onTriggerNavMorph={triggerSectionMorph}
        />

        {/* SECTION 04: EXTRACURRICULARS, SOFT SKILLS, LANGUAGES & CLINICAL REFERENCES */}
        <section
          id="references"
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14"
        >
          <div className="max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              CHAPTER 04 · LEADERSHIP, OLYMPIAD HONOURS &amp; CLINICAL ENDORSEMENTS
            </div>
            <h2
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mt-1"
            >
              04. Extracurricular Distinctions, Attributes &amp; References
            </h2>
          </div>

          {/* 3-Column Interactive Extracurricular & Leadership Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXTRACURRICULAR_HIGHLIGHTS.map((item, idx) => (
              <InteractiveCard
                key={item.id}
                tiltIntensity={7}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 hover:border-cyan-500/70 transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                    0{idx + 1} · {item.meta}
                  </div>
                  <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mt-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </InteractiveCard>
            ))}
          </div>

          {/* Soft Skills, Languages & Clinical References Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Soft Skills & Languages Panel */}
            <InteractiveCard
              tiltIntensity={4}
              className="lg:col-span-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6"
            >
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  COMMUNICATION &amp; PROFESSIONAL ATTRIBUTES
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                  Soft Skills &amp; Linguistic Fluency
                </h3>

                <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
                  {SOFT_SKILLS_LIST.map((skill, index) => (
                    <div
                      key={skill}
                      className="py-2.5 px-2 -mx-2 rounded-lg hover:bg-cyan-500/5 transition-colors flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-700 dark:text-slate-200">
                        {skill}
                      </span>
                      <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                        0{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-mono uppercase text-slate-400">
                    ENGLISH
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    Fluent (C1/C2)
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono uppercase text-slate-400">
                    BENGALI
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                    Native Speaker
                  </div>
                </div>
              </div>
            </InteractiveCard>

            {/* Clinical & Academic References Panel */}
            <InteractiveCard
              tiltIntensity={4}
              className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6"
            >
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  VERIFIED MEDICAL &amp; ACADEMIC ENDORSEMENTS
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mt-1">
                  Professional References
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Senior medical specialists available for verification of
                  research integrity, laboratory conduct, and academic
                  excellence.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                  {CLINICAL_REFERENCES.map((ref) => (
                    <div
                      key={ref.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-slate-50/50 dark:bg-slate-900/40 hover:border-cyan-500/60 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                          {ref.location}
                        </div>
                        <h4 className="text-base font-display font-bold text-slate-900 dark:text-white mt-1">
                          {ref.name}
                        </h4>
                        <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {ref.role}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {ref.institution}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1 text-xs font-mono text-slate-600 dark:text-slate-300">
                        <div>
                          <a
                            href={`mailto:${ref.email}`}
                            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          >
                            {ref.email}
                          </a>
                        </div>
                        <div>
                          <a
                            href={`tel:${ref.phone.replace(/\s+/g, '')}`}
                            className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          >
                            {ref.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Embedded Callout to View/Download Official CV PDF */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    Complete Curriculum Vitae (PDF Document)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Includes full academic transcript details, NICRH internship
                    scope, and reference contact cards.
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <a
                    href={PROFILE_DATA.cvPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>View CV</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={PROFILE_DATA.cvPdfUrl}
                    download="Hridoy_Zaman_CV.pdf"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            </InteractiveCard>
          </div>
        </section>

        {/* SECTION 05: CONTACT & RESEARCH COLLABORATION DISPATCH (#contact) */}
        <section
          id="contact"
          className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6"
        >
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101B] p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Contact Info & Direct Channels */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    CHAPTER 05 · INITIATE COLLABORATION
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
                    Connect for Research, Lab Roles &amp; Biotech AI Projects
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    Available for molecular biology research fellowships,
                    diagnostic laboratory positions, graduate programs, and
                    AI-driven biomedical software collaborations.
                  </p>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <a
                        href={`mailto:${PROFILE_DATA.email}`}
                        className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate hover:underline"
                      >
                        {PROFILE_DATA.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer shrink-0"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:border-cyan-500/50 transition-colors">
                    <Phone className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <a
                      href={`tel:${PROFILE_DATA.phone.replace(/\s+/g, '')}`}
                      className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:underline"
                    >
                      {PROFILE_DATA.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:border-cyan-500/50 transition-colors">
                    <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span className="font-mono text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {PROFILE_DATA.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 hover:border-cyan-500/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <a
                        href={PROFILE_DATA.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs sm:text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        {PROFILE_DATA.website}
                      </a>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Right Direct Inquiry Form */}
              <div className="lg:col-span-7">
                {inquirySubmitted ? (
                  <div className="h-full rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6 flex flex-col justify-center items-start space-y-4">
                    <div className="text-xs font-mono uppercase text-emerald-600 dark:text-emerald-400">
                      ● TRANSMISSION LOGGED
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                      Thank you, {inquiryName}. Your message is ready.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Topic: <strong className="font-mono">{inquiryTopic}</strong>.
                      You can also launch your default mail client directly with
                      this pre-formatted inquiry or reset the form below.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={`mailto:${PROFILE_DATA.email}?subject=${encodeURIComponent(
                          `[${inquiryTopic}] Inquiry from ${inquiryName}`
                        )}&body=${encodeURIComponent(
                          `${inquiryMessage}\n\nFrom: ${inquiryName} (${inquiryEmail})`
                        )}`}
                        className="px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                      >
                        Open in Mail Client
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setInquirySubmitted(false);
                          setInquiryName('');
                          setInquiryEmail('');
                          setInquiryMessage('');
                        }}
                        className="px-4 py-2 text-xs font-mono rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="inq-name"
                          className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5"
                        >
                          Your Name / Institution
                        </label>
                        <input
                          id="inq-name"
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="Dr. / Researcher / Recruiter"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="inq-email"
                          className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="inq-email"
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="name@institution.org"
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="inq-topic"
                        className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5"
                      >
                        Collaboration Domain
                      </label>
                      <select
                        id="inq-topic"
                        value={inquiryTopic}
                        onChange={(e) => setInquiryTopic(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Biotech Research Collaboration">
                          Biotech Research &amp; Epidemiology Collaboration
                        </option>
                        <option value="Molecular Diagnostics & Lab Role">
                          Molecular Diagnostics &amp; Wet-Lab Opportunity
                        </option>
                        <option value="AI Biomedical Software Project">
                          AI-Driven Biomedical Software / Web Development
                        </option>
                        <option value="STEM Mentorship & Educational Media">
                          STEM Mentorship &amp; Scientific Visualization
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="inq-msg"
                        className="block text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mb-1.5"
                      >
                        Message or Research Brief
                      </label>
                      <textarea
                        id="inq-msg"
                        rows={4}
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Share details regarding research positions, laboratory collaboration, or biotech software projects..."
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-xs font-mono text-slate-500">
                        Direct response via {PROFILE_DATA.email}
                      </span>
                      <button
                        type="submit"
                        className="px-5 py-2.5 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400 rounded-xl transition-colors cursor-pointer"
                      >
                        Prepare Inquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#07090E]/90 py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 text-center sm:text-left">
            <span className="font-display font-bold text-slate-900 dark:text-white">
              Hridoy Zaman
            </span>
            <span aria-hidden="true">·</span>
            <span>B.Sc. in Biotechnology, BRAC University</span>
            <span aria-hidden="true">·</span>
            <span>Dhaka, Bangladesh</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={PROFILE_DATA.cvPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-mono"
            >
              View CV
            </a>
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-mono cursor-pointer"
            >
              Toggle {isDark ? 'Light' : 'Dark'} Theme
            </button>
            <a
              href={PROFILE_DATA.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-mono"
            >
              hridoyzaman.vercel.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
