import React, { useState } from 'react';
import { X, LogIn, Cloud, CloudUpload, CloudDownload, User, ShieldCheck, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginWithGoogle, loginAnonymously, logoutUser, saveItineraryToCloud, loadItineraryFromCloud } from '../firebase';

export default function AuthModal({ isOpen, onClose, user, itinerary, tripInfo, onUpdateItinerary }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMsg(null);
    const { user: u, error } = await loginWithGoogle();
    setLoading(false);
    if (error) setMsg({ type: 'error', text: '로그인 실패: ' + error });
    else setMsg({ type: 'success', text: '구글 계정으로 로그인되었습니다!' });
  };

  const handleAnonLogin = async () => {
    setLoading(true);
    setMsg(null);
    const { user: u, error } = await loginAnonymously();
    setLoading(false);
    if (error) setMsg({ type: 'error', text: '익명 로그인 실패: ' + error });
    else setMsg({ type: 'success', text: '익명 모드로 시작되었습니다!' });
  };

  const handleLogout = async () => {
    await logoutUser();
    setMsg({ type: 'success', text: '로그아웃되었습니다.' });
  };

  const handleSaveCloud = async () => {
    if (!user) return;
    setLoading(true);
    const success = await saveItineraryToCloud(user.uid, itinerary, tripInfo);
    setLoading(false);
    if (success) setMsg({ type: 'success', text: '☁️ 클라우드(Firestore)에 안전하게 백업되었습니다!' });
    else setMsg({ type: 'error', text: '클라우드 저장 실패! .env 설정 또는 네트워크를 확인하세요.' });
  };

  const handleLoadCloud = async () => {
    if (!user) return;
    setLoading(true);
    const data = await loadItineraryFromCloud(user.uid);
    setLoading(false);
    if (data && data.itinerary) {
      onUpdateItinerary(data.itinerary, data.tripInfo || tripInfo);
      setMsg({ type: 'success', text: '☁️ 클라우드에서 최신 일정을 성공적으로 불러왔습니다!' });
    } else {
      setMsg({ type: 'error', text: '클라우드에 저장된 일정이 없습니다.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-slide-up">
        
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">클라우드 백업 & 로그인</h3>
              <p className="text-xs text-slate-400 font-medium">Firebase Auth / Firestore 연동</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 상태 메시지 */}
        {msg && (
          <div className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* 사용자 상태 섹션 */}
        {user ? (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-sm">
                  {user.isAnonymous ? '👻' : (user.email ? user.email[0].toUpperCase() : 'U')}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">
                    {user.isAnonymous ? '익명(로그인 없이 사용 중)' : user.email}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> 인증됨 (UID: {user.uid.slice(0, 6)}...)
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" /> 로그아웃
              </button>
            </div>

            {/* 클라우드 동기화 버튼들 */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
              <button
                onClick={handleSaveCloud}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <CloudUpload className="w-5 h-5" />
                <span>클라우드에 백업</span>
              </button>
              <button
                onClick={handleLoadCloud}
                disabled={loading}
                className="flex flex-col items-center justify-center gap-1.5 p-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <CloudDownload className="w-5 h-5 text-sky-600" />
                <span>클라우드에서 불러오기</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              로그인하면 내 여행 일정을 안전하게 <strong>클라우드(Firestore)</strong>에 저장하고, 스마트폰과 PC 등 어디서나 실시간으로 연동하여 볼 수 있습니다.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google 계정으로 계속하기</span>
            </button>

            <button
              onClick={handleAnonLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold text-xs transition-all active:scale-98 disabled:opacity-50"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>로그인 없이 익명 모드로 시작하기</span>
            </button>
          </div>
        )}

        {/* 설명 푸터 */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            💡 Firebase 프로젝트의 API 키를 <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">.env</code>에 등록하면 클라우드 동기화가 활성화됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
