import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import TimelineView from './components/TimelineView';
import MapView from './components/MapView';
import SheetSyncModal from './components/SheetSyncModal';
import AuthModal from './components/AuthModal';
import TravelTipsView from './components/TravelTipsView';
import { useItinerary } from './hooks/useItinerary';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useTripTime } from './hooks/useTripTime';
import { auth, onAuthStateChanged } from './firebase';
import { WifiOff, Wifi, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [focusedMapItem, setFocusedMapItem] = useState(null);
  const [user, setUser] = useState(null);

  const { itinerary, tripInfo, lastSyncTime, updateItinerary, resetToDefault } = useItinerary();
  const { isOnline, showToast, toastMessage, dismissToast } = useOnlineStatus();
  const tripTime = useTripTime();

  // Firebase 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const handleFocusMap = (item) => {
    setFocusedMapItem(item);
    setActiveTab('map');
  };

  const handleTabChange = (tab) => {
    if (tab === 'sheet') {
      setIsSheetModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>
      
      {/* 상단 헤더 */}
      <Navbar
        isOnline={isOnline}
        tripTitle={tripInfo.title}
        lastSyncTime={lastSyncTime}
        user={user}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onResetDefault={resetToDefault}
      />

      {/* 네트워크 상태 토스트 */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] max-w-sm w-full px-4 animate-slide-up">
          <div className={`flex items-center justify-between gap-2 px-4 py-3 rounded-2xl shadow-lg text-sm font-semibold ${
            isOnline ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            <div className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-xs">{toastMessage}</span>
            </div>
            <button onClick={dismissToast}><X className="w-4 h-4 opacity-70" /></button>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      <main>
        {activeTab === 'timeline' && (
          <TimelineView itinerary={itinerary} onFocusMap={handleFocusMap} />
        )}
        {activeTab === 'map' && (
          <MapView itinerary={itinerary} focusedItem={focusedMapItem} />
        )}
        {activeTab === 'tips' && (
          <TravelTipsView tripInfo={tripInfo} />
        )}
      </main>

      {/* 하단 탭 바 */}
      <BottomNav activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* 구글 시트 모달 */}
      <SheetSyncModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        onUpdateItinerary={updateItinerary}
        onResetDefault={resetToDefault}
      />

      {/* Firebase 로그인 / 클라우드 백업 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        itinerary={itinerary}
        tripInfo={tripInfo}
        onUpdateItinerary={updateItinerary}
      />
    </div>
  );
}
