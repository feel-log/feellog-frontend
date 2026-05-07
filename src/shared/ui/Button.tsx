'use client';

import { cn } from '@/shared/lib/utils';

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
  const baseStyles = 'font-medium transition-colors rounded-[10px] cursor-pointer';

  const variantStyles = {
    primary: disabled
      ? 'bg-[#E5E5E5] text-[#9FA4A8] cursor-not-allowed'
      : 'bg-[#13278a] text-white cursor-pointer',
    secondary: isActive
      ? 'border border-black text-black'
      : 'border border-gray-300 text-gray-700 opacity-45',
    outline: 'border border-gray-200 text-gray-900 hover:border-gray-300',
  };

  const sizeStyles = {
    sm: 'px-5 py-1 text-[14px]',
    md: 'px-6 py-2',
    lg: 'h-13.5 w-full px-4 text-[20px] font-semibold tracking-[-0.025em]',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled}
      {...props}
    />
  );
}
