import type { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">{children}</section>;
}
