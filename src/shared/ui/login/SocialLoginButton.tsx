import Image from 'next/image';
import { cn } from '@/shared/lib/utils';

interface SocialLoginButtonProps {
  imageUrl: string;
  imageSize?: number;
  text: string;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  rounded?: string;
  fontFamily?: string;
  fontWeight?: 'medium' | 'semibold';
  gap?: string;
  onClick?: () => void;
}

export default function SocialLoginButton({
  imageUrl,
  imageSize = 18,
  text,
  bgColor,
  textColor,
  borderColor,
  rounded = 'rounded-[6px]',
  fontFamily,
  fontWeight = 'semibold',
  gap = 'gap-2',
  onClick,
}: SocialLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-11.25 w-full cursor-pointer items-center justify-center px-3.5',
        rounded,
        gap,
        borderColor && 'border'
      )}
      style={{
        backgroundColor: bgColor,
        borderColor,
      }}
    >
      <Image src={imageUrl} alt={text} width={imageSize} height={imageSize} />
      <span
        className={cn('text-[15px]', fontWeight === 'medium' ? 'font-medium' : 'font-semibold')}
        style={{ color: textColor, fontFamily }}
      >
        {text}
      </span>
    </button>
  );
}
