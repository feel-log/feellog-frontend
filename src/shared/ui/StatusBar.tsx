import Image from 'next/image';

export default function StatusBar() {
  return (
    <div className="status__bar flex items-center justify-between px-10 pt-5 pb-4.25">
      <span>9:41</span>
      <ul className="flex items-center gap-2">
        <li>
          <Image src={'/svg/celluar.svg'} alt={'celluar'} width={22} height={13} />
        </li>
        <li>
          <Image src={'/svg/wifi.svg'} alt={'wifi'} width={21} height={15} />
        </li>
        <li>
          <Image src={'/svg/battery.svg'} alt={'battery'} width={28} height={14} />
        </li>
      </ul>
    </div>
  );
}