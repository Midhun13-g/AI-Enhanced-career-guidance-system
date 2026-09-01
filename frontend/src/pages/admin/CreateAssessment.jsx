import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiSave, FiSend, FiChevronLeft, FiPlus, FiX, FiAlertCircle,
  FiClock, FiHelpCircle, FiTarget, FiBarChart2, FiTag, FiCpu,
  FiLoader, FiShield, FiCheck, FiLayers, FiList, FiChevronDown
} from 'react-icons/fi';
import { adminService } from '../../services/adminService';

const categories = ['Technical', 'Aptitude', 'Soft Skills', 'Personality'];
const difficulties = ['Foundational', 'Intermediate', 'Advanced', 'Expert'];
const statuses = ['Draft', 'Published', 'Archived'];

const Field = ({ label, required, children, hint }) => (
  <div className="space-y-1">
    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 font-mono">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-neutral-400 font-sans mt-1">{hint}</p>}
  </div>
);

const inputCls =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 placeholder:font-sans focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs font-sans';

const selectCls =
  'w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-3.5 pr-9 py-2.5 text-sm text-neutral-900 outline-none focus:border-transparent focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs cursor-pointer font-sans';

export default function CreateAssessment() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [aiTopic, setAiTopic] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showManualQuestion, setShowManualQuestion] = useState(false);
  const [manualQuestion, setManualQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    explanation: ''
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Technical',
    difficulty: 'Intermediate',
    duration: 30,
    questionCount: 20,
    passingMarks: 60,
    negativeMarking: false,
    negativeValue: 0.25,
    maxAttempts: 3,
    shuffleQuestions: true,
    showResult: true,
    skills: [],
    status: 'Draft',
    instructions: '',
  });
  const [skillInput, setSkillInput] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Assessment title is required';
    if (!form.description.trim()) e.description = 'Curriculum description is required';
    if (form.duration < 5) e.duration = 'Minimum test duration is 5 minutes';
    if (form.questionCount < 1) e.questionCount = 'Minimum 1 question quota';
    if (form.passingMarks < 1 || form.passingMarks > 100) e.passingMarks = 'Scale must be 1–100%';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      set('skills', [...form.skills, s]);
      setSkillInput('');
    }
  };

  const removeSkill = (s) => set('skills', form.skills.filter((x) => x !== s));

  const addManualQuestion = () => {
    const questionText = manualQuestion.questionText.trim();
    const options = manualQuestion.options.map((option) => option.trim());
    if (!questionText || options.some((option) => !option)) {
      setSaveError('Provide the question prompt and all four answer options before adding.');
      return;
    }
    setQuestions((current) => [...current, { ...manualQuestion, questionText, options }]);
    setManualQuestion({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });
    setShowManualQuestion(false);
    setSaveError('');
  };

  const generateWithAI = async (topic = aiTopic, questionsOnly = false) => {
    setGenerating(true);
    setAiError('');
    try {
      const plan = await adminService.generateAssessmentPlan({
        topic: (topic || form.name || form.description || 'assessment questions').trim(),
        category: form.category,
        difficulty: form.difficulty,
        questionCount: questionsOnly ? Math.max(1, form.questionCount - questions.length) : form.questionCount,
      });

      if (!questionsOnly) {
        setForm((current) => ({
          ...current,
          name: plan.name || current.name,
          description: plan.description || current.description,
          skills: Array.isArray(plan.skills) ? plan.skills : current.skills,
          instructions: plan.instructions || current.instructions,
          duration: plan.duration || current.duration,
          questionCount: plan.questionCount || current.questionCount,
          passingMarks: plan.passingMarks || current.passingMarks,
        }));
      }

      const generatedQuestions = Array.isArray(plan.questions)
        ? plan.questions.filter((q) =>
            q?.questionText &&
            Array.isArray(q.options) &&
            q.options.length >= 2 &&
            Number.isInteger(q.correctOptionIndex) &&
            q.correctOptionIndex >= 0 &&
            q.correctOptionIndex < q.options.length
          )
        : [];

      if (questionsOnly && generatedQuestions.length === 0) {
        setAiError('No valid items returned. Try refining your domain prompt.');
        return;
      }

      setQuestions((current) => (questionsOnly ? [...current, ...generatedQuestions] : generatedQuestions));
      if (!questionsOnly) setSuggestedTopics(Array.isArray(plan.suggestedTopics) ? plan.suggestedTopics : []);
      if (topic) setAiTopic(topic);
    } catch (error) {
      setAiError('AI generation service currently unavailable. Add questions manually.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (publish = false) => {
    if (!validate()) return;
    if (publish && questions.length === 0) {
      setSaveError('Add at least one question item to the test bank before publishing.');
      return;
    }
    setSaveError('');
    publish ? setPublishing(true) : setSaving(true);
    const payload = { ...form, status: publish ? 'Published' : 'Draft', questions };
    try {
      await adminService.createAssessment(payload);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        if (publish) navigate('/admin/assessments');
      }, 1200);
    } catch (error) {
      setSaveError(error.response?.data?.message || error.response?.data?.detail || 'Unable to save assessment.');
    } finally {
      publish ? setPublishing(false) : setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12 antialiased selection:bg-[#0038FF] selection:text-white">
      
      {/* ── Top Header Ribbon ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Evaluation Engine
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
              <FiShield size={9} /> Assessment Core
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-950 mt-0.5">
            Configure Standardized Assessment
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Author metadata, calibrate passing criteria, and populate test bank rubrics.
          </p>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all shadow-2xs font-mono disabled:opacity-60"
          >
            <FiSave size={13} />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={publishing}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-semibold px-4 py-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
          >
            <FiSend size={13} />
            <span>{publishing ? 'Deploying...' : 'Publish Assessment'}</span>
          </button>
        </div>
      </div>

      {/* ── Status Banners ── */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800 font-mono"
        >
          <FiCheck size={14} className="text-emerald-600 shrink-0" />
          <span>Assessment parameters and questions committed to repository successfully.</span>
        </motion.div>
      )}

      {saveError && (
        <div className="flex items-center gap-2.5 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-xs text-rose-700 font-mono">
          <FiAlertCircle size={14} className="text-rose-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* ── Main Workspace Grid (8 / 4 Column Split) ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Form Content (8 cols) */}
        <div className="lg:col-span-8 space-y-7">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-7 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Catalog Identity
                </span>
                <h2 className="text-base font-bold text-neutral-950 mt-0.5">Basic Information</h2>
              </div>
              <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-md">
                Required
              </span>
            </div>

            <div className="space-y-5">
              <Field label="Assessment Title" required hint="Public title displayed across the candidate portal.">
                <input
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={`w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs ${errors.name ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                />
                {errors.name && <p className="mt-1.5 text-xs text-rose-600 font-mono">{errors.name}</p>}
              </Field>

              <Field label="Curriculum Description" required>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={3}
                  className={`w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs resize-none leading-relaxed ${errors.description ? 'border-rose-400 focus:ring-rose-200' : ''}`}
                />
                {errors.description && <p className="mt-1.5 text-xs text-rose-600 font-mono">{errors.description}</p>}
              </Field>

              <div className="rounded-xl border border-blue-100/80 bg-blue-50/30 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-mono flex items-center gap-2">
                    <FiCpu size={14} className="text-[#0038FF]" />
                    <span>AI Rubric Generator</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#0038FF] font-medium">Automated Synthesizer</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <input
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), generateWithAI())}
                    placeholder="e.g. Distributed consensus, Raft protocol, CAP theorem"
                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all font-sans placeholder:text-neutral-400"
                  />
                  <button
                    type="button"
                    onClick={() => generateWithAI()}
                    disabled={generating}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-xs font-semibold text-white hover:bg-neutral-800 font-mono disabled:opacity-60 transition-all shrink-0"
                  >
                    {generating ? <FiLoader size={13} className="animate-spin" /> : <FiCpu size={13} />}
                    <span>Generate Plan</span>
                  </button>
                </div>

                {aiError && <p className="text-xs font-semibold text-rose-600 font-mono">{aiError}</p>}

                {suggestedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    {suggestedTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => generateWithAI(topic)}
                        className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700 hover:border-[#0038FF] hover:text-[#0038FF] transition-colors"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2 pt-1">
                <Field label="Domain Track" required>
                  <div className="relative">
                    <select 
                      value={form.category} 
                      onChange={(e) => set('category', e.target.value)} 
                      className={selectCls}
                    >
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <FiChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </Field>

                <Field label="Difficulty Tier" required>
                  <div className="relative">
                    <select 
                      value={form.difficulty} 
                      onChange={(e) => set('difficulty', e.target.value)} 
                      className={selectCls}
                    >
                      {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <FiChevronDown size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  </div>
                </Field>
              </div>

              <Field label="Evaluated Competencies" hint="Press Enter or click Add to append taxonomy tags.">
                <div className="flex gap-2.5">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="e.g. Distributed Storage, RPC, Concurrency"
                    className="flex-1 rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-xs text-neutral-900 outline-none focus:ring-2 focus:ring-[#0038FF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors shrink-0 font-mono"
                  >
                    <FiPlus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {form.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-[#0038FF]"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="text-blue-400 hover:text-blue-700 transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Pre-Assessment Instructions" hint="Student examination guidelines, code of conduct, and timing alerts.">
                <textarea
                  value={form.instructions}
                  onChange={(e) => set('instructions', e.target.value)}
                  rows={2}
                  placeholder="e.g. Standard calculator permitted. Tab switching will flag telemetry warnings..."
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#0038FF] transition-all shadow-2xs resize-none"
                />
              </Field>
            </div>
          </div>

          {/* Section 2: Question Item Bank */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Item Repository
                </span>
                <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Question Item Bank</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualQuestion((v) => !v)}
                  className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 font-mono flex items-center gap-1"
                >
                  <FiPlus size={12} />
                  <span>Add Item</span>
                </button>

                <button
                  type="button"
                  onClick={() => generateWithAI(aiTopic, true)}
                  disabled={generating}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 font-mono disabled:opacity-60 shadow-2xs"
                >
                  {generating ? <FiLoader size={12} className="animate-spin" /> : <FiCpu size={12} />}
                  <span>Synthesize</span>
                </button>

                <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${
                  questions.length
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                    : 'bg-amber-50 text-amber-700 border-amber-200/80'
                }`}>
                  {questions.length} Items Configured
                </span>
              </div>
            </div>

            {/* Manual Question Form Drawer */}
            {showManualQuestion && (
              <div className="space-y-3 rounded-xl border border-neutral-200 bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-mono">
                    New MCQ Question Item
                  </span>
                  <button onClick={() => setShowManualQuestion(false)} className="text-neutral-400 hover:text-neutral-700">
                    <FiX size={14} />
                  </button>
                </div>

                <textarea
                  value={manualQuestion.questionText}
                  onChange={(e) => setManualQuestion((c) => ({ ...c, questionText: e.target.value }))}
                  rows={2}
                  placeholder="Enter the standardized question prompt..."
                  className={`${inputCls} resize-none`}
                />

                <div className="grid gap-2 sm:grid-cols-2 pt-1">
                  {manualQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct-option"
                        checked={manualQuestion.correctOptionIndex === index}
                        onChange={() => setManualQuestion((c) => ({ ...c, correctOptionIndex: index }))}
                        className="accent-[#0038FF] cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <input
                        value={option}
                        onChange={(e) =>
                          setManualQuestion((c) => ({
                            ...c,
                            options: c.options.map((val, i) => (i === index ? e.target.value : val))
                          }))
                        }
                        placeholder={`Option ${index + 1}`}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>

                <textarea
                  value={manualQuestion.explanation}
                  onChange={(e) => setManualQuestion((c) => ({ ...c, explanation: e.target.value }))}
                  rows={1}
                  placeholder="Diagnostic explanation (optional, shown in review analytics)..."
                  className={`${inputCls} resize-none`}
                />

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200/60">
                  <button
                    type="button"
                    onClick={() => setShowManualQuestion(false)}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addManualQuestion}
                    className="rounded-lg bg-[#0038FF] hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold font-mono shadow-xs"
                  >
                    Add to Bank
                  </button>
                </div>
              </div>
            )}

            {/* List of Configured Questions */}
            {questions.length > 0 ? (
              <div className="space-y-2 pt-1">
                {questions.map((q, idx) => (
                  <div
                    key={`${q.questionText}-${idx}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-neutral-100 bg-[#F8FAFC] p-3 text-xs font-mono"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="font-bold text-[#0038FF] shrink-0">{idx + 1}.</span>
                      <p className="truncate text-neutral-800 font-medium">{q.questionText}</p>
                    </div>
                    <button
                      onClick={() => setQuestions((curr) => curr.filter((_, i) => i !== idx))}
                      className="text-neutral-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                    >
                      <FiX size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-400 font-mono pt-1">
                No items populated. Add questions manually or utilize the AI rubric synthesizer.
              </p>
            )}
          </div>

          {/* Section 3: Execution Parameters */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Execution Constraints
                </span>
                <h2 className="text-sm font-bold text-neutral-950 mt-0.5">Evaluation Parameters</h2>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-1">
              <Field label="Duration (Mins)" required>
                <div className="relative">
                  <FiClock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={form.duration}
                    onChange={(e) => set('duration', Number(e.target.value))}
                    className={`${inputCls} pl-8 ${errors.duration ? 'border-rose-400' : ''}`}
                  />
                </div>
                {errors.duration && <p className="mt-1 text-[11px] text-rose-600 font-mono">{errors.duration}</p>}
              </Field>

              <Field label="Question Quota" required>
                <div className="relative">
                  <FiHelpCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={form.questionCount}
                    onChange={(e) => set('questionCount', Number(e.target.value))}
                    className={`${inputCls} pl-8 ${errors.questionCount ? 'border-rose-400' : ''}`}
                  />
                </div>
                {errors.questionCount && <p className="mt-1 text-[11px] text-rose-600 font-mono">{errors.questionCount}</p>}
              </Field>

              <Field label="Passing Score (%)" required>
                <div className="relative">
                  <FiTarget size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.passingMarks}
                    onChange={(e) => set('passingMarks', Number(e.target.value))}
                    className={`${inputCls} pl-8 ${errors.passingMarks ? 'border-rose-400' : ''}`}
                  />
                </div>
                {errors.passingMarks && <p className="mt-1 text-[11px] text-rose-600 font-mono">{errors.passingMarks}</p>}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Max Allowed Attempts">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.maxAttempts}
                  onChange={(e) => set('maxAttempts', Number(e.target.value))}
                  className={inputCls}
                />
              </Field>

              <Field label="Negative Score Value" hint="Marks deducted per wrong answer (0 = disabled).">
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.25}
                  value={form.negativeValue}
                  onChange={(e) => set('negativeValue', Number(e.target.value))}
                  disabled={!form.negativeMarking}
                  className={`${inputCls} disabled:opacity-40 disabled:cursor-not-allowed`}
                />
              </Field>
            </div>

            {/* Parameter Toggles */}
            <div className="grid gap-3.5 sm:grid-cols-3 pt-1">
              {[
                { key: 'negativeMarking', label: 'Negative Marking', desc: 'Deduct score on wrong choices' },
                { key: 'shuffleQuestions', label: 'Shuffle Sequence', desc: 'Randomize item delivery order' },
                { key: 'showResult', label: 'Instant Feedback', desc: 'Display score telemetry on submit' },
              ].map(({ key, label, desc }) => {
                const active = Boolean(form[key]);
                return (
                  <div
                    key={key}
                    onClick={() => set(key, !active)}
                    className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer select-none transition-all ${
                      active
                        ? 'border-[#0038FF]/30 bg-blue-50/20 shadow-2xs'
                        : 'border-neutral-200/80 bg-[#F8FAFC] hover:border-neutral-300'
                    }`}
                  >
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      onClick={(e) => {
                        e.stopPropagation();
                        set(key, !active);
                      }}
                      className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none mt-0.5 ${
                        active ? 'bg-[#0038FF]' : 'bg-neutral-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                          active ? 'translate-x-3' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-neutral-900 font-mono leading-tight">{label}</p>
                      <p className="text-[11px] text-neutral-400 font-mono mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Sidebar Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Publication State */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Lifecycle State
              </span>
              <h3 className="text-sm font-bold text-neutral-950 mt-0.5">Deployment Target</h3>
            </div>

            <div className="space-y-2 pt-1">
              {statuses.map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                    form.status === s
                      ? 'border-[#0038FF] bg-blue-50/40 text-neutral-900'
                      : 'border-neutral-100 hover:bg-neutral-50 text-neutral-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => set('status', s)}
                    className="accent-[#0038FF]"
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-900 font-mono">{s}</p>
                    <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {s === 'Draft' ? 'Hidden from candidate portal' : s === 'Published' ? 'Live on testing hub' : 'Archived from enrollment'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Assessment Summary Preview */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Catalog Preview
                </span>
                <h3 className="text-sm font-bold text-neutral-950 mt-0.5">Specification Sheet</h3>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#0038FF] text-[9px] font-bold font-mono uppercase">
                {form.difficulty}
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              {[
                { label: 'Title', value: form.name || 'Untitled Assessment' },
                { label: 'Domain Track', value: form.category },
                { label: 'Time Limit', value: `${form.duration} mins` },
                { label: 'Item Quota', value: `${form.questionCount} Questions` },
                { label: 'Pass Score', value: `${form.passingMarks}%` },
                { label: 'Attempt Cap', value: `${form.maxAttempts} Attempts` },
                { label: 'Loaded Items', value: `${questions.length} Items` },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-none">
                  <span className="text-neutral-400">{label}</span>
                  <span className="font-semibold text-neutral-900 truncate max-w-[150px] text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Column */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={publishing}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0038FF] hover:bg-blue-700 active:scale-[0.99] py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all font-mono disabled:opacity-60"
            >
              <FiSend size={13} />
              <span>{publishing ? 'Deploying...' : 'Deploy to Production'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-all shadow-2xs font-mono disabled:opacity-60"
            >
              <FiSave size={13} />
              <span>{saving ? 'Saving...' : 'Save Draft Specification'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}