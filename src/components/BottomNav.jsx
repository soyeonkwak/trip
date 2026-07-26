import React from 'react';
import { Calendar, Map, Link2, Lightbulb } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'timeline', label: '타임라인', icon: Calendar },
  { id: 'map', label: '지도', icon: Map },
  { id: 'sheet', label: '시트 연동', icon: Link2 },
  { id: 'tips', label: '꿀팁·체크', icon: Lightbulb },
];

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      <div className="grid grid-cols-4 px-2 pt-2 pb-2">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all ${
                active ? 'text-sky-600' : 'text-slate-400'
              }`}
            >
              {/* 아이콘 배경 강조 */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-2xl mb-0.5 transition-all ${
                active ? 'bg-sky-50' : 'bg-transparent'
              }`}>
                <Icon className={`w-5 h-5 transition-all ${active ? 'text-sky-600 scale-110' : 'text-slate-400'}`} />
              </div>
              <span className={`text-[11px] font-semibold leading-tight ${
                active ? 'text-sky-600' : 'text-slate-400'
              }`}>
                {label}
              </span>
              {/* 활성화 인디케이터 도트 */}
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
