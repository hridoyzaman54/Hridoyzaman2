export interface ResearchProject {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: 'epidemiology' | 'diagnostics' | 'biotech-ai' | 'education';
  categoryLabel: string;
  period: string;
  institution: string;
  summary: string;
  methodology: string[];
  outcomes: string[];
  metrics: {
    label: string;
    value: string;
    unit: string;
  }[];
  sequenceTag: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  department?: string;
  location: string;
  period: string;
  type: string;
  highlights: string[];
  protocols: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  focus: string;
  details: string;
}

export interface CompetencyItem {
  id: string;
  name: string;
  shortName: string;
  score: number;
  unit: string;
  domain: 'wet-lab' | 'analytical' | 'quality';
  description: string;
}

export interface TechSkillItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tools: string;
}

export interface DnaMilestoneNode {
  index: number;
  basePair: 'A-T' | 'T-A' | 'G-C' | 'C-G';
  codon: string;
  label: string;
  detail: string;
  metric: string;
}

export const PROFILE_DATA = {
  name: 'Hridoy Zaman',
  title: 'Biotechnology Researcher & AI Solutions Architect',
  pillars: [
    'Biotechnology',
    'Science-Driven',
    'Innovation-Focused',
    'Tech & AI Enthusiast',
  ],
  missionStatement:
    'Dedicated to bridging laboratory science with real-world biotechnology solutions through innovation, research integrity, and continuous learning, leveraging technology and emerging AI to address practical challenges while developing solutions that create meaningful real-world impact.',
  email: 'hridoyzaman1@gmail.com',
  phone: '+880 1947-062892',
  location: 'Dhaka, Bangladesh',
  website: 'https://hridoy-zaman.vercel.app/',
  cvPdfUrl:
    'https://drive.google.com/file/d/1SKloSy1-IBQ8zT686Ek2CaauZgJC3abb/view?usp=drive_link',
  degreeStatus: 'B.Sc. in Biotechnology · BRAC University (2026)',
  clinicalTraining:
    'National Institute of Cancer Research and Hospital (NICRH) — Dept. of Immunology & Molecular Biology',
  heroKpis: [
    {
      label: 'LAB SAFETY & QC PROFICIENCY',
      value: '95.0',
      unit: '%',
      delta: 'NICRH Clinical SOP Standard',
    },
    {
      label: 'MOLECULAR & GENETIC ENG.',
      value: '92.0',
      unit: '%',
      delta: 'PCR · Gel · IHC Diagnostics',
    },
    {
      label: 'COMPETITION DISTINCTIONS',
      value: '100+',
      unit: 'AWARDS',
      delta: 'Physics, Math & Creative',
    },
    {
      label: 'ACADEMIC MENTORSHIP',
      value: '5+',
      unit: 'YEARS',
      delta: '2021 – Present · Science & Tech',
    },
  ],
};

