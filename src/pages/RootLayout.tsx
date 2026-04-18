import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-slate-50 px-4 py-5 text-slate-900">
      <Outlet />
      <footer className="mt-10 pb-4 text-center text-xs text-slate-500">Copyright fuzelin</footer>
    </div>
  );
}
