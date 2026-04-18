import type { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-[28px] border border-white/60 bg-white/95 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}
