import React, { useState, useMemo, useEffect, useRef } from 'react';
import DaySelector from './DaySelector';
import EventCard from './EventCard';
import { Search, Calendar, MapPin, Clock, ChevronRight, Zap, Bell } from 'lucide-react';
import { useTripTime, findCurrentAndNextEvent } from '../hooks/useTripTime';

export default function TimelineView({ itinerary, onFocusMap }) {
  const tripTime = useTripTime();
  const [selectedDay, setSelectedDay] = useState(tripTime.currentDay);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const currentCardRef = useRef(null);

  // 여행지 현지 시각이 바뀌면 selectedDay도 업데이트
  useEffect(() => {
    setSelectedDay(tripTime.currentDay);
  }, [tripTime.currentDay]);

  // 현재 날짜의 일정들로 '지금 진행 중' / '다음 일정' 탐색
  const todayItems = useMemo(() => {
    return itinerary.filter(i => i.day === tripTime.currentDay)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [itinerary, tripTime.currentDay]);

  const { current: currentEvent, next: nextEvent } = useMemo(() => {
    if (!tripTime.isInTrip) return { current: null, next: null };
    return findCurrentAndNextEvent(todayItems, tripTime.localTimeShort);
  }, [todayItems, tripTime]);

  // 날짜 리스트
  const daysList = useMemo(() => {
    const map = new Map();
    itinerary.forEach(item => {
      if (!map.has(item.day)) map.set(item.day, { day: item.day, date: item.date, city: item.city });
    });
    return Array.from(map.values()).sort((a, b) => a.day - b.day);
  }, [itinerary]);

  // 필터링
  const filtered = useMemo(() => {
    return itinerary.filter(item => {
      if (selectedDay !== 0 && item.day !== selectedDay) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return [item.title, item.location, item.city, item.notes || '']
          .some(s => s.toLowerCase().includes(q));
      }
      return true;
    });
  }, [itinerary, selectedDay, selectedCategory, searchQuery]);

  // Day 그룹핑
  const grouped = useMemo(() => {
    const groups = new Map();
    filtered.forEach(item => {
      if (!groups.has(item.day)) groups.set(item.day, []);
      groups.get(item.day).push(item);
    });
    return Array.from(groups.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  // 현재 카드로 자동 스크롤
  useEffect(() => {
    if (currentCardRef.current) {
      setTimeout(() => {
        currentCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [selectedDay, currentEvent]);

  return (
    <div className="pb-32">
      {/* 현지 시각 & 여행 상태 배너 */}
      <TripStatusBanner tripTime={tripTime} currentEvent={currentEvent} nextEvent={nextEvent} />

      {/* 날짜 탭 */}
      <DaySelector
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        daysList={daysList}
        todayDay={tripTime.currentDay}
      />

      {/* 검색 & 필터 */}
      <div className="px-4 py-3 bg-white border-b border-slate-100 flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="일정, 장소, 맛집 검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="trip-input pl-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="trip-input !w-auto px-2.5 text-[12px] font-semibold text-slate-600"
        >
          <option value="all">전체</option>
          <option value="transport">✈️ 이동</option>
          <option value="hotel">🏨 숙소</option>
          <option value="sightseeing">🏛️ 관광</option>
          <option value="food">🍽️ 식사</option>
          <option value="cafe">☕ 카페</option>
          <option value="night">🌙 야경</option>
          <option value="event">🎟️ 행사</option>
        </select>
      </div>

      <div className="px-4 pt-2">
        {grouped.length > 0 ? (
          grouped.map(([day, items]) => {
            const dayInfo = daysList.find(d => d.day === day);
            const isToday = day === tripTime.currentDay && tripTime.isInTrip;

            return (
              <div key={day} className="mb-2">
                {/* Day 섹션 헤더 */}
                <div className="day-section-header">
                  <span className={`day-badge ${isToday ? 'ring-2 ring-orange-300 ring-offset-1' : ''}`}>
                    Day {day}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      오늘
                    </span>
                  )}
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700">{dayInfo?.city}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{dayInfo?.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{items.length}곳</span>
                  </div>
                </div>

                {/* 카드 목록 */}
                <div className="relative">
                  {items.map((item) => {
                    const isCurrent = currentEvent?.id === item.id && tripTime.isInTrip;
                    const isNext = nextEvent?.id === item.id && tripTime.isInTrip && !currentEvent;
                    return (
                      <div
                        key={item.id}
                        ref={isCurrent ? currentCardRef : null}
                      >
                        {/* '지금 여기!' 뱃지 */}
                        {isCurrent && (
                          <div className="flex items-center gap-2 mb-1 ml-14">
                            <Zap className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[11px] font-extrabold text-emerald-600">
                              지금 진행 중 · {tripTime.localTimeShort} (현지 시각)
                            </span>
                          </div>
                        )}
                        {/* '다음 일정' 뱃지 */}
                        {isNext && (
                          <div className="flex items-center gap-2 mb-1 ml-14">
                            <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                            <span className="text-[11px] font-bold text-sky-500">다음 일정</span>
                          </div>
                        )}
                        <div className={`rounded-2xl transition-all ${
                          isCurrent ? 'ring-2 ring-emerald-400 ring-offset-2' :
                          isNext ? 'ring-1 ring-sky-300 ring-offset-1' : ''
                        }`}>
                          <EventCard item={item} onFocusMap={onFocusMap} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">검색 결과가 없습니다</p>
            <p className="text-xs text-slate-300 mt-1">검색어나 필터를 변경해 보세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===========================
// 현지 시각 & 여행 상태 상단 배너
// ===========================
function TripStatusBanner({ tripTime, currentEvent, nextEvent }) {
  // 여행 전: 카운트다운
  if (tripTime.status === 'before') {
    return (
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-500 uppercase tracking-wide">여행 출발까지</p>
            <p className="text-xl font-extrabold text-slate-800 mt-0.5">
              {tripTime.daysLeft}일 {tripTime.hoursLeft}시간 {tripTime.minsLeft}분
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">2026년 8월 6일 출발 · 프라하행</p>
          </div>
          <div className="text-3xl">✈️</div>
        </div>
      </div>
    );
  }

  // 여행 종료 후
  if (tripTime.status === 'after') {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 px-4 py-3 text-center">
        <p className="text-sm font-bold text-emerald-600">🎉 동유럽 10박 12일 여행 완료!</p>
        <p className="text-[11px] text-slate-400 mt-0.5">소중한 추억을 담은 일정 기록입니다</p>
      </div>
    );
  }

  // 여행 중 배너
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-[11px] font-bold text-white/90 uppercase tracking-wide">
            {tripTime.currentCity} 현지 시각
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-sm font-extrabold tabular-nums">{tripTime.localTimeShort}</span>
        </div>
      </div>

      {/* 지금 진행 중인 일정 */}
      {currentEvent && (
        <div className="bg-white/15 rounded-2xl px-3 py-2.5">
          <p className="text-[10px] font-bold text-white/70 mb-0.5 flex items-center gap-1">
            <Zap className="w-3 h-3" /> 지금 진행 중
          </p>
          <p className="text-sm font-extrabold text-white leading-snug">{currentEvent.title}</p>
          <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {currentEvent.location}
          </p>
        </div>
      )}

      {/* 다음 일정 (진행 중인 게 없을 때) */}
      {!currentEvent && nextEvent && (
        <div className="bg-white/15 rounded-2xl px-3 py-2.5">
          <p className="text-[10px] font-bold text-white/70 mb-0.5 flex items-center gap-1">
            <ChevronRight className="w-3 h-3" /> 다음 일정 · {nextEvent.time}
          </p>
          <p className="text-sm font-extrabold text-white leading-snug">{nextEvent.title}</p>
          <p className="text-[11px] text-white/70 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {nextEvent.location}
          </p>
        </div>
      )}
    </div>
  );
}
