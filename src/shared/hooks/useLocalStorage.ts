'use client';

import { useState, useEffect } from 'react';

/**
 * 서버-클라이언트 안전한 로컬스토리지 관리
 * SSR 환경에서 안전하게 로컬스토리지 접근 가능
 *
 * 사용 예:
 * ```tsx
 * const [user, setUser, isLoaded] = useLocalStorage('user', null);
 *
 * if (!isLoaded) return <div>로딩 중...</div>;
 * return <div>{user?.name}</div>;
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [value: T, setValue: (value: T | ((val: T) => T)) => void, isLoaded: boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 로드
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`로컬 스토리지 읽기 오류 [${key}]:`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // 값 업데이트
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`로컬 스토리지 저장 오류 [${key}]:`, error);
    }
  };

  return [storedValue, setValue, isLoaded];
}
