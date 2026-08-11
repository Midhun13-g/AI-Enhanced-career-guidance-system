import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Code2, Brain, Users, Smile,
  BarChart3, Database, Globe, Cpu, MessageSquare, Star,
  ChevronDown, BookOpen, Layers,
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/ui/Badge';
import api from '../../services/api';

const categories = [
  {
    id: 'quantitative', group: 'Aptitude', icon: BarChart3, color: 'blue',
    name: 'Quantitative Ability', description: 'Master numerical reasoning, arithmetic, and data interpretation for competitive exams.',
    tests: 12, difficulty: 'Medium', skills: ['Arithmetic', 'Percentages', 'Ratios', 'Speed & Time'],
  },
  {
    id: 'logical', group: 'Aptitude', icon: Brain, color: 'indigo',
    name: 'Logical Reasoning', description: 'Sharpen deductive, inductive, and critical thinking skills.',
    tests: 10, difficulty: 'Hard', skills: ['Syllogisms', 'Puzzles', 'Sequences', 'Analogies'],
  },
  {
    id: 'data-interp', group: 'Aptitude', icon: BarChart3, color: 'purple',
    name: 'Data Interpretation', description: 'Analyze charts, tables, and graphs to extract meaningful insights.',
    tests: 8, difficulty: 'Hard', skills: ['Charts', 'Tables', 'Graphs', 'Inference'],
  },
  {
    id: 'programming', group: 'Technical', icon: Code2, color: 'blue',
    name: 'Programming', description: 'Test your coding skills across Java, Python, JavaScript and more.',
    tests: 18, difficulty: 'Medium', skills: ['Java', 'Python', 'JavaScript', 'Algorithms'],
  },
  {
    id: 'dsa', group: 'Technical', icon: Layers, color: 'indigo',
    name: 'Data Structures', description: 'Arrays, trees, graphs, and algorithm complexity analysis.',
    tests: 15, difficulty: 'Hard', skills: ['Arrays', 'Trees', 'Graphs', 'Sorting'],
  },
  {
    id: 'database', group: 'Technical', icon: Database, color: 'teal',
    name: 'Database & SQL', description: 'Relational databases, SQL queries, normalization, and optimization.',
    tests: 10, difficulty: 'Medium', skills: ['SQL', 'Normalization', 'Joins', 'Indexing'],
  },
  {
    id: 'webdev', group: 'Technical', icon: Globe, color: 'green',
    name: 'Web Development', description: 'Frontend and backend web technologies, REST APIs, and frameworks.',
    tests: 14, difficulty: 'Medium', skills: ['React', 'HTML/CSS', 'REST', 'Spring Boot'],
  },
  {
    id: 'aiml', group: 'Technical', icon: Cpu, color: 'purple',
    name: 'AI / ML', description: 'Machine learning concepts, model evaluation, and AI fundamentals.',
    tests: 9, difficulty: 'Expert', skills: ['ML Algorithms', 'Neural Nets', 'Python', 'Statistics'],
  },
  {
    id: 'communication', group: 'Soft Skills', icon: MessageSquare, color: 'teal',
    name: 'Communication', description: 'Verbal, written, and presentation skills for professional environments.',
    tests: 8, difficulty: 'Easy', skills: ['Verbal', 'Written', 'Presentation', 'Listening'],
  },
  {
    id: 'leadership', group: 'Soft Skills', icon: Star, color: 'amber',
    name: 'Leadership', description: 'Decision-making, team management, and strategic thinking assessments.',
    tests: 6, difficulty: 'Medium', skills: ['Decision Making', 'Delegation', 'Vision', 'Conflict'],
  },
  {
    id: 'teamwork', group: 'Soft Skills', icon: Users, color: 'green',
    name: 'Teamwork', description: 'Collaboration, empathy, and cross-functional team dynamics.',
    tests: 7, difficulty: 'Easy', skills: ['Collaboration', 'Empathy', 'Feedback', 'Trust'],
  },
  {
    id: 'adaptability', group: 'Soft Skills', icon: BookOpen, color: 'rose',
    name: 'Adaptability', description: 'Resilience, learning agility, and change management skills.',
    tests: 5, difficulty: 'Easy', skills: ['Resilience', 'Flexibility', 'Learning', 'Stress'],
  },
  {
    id: 'behaviour', group: 'Personality', icon: Brain, color: 'purple',
    name: 'Behaviour Analysis', description: 'Understand your work style, motivations, and behavioral patterns.',
    tests: 4, difficulty: 'Easy', skills: ['Work Style', 'Motivation', 'Patterns', 'Values'],
  },
  {
    id: 'career-interest', group: 'Personality', icon: Smile, color: 'amber',
    name: 'Career Interest', description: 'Discover career domains that align with your passions and strengths.',
    tests: 3, difficulty: 'Easy', skills: ['Interests', 'Strengths', 'Career Fit', 'Goals'],
  },
];

