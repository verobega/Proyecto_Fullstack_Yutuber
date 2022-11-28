import { type ReactNode } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'main' | 'outline';
  type?: 'button' | 'submit';
}
export default function Button({
  variant = 'main',
  onClick,
  children,
  type = 'button',
}: ButtonProps) {
  const className =
    variant === 'main'
      ? 'text-violet-100 bg-violet-500 text-xl p-4 rounded-r-xl hover:bg-violet-700 transition-all'
      : 'p-4 border border-violet-500 w-32 rounded bg-violet-300';

  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}
