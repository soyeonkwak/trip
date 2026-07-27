import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Tag, FileText, Trash2, Check, PlusCircle, Edit3 } from 'lucide-react';

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

export default function EditEventModal({ isOpen, onClose, item, defaultDay = 1, onSave, onDelete }) {
  const isEditMode = Boolean(item && item.id);

  const [day, setDay] = useState(defaultDay);
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('sightseeing');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setDay(item.day || defaultDay);
      setTime(item.time || '12:00');
      setTitle(item.title || '');
      setLocation(item.location || '');
      setCategory(item.category || 'sightseeing');
      setNotes(item.notes || '');
    } else {
      setDay(defaultDay);
      setTime('12:00');
      setTitle('');
      setLocation('');
      setCategory('sightseeing');
      setNotes('');
    }
  }, [item, defaultDay, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('일정 제목을 입력해 주세요!');
      return;
    }

    const city = CITY_BY_DAY[day] || '프라하';
    const updatedItem = {
      ...item,
      id: item?.id || `custom-${Date.now()}`,
      day: Number(day),
      date: item?.date || `Day ${day}`,
      time: time.trim() || '12:00',
      city: city,
      title: title.trim(),
      location: location.trim() || title.trim(),
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

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4 animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                {isEditMode ? '일정 수정하기' : '새 일정 추가하기'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">현장에서 빠르게 시간과 일정을 변경하세요</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Day 및 시간 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-sky-500" />
                <span>여행 날짜</span>
              </label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d} ({CITY_BY_DAY[d]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>시각 (예: 14:00 - 15:30)</span>
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="14:00 또는 14:00 - 15:30"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 카테고리 칩 선택 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              카테고리 선택
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

          {/* 일정/명소 제목 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              일정 / 명소 이름 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 카페 데멜 방문, 슈테판 대성당 야경"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 위치/주소 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>구글 맵 검색용 장소 이름 / 주소</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: Cafe Demel, Vienna 또는 상세 주소"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 메모/주의사항 */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              <span>메모 및 현지 주의사항</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="티켓 세부 정보, 휴무일, 웨이팅 팁 등..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 하단 버튼 바 */}
          <div className="pt-2 flex items-center gap-2">
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-all active:scale-95 border border-rose-200"
              >
                <Trash2 className="w-4 h-4" />
                <span>삭제</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              취소
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-sky-200 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEditMode ? '수정 완료' : '일정 추가'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
