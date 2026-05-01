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

  const numberButtonClass =
    'flex h-23.75 w-24.5 cursor-pointer items-center justify-center bg-white text-[24px] font-medium tracking-[-0.025em] text-black hover:bg-[#13278a] hover:text-white';
  const operatorButtonClass =
    'flex w-full flex-1 cursor-pointer items-center justify-center bg-[#f0f4f5] hover:bg-[#dfe6e8]';

  return (
    <div className={'flex pt-13.5'}>
      <div className={'key__pad grid grid-cols-3'}>
        <button onClick={() => handleNumberClick('1')} className={numberButtonClass}>1</button>
        <button onClick={() => handleNumberClick('2')} className={numberButtonClass}>2</button>
        <button onClick={() => handleNumberClick('3')} className={numberButtonClass}>3</button>
        <button onClick={() => handleNumberClick('4')} className={numberButtonClass}>4</button>
        <button onClick={() => handleNumberClick('5')} className={numberButtonClass}>5</button>
        <button onClick={() => handleNumberClick('6')} className={numberButtonClass}>6</button>
        <button onClick={() => handleNumberClick('7')} className={numberButtonClass}>7</button>
        <button onClick={() => handleNumberClick('8')} className={numberButtonClass}>8</button>
        <button onClick={() => handleNumberClick('9')} className={numberButtonClass}>9</button>
        <button onClick={() => handleNumberClick('0')} className={numberButtonClass}>0</button>
        <button onClick={() => handleDecimalClick(',00')} className={numberButtonClass}>,00</button>
        <button onClick={() => handleDecimalClick(',000')} className={numberButtonClass}>,000</button>
      </div>
      <div className={'flex flex-1 flex-col'}>
        <button onClick={handleBackspace} className={operatorButtonClass}>
          <Image src={'/svg/backspace.svg'} alt={'backspace'} width={28} height={28} />
        </button>
        <button onClick={() => handleOperation('+')} className={operatorButtonClass}>
          <Image src={'/svg/plus.svg'} alt={'plus'} width={28} height={28} />
        </button>
        <button onClick={() => handleOperation('-')} className={operatorButtonClass}>
          <Image src={'/svg/minus.svg'} alt={'minus'} width={28} height={28} />
        </button>
        <button onClick={() => handleOperation('*')} className={operatorButtonClass}>
          <Image src={'/svg/multiply.svg'} alt={'multiply'} width={28} height={28} />
        </button>
        <button onClick={() => handleOperation('/')} className={operatorButtonClass}>
          <Image src={'/svg/division.svg'} alt={'division'} width={28} height={28} />
        </button>
      </div>
      <button
        onClick={handleEquals}
        className={'absolute top-0 left-0 right-0 h-13.5 bg-[#13278a] text-[20px] font-semibold tracking-[-0.025em] text-white cursor-pointer'}
      >
        확인
      </button>
    </div>
  );
}