export const DNA_HELIX_MILESTONES: DnaMilestoneNode[] = [
  {
    index: 0,
    basePair: 'G-C',
    codon: 'ATG · START',
    label: 'B.Sc. in Biotechnology — BRAC University',
    detail: 'Final semester graduation track (2026) focusing on molecular diagnostics & infectious disease.',
    metric: '2026 Cohort',
  },
  {
    index: 1,
    basePair: 'A-T',
    codon: 'GGC · NICRH',
    label: 'Immunology & Molecular Biology Internship',
    detail: 'National Institute of Cancer Research and Hospital (NICRH), Mohakhali, Dhaka.',
    metric: 'Feb – May 2025',
  },
  {
    index: 2,
    basePair: 'C-G',
    codon: 'TAC · DENV',
    label: 'Dengue Epidemiology in South Asia',
    detail: 'Final year thesis investigating serotype shifts, vector dynamics, and regional mitigation.',
    metric: '4 Serotypes',
  },
  {
    index: 3,
    basePair: 'G-C',
    codon: 'CCA · PCR',
    label: 'Nucleic Acid Extraction & Amplification',
    detail: 'High-purity DNA/RNA isolation, thermal cycling optimization, and agarose gel electrophoresis.',
    metric: '90% Mastery',
  },
  {
    index: 4,
    basePair: 'T-A',
    codon: 'GAA · IHC',
    label: 'Cancer Cell Biology & Immunohistochemistry',
    detail: 'Tissue specimen handling, IHC biomarker staining, and clinical pathology collaboration.',
    metric: '95% Biosafety',
  },
  {
    index: 5,
    basePair: 'C-G',
    codon: 'CTG · BIO-AI',
    label: 'AI-Driven Biomedical Workflow Automation',
    detail: 'Full-stack biotech software development and custom AI agent pipelines for lab analytics.',
    metric: '88% Bioinfo',
  },
  {
    index: 6,
    basePair: 'A-T',
    codon: 'UAA · MENTOR',
    label: 'Molecular Biology Workshops & STEM Mentorship',
    detail: 'Gamified English-version science curricula, junior workshops, and national olympiad honours.',
    metric: '100+ Prizes',
  },
];

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: 'dengue-south-asia',
    code: 'RES-01',
    title: 'Dengue Epidemiology, Challenges & Mitigation Strategies in South Asia',
    subtitle: 'Final Year B.Sc. Biotechnology Research · BRAC University',
    category: 'epidemiology',
    categoryLabel: 'Epidemiology & Public Health',
    period: '2025 – 2026',
    institution: 'BRAC University · Department of Mathematics and Natural Sciences',
    summary:
      'Comprehensive epidemiological investigation into hyper-endemic Dengue virus (DENV 1–4) transmission waves across South Asia, evaluating climate-driven Aedes vector proliferation, diagnostic bottlenecks, and integrated molecular & biological mitigation protocols.',
    methodology: [
      'Comparative surveillance analysis of seasonal monsoon transmission peaks and urban demographic vulnerability across Bangladesh and neighboring South Asian regions.',
      'Evaluation of secondary heterotypic infection risks (Antibody-Dependent Enhancement) during DENV-2 and DENV-3 serotype displacement events.',
      'Assessment of early NS1 antigen and RT-PCR molecular triage windows alongside Wolbachia-introgressed Aedes aegypti biocontrol efficacy.',
    ],
    outcomes: [
      'Formulated a multi-tiered South Asian mitigation framework combining early molecular diagnostics, clinical triage standardization, and targeted vector suppression.',
      'Modeled intervention sensitivity showing how combining rapid NS1/RT-PCR screening with larval source reduction compresses epidemic peak burden.',
    ],
    metrics: [
      { label: 'SEROTYPES ANALYZED', value: 'DENV 1–4', unit: 'LINEAGES' },
      { label: 'GEOGRAPHIC SCOPE', value: 'South Asia', unit: 'ENDEMIC BELT' },
      { label: 'PRIMARY VECTOR', value: 'A. aegypti', unit: 'ARBOVIRUS' },
    ],
    sequenceTag: "5'-AGTTGTTAGTCTACGTGGACCGACA-3'",
  },
  {
    id: 'nicrh-molecular-diagnostics',
    code: 'CLN-02',
    title: 'Oncological Molecular Diagnostics & Immunohistochemistry Workflow',
    subtitle: 'Clinical Laboratory Internship · Dept. of Immunology & Molecular Biology',
    category: 'diagnostics',
    categoryLabel: 'Clinical Oncology & Molecular Lab',
    period: 'Feb 2025 – May 2025',
    institution: 'National Institute of Cancer Research and Hospital (NICRH), Dhaka',
    summary:
      'Hands-on clinical diagnostic work inside Bangladesh’s premier tertiary oncology institute, executing nucleic acid extraction, PCR thermal amplification, gel electrophoresis, and immunohistochemistry staining on patient biopsy and blood specimens.',
    methodology: [
      'Performed standardized DNA and RNA extraction protocols from clinical oncology samples under strict BSL-2 biosafety and quality assurance SOPs.',
      'Executed endpoint PCR amplification and high-resolution agarose gel electrophoresis for molecular biomarker verification.',
      'Conducted immunohistochemistry (IHC) tissue staining and collaborated with pathologists, oncologists, and research fellows on clinical trial data compilation.',
    ],
    outcomes: [
      'Maintained zero-contamination specimen handling and rigorous laboratory batch records across daily diagnostic cohorts.',
      'Integrated wet-lab molecular assays with structured clinical trial documentation for multi-disciplinary oncology review.',
    ],
    metrics: [
      { label: 'BIOSAFETY & QC', value: '95.0', unit: '% SCORE' },
      { label: 'PCR & BLOTTING', value: '90.0', unit: '% SCORE' },
      { label: 'CELL MICROSCOPY', value: '88.0', unit: '% SCORE' },
    ],
    sequenceTag: "5'-ATGGATTTATCTGCTCTTCGCGTT-3'",
  },
  {
    id: 'ai-biomedical-platform',
    code: 'DEV-03',
    title: 'AI-Driven Biomedical Process & Laboratory Automation Suite',
    subtitle: 'Biotech Software Engineering & Custom AI Agent Pipeline',
    category: 'biotech-ai',
    categoryLabel: 'Bioinformatics & AI Engineering',
    period: '2024 – Present',
    institution: 'Independent R&D & Client Web Engineering',
    summary:
      'Designing and engineering a specialized AI-assisted biotechnology web application to streamline biomedical data processing, protocol tracking, and automated experimental reporting.',
    methodology: [
      'Architected modular web interfaces tailored for laboratory researchers to organize assay metadata, PCR reaction mixes, and quality control logs.',
      'Built custom AI agent workflows for automated scientific data synthesis, anomaly flagging, and structured reporting.',
      'Applied responsive full-stack web engineering practices tested across deployed client applications solving real-world operational bottlenecks.',
    ],
    outcomes: [
      'Bridged wet-lab experimental workflows with modern software automation, reducing manual spreadsheet transcription errors.',
      'Delivered production web applications for clients while advancing a dedicated passion project in computational biotechnology.',
    ],
    metrics: [
      { label: 'BIOINFORMATICS', value: '88.0', unit: '% SCORE' },
      { label: 'MOL. BIOLOGY', value: '92.0', unit: '% SCORE' },
      { label: 'AUTOMATION', value: 'AI Agents', unit: 'PIPELINE' },
    ],
    sequenceTag: "5'-CGTACGTAGCTAGCTAGCTAGCTA-3'",
  },
  {
    id: 'gamified-science-edtech',
    code: 'EDU-04',
    title: 'Gamified Science Curricula & Molecular Biology Workshop Initiative',
    subtitle: 'STEM Education, Scientific Visualization & Peer Mentorship',
    category: 'education',
    categoryLabel: 'Scientific Communication & EdTech',
    period: '2021 – Present',
    institution: 'Private Academic Institutions & BRAC University Workshops',
    summary:
      'Interactive English-version science education program combining AI-assisted animated visual media, gamified e-learning modules, and hands-on molecular biology workshops for junior cohorts.',
    methodology: [
      'Created interactive digital lessons, scientific animations, and visual presentations to demystify genetics, biochemistry, and physics.',
      'Organized practical molecular biology workshops for junior university students and mentored school/college cohorts for science fairs.',
      'Combined student-centered pedagogy with project management to cultivate scientific curiosity and analytical problem solving.',
    ],
    outcomes: [
      'Commended for teaching dedication, high student engagement, and clear scientific storytelling across 5+ years of mentorship.',
      'Empowered junior biotechnology students with foundational laboratory confidence and conceptual clarity.',
    ],
    metrics: [
      { label: 'TEACHING TENURE', value: '2021–2026', unit: 'ACTIVE' },
      { label: 'CURRICULUM', value: 'English', unit: 'C1/C2 FLUENT' },
      { label: 'MEDIA FORMAT', value: 'Animated', unit: 'E-LEARNING' },
    ],
    sequenceTag: "5'-GCTAGCTAGCATCGATCGATCGAT-3'",
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    id: 'nicrh-intern',
    role: 'Intern — Immunology & Molecular Biology',
    organization: 'National Institute of Cancer Research and Hospital (NICRH)',
    department: 'Department of Immunology & Molecular Biology',
    location: 'Mohakhali, Dhaka, Bangladesh',
    period: 'Feb 2025 – May 2025',
    type: 'Clinical & Molecular Diagnostics Internship',
    highlights: [
      'Assisted in ongoing clinical laboratory diagnostics and molecular diagnostics sample analysis for oncology patients.',
      'Performed nucleic acid (DNA/RNA) extraction, PCR thermal amplification, and agarose gel electrophoresis.',
      'Maintained detailed laboratory records and contributed to clinical trial data compilation with strict data integrity.',
      'Gained hands-on experience in cancer cell biology and immunohistochemistry (IHC) tissue staining protocols.',
      'Collaborated directly with pathologists, oncologists, and research fellows in diagnostic case evaluations.',
      'Mastered institutional Standard Operating Procedures (SOPs) for biosafety, clinical specimen handling, and quality assurance.',
    ],
    protocols: [
      'DNA/RNA Extraction',
      'PCR Amplification',
      'Gel Electrophoresis',
      'Immunohistochemistry (IHC)',
      'Cancer Cell Biology',
      'Biosafety SOPs & QA',
    ],
  },
  {
    id: 'stem-mentorship',
    role: 'Teaching, Mentorship & E-Learning Specialist',
    organization: 'Private Academic Institutions',
    department: 'Science & Mathematics Division (English Version)',
    location: 'Dhaka, Bangladesh',
    period: '2021 – Present',
    type: 'Academic Instruction & Curriculum Design',
    highlights: [
      'Delivered comprehensive English-version science curricula reinforced by interactive, gamified e-learning content.',
      'Mentored students in experimental academic projects and organized institutional science fairs.',
      'Commended by faculty and families for teaching dedication and the creation of compelling visual educational materials.',
    ],
    protocols: [
      'Gamified E-Learning',
      'Science Fair Mentorship',
      'Curriculum Architecture',
      'Scientific Visualization',
    ],
  },
  {
    id: 'freelance-tech-ai',
    role: 'Freelance Web Developer & Biotech AI Innovator',
    organization: 'Independent Software & Biomedical Solutions',
    department: 'Full-Stack Web & AI Agent Workflows',
    location: 'Dhaka, Bangladesh (Remote)',
    period: '2023 – Present',
    type: 'Technical Development & Automation',
    highlights: [
      'Built and deployed client-based websites and web applications addressing practical operational challenges.',
      'Currently developing an AI-driven biotech application designed to streamline biomedical laboratory processes.',
      'Engineered custom AI agent workflows for automated scientific data processing, synthesis, and reporting.',
    ],
    protocols: [
      'Full-Stack Web Apps',
      'Custom AI Agents',
      'Biomedical Workflow UI',
      'Data Automation',
    ],
  },
];

