import { type ReactNode } from 'react';
import Spinner from './Spinner';

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'main' | 'outline';
  type?: 'button' | 'submit';
  className?: string;
  isLoading?: boolean;
}
export default function Button({
  variant = 'main',
  onClick,
  children,
  type = 'button',
  className: classname,
  isLoading,
}: ButtonProps) {
  const className =
    variant === 'main'
      ? 'text-violet-100 bg-violet-500 text-xl p-4 rounded-r-xl hover:bg-violet-700 transition-all disabled:bg-bg-violet-100 flex justify-center'
      : 'p-4 border border-violet-500 w-32 rounded bg-violet-300 disabled:bg-bg-violet-100 flex justify-center';

  return (
    <button
      disabled={isLoading}
      type={type}
      onClick={onClick}
      className={className + ' ' + classname}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
