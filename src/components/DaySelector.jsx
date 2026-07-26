import React from 'react';

// 오늘(today) 날짜에 해당하는 Day 칩에 강조 표시 포함
export default function DaySelector({ selectedDay, setSelectedDay, daysList, todayDay }) {
  return (
    <div className="bg-white border-b border-slate-100 px-4 py-2.5 overflow-x-auto no-scrollbar shadow-sm">
      <div className="flex items-center gap-2">
        {/* 전체 보기 */}
        <button
          onClick={() => setSelectedDay(0)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            selectedDay === 0
              ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          전체
        </button>

        {/* Day 칩 */}
        {daysList.map((d) => {
          const isSelected = selectedDay === d.day;
          const isToday = d.day === todayDay;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`flex-shrink-0 relative flex flex-col items-center px-3.5 py-1.5 rounded-2xl text-left transition-all ${
                isSelected
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-200'
                  : isToday
                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-400'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              <span className={`text-[10px] font-bold ${
                isSelected ? 'text-sky-100' : isToday ? 'text-emerald-500' : 'text-slate-400'
              }`}>
                Day {d.day}
              </span>
              <span className={`text-[11px] font-extrabold leading-tight ${
                isSelected ? 'text-white' : isToday ? 'text-emerald-700' : 'text-slate-700'
              }`}>
                {d.city}
              </span>
              {/* 오늘 표시 도트 */}
              {isToday && !isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              )}
              {isToday && isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-sky-300" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