export const EDUCATION_HISTORY: EducationItem[] = [
  {
    id: 'bsc-biotech',
    degree: 'B.Sc. in Biotechnology',
    institution: 'BRAC University',
    year: '2026 (Final Semester)',
    focus: 'Molecular Biology, Genetic Engineering, Epidemiology & Bioinformatics',
    details:
      'Final year research: Dengue epidemiology, challenges & mitigation strategies in South Asia. Completed clinical internship at NICRH (Department of Immunology & Molecular Biology).',
  },
  {
    id: 'hsc-science',
    degree: 'Higher Secondary Certificate (HSC) — Science',
    institution: 'Dhaka Megacity College',
    year: '2018',
    focus: 'Biology Major · Higher Mathematics Additional Subject',
    details:
      'Completed rigorous upper-secondary science track specializing in Biological Sciences, Chemistry, Physics, and Higher Mathematics.',
  },
  {
    id: 'ssc-science',
    degree: 'Secondary School Certificate (SSC) — Science',
    institution: 'Laboratory English Version School & College',
    year: '2016',
    focus: 'English Version Curriculum · Biology Major & Higher Mathematics',
    details:
      'Foundation in English-medium scientific terminology, experimental biology, and quantitative mathematics.',
  },
];

export const BIOTECH_COMPETENCIES: CompetencyItem[] = [
  {
    id: 'lab-safety',
    name: 'Laboratory Safety & Quality Control',
    shortName: 'Lab Safety & QC',
    score: 95,
    unit: '%',
    domain: 'quality',
    description:
      'Biosafety SOPs, clinical specimen custody, contamination prevention, sterilization, and diagnostic quality assurance validated at NICRH.',
  },
  {
    id: 'mol-bio',
    name: 'Molecular Biology & Genetic Engineering',
    shortName: 'Molecular Bio',
    score: 92,
    unit: '%',
    domain: 'wet-lab',
    description:
      'Nucleic acid isolation (DNA/RNA), recombinant vector concepts, gene expression analysis, and molecular cloning workflows.',
  },
  {
    id: 'pcr-gel',
    name: 'PCR, Gel Electrophoresis & Blotting',
    shortName: 'PCR & Gel Assay',
    score: 90,
    unit: '%',
    domain: 'wet-lab',
    description:
      'Primer annealing optimization, thermal cycling protocols, agarose/polyacrylamide gel resolution, and macromolecular blotting.',
  },
  {
    id: 'cell-culture',
    name: 'Cell Culture & Microscopy',
    shortName: 'Cell & Microscopy',
    score: 88,
    unit: '%',
    domain: 'wet-lab',
    description:
      'Aseptic mammalian & microbial cell maintenance, cancer cell morphology, brightfield/phase-contrast microscopy, and IHC staining.',
  },
  {
    id: 'bioinformatics',
    name: 'Bioinformatics & Data Analysis',
    shortName: 'Bioinformatics',
    score: 88,
    unit: '%',
    domain: 'analytical',
    description:
      'Sequence alignment, genomic database querying, epidemiological modeling, and clinical trial dataset compilation.',
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry & Analytical Techniques',
    shortName: 'Biochemistry',
    score: 85,
    unit: '%',
    domain: 'analytical',
    description:
      'Spectrophotometry, enzyme kinetics, buffer titration, protein quantification, and analytical assay calibration.',
  },
];

