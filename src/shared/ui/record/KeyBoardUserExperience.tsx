import Image from 'next/image';

export default function KeyBoardUserExperience({ changeAmount } : { changeAmount: (value: string) => void}) {
  const handleNumberClick = (num: string) => {
    changeAmount(num);
  };

  const handleDecimalClick = (decimal: string) => {
    changeAmount(decimal);
  };

  const handleBackspace = () => {
    changeAmount('backspace');
  };

  const handleOperation = (op: string) => {
    changeAmount(op);
  };

  const handleEquals = () => {
    changeAmount('equals');
  };

  return (
    <div className={'flex pt-13.5'}>
      <div className={'key__pad grid grid-cols-3'}>
        <button
          onClick={() => handleNumberClick('1')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          1
        </button>
        <button
          onClick={() => handleNumberClick('2')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          2
        </button>
        <button
          onClick={() => handleNumberClick('3')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          3
        </button>
        <button
          onClick={() => handleNumberClick('4')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          4
        </button>
        <button
          onClick={() => handleNumberClick('5')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          5
        </button>
        <button
          onClick={() => handleNumberClick('6')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          6
        </button>
        <button
          onClick={() => handleNumberClick('7')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          7
        </button>
        <button
          onClick={() => handleNumberClick('8')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          8
        </button>
        <button
          onClick={() => handleNumberClick('9')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          9
        </button>
        <button
          onClick={() => handleNumberClick('0')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          0
        </button>
        <button
          onClick={() => handleDecimalClick(',00')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          ,00
        </button>
        <button
          onClick={() => handleDecimalClick(',000')}
          className={
            'flex h-23.75 w-24.5 cursor-pointer items-center justify-center hover:bg-[#13278a] hover:text-white'
          }
        >
          ,000
        </button>
      </div>
      <div className={'flex flex-1 flex-col'}>
        <button
          onClick={handleBackspace}
          className={'flex w-full flex-1 items-center justify-center hover:bg-gray-100'}
        >
          <Image src={'/svg/backspace.svg'} alt={'backspace'} width={24} height={24} />
        </button>
        <button
          onClick={() => handleOperation('+')}
          className={'flex w-full flex-1 items-center justify-center hover:bg-gray-100'}
        >
          <Image src={'/svg/plus.svg'} alt={'plus'} width={24} height={24} />
        </button>
        <button
          onClick={() => handleOperation('-')}
          className={'flex w-full flex-1 items-center justify-center hover:bg-gray-100'}
        >
          <Image src={'/svg/minus.svg'} alt={'minus'} width={24} height={24} />
        </button>
        <button
          onClick={() => handleOperation('*')}
          className={'flex w-full flex-1 items-center justify-center hover:bg-gray-100'}
        >
          <Image src={'/svg/multiply.svg'} alt={'multiply'} width={24} height={24} />
        </button>
        <button
          onClick={() => handleOperation('/')}
          className={'flex w-full flex-1 items-center justify-center hover:bg-gray-100'}
        >
          <Image src={'/svg/division.svg'} alt={'division'} width={24} height={24} />
        </button>
      </div>
      <button onClick={handleEquals} className={"absolute top-0 left-0 right-0 h-13.5 bg-[#13278a] text-white cursor-pointer"}>확인</button>
    </div>
  );
}