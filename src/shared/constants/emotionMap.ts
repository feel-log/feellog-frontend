export const EMOTION_NAME_TO_SVG: Record<string, string> = {
  기쁨: 'happy',
  설렘: 'flut',
  뿌듯함: 'proud',
  고마움: 'thanks',
  짜증: 'annoy',
  화남: 'angry',
  불안함: 'anxios',
  슬픔: 'sad',
  스트레스: 'stress',
  우울함: 'depressed',
  심심함: 'boring',
  피곤함: 'tired',
  공허함: 'emptiness',
  외로움: 'lonely',
  충동: 'impulse',
};

export function getEmotionSvgPath(name: string): string | null {
  const key = EMOTION_NAME_TO_SVG[name];
  return key ? `/svg/emo/${key}.svg` : null;
}
