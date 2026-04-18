import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'danger' | 'neutral';
  fullWidth?: boolean;
}

const toneClasses: Record<NonNullable<AppButtonProps['tone']>, string> = {
  primary: 'bg-lime-500 text-white shadow-[0_4px_0_0_#4d7c0f] active:translate-y-[2px] active:shadow-[0_2px_0_0_#4d7c0f]',
  secondary: 'bg-sky-500 text-white shadow-[0_4px_0_0_#0369a1] active:translate-y-[2px] active:shadow-[0_2px_0_0_#0369a1]',
  danger: 'bg-rose-500 text-white shadow-[0_4px_0_0_#be123c] active:translate-y-[2px] active:shadow-[0_2px_0_0_#be123c]',
  neutral: 'bg-white text-slate-700 ring-1 ring-slate-200 shadow-[0_3px_0_0_#e2e8f0] active:translate-y-[2px] active:shadow-[0_1px_0_0_#e2e8f0]',
};

export function AppButton({
  children,
  tone = 'primary',
  fullWidth = true,
  className,
  ...props
}: PropsWithChildren<AppButtonProps>) {
  const resolvedTone = tone ?? 'primary';
  return (
    <button
      className={`rounded-2xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses[resolvedTone]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