export const COMPUTER_IT_SKILLS: TechSkillItem[] = [
  {
    id: 'web-dev',
    title: 'Web Development & Biotech Software',
    category: 'Full-Stack Engineering',
    description:
      'Experienced in client-based website development with deployed projects addressing real-world problems; actively building an AI-driven biotech application to streamline biomedical processes.',
    tools: 'React · TypeScript · Tailwind CSS · Modern Web Architecture',
  },
  {
    id: 'ai-integration',
    title: 'AI Integration & Model Utilization',
    category: 'Applied Artificial Intelligence',
    description:
      'Dedicated to staying at the frontier of emerging AI models; skilled at evaluating, adapting, and implementing AI tools to maximize scientific and operational efficiency.',
    tools: 'LLM Workflows · Multimodal AI · Prompt Engineering · Research Synthesis',
  },
  {
    id: 'automation',
    title: 'Problem Solving & Agentic Automation',
    category: 'Workflow Engineering',
    description:
      'Architects custom solutions for laboratory data processing, structured compilation, and automated reporting using custom AI agents.',
    tools: 'Custom AI Agents · Automated Pipelines · Data Transformation',
  },
  {
    id: 'design-media',
    title: 'Graphic, UI & Scientific Multimedia Design',
    category: 'Visual Communication',
    description:
      'Designs clean UI systems, academic presentations, and digital assets; produces engaging scientific, educational, and animated videos with AI-assisted visual content.',
    tools: 'UI/UX Systems · Scientific Animation · Interactive Presentations',
  },
  {
    id: 'remote-collab',
    title: 'Remote Work & Distributed Collaboration',
    category: 'Project Operations',
    description:
      'Seamless coordination across multidisciplinary scientific and software teams using modern cloud documentation and version control.',
    tools: 'GitHub · Notion · Google Workspace · Microsoft Teams · Zoom',
  },
  {
    id: 'digital-fluency',
    title: 'Technical Proficiency & Digital Fluency',
    category: 'Core Literacy',
    description:
      'Advanced computer literacy enabling rapid mastery of laboratory instrumentation software, statistical suites, and modern cloud platforms.',
    tools: 'Clinical Data Systems · Telemetry Dashboards · Documentation SOPs',
  },
];

