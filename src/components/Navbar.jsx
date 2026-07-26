import React from 'react';
import { Wifi, WifiOff, FileSpreadsheet, RefreshCw, Globe, ChevronRight, Cloud } from 'lucide-react';

export default function Navbar({ isOnline, tripTitle, lastSyncTime, user, onOpenSheetModal, onOpenAuthModal, onResetDefault }) {
  return (
    <header className="trip-header text-white px-5 pt-12 pb-5 relative z-10">
      {/* 온라인 상태 & 컨트롤 버튼 바 */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          isOnline ? 'bg-white/20 text-white' : 'bg-amber-400/80 text-amber-900'
        }`}>
          {isOnline
            ? <><Wifi className="w-3 h-3" /><span>온라인 · PWA</span></>
            : <><WifiOff className="w-3 h-3" /><span>오프라인 저장 모드</span></>
          }
        </div>

        <div className="flex items-center gap-2">
          {/* 클라우드 백업/로그인 버튼 */}
          <button
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              user ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm' : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>{user ? (user.isAnonymous ? '☁️ 익명 백업' : '☁️ 동기화됨') : '☁️ 로그인/백업'}</span>
          </button>

          {/* 구글 시트 연동 버튼 */}
          <button
            onClick={onOpenSheetModal}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>시트 연동</span>
          </button>

          {/* 초기화 버튼 */}
          <button
            onClick={onResetDefault}
            className="w-7 h-7 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all active:scale-95"
            title="기본 일정 복원"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 여행 제목 */}
      <div className="flex items-start gap-2">
        <Globe className="w-5 h-5 mt-0.5 opacity-80 flex-shrink-0" />
        <div>
          <h1 className="text-lg font-bold leading-snug text-white drop-shadow-sm">
            {tripTitle || '동유럽 여행 플래너'}
          </h1>
          <p className="text-[11px] text-sky-100/80 mt-0.5 font-medium">
            2026년 8월 6일 ~ 17일 · 10박 12일
          </p>
        </div>
      </div>

      {/* 도시 경로 태그 */}
      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {['프라하', '잘츠부르크', '인스부르크', '빈', '부다페스트'].map((city, i, arr) => (
          <React.Fragment key={city}>
            <span className="text-xs font-bold text-white/90 bg-white/15 px-2.5 py-1 rounded-full">
              {city}
            </span>
            {i < arr.length - 1 && (
              <ChevronRight className="w-3 h-3 text-white/40 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 마지막 동기화 시각 */}
      <p className="text-[10px] text-white/50 mt-2 font-medium">
        마지막 동기화: {lastSyncTime}
      </p>
    </header>
  );
}
