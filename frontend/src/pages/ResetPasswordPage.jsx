export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-2">Reset password</h2>
        <p className="text-sm text-slate-500 mb-6">This screen is ready for reset password integration.</p>
        <input className="w-full border rounded px-3 py-2 mb-4" type="password" placeholder="New password" />
        <button className="w-full rounded bg-blue-600 px-4 py-2 text-white">Reset password</button>
      </div>
    </div>
  );
}
