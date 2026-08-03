import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_ITINERARY, INITIAL_TRIP_INFO } from '../data/sampleItinerary';
import { pushItineraryToCloud, pullItineraryFromCloud } from '../utils/cloudSync';

// 도시별 기본 좌표 (지오코딩 실패 시 폴백)
const CITY_DEFAULT_COORDS = {
  '프라하': { lat: 50.0755, lng: 14.4378 },
  '잘츠부르크': { lat: 47.8095, lng: 13.0550 },
  '인스부르크': { lat: 47.2692, lng: 11.4041 },
  '빈': { lat: 48.2082, lng: 16.3738 },
  '부다페스트': { lat: 47.4979, lng: 19.0402 },
  '인천': { lat: 37.4602, lng: 126.4407 },
};

const STORAGE_KEY_ITINERARY = 'travel_app_itinerary_v5';
const STORAGE_KEY_TRIP_INFO = 'travel_app_trip_info_v5';
const STORAGE_KEY_LAST_SYNC = 'travel_app_last_sync_v5';

export function useItinerary() {
  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITINERARY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load itinerary from localStorage:', e);
    }
    return SAMPLE_ITINERARY;
  });

  const [tripInfo, setTripInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIP_INFO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load trip info:', e);
    }
    return INITIAL_TRIP_INFO;
  });

  const [lastSyncTime, setLastSyncTime] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_LAST_SYNC) || new Date().toLocaleString('ko-KR');
  });

  const [syncToast, setSyncToast] = useState(null); // 다른 기기 동기화 알림용

  // 상태 변경 시 localStorage 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITINERARY, JSON.stringify(itinerary));
      localStorage.setItem(STORAGE_KEY_TRIP_INFO, JSON.stringify(tripInfo));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [itinerary, tripInfo]);

  // 다른 핸드폰에서 수정한 내용이 있는지 클라우드에서 확인 및 동기화
  const syncWithCloud = useCallback(async (isManual = false) => {
    const result = await pullItineraryFromCloud();
    if (result && result.hasUpdate) {
      setItinerary(result.itinerary);
      if (result.tripInfo) setTripInfo(result.tripInfo);
      const nowStr = result.updatedAtStr || new Date().toLocaleString('ko-KR');
      setLastSyncTime(nowStr);
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);
      setSyncToast('📱 다른 핸드폰에서 수정한 최신 일정으로 자동 동기화되었습니다!');
    } else if (isManual) {
      setSyncToast('☁️ 모든 핸드폰의 일정이 최신 상태로 동기화되어 있습니다.');
    }
  }, []);

  // 10초 주기 클라우드 폴링 + 탭 활성화 시 즉시 동기화 (다중 핸드폰 실시간 연동)
  useEffect(() => {
    // 최초 접속 시 클라우드 동기화 1회 실행
    syncWithCloud(false);

    const interval = setInterval(() => {
      syncWithCloud(false);
    }, 10000); // 10초마다 자동 확인

    const handleFocus = () => syncWithCloud(false);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, [syncWithCloud]);

  // 일정 수정 (내 핸드폰 + 다른 핸드폰에도 클라우드 즉시 전송)
  const editItem = (updatedItem) => {
    const nextItinerary = itinerary.map(item => item.id === updatedItem.id ? updatedItem : item);
    setItinerary(nextItinerary);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);

    // 다른 핸드폰과도 공유되도록 클라우드로 전송
    pushItineraryToCloud(nextItinerary, tripInfo);
    setSyncToast('☁️ 수정한 일정이 다른 핸드폰에도 실시간 공유되었습니다!');
  };

  // 일정 추가 (내 핸드폰 + 다른 핸드폰에도 클라우드 즉시 전송)
  const addItem = (item) => {
    // 지오코딩된 좌표가 있으면 그대로 사용, 없으면 도시 기본 좌표 폴백
    const cityCoords = CITY_DEFAULT_COORDS[item.city] || CITY_DEFAULT_COORDS['프라하'];
    const newItem = {
      ...item,
      id: item.id || `custom-${Date.now()}`,
      lat: item.lat || cityCoords.lat,
      lng: item.lng || cityCoords.lng,
    };
    const nextItinerary = [...itinerary, newItem];
    setItinerary(nextItinerary);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);

    pushItineraryToCloud(nextItinerary, tripInfo);
    setSyncToast('☁️ 새 일정이 다른 핸드폰에도 실시간 공유되었습니다!');
  };

  // 일정 삭제
  const removeItem = (id) => {
    const nextItinerary = itinerary.filter(item => item.id !== id);
    setItinerary(nextItinerary);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);

    pushItineraryToCloud(nextItinerary, tripInfo);
    setSyncToast('☁️ 삭제한 내용이 다른 핸드폰에도 실시간 반영되었습니다.');
  };

  // 전체 업데이트
  const updateItinerary = (newItinerary, customTripTitle = null) => {
    setItinerary(newItinerary);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);

    let nextTripInfo = tripInfo;
    if (customTripTitle) {
      const cities = Array.from(new Set(newItinerary.map(item => item.city).filter(Boolean)));
      nextTripInfo = {
        ...tripInfo,
        title: customTripTitle,
        cities: cities.length > 0 ? cities : tripInfo.cities
      };
      setTripInfo(nextTripInfo);
    }

    pushItineraryToCloud(newItinerary, nextTripInfo);
  };

  // 기본 동유럽 10박 12일 일정으로 리셋
  const resetToDefault = () => {
    setItinerary(SAMPLE_ITINERARY);
    setTripInfo(INITIAL_TRIP_INFO);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);

    pushItineraryToCloud(SAMPLE_ITINERARY, INITIAL_TRIP_INFO);
    setSyncToast('🔄 기본 일정으로 초기화 및 공유되었습니다.');
  };

  return {
    itinerary,
    tripInfo,
    lastSyncTime,
    syncToast,
    dismissSyncToast: () => setSyncToast(null),
    manualSync: () => syncWithCloud(true),
    updateItinerary,
    editItem,
    addItem,
    removeItem,
    resetToDefault
  };
}
