'use client';

import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isActive?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isActive = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-colors rounded-lg';

  const variantStyles = {
    primary: disabled
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-[#13278a] text-white hover:bg-gray-800 cursor-pointer',
    secondary: isActive
      ? 'border border-black text-black'
      : 'border border-gray-300 text-gray-700 hover:border-gray-400 opacity-45',
    outline: 'border border-gray-200 text-gray-900 hover:border-gray-300',
  };

  const sizeStyles = {
    sm: 'px-5 py-1 text-[14px]',
    md: 'px-6 py-2',
    lg: 'px-6 py-3 w-full',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled}
      {...props}
    />
  );
}
