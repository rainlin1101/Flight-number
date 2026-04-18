import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'primary' | 'secondary' | 'danger' | 'neutral';
  fullWidth?: boolean;
}

const toneClasses: Record<NonNullable<AppButtonProps['tone']>, string> = {
  primary:
    'bg-gradient-to-b from-lime-400 to-lime-500 text-white border border-lime-300/80 shadow-[0_6px_0_0_#4d7c0f] active:translate-y-[2px] active:shadow-[0_4px_0_0_#4d7c0f]',
  secondary:
    'bg-gradient-to-b from-sky-400 to-sky-500 text-white border border-sky-300/80 shadow-[0_6px_0_0_#0369a1] active:translate-y-[2px] active:shadow-[0_4px_0_0_#0369a1]',
  danger:
    'bg-gradient-to-b from-rose-400 to-rose-500 text-white border border-rose-300/80 shadow-[0_6px_0_0_#be123c] active:translate-y-[2px] active:shadow-[0_4px_0_0_#be123c]',
  neutral:
    'bg-white text-slate-700 border border-slate-200 shadow-[0_5px_0_0_#cbd5e1] active:translate-y-[2px] active:shadow-[0_3px_0_0_#cbd5e1]',
};

export function AppButton({
  children,
  tone = 'primary',
  fullWidth = true,
  className,
  ...props
}: PropsWithChildren<AppButtonProps>) {
  return (
    <button
      className={`rounded-2xl px-4 py-3.5 text-base font-extrabold tracking-wide transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${toneClasses[tone]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
