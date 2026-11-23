export default function GlobalLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
      <h3 className="text-base font-bold text-slate-800">Loading Content</h3>
      <p className="text-xs text-slate-500 mt-1">Please wait a moment while we retrieve your data...</p>
    </div>
  );
}
