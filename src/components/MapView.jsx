import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, MapPin, ExternalLink, Compass, Layers, Sparkles, Route } from 'lucide-react';

// Leaflet 기본 마커 아이콘 픽스
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 지도 이동 및 리사이즈 헬퍼
function MapResizer({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (center) map.setView(center, zoom || map.getZoom(), { animate: true });
    }, 200);
    return () => clearTimeout(timer);
  }, [map, center, zoom]);
  return null;
}

// 카테고리별 마커 색상
const CATEGORY_COLORS = {
  transport: '#0284c7',
  hotel: '#6366f1',
  sightseeing: '#0d9488',
  food: '#eab308',
  cafe: '#f97316',
  night: '#a855f7',
  event: '#ec4899',
};

// 숫자 포함 구글 핀 스타일 DivIcon
function createGoogleMarkerIcon(number, category, isSelected = false) {
  const color = CATEGORY_COLORS[category] || '#0284c7';
  const size = isSelected ? 34 : 28;
  const shadow = isSelected ? '0 4px 12px rgba(2,132,199,0.6)' : '0 2px 8px rgba(0,0,0,0.35)';

  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:${size}px;height:${size}px;border-radius:50%;
      border:3px solid #ffffff;
      box-shadow:${shadow};
      display:flex;align-items:center;justify-content:center;
      color:#ffffff;font-weight:900;font-size:${isSelected ? '14px' : '12px'};font-family:'Inter', sans-serif;
      position:relative;
      transition: all 0.2s ease;
    ">
      ${number}
      <div style="
        position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:8px solid ${color};
      "></div>
    </div>`,
    iconSize: [size, size + 7],
    iconAnchor: [size / 2, size + 7],
    popupAnchor: [0, -(size + 8)]
  });
}

export default function MapView({ itinerary, focusedItem }) {
  const [selectedDay, setSelectedDay] = useState(focusedItem ? focusedItem.day : 1);
  const [mapType, setMapType] = useState('google-roadmap'); // google-roadmap | google-satellite | google-terrain
  const [activeItem, setActiveItem] = useState(focusedItem || null);
  const markerRefs = useRef({});

  // 일자별 리스트
  const daysList = useMemo(() => {
    const map = new Map();
    itinerary.forEach(item => {
      if (!map.has(item.day)) map.set(item.day, { day: item.day, date: item.date, city: item.city });
    });
    return Array.from(map.values()).sort((a, b) => a.day - b.day);
  }, [itinerary]);

  // 외부 focusItem 전달 시 업데이트
  useEffect(() => {
    if (focusedItem) {
      setSelectedDay(focusedItem.day);
      setActiveItem(focusedItem);
    }
  }, [focusedItem]);

  // 선택 날짜 기준으로 필터링 + 정렬
  const mapItems = useMemo(() => {
    let list = selectedDay === 0 ? [...itinerary] : itinerary.filter(i => i.day === selectedDay);
    return list.sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time));
  }, [itinerary, selectedDay]);

  // Polyline 이동 경로 좌표
  const routeCoords = useMemo(() => mapItems.map(i => [i.lat, i.lng]), [mapItems]);

  // 지도 중심
  const center = useMemo(() => {
    if (activeItem) return [activeItem.lat, activeItem.lng];
    if (mapItems.length > 0) {
      const lats = mapItems.map(i => i.lat);
      const lngs = mapItems.map(i => i.lng);
      return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
    }
    return [50.0878, 14.4205]; // 프라하 기본
  }, [activeItem, mapItems]);

  const zoom = activeItem ? 16 : (selectedDay === 0 ? 5 : 13);

  // 구글 맵 타일 레이어 설정
  const tileConfig = {
    'google-roadmap': {
      name: '🗺️ 일반 지도',
      url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      sub: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    'google-satellite': {
      name: '🛰️ 위성 지도',
      url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
      sub: ['mt0', 'mt1', 'mt2', 'mt3']
    },
    'google-terrain': {
      name: '🏔️ 지형 지도',
      url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      sub: ['mt0', 'mt1', 'mt2', 'mt3']
    }
  };

  const tile = tileConfig[mapType] || tileConfig['google-roadmap'];

  // 하단 장소 카드 터치 시 지도 포커스
  const handleSelectPlace = (item) => {
    setActiveItem(item);
    const marker = markerRefs.current[item.id];
    if (marker) {
      marker.openPopup();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-slate-100 relative overflow-hidden">
      
      {/* 상단 컨트롤 바 */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm z-20 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <span>Google Maps 동선지도</span>
                <span className="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full border border-sky-100 font-bold">
                  {mapItems.length}곳
                </span>
              </h2>
            </div>
          </div>

          {/* 지도 타입 스위처 (구글 일반 / 위성 / 지형) */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            {Object.entries(tileConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setMapType(key)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  mapType === key
                    ? 'bg-white text-sky-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cfg.name.split(' ')[0]} {cfg.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* 날짜 선택 칩 스크롤 */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => { setSelectedDay(0); setActiveItem(null); }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDay === 0
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 동선
          </button>
          {daysList.map((d) => (
            <button
              key={d.day}
              onClick={() => { setSelectedDay(d.day); setActiveItem(null); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all ${
                selectedDay === d.day
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>Day {d.day}</span>
              <span className="text-[10px] opacity-80 font-normal">({d.city})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 w-full relative z-10">
        <MapContainer
          key={`google-map-${selectedDay}-${mapType}`}
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapResizer center={center} zoom={zoom} />

          {/* 구글 맵 타일 레이어 */}
          <TileLayer
            url={tile.url}
            subdomains={tile.sub}
            maxZoom={19}
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
          />

          {/* 이동 경로 Polyline 선 연결 */}
          {routeCoords.length > 1 && (
            <>
              <Polyline positions={routeCoords} color="#0284c7" weight={5} opacity={0.7} />
              <Polyline positions={routeCoords} color="#38bdf8" weight={2.5} dashArray="8 6" opacity={1} />
            </>
          )}

          {/* 구글 맵 마커 */}
          {mapItems.map((item, idx) => {
            const isSelected = activeItem?.id === item.id;

            // 구글 맵 앱 연결 딥링크 URL
            const googleSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location + ' ' + item.city)}`;
            const googleDirUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}&destination_place_id=${encodeURIComponent(item.location)}`;

            return (
              <Marker
                key={item.id}
                ref={(el) => (markerRefs.current[item.id] = el)}
                position={[item.lat, item.lng]}
                icon={createGoogleMarkerIcon(idx + 1, item.category, isSelected)}
                eventHandlers={{
                  click: () => setActiveItem(item)
                }}
              >
                <Popup maxWidth={290} minWidth={230} className="google-map-popup">
                  <div className="p-1 space-y-2 font-sans">
                    
                    {/* 상단 순번 & 카테고리 헤더 */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[11px] font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          Day {item.day} · {item.city}
                        </span>
                      </div>
                      <span className="text-[11px] font-extrabold text-sky-600">{item.time}</span>
                    </div>

                    {/* 장소 정보 */}
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{item.location}</span>
                      </p>
                    </div>

                    {/* 메모 */}
                    {item.notes && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-2 text-[11px] leading-relaxed">
                        {item.notes}
                      </div>
                    )}

                    {/* 역사 & 관람 포인트 */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-sky-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-sky-500" /> 역사·관광 포인트
                        </p>
                        {item.highlights.map((h, i) => (
                          <div key={i} className="text-[11px] text-slate-700 bg-sky-50/70 border border-sky-100 rounded-lg p-1.5 leading-snug">
                            {h}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 구글 맵 앱 연결 버튼 (딥링크) */}
                    <div className="pt-1 grid grid-cols-2 gap-1.5">
                      <a
                        href={googleSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] py-2 rounded-xl text-center shadow-sm no-underline transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>구글맵 장소 열기</span>
                      </a>

                      <a
                        href={googleDirUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] py-2 rounded-xl text-center shadow-sm no-underline transition-all"
                      >
                        <Route className="w-3 h-3 text-sky-400" />
                        <span>구글맵 길찾기</span>
                      </a>
                    </div>

                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* 하단 장소 카드 빠른 선택  carousel 바 */}
      {mapItems.length > 0 && (
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 z-20 shadow-lg">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {mapItems.map((item, idx) => {
              const isSelected = activeItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectPlace(item)}
                  className={`flex-shrink-0 px-3 py-2 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 ring-offset-1 shadow-md'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-black flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600">{item.time}</span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-800 max-w-[130px] truncate">
                    {item.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
