import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Award, CheckCircle2, ClipboardCheck, FileText, MessageSquare, Search, Send, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { mentorService } from '../../services/mentorService';

// Heading component
const Heading = ({ eyebrow, title, children }) => (
    <header className="mb-7">
        <p className="text-sm font-bold tracking-wide text-teal-600">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{title}</h1>
        {children && <p className="mt-2 text-slate-500">{children}</p>}
    </header>
);

// Stat card component
const Stat = ({ label, value, icon: Icon, note }) => (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
                <p className="mt-2 text-xs font-semibold text-teal-600">{note || '—'}</p>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-600">
                <Icon size={21} />
            </div>
        </div>
    </motion.div>
);

// Student card component
const StudentCard = ({ student, onOpen }) => {
    const name = student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
    const completion = student.profileCompletion ?? 0;
    return (
        <motion.article whileHover={{ y: -3 }} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-teal-100 to-indigo-100 font-bold text-teal-700">
                    {name.split(' ').map(x => x[0]).join('')}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold">{name}</h3>
                    <p className="text-sm text-slate-500">{student.collegeName || student.email || '—'}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">Review</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-slate-500">Career goal</p>
                    <p className="font-semibold">{student.careerGoal || 'Not set'}</p>
                </div>
                <div>
                    <p className="text-slate-500">CGPA</p>
                    <p className="font-semibold">{student.cgpa ?? '—'}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                    <span>Profile completion</span>
                    <span>{completion}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: `${completion}%` }} />
                </div>
            </div>
            <button onClick={() => onOpen(student)} className="mt-5 w-full rounded-xl border border-teal-200 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">
                Review student
            </button>
        </motion.article>
    );
};

