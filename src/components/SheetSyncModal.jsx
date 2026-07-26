import React, { useState } from 'react';
import { convertToCsvUrl, parseCSV, convertRowsToItinerary } from '../utils/sheetParser';
import { Link2, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, X, HelpCircle } from 'lucide-react';

export default function SheetSyncModal({ isOpen, onClose, onUpdateItinerary, onResetDefault }) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFetch = async (e) => {
    e.preventDefault();
    if (!sheetUrl.trim()) { setErrorMsg('구글 시트 URL을 입력해 주세요.'); return; }
    setLoading(true); setErrorMsg(''); setSuccessMsg('');
    try {
      const csvUrl = convertToCsvUrl(sheetUrl.trim());
      const res = await fetch(csvUrl);
      if (!res.ok) throw new Error('시트를 불러올 수 없습니다. 공유 설정(링크 공개)을 확인해 주세요.');
      const text = await res.text();
      const { rows } = parseCSV(text);
      if (!rows.length) throw new Error('시트에 유효한 데이터가 없습니다.');
      const parsed = convertRowsToItinerary(rows);
      onUpdateItinerary(parsed, '구글 시트 연동 일정');
      setSuccessMsg(`${parsed.length}개의 일정을 불러왔습니다!`);
      setTimeout(onClose, 1500);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
         style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
        {/* 핸들 (모바일 바텀시트) */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5 sm:hidden" />

        {/* 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">구글 시트 불러오기</h2>
              <p className="text-[11px] text-slate-400 font-medium">URL을 입력하여 일정을 동기화합니다</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL 입력 폼 */}
        <form onSubmit={handleFetch} className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-sky-500" />구글 시트 URL
            </label>
            <input
              type="text"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={e => setSheetUrl(e.target.value)}
              className="trip-input font-mono text-[12px]"
            />
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-red-600 font-medium">{errorMsg}</p>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <p className="text-[12px] text-emerald-700 font-bold">{successMsg}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />불러오는 중...</> : '일정 불러오기'}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-100" />
          <span className="text-[11px] text-slate-400 font-semibold">또는</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>

        <button onClick={() => { onResetDefault(); setTimeout(onClose, 800); }}
          className="btn-secondary w-full flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          동유럽 기본 일정으로 복원
        </button>

        {/* 팁 */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 space-y-1 leading-relaxed">
          <div className="flex items-center gap-1 font-bold text-slate-600 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />구글 시트 공유 설정 방법
          </div>
          <p>1. 시트 상단 <strong>[공유]</strong> → <strong>'링크가 있는 모든 사용자'</strong>로 공개 설정</p>
          <p>2. 열 헤더 예시: 일차, 날짜, 시간, 도시, 일정, 장소, 카테고리, 메모</p>
        </div>
      </div>
    </div>
  );
}
