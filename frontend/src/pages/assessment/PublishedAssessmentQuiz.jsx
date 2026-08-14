import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../services/api';

export default function PublishedAssessmentQuiz() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/api/assessment/published/${assessmentId}`)
      .then((response) => setAssessment(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'This assessment is no longer available.'));
  }, [assessmentId]);

  if (error) return <AppLayout><div className="mx-auto max-w-3xl rounded-2xl bg-red-50 p-6 text-red-700">{error}</div></AppLayout>;
  if (!assessment) return <AppLayout><div className="mx-auto max-w-3xl p-6 text-slate-500">Loading assessment…</div></AppLayout>;
  if (!assessment.questions.length) return <AppLayout><div className="mx-auto max-w-3xl rounded-2xl bg-amber-50 p-6 text-amber-800">This assessment has no active questions.</div></AppLayout>;

  const question = assessment.questions[current];
  const answered = Object.keys(answers).length;
  const isLast = current === assessment.questions.length - 1;
  const finish = async () => { setSubmitting(true); setError(''); try { const response = await api.post(`/api/assessment/published/${assessmentId}/submit`, { answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId: Number(questionId), optionId })), timeTakenSecs: null }); navigate(`/assessments/quiz/${assessmentId}/result/${response.data.attemptId}`); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to submit the assessment.'); setSubmitting(false); } };

  return <AppLayout><main className="mx-auto max-w-4xl">
    <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800"><ChevronLeft size={16}/> Back to assessment</button>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white">
      <div><p className="text-xs font-bold uppercase tracking-wider text-blue-100">{assessment.category} · {assessment.difficulty}</p><h1 className="mt-1 text-xl font-extrabold">{assessment.title}</h1></div>
      <span className="inline-flex items-center gap-2 text-sm font-bold"><Clock size={16}/>{assessment.durationMinutes} minutes</span>
    </div>
    <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-600"><span>Question {current + 1} of {assessment.questions.length}</span><span>{answered} answered</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${((current + 1) / assessment.questions.length) * 100}%` }}/></div>
    <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-card"><h2 className="text-xl font-bold text-slate-900">{question.questionText}</h2><div className="mt-6 grid gap-3">{question.options.map((option, index) => <button key={option.id} onClick={() => setAnswers((value) => ({ ...value, [question.id]: option.id }))} className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${answers[question.id] === option.id ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'}`}><span className="mr-3 inline-grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs">{String.fromCharCode(65 + index)}</span>{option.text}</button>)}</div></section>
    {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 flex justify-between gap-3"><button disabled={!current || submitting} onClick={() => setCurrent((value) => value - 1)} className="rounded-xl border px-4 py-2.5 text-sm font-bold disabled:opacity-40">Previous</button>{isLast ? <button disabled={answered !== assessment.questions.length || submitting} onClick={finish} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-40"><CheckCircle2 size={16}/>{submitting ? 'Submitting…' : 'Finish'}</button> : <button disabled={submitting} onClick={() => setCurrent((value) => value + 1)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white">Next <ChevronRight size={16}/></button>}</div>
  </main></AppLayout>;
}