const groups = ['All', 'Aptitude', 'Technical', 'Soft Skills', 'Personality'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-600',   border: 'border-blue-100',   text: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-600', border: 'border-indigo-100', text: 'text-indigo-600' },
  teal:   { bg: 'bg-teal-50',   icon: 'bg-teal-600',   border: 'border-teal-100',   text: 'text-teal-600' },
  green:  { bg: 'bg-green-50',  icon: 'bg-green-600',  border: 'border-green-100',  text: 'text-green-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-600', border: 'border-purple-100', text: 'text-purple-600' },
  amber:  { bg: 'bg-amber-50',  icon: 'bg-amber-500',  border: 'border-amber-100',  text: 'text-amber-600' },
  rose:   { bg: 'bg-rose-50',   icon: 'bg-rose-600',   border: 'border-rose-100',   text: 'text-rose-600' },
};

export default function AssessmentCategories() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('name');
  const [publishedAssessments, setPublishedAssessments] = useState([]);

  useEffect(() => {
    api.get('/api/assessment/published').then((response) => setPublishedAssessments(response.data)).catch(() => setPublishedAssessments([]));
  }, []);

  const filtered = useMemo(() => {
    let list = categories;
    if (group !== 'All') list = list.filter((c) => c.group === group);
    if (difficulty !== 'All') list = list.filter((c) => c.difficulty === difficulty);
    if (query) list = list.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'tests') list = [...list].sort((a, b) => b.tests - a.tests);
    return list;
  }, [query, group, difficulty, sort]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Assessment Engine</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Assessment Categories</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a category to begin your skill assessment journey.</p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assessments..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal size={15} className="text-slate-400 shrink-0" />
            {groups.map((g) => (
              <button key={g} onClick={() => setGroup(g)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${group === g ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'}`}>
                {g}
              </button>
            ))}
            <div className="relative">
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-bold text-slate-600 focus:border-blue-500 focus:outline-none cursor-pointer">
                {difficulties.map((d) => <option key={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-7 text-xs font-bold text-slate-600 focus:border-blue-500 focus:outline-none cursor-pointer">
                <option value="name">Sort: Name</option>
                <option value="tests">Sort: Tests</option>
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-slate-500">{filtered.length} assessment{filtered.length !== 1 ? 's' : ''} found</p>

        {publishedAssessments.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between">
              <div><h2 className="text-lg font-extrabold text-slate-900">Published Assessments</h2><p className="mt-1 text-sm text-slate-500">New assessments made available by your administrator.</p></div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{publishedAssessments.length} available</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {publishedAssessments.map((assessment, index) => (
                <motion.div key={assessment.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-card hover:shadow-card-md transition-all hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm"><BookOpen size={22} /></div><div className="flex flex-col items-end gap-1"><Badge label={assessment.category} variant="ai" /><Badge label={assessment.difficulty} /></div></div>
                  <h3 className="font-extrabold text-slate-900 leading-snug">{assessment.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">{assessment.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-400"><BookOpen size={12} /><span className="font-semibold">{assessment.totalQuestions} questions · {assessment.durationMinutes} min</span></div>
                  <button onClick={() => navigate('/assessments/details', { state: { assessment: { title: assessment.title, description: assessment.description, category: assessment.category, difficulty: assessment.difficulty, duration: `${assessment.durationMinutes} minutes`, questions: assessment.totalQuestions, passingScore: assessment.passingPercentage, maxAttempts: assessment.maximumAttempts, instructions: assessment.instructions, id: assessment.id } } })} className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-colors">View Assessment</button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Category Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cat, i) => {
            const c = colorMap[cat.color] || colorMap.blue;
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                className={`group rounded-2xl border ${c.border} bg-white p-5 shadow-card hover:shadow-card-md transition-all hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.icon} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge label={cat.group} variant={cat.color} />
                    <Badge label={cat.difficulty} />
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 leading-snug">{cat.name}</h3>
                <p className="mt-1.5 text-sm text-slate-500 leading-relaxed line-clamp-2">{cat.description}</p>

                <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                  <BookOpen size={12} />
                  <span className="font-semibold">{cat.tests} tests available</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <span key={s} className={`rounded-lg ${c.bg} ${c.text} px-2 py-0.5 text-[11px] font-semibold`}>{s}</span>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/assessments/details', { state: { category: cat } })}
                  className={`mt-4 w-full rounded-xl ${c.icon} py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  Start Assessment
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
