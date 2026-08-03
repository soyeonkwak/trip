import React, { useState, useEffect, useCallback } from 'react';
import { X, Clock, MapPin, Tag, FileText, Trash2, Check, PlusCircle, Edit3, ExternalLink, Search, Loader2 } from 'lucide-react';
import { geocodeLocation } from '../utils/geocoding';

const CATEGORY_OPTIONS = [
  { value: 'sightseeing', label: '🏛️ 관광/명소' },
  { value: 'food',        label: '🍽️ 식사/맛집' },
  { value: 'cafe',        label: '☕ 카페/디저트' },
  { value: 'transport',   label: '✈️ 이동/교통' },
  { value: 'hotel',       label: '🏨 숙소/체크인' },
  { value: 'night',       label: '🌙 야경/산책' },
  { value: 'event',       label: '🎟️ 공연/행사' },
];

const CITY_BY_DAY = {
  1: '프라하', 2: '프라하', 3: '잘츠부르크', 4: '잘츠부르크',
  5: '인스부르크', 6: '인스부르크', 7: '빈', 8: '빈',
  9: '부다페스트', 10: '부다페스트', 11: '부다페스트', 12: '인천'
};

// 시각 리스트 옵션 생성 (06:00 ~ 23:30 30분 단위)
const TIME_LIST_OPTIONS = [];
for (let h = 6; h <= 23; h++) {
  const hh = String(h).padStart(2, '0');
  TIME_LIST_OPTIONS.push(`${hh}:00`);
  TIME_LIST_OPTIONS.push(`${hh}:30`);
}

// 도시별 주요 구글 맵 명소 추천 리스트
const RECOMMENDED_PLACES_BY_CITY = {
  '프라하': ['프라하성', '성 비투스 대성당', '카를교', '구시가지 광장', '천문시계탑', "Pork's Mostecka", 'Reduta Jazz Club'],
  '잘츠부르크': ['게트라이데 거리', '모차르트 생가', '할슈타트 호수', '고사우제', '호엔잘츠부르크 성', 'Augustinerbräu'],
  '인스부르크': ['황금지붕', '헬블링하우스', '노르트케테 케이블카', '인강 변 산책로', '골든 크로네 호텔'],
  '빈': ['성베드로성당', '카페 데멜', 'Vollpension 카페', '슈테판 대성당', '벨베데레 상궁', '미술사박물관', '호프부르크 왕궁'],
  '부다페스트': ['부티크 빅토리아 호텔', '중앙재래시장', '어부의 요새', '겔레르트 언덕', '아난타라 뉴욕카페', '도나우강 유람선']
};