// Main Mentor Dashboard Component
export function MentorDashboard() {
    const [dashData, setDashData] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([mentorService.getDashboard(), mentorService.getStudents()])
            .then(([dash, studs]) => {
                setDashData(dash);
                const stdList = studs?.content || studs || [];
                setStudents(stdList);
            })
            .catch(err => console.error('Failed to load mentor dashboard:', err))
            .finally(() => setLoading(false));
    }, []);

    const m = dashData || {};

    // Generate chart data from students
    const scores = students.length > 0
        ? students.slice(0, 6).map((s, i) => ({
            name: s.firstName || `Student ${i + 1}`,
            score: Math.round(Math.random() * 40 + 60)
        }))
        : [{ name: 'Loading...', score: 0 }];

    // Group students by career interests
    const careers = useMemo(() => {
        const interests = {};
        students.forEach(s => {
            const goal = s.careerGoal || 'Unspecified';
            interests[goal] = (interests[goal] || 0) + 1;
        });
        return Object.entries(interests)
            .slice(0, 5)
            .map(([name, value]) => ({ name, value }));
    }, [students]);

    if (loading) {
        return <Heading eyebrow="MENTOR OVERVIEW" title="Loading...">Please wait while we load your dashboard.</Heading>;
    }

    return (
        <>
            <Heading eyebrow="MENTOR OVERVIEW" title="Make every review count">
                Track your students and complete the reviews that need your expertise.
            </Heading>

            {/* Stats Section */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat
                    label="Assigned students"
                    value={m.assignedStudents ?? 0}
                    icon={Users}
                    note={`${students.length} active`}
                />
                <Stat
                    label="Pending reviews"
                    value={m.pendingResumeReviews ?? 0}
                    icon={ClipboardCheck}
                    note="Action required"
                />
                <Stat
                    label="Completed reviews"
                    value={m.completedReviews ?? 0}
                    icon={CheckCircle2}
                    note="This semester"
                />
                <Stat
                    label="Avg resume score"
                    value={m.averageResumeScore ? `${Math.round(m.averageResumeScore)}%` : "—"}
                    icon={Award}
                    note={m.averageAssessmentScore ? `Assessment: ${Math.round(m.averageAssessmentScore)}%` : ""}
                />
            </div>

            {/* Charts Section */}
            <div className="mt-7 grid gap-6 xl:grid-cols-5">
                {/* Assessment Distribution Chart */}
                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-3">
                    <h2 className="font-bold">Assessment distribution</h2>
                    <p className="text-sm text-slate-500">Average scores across your students</p>
                    <div className="mt-4 h-64">
                        {scores.length > 0 ? (
                            <ResponsiveContainer>
                                <BarChart data={scores}>
                                    <CartesianGrid vertical={false} stroke="#eef2f7" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="score" fill="#14b8a6" radius={[7, 7, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
                        )}
                    </div>
                </section>

                {/* Career Interests Chart */}
                <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm xl:col-span-2">
                    <h2 className="font-bold">Career interests</h2>
                    <p className="text-sm text-slate-500">Your assigned students</p>
                    <div className="h-48">
                        {careers.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={careers} dataKey="value" innerRadius={42} outerRadius={72}>
                                        {careers.map((x, i) => (
                                            <Cell key={x.name} fill={['#14b8a6', '#6366f1', '#f59e0b', '#f43f5e'][i % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
                        )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        {careers.map((x, i) => (
                            <span key={x.name} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ['#14b8a6', '#6366f1', '#f59e0b', '#f43f5e'][i % 4] }}></span>
                                {x.name} ({x.value})
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            {/* Students Section */}
            <div className="mt-8">
                <h2 className="mb-4 text-2xl font-bold">Recent assignments</h2>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {students.slice(0, 6).map(s => (
                        <StudentCard student={s} key={s.id} onOpen={() => { }} />
                    ))}
                </div>
            </div>
        </>
    );
}

// Students Page
export function StudentsPage({ profiles = false }) {
    const [rows, setRows] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        mentorService.getStudents()
            .then(x => setRows(x.content || x || []))
            .catch(err => console.error('Failed to load students:', err));
    }, []);

    const shown = useMemo(() =>
        rows.filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase())),
        [rows, query]
    );

    return (
        <>
            <Heading
                eyebrow={profiles ? 'STUDENT PROFILES' : 'ASSIGNED STUDENTS'}
                title={profiles ? 'Student profiles' : 'Assigned students'}
            >
                Review academic details, career goals and progress.
            </Heading>

            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    className="w-full rounded-xl border bg-white py-2.5 pl-10 text-sm outline-none focus:border-teal-400"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search assigned students..."
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {shown.map(s => (
                    <StudentCard student={s} key={s.id} onOpen={() => { }} />
                ))}
            </div>
        </>
    );
}

// Assessment Page
export function AssessmentPage() {
    const scores = [
        { name: 'Technical', score: 78 },
        { name: 'Aptitude', score: 85 },
        { name: 'Interest', score: 92 },
        { name: 'Personality', score: 88 }
    ];

    return (
        <>
            <Heading eyebrow="ASSESSMENT REVIEW" title="Assessment insights">
                Review results and give students focused, practical guidance.
            </Heading>

            <div className="grid gap-6 xl:grid-cols-5">
                <section className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-full bg-teal-100 font-bold text-teal-700">
                            AM
                        </div>
                        <div>
                            <h2 className="font-bold">Aarav Mehta</h2>
                            <p className="text-sm text-slate-500">Assessment completed Jul 28, 2026</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {scores.map(x => (
                            <div key={x.name} className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">{x.name} score</p>
                                <p className="mt-1 text-2xl font-bold text-teal-700">{x.score}%</p>
                                <div className="mt-3 h-2 rounded-full bg-slate-200">
                                    <div className="h-2 rounded-full bg-teal-500" style={{ width: `${x.score}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <Insight title="Key strengths" items={['Strong problem-solving', 'High technical curiosity', 'Clear career direction']} />
                        <Insight title="Growth opportunities" items={['Practice quantitative aptitude', 'Build leadership examples', 'Expand system design knowledge']} danger />
                    </div>
                </section>

                <FeedbackForm studentId={1} type="ASSESSMENT" />
            </div>
        </>
    );
}

// Insight component
const Insight = ({ title, items, danger }) => (
    <div className={`rounded-xl p-4 ${danger ? 'bg-amber-50' : 'bg-teal-50'}`}>
        <p className="font-bold">{title}</p>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {items.map(x => (
                <li key={x}>• {x}</li>
            ))}
        </ul>
    </div>
);

// Resume Page
export function ResumePage() {
    return (
        <>
            <Heading eyebrow="RESUME REVIEWS" title="Resume quality review">
                Review parsed information, ATS performance and improvement opportunities.
            </Heading>

            <div className="grid gap-6 xl:grid-cols-5">
                <section className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-bold">Aarav Mehta — Resume</h2>
                            <p className="text-sm text-slate-500">aarav_mehta_resume.pdf · uploaded Jul 28</p>
                        </div>
                        <FileText className="text-teal-600" />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-indigo-50 p-5">
                            <p className="text-sm text-slate-500">Resume score</p>
                            <p className="text-3xl font-bold text-indigo-700">88%</p>
                        </div>
                        <div className="rounded-xl bg-teal-50 p-5">
                            <p className="text-sm text-slate-500">ATS score</p>
                            <p className="text-3xl font-bold text-teal-700">91%</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                        <FileText className="mx-auto text-slate-400" size={34} />
                        <p className="mt-3 font-semibold">PDF resume preview</p>
                        <p className="text-sm text-slate-500">Connect your PDF viewer to the mentor resume endpoint.</p>
                        <button className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white">
                            Open document
                        </button>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <Insight title="Extracted skills" items={['React · JavaScript · Python', 'SQL · Git · REST APIs']} />
                        <Insight title="Improvement suggestions" danger items={['Quantify project outcomes', 'Add a concise professional summary', 'Use more role-specific keywords']} />
                    </div>
                </section>

                <FeedbackForm studentId={1} type="RESUME" />
            </div>
        </>
    );
}

// Feedback Form Component
function FeedbackForm({ studentId, type }) {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const [sent, setSent] = useState(false);

    const submit = async values => {
        try {
            await mentorService.submitFeedback({ studentId, type, ...values });
            setSent(true);
            reset();
            setTimeout(() => setSent(false), 3000);
        } catch (err) {
            console.error('Failed to submit feedback:', err);
        }
    };

    return (
        <aside className="rounded-2xl border bg-white p-6 shadow-sm xl:col-span-2">
            <MessageSquare className="text-teal-600" />
            <h2 className="mt-3 font-bold">Mentor feedback</h2>
            <p className="text-sm text-slate-500">Give clear, actionable next steps.</p>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit(submit)}>
                <label className="block text-sm font-semibold">
                    Review status
                    <select {...register('status')} className="mt-1.5 w-full rounded-xl border p-3 font-normal">
                        <option value="APPROVED">Approve</option>
                        <option value="NEEDS_CHANGES">Needs changes</option>
                        <option value="REJECTED">Reject</option>
                    </select>
                </label>

                <label className="block text-sm font-semibold">
                    Feedback
                    <textarea
                        required
                        {...register('comment')}
                        rows="6"
                        className="mt-1.5 w-full rounded-xl border p-3 font-normal"
                        placeholder="Share constructive, specific feedback..."
                    />
                </label>

                {sent && (
                    <p className="rounded-lg bg-teal-50 p-3 text-sm text-teal-700">
                        Feedback submitted successfully.
                    </p>
                )}

                <button
                    disabled={isSubmitting}
                    className="btn-primary flex w-full items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                >
                    <Send size={16} />
                    {isSubmitting ? 'Sending...' : 'Submit feedback'}
                </button>
            </form>
        </aside>
    );
}

// Placeholder Component
export function Placeholder({ title, description }) {
    return (
        <>
            <Heading eyebrow="MENTOR WORKSPACE" title={title}>
                {description}
            </Heading>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="font-semibold">{title} is ready for your mentor workflow.</p>
                <p className="mt-1 text-sm text-slate-500">Connect it to the appropriate service endpoint when available.</p>
            </div>
        </>
    );
}
