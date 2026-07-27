import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Tag, FileText, Trash2, Check, PlusCircle, Edit3, ExternalLink, Search } from 'lucide-react';

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

  useEffect(() => {
    if (item) {
      setDay(item.day || defaultDay);
      // 시간 분리 (예: "14:00 - 15:30")
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
  }, [item, defaultDay, isOpen]);

  if (!isOpen) return null;

  const currentCity = CITY_BY_DAY[day] || '프라하';
  const recommendedPlaces = RECOMMENDED_PLACES_BY_CITY[currentCity] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('일정 제목을 입력해 주세요!');
      return;
    }

    const formattedTime = endTime.trim() ? `${startTime} - ${endTime}` : startTime;
    const finalLocation = location.trim() || title.trim();

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
      lat: item?.lat || 50.0878,
      lng: item?.lng || 14.4205,
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

  // 구글 맵에서 직접 장소 검색 및 연동 테스트
  const handleOpenGoogleMapsSearch = () => {
    const query = location.trim() || title.trim() || currentCity;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ' ' + currentCity)}`;
    window.open(url, '_blank');
  };

  return (
    // z-[100] 적용으로 하단 BottomNav(z-50)보다 상위에 팝업 노출!
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
              <p className="text-[11px] text-slate-400 font-medium">하단 저장 버튼을 눌러 일정을 완결하세요</p>
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

              {/* 시각 드롭다운 리스트 (주르륵 선택) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500" />
                  <span>시각 선택 (드롭다운)</span>
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
                }}
                placeholder="예: 카페 데멜 방문, 슈테판 대성당 야경"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* 구글 맵 장소 검색 및 주소 연동 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>구글 맵 검색 장소 / 주소</span>
                </label>
                <button
                  type="button"
                  onClick={handleOpenGoogleMapsSearch}
                  className="text-[10px] font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200 flex items-center gap-1 transition-all"
                >
                  <Search className="w-3 h-3" />
                  <span>구글맵에서 장소 확인</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: Cafe Demel, Vienna 또는 상세 장소 이름"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />

              {/* 해당 도시 주요 구글 맵 추천 칩 */}
              {recommendedPlaces.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] text-slate-400 font-semibold mb-1">💡 {currentCity} 구글 맵 인기 추천:</p>
                  <div className="flex flex-wrap gap-1">
                    {recommendedPlaces.map((place, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          if (!title) setTitle(place);
                          setLocation(place);
                        }}
                        className="text-[10px] font-bold text-slate-600 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 px-2 py-1 rounded-lg border border-slate-200 transition-all"
                      >
                        + {place}
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

          {/* 3. 하단 저장 버튼 바 (하단 탭바 z-50보다 완전히 위에 항상 고정 노출!) */}
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
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-sky-200 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEditMode ? '수정 완료' : '일정 저장하기'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
