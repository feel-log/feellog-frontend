import Image from 'next/image';

export default function SocialLoginButton({ imageUrl, text, color, textColor }: { imageUrl: string, text: string, color: string, textColor: string }) {
  return (
    <button className={"w-3/4 py-4 px-5 rounded-[8px] flex items-center cursor-pointer"} style={{ backgroundColor: color}}>
      <Image src={imageUrl} alt={text} width={20} height={20} />
      <span className={"absolute left-1/2 -translate-x-1/2 text-[13px]"} style={{ color: textColor }}>{text}</span>
    </button>
  )
}