import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <div className={"px-4 py-2.5"}>
      <Link href="/">
        <Image src={"/svg/feel_log_logo.svg"} alt={"logo"} width={71} height={15.56} />
      </Link>
    </div>
  )
}