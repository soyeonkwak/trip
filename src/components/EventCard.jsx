import React, { useState } from 'react';
import {
  Plane, Hotel, Landmark, Utensils, Coffee, Moon, Ticket,
  MapPin, ExternalLink, Clock, AlertCircle, Star, ChevronDown, ChevronUp
} from 'lucide-react';

// 카테고리 정의
const CATEGORY_MAP = {
  transport:   { label: '이동/교통',  Icon: Plane,    cls: 'cat-transport' },
  hotel:       { label: '숙소/체크인', Icon: Hotel,    cls: 'cat-hotel' },
  sightseeing: { label: '관광/명소',  Icon: Landmark,  cls: 'cat-sightseeing' },
  food:        { label: '식사/맛집',  Icon: Utensils,  cls: 'cat-food' },
  cafe:        { label: '카페/디저트', Icon: Coffee,   cls: 'cat-cafe' },
  night:       { label: '야경/산책',  Icon: Moon,      cls: 'cat-night' },
  event:       { label: '공연/행사',  Icon: Ticket,    cls: 'cat-event' },
};

export default function EventCard({ item, onFocusMap }) {
  const [showHighlights, setShowHighlights] = useState(false);
  const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.sightseeing;
  const { Icon } = cat;
  const hasHighlights = item.highlights?.length > 0;

  const deepLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;

  return (
    <div className="relative pl-14 pb-4 last:pb-0">
      {/* 타임라인 세로선 */}
      <div className="timeline-line" />

      {/* 카테고리 아이콘 */}
      <div className={`cat-icon ${cat.cls} absolute left-0 top-0`}>
        <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
      </div>

      {/* 카드 */}
      <div className="trip-card animate-slide-up">
        {/* 시간 + 카테고리 레이블 */}
        <div className="flex items-center justify-between px-4 pt-3 pb-0">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">{item.time}</span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            item.category === 'transport' ? 'bg-blue-50 text-blue-600' :
            item.category === 'hotel' ? 'bg-violet-50 text-violet-600' :
            item.category === 'sightseeing' ? 'bg-teal-50 text-teal-600' :
            item.category === 'food' ? 'bg-amber-50 text-amber-600' :
            item.category === 'cafe' ? 'bg-orange-50 text-orange-600' :
            item.category === 'night' ? 'bg-purple-50 text-purple-600' :
            'bg-rose-50 text-rose-500'
          }`}>
            {cat.label}
          </span>
        </div>

        {/* 제목 */}
        <div className="px-4 pt-1.5 pb-2">
          <h3 className="text-[15px] font-bold text-slate-800 leading-snug">
            {item.title}
          </h3>
          {/* 위치 */}
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-sky-500 flex-shrink-0" />
            <span className="text-[11px] text-slate-400 font-medium truncate">{item.location}</span>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-slate-100 mx-4" />

        {/* 메모/주의사항 */}
        {item.notes && (
          <div className="px-4 py-3">
            <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-800 leading-relaxed whitespace-pre-line font-medium">
                {item.notes}
              </p>
            </div>
          </div>
        )}

        {/* 역사·관광 포인트 */}
        {hasHighlights && (
          <div className={`px-4 ${item.notes ? 'pt-0 pb-3' : 'py-3'}`}>
            <button
              onClick={() => setShowHighlights(!showHighlights)}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-sky-50 border border-sky-100 transition-all active:bg-sky-100"
            >
              <div className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-[12px] font-bold text-sky-700">
                  역사·관광 포인트 {item.highlights.length}개
                </span>
              </div>
              {showHighlights
                ? <ChevronUp className="w-4 h-4 text-sky-400" />
                : <ChevronDown className="w-4 h-4 text-sky-400" />}
            </button>

            {showHighlights && (
              <div className="mt-2 space-y-1.5">
                {item.highlights.map((h, i) => (
                  <div key={i} className="highlight-item">
                    <span className="text-sky-400 flex-shrink-0 font-bold mt-0.5">✦</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 하단 액션 */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            <a
              href={deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-[12px] font-bold transition-all active:scale-95 shadow-md shadow-sky-200"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>구글 맵에서 열기</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            {onFocusMap && (
              <button
                onClick={() => onFocusMap(item)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[12px] font-semibold flex items-center gap-1 transition-all active:scale-95 border border-slate-200"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>지도 핀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