export const EXTRACURRICULAR_HIGHLIGHTS = [
  {
    id: 'olympiads-awards',
    title: 'Competitions & National Distinctions',
    meta: 'Physics & Mathematics Olympiads · 100+ Prizes · Nationwide Rank 1',
    description:
      'Earned top distinctions in Physics and Mathematics Olympiads, alongside 100+ prizes across arts, crafts, and creative competitions. Achieved the highest marks nationwide in Dhruboparishad Bangladesh (7th Year).',
  },
  {
    id: 'leadership-volunteering',
    title: 'Molecular Biology Workshops & Community Health',
    meta: 'Peer Leadership · Blood Donation Drives · STEM Outreach',
    description:
      'Organized hands-on molecular biology workshops for junior university cohorts to bridge textbook theory with laboratory practice. Active organizer in community health awareness and blood donation drives.',
  },
  {
    id: 'tech-ai-innovation',
    title: 'Tech & AI Biomedical Innovation',
    meta: 'Freelance Developer · Biomedical Workflow Streamlining',
    description:
      'Combines freelance software delivery with independent biotech tool creation, focusing on AI-assisted interfaces that reduce cognitive and clerical friction for wet-lab scientists.',
  },
];

export const SOFT_SKILLS_LIST = [
  'English Fluency (Written & Spoken — C1/C2)',
  'Bengali (Native Proficiency)',
  'Presentation & Public Speaking',
  'Creative Problem Solving',
  'Teaching & Knowledge Transfer',
  'Fast & Eager Learner',
  'Advanced Computer Literacy',
  'Graphic, UI & Multimedia Design',
  'Digital Content Creation',
];

export const CLINICAL_REFERENCES = [
  {
    id: 'ref-monia',
    name: 'Dr. Monia Zaman',
    role: 'Specialist Obstetrician and Gynecologist',
    institution: 'Aster Al Raffah Clinic & Hospital',
    location: 'Muscat, Oman',
    email: 'monia.zaman@gmail.com',
    phone: '+96896101670',
  },
  {
    id: 'ref-shammima',
    name: 'Dr. Shammima Alam Mimu',
    role: 'Medical Officer, Gynecologist',
    institution: 'Clinical Medical Service',
    location: 'Dinajpur, Bangladesh',
    email: 'mimualam@gmail.com',
    phone: '+880 1737-908719',
  },
];
