import Image from 'next/image';
import { getEmotionSvgPath } from '@/shared/constants/emotionMap';

interface EmotionIconProps {
  name: string;
  size?: number;
}

export default function EmotionIcon({ name, size = 24 }: EmotionIconProps) {
  const src = getEmotionSvgPath(name);
  if (!src) return null;
  return <Image src={src} alt={name} width={size} height={size} loading="lazy" />;
}
