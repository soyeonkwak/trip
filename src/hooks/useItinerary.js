import { useState, useEffect } from 'react';
import { SAMPLE_ITINERARY, INITIAL_TRIP_INFO } from '../data/sampleItinerary';

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

  // 상태 변경 시 localStorage 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITINERARY, JSON.stringify(itinerary));
      localStorage.setItem(STORAGE_KEY_TRIP_INFO, JSON.stringify(tripInfo));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [itinerary, tripInfo]);

  // 전체 구글 시트 또는 커스텀 데이터 업데이트
  const updateItinerary = (newItinerary, customTripTitle = null) => {
    setItinerary(newItinerary);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);

    if (customTripTitle) {
      const cities = Array.from(new Set(newItinerary.map(item => item.city).filter(Boolean)));
      setTripInfo(prev => ({
        ...prev,
        title: customTripTitle,
        cities: cities.length > 0 ? cities : prev.cities
      }));
    }
  };

  // 기존 일정 수정 (핸드폰 현장 일정 변경용)
  const editItem = (updatedItem) => {
    setItinerary(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);
  };

  // 새로운 일정 추가
  const addItem = (item) => {
    const newItem = {
      ...item,
      id: item.id || `custom-${Date.now()}`,
      lat: item.lat || 50.0878,
      lng: item.lng || 14.4205,
    };
    setItinerary(prev => [...prev, newItem]);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);
  };

  // 일정 삭제
  const removeItem = (id) => {
    setItinerary(prev => prev.filter(item => item.id !== id));
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);
  };

  // 기본 동유럽 10박 12일 일정으로 리셋
  const resetToDefault = () => {
    setItinerary(SAMPLE_ITINERARY);
    setTripInfo(INITIAL_TRIP_INFO);
    const nowStr = new Date().toLocaleString('ko-KR');
    setLastSyncTime(nowStr);
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowStr);
  };

  return {
    itinerary,
    tripInfo,
    lastSyncTime,
    updateItinerary,
    editItem,
    addItem,
    removeItem,
    resetToDefault
  };
}
