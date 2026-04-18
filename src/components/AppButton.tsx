import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'danger' | 'neutral';
  fullWidth?: boolean;
}

const toneClasses: Record<NonNullable<AppButtonProps['tone']>, string> = {
  primary: 'bg-blue-600 text-white active:bg-blue-700',
  secondary: 'bg-emerald-600 text-white active:bg-emerald-700',
  danger: 'bg-rose-600 text-white active:bg-rose-700',
  neutral: 'bg-slate-100 text-slate-800 active:bg-slate-200',
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
      className={`rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses[resolvedTone]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
