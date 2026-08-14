import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Play, Send, ChevronDown, Terminal, CheckCircle2, XCircle,
  Clock, Cpu, MemoryStick, Maximize2, RotateCcw, BookOpen,
  AlertCircle, ChevronRight,
} from 'lucide-react';
import Badge from '../../components/ui/Badge';

const problem = {
  title: 'Two Sum',
  difficulty: 'Easy',
  category: 'Arrays & Hashing',
  timeLimit: '1 second',
  memoryLimit: '256 MB',
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
    { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6, return [1, 2].' },
  ],
  constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'],
};

const testCases = [
  { id: 1, input: '[2,7,11,15], 9', expected: '[0,1]', status: 'passed', time: '12ms', memory: '42MB' },
  { id: 2, input: '[3,2,4], 6', expected: '[1,2]', status: 'passed', time: '8ms', memory: '41MB' },
  { id: 3, input: '[3,3], 6', expected: '[0,1]', status: 'failed', time: '—', memory: '—' },
];

const languages = ['Java', 'Python', 'JavaScript', 'C++', 'Go'];
const themes = ['Dark', 'Light', 'Monokai', 'Dracula'];

const starterCode = {
  Java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}`,
  Python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution here\n        pass`,
  JavaScript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your solution here\n    \n};`,
};

export default function CodingAssessment() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('Java');
  const [theme, setTheme] = useState('Dark');
  const [code, setCode] = useState(starterCode.Java);
  const [activeTab, setActiveTab] = useState('testcases');
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft] = useState('28:45');

  const handleLangChange = (l) => { setLang(l); setCode(starterCode[l] || starterCode.Java); };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setActiveTab('output'); }, 1200);
  };

  const handleSubmit = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setSubmitted(true); setActiveTab('output'); }, 1800);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-900 text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2.5 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
            <ChevronRight size={16} className="rotate-180" />
          </button>
          <span className="text-sm font-bold text-white">{problem.title}</span>
          <Badge label={problem.difficulty} />
          <Badge label={problem.category} variant="indigo" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-1.5">
            <Clock size={14} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-400 tabular-nums">{timeLeft}</span>
          </div>
          <button onClick={handleRun} disabled={running}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-bold hover:bg-teal-500 disabled:opacity-60 transition-colors">
            <Play size={14} /> {running ? 'Running...' : 'Run Code'}
          </button>
          <button onClick={handleSubmit} disabled={running}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-bold hover:bg-blue-500 disabled:opacity-60 transition-colors">
            <Send size={14} /> Submit
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem Statement */}
        <div className="w-[420px] shrink-0 flex flex-col border-r border-slate-700 overflow-y-auto bg-slate-800">
          <div className="p-5 space-y-5">
            {/* Problem Header */}
            <div>
              <h1 className="text-lg font-extrabold text-white">{problem.title}</h1>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={11} /> {problem.timeLimit}</span>
                <span className="flex items-center gap-1"><Cpu size={11} /> {problem.timeLimit}</span>
                <span className="flex items-center gap-1"><MemoryStick size={11} /> {problem.memoryLimit}</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{problem.description}</div>

            {/* Examples */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Examples</h3>
              {problem.examples.map((ex, i) => (
                <div key={i} className="rounded-xl bg-slate-900 p-4 text-xs font-mono space-y-1.5">
                  <div><span className="text-slate-400">Input: </span><span className="text-green-400">{ex.input}</span></div>
                  <div><span className="text-slate-400">Output: </span><span className="text-blue-400">{ex.output}</span></div>
                  <div><span className="text-slate-400">Explanation: </span><span className="text-slate-300">{ex.explanation}</span></div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Constraints</h3>
              <ul className="space-y-1">
                {problem.constraints.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <code className="font-mono">{c}</code>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Editor + Output */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2 shrink-0">
            <div className="flex items-center gap-2">
              {languages.map((l) => (
                <button key={l} onClick={() => handleLangChange(l)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${lang === l ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}>
                  {l}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select value={theme} onChange={(e) => setTheme(e.target.value)}
                  className="appearance-none rounded-lg bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 focus:outline-none cursor-pointer">
                  {themes.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={10} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Reset code">
                <RotateCcw size={14} />
              </button>
              <button className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Fullscreen">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 overflow-hidden bg-slate-900">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="h-full w-full resize-none bg-transparent p-5 font-mono text-sm text-slate-100 focus:outline-none leading-relaxed"
              style={{ tabSize: 2 }}
            />
          </div>

          {/* Output Panel */}
          <div className="h-52 shrink-0 border-t border-slate-700 bg-slate-800 flex flex-col">
            <div className="flex items-center gap-1 border-b border-slate-700 px-4 py-2">
              {['testcases', 'output'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold capitalize transition-colors ${activeTab === tab ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>
                  {tab === 'testcases' ? 'Test Cases' : 'Output'}
                </button>
              ))}
              <Terminal size={13} className="ml-auto text-slate-500" />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'testcases' ? (
                <div className="space-y-2">
                  {testCases.map((tc) => (
                    <div key={tc.id} className="flex items-center gap-3 rounded-lg bg-slate-900 px-3 py-2 text-xs">
                      {tc.status === 'passed'
                        ? <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                        : <XCircle size={14} className="text-red-400 shrink-0" />}
                      <span className="text-slate-400 font-mono">Case {tc.id}:</span>
                      <span className="text-slate-300 font-mono flex-1 truncate">{tc.input}</span>
                      {tc.status === 'passed' && (
                        <>
                          <span className="text-slate-500">{tc.time}</span>
                          <span className="text-slate-500">{tc.memory}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {submitted ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-3 rounded-xl bg-green-900/30 border border-green-700 p-3">
                      <CheckCircle2 size={18} className="text-green-400" />
                      <div>
                        <p className="text-sm font-bold text-green-400">Accepted</p>
                        <p className="text-xs text-slate-400">2/3 test cases passed · Runtime: 12ms · Memory: 42MB</p>
                      </div>
                    </motion.div>
                  ) : running ? (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <RotateCcw size={14} />
                      </motion.div>
                      Executing code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <AlertCircle size={14} />
                      Run your code to see output here.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
