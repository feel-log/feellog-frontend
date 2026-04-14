'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Feel-Log',
  showBack = false,
  onBack,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4">
        {showBack ? (
          <button
            onClick={onBack}
            className="w-6 h-6 flex items-center justify-center text-gray-700"
            aria-label="뒤로가기"
          >
            ←
          </button>
        ) : (
          <div className="w-6" />
        )}

        <h1 className="text-lg font-bold text-center flex-1">{title}</h1>

        {rightAction ? (
          <div className="w-6 flex justify-end">{rightAction}</div>
        ) : (
          <div className="w-6" />
        )}
      </div>
    </header>
  );
};
