export const demoResume = {
  id: 'demo-resume',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  linkedin: 'linkedin.com/in/alexjohnson',
  github: 'github.com/alexjohnson',
  summary: 'Aspiring software engineer with hands-on experience building responsive web applications and data-driven products.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Tailwind CSS', 'Git', 'Figma'],
  education: [{ degree: 'B.Tech in Computer Science', school: 'National Institute of Technology', year: '2025', cgpa: '8.6 / 10' }],
  projects: [
    { name: 'Career Compass', description: 'AI-powered career guidance platform for students.', technologies: 'React, Node.js, Python' },
    { name: 'Campus Connect', description: 'Collaborative event discovery application.', technologies: 'React, Firebase' },
  ],
  experience: [{ company: 'TechLabs', role: 'Frontend Developer Intern', years: 'Jun 2024 – Aug 2024', description: 'Built reusable user interfaces and improved page performance.' }],
  certifications: [{ title: 'Google Data Analytics', provider: 'Google', date: '2024' }],
};

export const analysis = {
  score: 82,
  ats: 76,
  sections: [
    { name: 'Skills', value: 88 },
    { name: 'Education', value: 82 },
    { name: 'Projects', value: 85 },
    { name: 'Experience', value: 68 },
    { name: 'Certifications', value: 74 },
  ],
  strengths: [
    'Strong programming skills across modern web technologies',
    'Clear academic record with a competitive CGPA',
    'Projects demonstrate practical product thinking',
  ],
  improvements: [
    'Add a tailored professional summary for each role',
    'Include measurable outcomes for project contributions',
    'Add a LinkedIn profile URL to improve discoverability',
  ],
};

// NLP Extraction data
export const nlpExtraction = {
  personal: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
  },
  education: [
    { degree: 'B.Tech in Computer Science', institution: 'National Institute of Technology', cgpa: '8.6', year: '2025', confidence: 97 },
  ],
  skills: [
    { name: 'JavaScript', confidence: 96, category: 'Programming Language' },
    { name: 'React', confidence: 94, category: 'Frontend Framework' },
    { name: 'Node.js', confidence: 91, category: 'Backend Runtime' },
    { name: 'Python', confidence: 89, category: 'Programming Language' },
    { name: 'SQL', confidence: 87, category: 'Database' },
    { name: 'Tailwind CSS', confidence: 85, category: 'CSS Framework' },
    { name: 'Git', confidence: 93, category: 'Version Control' },
    { name: 'Figma', confidence: 78, category: 'Design Tool' },
    { name: 'REST API', confidence: 82, category: 'Web Technology' },
    { name: 'PostgreSQL', confidence: 80, category: 'Database' },
  ],
  projects: [
    { name: 'Career Compass', description: 'AI-powered career guidance platform for students with NLP-based skill extraction.', technologies: ['React', 'Node.js', 'Python', 'PostgreSQL'], role: 'Full Stack Developer', duration: '3 months', confidence: 94 },
    { name: 'Campus Connect', description: 'Collaborative event discovery and management application for college students.', technologies: ['React', 'Firebase', 'Tailwind CSS'], role: 'Frontend Developer', duration: '2 months', confidence: 91 },
  ],
  certifications: [
    { title: 'Google Data Analytics', organization: 'Google', issueDate: 'Mar 2024', status: 'Verified' },
    { title: 'React Developer Certification', organization: 'Meta', issueDate: 'Jan 2024', status: 'Verified' },
  ],
};

// Skill taxonomy mapping
export const skillTaxonomy = [
  { id: 1, extracted: 'JS', mapped: 'JavaScript', category: 'Programming Language', confidence: 98, status: 'approved' },
  { id: 2, extracted: 'ReactJS', mapped: 'React', category: 'Frontend Framework', confidence: 96, status: 'approved' },
  { id: 3, extracted: 'Node', mapped: 'Node.js', category: 'Backend Runtime', confidence: 94, status: 'pending' },
  { id: 4, extracted: 'Postgres', mapped: 'PostgreSQL', category: 'Database', confidence: 92, status: 'pending' },
  { id: 5, extracted: 'TailwindCSS', mapped: 'Tailwind CSS', category: 'CSS Framework', confidence: 97, status: 'approved' },
  { id: 6, extracted: 'py', mapped: 'Python', category: 'Programming Language', confidence: 89, status: 'pending' },
  { id: 7, extracted: 'REST', mapped: 'REST API', category: 'Web Technology', confidence: 85, status: 'rejected' },
  { id: 8, extracted: 'git', mapped: 'Git', category: 'Version Control', confidence: 99, status: 'approved' },
];

