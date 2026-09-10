import React, { useMemo, useState } from 'react';
import { FiCode, FiCopy, FiCheck, FiDownload, FiSearch, FiChevronDown, FiChevronRight, FiBox } from 'react-icons/fi';

function parseRawPayload(rawData) {
  if (!rawData) return { parsed: null, source: 'none', error: null };
  const rawStr = rawData.raw_ai_response ?? rawData.rawAiResponse ?? null;
  if (typeof rawStr === 'string' && rawStr.trim()) {
    try {
      const parsed = JSON.parse(rawStr);
      return { parsed, source: 'raw_ai_response', error: null };
    } catch (err) {
      return { parsed: null, source: 'raw_ai_response', error: 'Stored raw_ai_response is not valid JSON: ' + err.message };
    }
  }
  // Fallback: show the whole mapped response object
  return { parsed: rawData, source: 'mapped_response', error: null };
}

function countKeys(value) {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') return Object.keys(value).length;
  return 0;
}

function JsonNode({ name, value, depth = 0, defaultExpanded = true, search = '' }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isObj = value !== null && typeof value === 'object';
  const isArr = Array.isArray(value);

  const matchesSearch = (key, val) => {
    if (!search) return true;
    const s = search.toLowerCase();
    if (String(key).toLowerCase().includes(s)) return true;
    if (!isObj && String(val).toLowerCase().includes(s)) return true;
    return false;
  };

  if (!isObj) {
    return (
      <div className="flex gap-2 py-0.5 leading-relaxed">
        {name !== undefined && <span className="text-sky-300 shrink-0">"{name}":</span>}
        <span className={value === null ? 'text-neutral-500' : typeof value === 'string' ? 'text-emerald-300 break-all' : typeof value === 'number' ? 'text-amber-300' : typeof value === 'boolean' ? 'text-fuchsia-300' : 'text-neutral-300'}>
          {value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value)}
        </span>
      </div>
    );
  }

  const keys = Object.keys(value);
  const label = isArr ? `Array(${value.length})` : `Object(${keys.length})`;

  return (
    <div className="py-0.5">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 hover:bg-white/5 rounded px-1 -ml-1 transition-colors text-left"
      >
        {expanded ? <FiChevronDown size={13} className="text-neutral-500 shrink-0" /> : <FiChevronRight size={13} className="text-neutral-500 shrink-0" />}
        {name !== undefined && <span className="text-sky-300">"{name}":</span>}
        <span className="text-neutral-500 text-[11px]">
          {isArr ? '[' : '{'} {label} {isArr ? ']' : '}'}
        </span>
        {!expanded && <span className="text-neutral-600 text-[11px] truncate max-w-[400px]">{isArr ? '[ … ]' : '{ … }'}</span>}
      </button>
      {expanded && (
        <div className="ml-4 pl-3 border-l border-white/10 mt-0.5 space-y-0.5">
          {(isArr ? value : keys).map((item, idx) => {
            const k = isArr ? idx : item;
            const v = isArr ? item : value[item];
            if (search && typeof v !== 'object') {
              if (!matchesSearch(k, v)) return null;
            }
            return (
              <JsonNode
                key={k}
                name={isArr ? undefined : k}
                value={v}
                depth={depth + 1}
                defaultExpanded={depth < 1}
                search={search}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RawModelOutput({ rawData }) {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const { parsed, source, error } = useMemo(() => parseRawPayload(rawData), [rawData]);

  const prettyText = useMemo(() => {
    if (!parsed) return '';
    try {
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(parsed);
    }
  }, [parsed]);

  const sizeKb = useMemo(() => (prettyText ? (new Blob([prettyText]).size / 1024).toFixed(1) : '0'), [prettyText]);
  const topKeys = useMemo(() => (parsed && typeof parsed === 'object' ? Object.keys(Array.isArray(parsed) ? (parsed[0] ?? {}) : parsed) : []), [parsed]);

  if (!rawData) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-xs font-mono text-neutral-400">
        No model output available yet. Upload a resume to generate raw JSON.
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prettyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  const handleDownload = () => {
    const blob = new Blob([prettyText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-model-output-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-neutral-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center">
              <FiCode size={15} />
            </span>
            <div>
              <h2 className="text-sm font-bold text-neutral-950">Full Raw Model Output</h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Source: <span className="text-neutral-700 font-bold">{source === 'raw_ai_response' ? 'raw_ai_response (complete HF pipeline payload)' : 'mapped backend response'}</span>
                {' '}• {sizeKb} KB • {countKeys(Array.isArray(parsed) ? parsed[0] ?? parsed : parsed)} top-level keys
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandAll((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-1.5 text-[11px] font-mono font-bold text-neutral-700 transition-all"
            >
              <FiBox size={12} />
              {expandAll ? 'Collapse view' : 'Expand hint'}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 px-3 py-1.5 text-[11px] font-mono font-bold text-neutral-700 transition-all"
            >
              {copied ? <FiCheck size={12} className="text-emerald-500" /> : <FiCopy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 px-3 py-1.5 text-[11px] font-mono font-bold text-white transition-all"
            >
              <FiDownload size={12} />
              Download JSON
            </button>
          </div>
        </div>

        {topKeys.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topKeys.slice(0, 20).map((k) => (
              <span key={k} className="rounded-md bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-600">
                {k}
              </span>
            ))}
          </div>
        )}

        <div className="relative">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter keys / values in raw JSON… (e.g. selected_role, roadmap_phases, skills_to_learn)"
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 py-2 text-xs font-mono text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Body */}
      {error ? (
        <div className="p-5 text-xs font-mono text-rose-600">{error}</div>
      ) : (
        <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">
          {/* Tree view */}
          <div className="bg-neutral-950 text-neutral-100 p-5 overflow-auto max-h-[560px] font-mono text-xs">
            <JsonNode key={expandAll ? 'expanded' : 'collapsed'} value={parsed} defaultExpanded search={search.trim()} />
          </div>
          {/* Pretty text view */}
          <div className="bg-black/90 p-5 overflow-auto max-h-[560px]">
            <pre className="font-mono text-[11px] leading-relaxed text-emerald-300 whitespace-pre-wrap break-all">{prettyText}</pre>
          </div>
        </div>
      )}

      <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50 text-[10px] font-mono text-neutral-400">
        This is the complete JSON returned by your resume model (Hugging Face pipeline), including unmapped fields like final_result, selected_role, step outputs, top_5_roles, roadmap_phases and explanations. Nothing is hidden or truncated.
      </div>
    </div>
  );
}