export default function EditEventModal({ isOpen, onClose, item, defaultDay = 1, onSave, onDelete }) {
  const isEditMode = Boolean(item && item.id);

  const [day, setDay] = useState(defaultDay);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [notes, setNotes] = useState('');

  // 지오코딩 상태
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodedCoords, setGeocodedCoords] = useState(null); // { lat, lng }
  const [geocodeStatus, setGeocodeStatus] = useState(null); // 'success' | 'failed' | null

  useEffect(() => {
    if (item) {
      setDay(item.day || defaultDay);
      const timeParts = (item.time || '12:00').split('-').map(s => s.trim());
      setStartTime(timeParts[0] || '12:00');
      setEndTime(timeParts[1] || '');
      setTitle(item.title || '');
      setLocation(item.location || '');
      setCategory(item.category || 'sightseeing');
      setNotes(item.notes || '');
    } else {
      setDay(defaultDay);
      setStartTime('12:00');
      setEndTime('');
      setTitle('');
      setLocation('');
      setCategory('sightseeing');
      setNotes('');
    }
    // 모달 새로 열릴 때 지오코딩 상태 초기화
    setGeocodedCoords(null);
    setGeocodeStatus(null);
  }, [item, defaultDay, isOpen]);

  if (!isOpen) return null;

  const currentCity = CITY_BY_DAY[day] || '프라하';
  const recommendedPlaces = RECOMMENDED_PLACES_BY_CITY[currentCity] || [];

  // 위치 검색 → 지오코딩 → 좌표 업데이트
  const handleGeocode = useCallback(async (locationQuery) => {
    const query = (locationQuery || location || title || '').trim();
    if (!query) return;

    setIsGeocoding(true);
    setGeocodeStatus(null);

    const coords = await geocodeLocation(query, currentCity);
    setIsGeocoding(false);

    if (coords) {
      setGeocodedCoords(coords);
      setGeocodeStatus('success');
    } else {
      setGeocodeStatus('failed');
    }
  }, [location, title, currentCity]);

  // 구글 맵에서 장소 확인 (새 탭)
  const handleOpenGoogleMapsSearch = () => {
    const query = location.trim() || title.trim() || currentCity;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' ' + currentCity)}`;
    window.open(url, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('일정 제목을 입력해 주세요!');
      return;
    }

    const formattedTime = endTime.trim() ? `${startTime} - ${endTime}` : startTime;
    const finalLocation = location.trim() || title.trim();

    // 저장 시점에 좌표 결정:
    // 1) 이미 지오코딩된 좌표 있으면 사용
    // 2) 없으면 저장 시 자동 지오코딩 시도
    // 3) 그래도 없으면 기존 item 좌표 or 도시 기본 좌표 사용
    let lat = item?.lat;
    let lng = item?.lng;

    if (geocodedCoords) {
      lat = geocodedCoords.lat;
      lng = geocodedCoords.lng;
    } else {
      // 저장 시 자동 지오코딩
      setIsGeocoding(true);
      const coords = await geocodeLocation(finalLocation, currentCity);
      setIsGeocoding(false);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
      }
    }

    // 도시 기본 폴백
    if (!lat || !lng) {
      const defaults = {
        '프라하': [50.0878, 14.4205], '잘츠부르크': [47.8095, 13.0550],
        '인스부르크': [47.2692, 11.4041], '빈': [48.2082, 16.3738],
        '부다페스트': [47.4979, 19.0402],
      };
      [lat, lng] = defaults[currentCity] || [50.0878, 14.4205];
    }

    const updatedItem = {
      ...item,
      id: item?.id || `custom-${Date.now()}`,
      day: Number(day),
      date: item?.date || `Day ${day}`,
      time: formattedTime,
      city: currentCity,
      title: title.trim(),
      location: finalLocation,
      category: category,
      notes: notes.trim(),
      lat,
      lng,
      highlights: item?.highlights || []
    };

    onSave(updatedItem);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`'${title}' 일정을 삭제하시겠습니까?`)) {
      onDelete(item.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      
      {/* 바텀 시트 메인 컨테이너 */}
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-slide-up overflow-hidden">
        
        {/* 모바일 상단 드래그 핸들 */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2.5 flex-shrink-0 sm:hidden" />

        {/* 1. 상단 헤더 (고정) */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                {isEditMode ? '일정 수정하기' : '새 일정 추가하기'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">장소 입력 후 📍 핀 찾기 → 지도에 자동 반영</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. 중앙 폼 영역 (내부 스크롤 가능) */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            
            {/* 여행 날짜 및 시각 선택 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-sky-500" />
                  <span>여행 날짜</span>
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      Day {d} ({CITY_BY_DAY[d]})
                    </option>
                  ))}
                </select>
              </div>

              {/* 시각 드롭다운 리스트 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>시각 선택</span>
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {TIME_LIST_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t} 시작</option>
                    ))}
                  </select>

                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">(종료 없음)</option>
                    {TIME_LIST_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t} 종료</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 카테고리 칩 선택 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                카테고리
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      category === c.value
                        ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 일정 / 명소 이름 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                일정 / 명소 이름 *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!location) setLocation(e.target.value);
                  setGeocodedCoords(null);
                  setGeocodeStatus(null);
                }}
                placeholder="예: 카페 데멜 방문, 슈테판 대성당 야경"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* 구글 맵 장소 검색 및 지도 핀 연동 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>지도 핀 장소 / 주소</span>
                </label>
                <div className="flex items-center gap-1.5">
                  {/* 📍 핀 위치 찾기 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleGeocode(location || title)}
                    disabled={isGeocoding}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all ${
                      geocodeStatus === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : geocodeStatus === 'failed'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100'
                    }`}
                  >
                    {isGeocoding ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <MapPin className="w-3 h-3" />
                    )}
                    <span>
                      {isGeocoding ? '검색 중...'
                        : geocodeStatus === 'success' ? '📍 핀 위치 확인!'
                        : geocodeStatus === 'failed' ? '위치 못 찾음'
                        : '📍 지도 핀 찾기'}
                    </span>
                  </button>

                  {/* 구글맵 외부 열기 */}
                  <button
                    type="button"
                    onClick={handleOpenGoogleMapsSearch}
                    className="text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded-lg border border-sky-200 flex items-center gap-1 transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>구글맵</span>
                  </button>
                </div>
              </div>

              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setGeocodedCoords(null);
                  setGeocodeStatus(null);
                }}
                placeholder="예: Cafe Demel, Vienna 또는 상세 장소 이름"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {/* 지오코딩 결과 미리보기 */}
              {geocodedCoords && geocodeStatus === 'success' && (
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-base">📍</span>
                  <div>
                    <p className="text-[11px] font-extrabold text-emerald-800">지도 핀 위치 확인 완료!</p>
                    <p className="text-[10px] text-emerald-600 font-mono">
                      {geocodedCoords.lat.toFixed(4)}, {geocodedCoords.lng.toFixed(4)}
                    </p>
                    <p className="text-[10px] text-emerald-600">저장 시 지도 핀이 이 위치로 업데이트됩니다</p>
                  </div>
                </div>
              )}

              {geocodeStatus === 'failed' && (
                <div className="mt-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[11px] font-bold text-amber-700">⚠️ 정확한 위치를 찾지 못했어요</p>
                  <p className="text-[10px] text-amber-600">저장 시 도시 중심 위치로 핀이 표시됩니다. 장소명을 영문이나 현지 언어로 입력하면 더 정확해요!</p>
                </div>
              )}

              {/* 해당 도시 주요 추천 칩 */}
              {recommendedPlaces.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] text-slate-400 font-semibold mb-1">💡 {currentCity} 인기 장소 (탭하면 핀 자동 설정):</p>
                  <div className="flex flex-wrap gap-1">
                    {recommendedPlaces.map((place, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={async () => {
                          if (!title) setTitle(place);
                          setLocation(place);
                          setGeocodeStatus(null);
                          setGeocodedCoords(null);
                          // 추천 장소 탭하면 즉시 지오코딩
                          const coords = await geocodeLocation(place, currentCity);
                          if (coords) {
                            setGeocodedCoords(coords);
                            setGeocodeStatus('success');
                          }
                        }}
                        className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-2 py-1 rounded-lg border border-slate-200 transition-all"
                      >
                        📍 {place}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 메모 및 주의사항 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>메모 및 현지 주의사항</span>
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="티켓 예약 번호, 휴무일, 꿀팁 등 메모..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

          </div>

          {/* 3. 하단 저장 버튼 바 */}
          <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-2 flex-shrink-0 z-30 shadow-lg">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 border border-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>삭제</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold transition-all active:scale-95"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={isGeocoding}
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-300 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-sky-200 transition-all active:scale-95"
            >
              {isGeocoding ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>핀 위치 설정 중...</span></>
              ) : (
                <><Check className="w-4 h-4" /><span>{isEditMode ? '수정 완료' : '일정 저장하기'}</span></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
