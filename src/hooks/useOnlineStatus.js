import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastMessage('네트워크에 연결되었습니다. 구글 시트 동기화가 가능합니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastMessage('오프라인 모드: 마지막으로 저장된 일정을 표시합니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, showToast, toastMessage, dismissToast: () => setShowToast(false) };
}
