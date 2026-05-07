import { useState } from 'react';
import { calculateExpression, getDisplayAmount } from '@/shared/utils/record';

export function useAmountInput() {
  const [amountInput, setAmountInput] = useState('');
  const [isAmountEditing, setIsAmountEditing] = useState(false);

  const handleAmountChange = (value: string): number => {
    if (value === 'equals') {
      const calculated = calculateExpression(amountInput);
      setAmountInput(calculated.toString());
      setIsAmountEditing(false);
      return calculated;
    }

    let result = amountInput;

    if (value === 'backspace') {
      result = result.slice(0, -1);
    } else if (value === '+' || value === '-' || value === '*' || value === '/') {
      if (!/[+\-*/]$/.test(result) && result !== '') {
        const calculated = calculateExpression(result);
        result = calculated.toString() + value;
      } else if (result === '') {
        result = '0' + value;
      }
    } else if (value === ',00' || value === ',000') {
      const zeros = value === ',00' ? '00' : '000';
      if (!/[+\-*/]$/.test(result)) {
        const lastNumberMatch = result.match(/\d+$/);
        if (lastNumberMatch) {
          result = result.replace(/\d+$/, lastNumberMatch[0] + zeros);
        } else {
          result = '0' + zeros;
        }
      }
    } else {
      result += value;
    }

    setAmountInput(result);
    return getDisplayAmount(result);
  };

  return {
    amountInput,
    setAmountInput,
    isAmountEditing,
    setIsAmountEditing,
    handleAmountChange,
    displayAmount: getDisplayAmount(amountInput),
  };
}