// AI Insights
export const aiInsights = {
  strengths: [
    'Strong frontend development skills with React and modern CSS frameworks',
    'Solid backend experience with Node.js and Python',
    'Good project portfolio demonstrating full-stack capabilities',
    'Consistent academic performance with competitive CGPA',
  ],
  weaknesses: [
    'Missing cloud platform skills (AWS, GCP, Azure)',
    'No containerization experience (Docker, Kubernetes)',
    'Limited certifications in specialized domains',
    'No open-source contributions mentioned',
  ],
  recommendations: [
    { title: 'Learn AWS Fundamentals', priority: 'High', category: 'Cloud', description: 'AWS is required in 78% of job postings matching your profile.' },
    { title: 'Add Docker to your stack', priority: 'High', category: 'DevOps', description: 'Containerization skills increase interview callbacks by 40%.' },
    { title: 'Contribute to Open Source', priority: 'Medium', category: 'Portfolio', description: 'GitHub activity signals initiative to recruiters.' },
    { title: 'Get AWS Cloud Practitioner', priority: 'Medium', category: 'Certification', description: 'Entry-level cloud cert validates your cloud readiness.' },
    { title: 'Improve LinkedIn Profile', priority: 'Low', category: 'Visibility', description: 'A complete LinkedIn profile increases recruiter outreach by 3x.' },
  ],
};

// Skill profile (before/after resume upload)
export const skillProfile = {
  improved: [
    { skill: 'JavaScript', before: 65, after: 88 },
    { skill: 'React', before: 60, after: 85 },
    { skill: 'Node.js', before: 50, after: 78 },
    { skill: 'Python', before: 55, after: 75 },
    { skill: 'SQL', before: 45, after: 72 },
  ],
  added: ['Tailwind CSS', 'Figma', 'REST API', 'PostgreSQL'],
  missing: ['AWS', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL'],
};

// Resume history
export const resumeHistory = [
  { id: 'r3', fileName: 'Alex_Johnson_Resume_v3.pdf', uploadDate: 'Today', score: 82, skillsExtracted: 10, status: 'Analyzed' },
  { id: 'r2', fileName: 'Alex_Johnson_Resume_v2.pdf', uploadDate: '12 Jul 2025', score: 74, skillsExtracted: 8, status: 'Analyzed' },
  { id: 'r1', fileName: 'Alex_Johnson_Resume_v1.pdf', uploadDate: '03 Mar 2025', score: 61, skillsExtracted: 6, status: 'Analyzed' },
];

// Admin analytics
export const adminResumeStats = {
  totalUploaded: 1284,
  totalSkillsExtracted: 38520,
  avgScore: 74,
  successRate: 96.4,
  uploadTrend: [
    { month: 'Jan', uploads: 80 }, { month: 'Feb', uploads: 95 }, { month: 'Mar', uploads: 110 },
    { month: 'Apr', uploads: 130 }, { month: 'May', uploads: 160 }, { month: 'Jun', uploads: 145 },
    { month: 'Jul', uploads: 190 }, { month: 'Aug', uploads: 210 }, { month: 'Sep', uploads: 175 },
  ],
  skillDistribution: [
    { skill: 'JavaScript', count: 820 }, { skill: 'Python', count: 740 }, { skill: 'React', count: 680 },
    { skill: 'Java', count: 610 }, { skill: 'SQL', count: 590 }, { skill: 'Node.js', count: 480 },
  ],
  processingStatus: [
    { status: 'Success', value: 1238 }, { status: 'Failed', value: 28 }, { status: 'Pending', value: 18 },
  ],
};

// Admin taxonomy
export const adminTaxonomy = [
  { id: 1, skill: 'JavaScript', category: 'Programming Language', aliases: ['JS', 'js', 'javascript'], count: 820 },
  { id: 2, skill: 'Python', category: 'Programming Language', aliases: ['py', 'python3'], count: 740 },
  { id: 3, skill: 'React', category: 'Frontend Framework', aliases: ['ReactJS', 'React.js'], count: 680 },
  { id: 4, skill: 'Java', category: 'Programming Language', aliases: ['java', 'Java SE'], count: 610 },
  { id: 5, skill: 'PostgreSQL', category: 'Database', aliases: ['Postgres', 'psql'], count: 430 },
  { id: 6, skill: 'Docker', category: 'DevOps', aliases: ['docker', 'Docker CE'], count: 390 },
  { id: 7, skill: 'AWS', category: 'Cloud Platform', aliases: ['Amazon Web Services', 'aws'], count: 520 },
  { id: 8, skill: 'TypeScript', category: 'Programming Language', aliases: ['TS', 'ts'], count: 460 },
];

// Admin NLP monitoring
export const nlpMonitoring = [
  { id: 'j1', file: 'resume_1284.pdf', status: 'Success', accuracy: 97, duration: '1.2s', time: '2 min ago' },
  { id: 'j2', file: 'resume_1283.pdf', status: 'Success', accuracy: 94, duration: '1.5s', time: '5 min ago' },
  { id: 'j3', file: 'resume_1282.pdf', status: 'Failed', accuracy: 0, duration: '—', time: '8 min ago' },
  { id: 'j4', file: 'resume_1281.pdf', status: 'Success', accuracy: 91, duration: '1.8s', time: '12 min ago' },
  { id: 'j5', file: 'resume_1280.pdf', status: 'Success', accuracy: 96, duration: '1.1s', time: '18 min ago' },
  { id: 'j6', file: 'resume_1279.pdf', status: 'Pending', accuracy: 0, duration: '—', time: '22 min ago' },
];
