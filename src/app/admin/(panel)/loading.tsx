/*
 * Shown instantly while an admin page loads. Every admin page reads the sign-in
 * session (request-time data), so this boundary keeps navigation between admin
 * pages instant instead of blocking until the session check finishes.
 */
const AdminLoading = () => (
  <div aria-busy="true" className="flex flex-col gap-3 p-4 lg:p-6">
    <span className="sr-only">Loading…</span>
    <div className="h-8 w-48 animate-pulse rounded-md bg-media-frame" />
    <div className="h-10 w-full max-w-120 animate-pulse rounded-md bg-media-frame" />
    <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
  </div>
);

export default AdminLoading;
