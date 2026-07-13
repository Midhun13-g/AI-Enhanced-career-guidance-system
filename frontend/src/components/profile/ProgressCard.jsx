export default function ProgressCard({ completion }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Profile Completion</h3>
          <p className="text-sm text-slate-500">Complete your profile to unlock better recommendations.</p>
        </div>
        <div className="text-3xl font-semibold text-blue-600">{completion?.profileCompletion ?? 0}%</div>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-blue-600" style={{ width: `${completion?.profileCompletion ?? 0}%` }} />
      </div>
      {completion?.missingFields?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">Missing fields</p>
          <div className="flex flex-wrap gap-2">
            {completion.missingFields.map((field) => (
              <span key={field} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{field}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
