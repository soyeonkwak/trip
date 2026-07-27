import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import TimelineView from './components/TimelineView';
import MapView from './components/MapView';
import SheetSyncModal from './components/SheetSyncModal';
import TravelTipsView from './components/TravelTipsView';
import { useItinerary } from './hooks/useItinerary';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useTripTime } from './hooks/useTripTime';
import { WifiOff, Wifi, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [focusedMapItem, setFocusedMapItem] = useState(null);

  const {
    itinerary,
    tripInfo,
    lastSyncTime,
    updateItinerary,
    editItem,
    addItem,
    removeItem,
    resetToDefault
  } = useItinerary();

  const { isOnline, showToast, toastMessage, dismissToast } = useOnlineStatus();
  const tripTime = useTripTime();

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
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
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
          <TimelineView
            itinerary={itinerary}
            onFocusMap={handleFocusMap}
            onEditItem={editItem}
            onAddItem={addItem}
            onDeleteItem={removeItem}
          />
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
    </div>
  );
}
