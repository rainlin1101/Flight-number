import type { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return <section className="rounded-3xl bg-white p-4 shadow-[0_6px_0_0_#e2e8f0] ring-1 ring-slate-100">{children}</section>;
}
