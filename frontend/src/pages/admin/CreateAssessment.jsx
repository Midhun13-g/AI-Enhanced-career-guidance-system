import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Save, Send, ChevronLeft, Plus, X, AlertCircle,
  Clock, HelpCircle, Target, BarChart3, Tag, Sparkles, Loader2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const categories = ['Technical', 'Aptitude', 'Soft Skills', 'Personality'];
const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];
const statuses = ['Draft', 'Published', 'Archived'];

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="mb-1.5 block text-sm font-bold text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
  </div>
);

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors';
const selectCls = `${inputCls} cursor-pointer`;

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
  const [manualQuestion, setManualQuestion] = useState({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });

  const [form, setForm] = useState({
    name: '', description: '', category: 'Technical', difficulty: 'Medium',
    duration: 30, questionCount: 20, passingMarks: 60,
    negativeMarking: false, negativeValue: 0.25,
    maxAttempts: 3, shuffleQuestions: true, showResult: true,
    skills: [], status: 'Draft', instructions: '',
  });
  const [skillInput, setSkillInput] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Assessment name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (form.duration < 5) e.duration = 'Minimum 5 minutes';
    if (form.questionCount < 1) e.questionCount = 'At least 1 question';
    if (form.passingMarks < 1 || form.passingMarks > 100) e.passingMarks = 'Must be 1–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) { set('skills', [...form.skills, s]); setSkillInput(''); }
  };

  const removeSkill = (s) => set('skills', form.skills.filter((x) => x !== s));

  const addManualQuestion = () => {
    const questionText = manualQuestion.questionText.trim();
    const options = manualQuestion.options.map((option) => option.trim());
    if (!questionText || options.some((option) => !option)) {
      setSaveError('Enter the question and all four answer options before adding it.');
      return;
    }
    setQuestions((current) => [...current, { ...manualQuestion, questionText, options }]);
    setManualQuestion({ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, explanation: '' });
    setShowManualQuestion(false); setSaveError('');
  };

  const generateWithAI = async (topic = aiTopic, questionsOnly = false) => {
    setGenerating(true); setAiError('');
    try {
      const plan = await adminService.generateAssessmentPlan({
        topic: (topic || form.name || form.description || 'assessment questions').trim(), category: form.category, difficulty: form.difficulty,
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
      const generatedQuestions = Array.isArray(plan.questions) ? plan.questions.filter((question) =>
        question?.questionText && Array.isArray(question.options) && question.options.length >= 2 &&
        Number.isInteger(question.correctOptionIndex) && question.correctOptionIndex >= 0 && question.correctOptionIndex < question.options.length
      ) : [];
      if (questionsOnly && generatedQuestions.length === 0) {
        setAiError('No valid questions were returned. Try again with a topic, or check that the updated backend is running.');
        return;
      }
      setQuestions((current) => questionsOnly ? [...current, ...generatedQuestions] : generatedQuestions);
      if (!questionsOnly) setSuggestedTopics(Array.isArray(plan.suggestedTopics) ? plan.suggestedTopics : []);
      if (topic) setAiTopic(topic);
    } catch (error) {
      setAiError('The AI assistant could not generate a plan right now. Please try again or add questions manually.');
    } finally { setGenerating(false); }
  };

  const handleSave = async (publish = false) => {
    if (!validate()) return;
    if (publish && questions.length === 0) {
      setSaveError('Add at least one question before publishing. You can add questions manually or use the AI assistant.');
      return;
    }
    setSaveError('');
    publish ? setPublishing(true) : setSaving(true);
    const payload = { ...form, status: publish ? 'Published' : 'Draft', questions };
    try {
      await adminService.createAssessment(payload);
      setSaved(true);
      setTimeout(() => { setSaved(false); if (publish) navigate('/admin/assessments'); }, 1200);
    } catch (error) { setSaveError(error.response?.data?.message || error.response?.data?.detail || 'Unable to save the assessment.'); }
    publish ? setPublishing(false) : setSaving(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button onClick={() => navigate(-1)}
            className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft size={15} /> Back
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Assessment Builder</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">Create Assessment</h1>
          <p className="mt-1 text-sm text-slate-500">Configure and publish a new assessment for students.</p>
        </div>
      </motion.div>

      {/* Success Banner */}
      {saved && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
          <AlertCircle size={16} className="text-green-500" /> Assessment saved successfully!
        </motion.div>
      )}
      {saveError && <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"><AlertCircle size={16} /> {saveError}</div>}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Main Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Tag size={16} className="text-indigo-600" /> Basic Information
            </h2>

            <Field label="Assessment Name" required hint="Use a clear, descriptive name students will see.">
              <input value={form.name} onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Advanced Java Programming Assessment"
                className={`${inputCls} ${errors.name ? 'border-red-400 focus:ring-red-100' : ''}`} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </Field>

            <Field label="Description" required>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                rows={3} placeholder="Describe what this assessment covers and who it's for..."
                className={`${inputCls} resize-none ${errors.description ? 'border-red-400' : ''}`} />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </Field>

            <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-violet-950"><Sparkles size={15} className="text-violet-600" /> Need ideas?</label>
                  <input value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), generateWithAI())}
                    placeholder="e.g. Java collections, database normalization"
                    className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100" />
                </div>
                <button type="button" onClick={() => generateWithAI()} disabled={generating}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white hover:bg-violet-700 disabled:opacity-60">
                  {generating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} AI assist
                </button>
              </div>
              <p className="mt-2 text-xs text-violet-700">Optional: get a topic suggestion and a draft you can review and change.</p>
              {aiError && <p className="mt-2 text-xs font-semibold text-rose-600">{aiError}</p>}
              {suggestedTopics.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{suggestedTopics.map((topic) => <button key={topic} type="button" onClick={() => generateWithAI(topic)} className="rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-100">{topic}</button>)}</div>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" required>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className={selectCls}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Difficulty" required>
                <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className={selectCls}>
                  {difficulties.map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Skills Covered" hint="Press Enter or click Add to add a skill tag.">
              <div className="flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="e.g. Java, OOP, Spring Boot"
                  className={inputCls} />
                <button onClick={addSkill} type="button"
                  className="flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors shrink-0">
                  <Plus size={14} /> Add
                </button>
              </div>
              {form.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.skills.map((s) => (
                    <span key={s} className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 border border-indigo-100">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-indigo-400 hover:text-indigo-700 transition-colors">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            <Field label="Instructions" hint="Optional rules or notes shown to students before starting.">
              <textarea value={form.instructions} onChange={(e) => set('instructions', e.target.value)}
                rows={3} placeholder="e.g. No tab switching allowed. Auto-submission enabled..."
                className={`${inputCls} resize-none`} />
            </Field>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">Assessment questions</p>
                  <p className="text-xs text-slate-500">Build the questions for this assessment.</p>
                </div>
                <div className="flex items-center gap-2"><button type="button" onClick={() => setShowManualQuestion((visible) => !visible)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"><Plus size={13} className="mr-1 inline" /> Add question</button><button type="button" onClick={() => generateWithAI(aiTopic, true)} disabled={generating} className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-white px-2.5 py-1.5 text-xs font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-60">{generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} AI assist</button><span className={`rounded-full px-3 py-1 text-xs font-bold ${questions.length ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{questions.length} ready</span></div>
              </div>
              {showManualQuestion && <div className="mt-4 space-y-3 rounded-lg border border-indigo-100 bg-white p-4">
                <p className="text-sm font-bold text-slate-800">Add a multiple-choice question</p>
                <textarea value={manualQuestion.questionText} onChange={(e) => setManualQuestion((current) => ({ ...current, questionText: e.target.value }))} rows={2} placeholder="Write your question" className={`${inputCls} resize-none`} />
                <div className="grid gap-2 sm:grid-cols-2">{manualQuestion.options.map((option, index) => <label key={index} className="flex items-center gap-2"><input type="radio" name="correct-option" checked={manualQuestion.correctOptionIndex === index} onChange={() => setManualQuestion((current) => ({ ...current, correctOptionIndex: index }))} className="accent-indigo-600" title="Mark as correct answer"/><input value={option} onChange={(e) => setManualQuestion((current) => ({ ...current, options: current.options.map((value, optionIndex) => optionIndex === index ? e.target.value : value) }))} placeholder={`Option ${index + 1}`} className={inputCls} /></label>)}</div>
                <textarea value={manualQuestion.explanation} onChange={(e) => setManualQuestion((current) => ({ ...current, explanation: e.target.value }))} rows={2} placeholder="Explanation (optional)" className={`${inputCls} resize-none`} />
                <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowManualQuestion(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600">Cancel</button><button type="button" onClick={addManualQuestion} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white">Add question</button></div>
              </div>}
              {questions.length > 0 ? <div className="mt-3 space-y-2">{questions.slice(0, 3).map((question, index) => <p key={`${question.questionText}-${index}`} className="truncate rounded-lg bg-white px-3 py-2 text-sm text-slate-700">{index + 1}. {question.questionText}</p>)}{questions.length > 3 && <p className="text-xs font-semibold text-slate-500">+ {questions.length - 3} more questions</p>}</div> : <p className="mt-3 text-xs text-amber-700">Add at least one question before publishing.</p>}
            </div>
          </motion.div>

          {/* Configuration */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" /> Assessment Configuration
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Duration (minutes)" required>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" min={5} max={180} value={form.duration}
                    onChange={(e) => set('duration', Number(e.target.value))}
                    className={`${inputCls} pl-9 ${errors.duration ? 'border-red-400' : ''}`} />
                </div>
                {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration}</p>}
              </Field>

              <Field label="Number of Questions" required>
                <div className="relative">
                  <HelpCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" min={1} max={200} value={form.questionCount}
                    onChange={(e) => set('questionCount', Number(e.target.value))}
                    className={`${inputCls} pl-9 ${errors.questionCount ? 'border-red-400' : ''}`} />
                </div>
                {errors.questionCount && <p className="mt-1 text-xs text-red-500">{errors.questionCount}</p>}
              </Field>

              <Field label="Passing Marks (%)" required>
                <div className="relative">
                  <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="number" min={1} max={100} value={form.passingMarks}
                    onChange={(e) => set('passingMarks', Number(e.target.value))}
                    className={`${inputCls} pl-9 ${errors.passingMarks ? 'border-red-400' : ''}`} />
                </div>
                {errors.passingMarks && <p className="mt-1 text-xs text-red-500">{errors.passingMarks}</p>}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Max Attempts">
                <input type="number" min={1} max={10} value={form.maxAttempts}
                  onChange={(e) => set('maxAttempts', Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Negative Marking Value" hint="Marks deducted per wrong answer (0 = disabled)">
                <input type="number" min={0} max={1} step={0.25} value={form.negativeValue}
                  onChange={(e) => set('negativeValue', Number(e.target.value))}
                  disabled={!form.negativeMarking}
                  className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`} />
              </Field>
            </div>

            {/* Toggles */}
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { key: 'negativeMarking', label: 'Negative Marking', desc: 'Deduct marks for wrong answers' },
                { key: 'shuffleQuestions', label: 'Shuffle Questions', desc: 'Randomize question order' },
                { key: 'showResult', label: 'Show Result Immediately', desc: 'Display score after submission' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <button
                    onClick={() => set(key, !form[key])}
                    className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${form[key] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    role="switch" aria-checked={form[key]}
                  >
                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-5">
          {/* Publish Status */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900">Publish Status</h2>
            <div className="space-y-2">
              {statuses.map((s) => (
                <label key={s} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${form.status === s ? 'border-indigo-300 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <input type="radio" name="status" value={s} checked={form.status === s}
                    onChange={() => set('status', s)} className="accent-indigo-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">{s}</p>
                    <p className="text-xs text-slate-400">
                      {s === 'Draft' ? 'Not visible to students' : s === 'Published' ? 'Live and accessible' : 'Hidden from all users'}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-indigo-800">Assessment Preview</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Name', value: form.name || '—' },
                { label: 'Category', value: form.category },
                { label: 'Difficulty', value: form.difficulty },
                { label: 'Duration', value: `${form.duration} min` },
                { label: 'Questions', value: form.questionCount },
                { label: 'Passing', value: `${form.passingMarks}%` },
                { label: 'Attempts', value: form.maxAttempts },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-bold text-slate-800 truncate max-w-[140px] text-right">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button onClick={() => handleSave(false)} disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-60">
              <Save size={15} /> {saving ? 'Saving...' : 'Save as Draft'}
            </button>
            <button onClick={() => handleSave(true)} disabled={publishing}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors disabled:opacity-60">
              <Send size={15} /> {publishing ? 'Publishing...' : 'Publish Assessment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
