import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, ExternalLink, Star } from 'lucide-react';

// Leaflet 기본 마커 아이콘 픽스
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 지도 리사이즈 헬퍼
function MapResizer({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      if (center) map.setView(center, zoom || map.getZoom());
    }, 300);
    return () => clearTimeout(timer);
  }, [map, center, zoom]);
  return null;
}

// 카테고리별 색상
const CATEGORY_COLORS = {
  transport: '#3b82f6',
  hotel: '#6366f1',
  sightseeing: '#14b8a6',
  food: '#f59e0b',
  cafe: '#f97316',
  night: '#a855f7',
  event: '#ec4899',
};

// 커스텀 숫자 마커 아이콘
function createMarkerIcon(number, category) {
  const color = CATEGORY_COLORS[category] || '#0284c7';
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      width:28px;height:28px;border-radius:50%;
      border:2.5px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-weight:800;font-size:12px;font-family:sans-serif;
      position:relative;
    ">
      ${number}
      <div style="
        position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
        width:0;height:0;
        border-left:5px solid transparent;
        border-right:5px solid transparent;
        border-top:7px solid ${color};
      "></div>
    </div>`,
    iconSize: [28, 35],
    iconAnchor: [14, 35],
    popupAnchor: [0, -36]
  });
}

export default function MapView({ itinerary, focusedItem }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [mapType, setMapType] = useState('google-roadmap');

  // 일자 리스트
  const daysList = useMemo(() => {
    const map = new Map();
    itinerary.forEach(item => {
      if (!map.has(item.day)) map.set(item.day, { day: item.day, date: item.date, city: item.city });
    });
    return Array.from(map.values()).sort((a, b) => a.day - b.day);
  }, [itinerary]);

  // 선택 날짜 기준으로 필터링 + 정렬
  const mapItems = useMemo(() => {
    let list = selectedDay === 0 ? [...itinerary] : itinerary.filter(i => i.day === selectedDay);
    return list.sort((a, b) => a.day !== b.day ? a.day - b.day : a.time.localeCompare(b.time));
  }, [itinerary, selectedDay]);

  // Polyline 좌표 배열
  const routeCoords = useMemo(() => mapItems.map(i => [i.lat, i.lng]), [mapItems]);

  // 지도 중심
  const center = useMemo(() => {
    if (focusedItem) return [focusedItem.lat, focusedItem.lng];
    if (mapItems.length > 0) {
      const lats = mapItems.map(i => i.lat);
      const lngs = mapItems.map(i => i.lng);
      return [(Math.min(...lats) + Math.max(...lats)) / 2, (Math.min(...lngs) + Math.max(...lngs)) / 2];
    }
    return [50.0878, 14.4205];
  }, [focusedItem, mapItems]);

  const zoom = focusedItem ? 15 : (selectedDay === 0 ? 5 : 13);

  // 타일 URL
  const tileConfig = {
    'google-roadmap': { url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', sub: ['mt0','mt1','mt2','mt3'] },
    'google-satellite': { url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', sub: ['mt0','mt1','mt2','mt3'] },
    'osm': { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', sub: undefined }
  };
  const tile = tileConfig[mapType] || tileConfig['google-roadmap'];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-950">
      
      {/* 컨트롤 헤더 */}
      <div className="sticky top-[61px] z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-100">동선 지도 시각화</h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700 font-bold">
              {mapItems.length}곳
            </span>
          </div>
          {/* 지도 타입 전환 */}
          <div className="flex gap-1">
            {[['google-roadmap','구글'], ['google-satellite','위성'], ['osm','OSM']].map(([key, label]) => (
              <button key={key} onClick={() => setMapType(key)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  mapType === key ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}>{label}</button>
            ))}
          </div>
        </div>

        {/* 날짜 칩 스크롤 */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button onClick={() => setSelectedDay(0)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedDay === 0 ? 'bg-sky-500 text-white shadow' : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>전체</button>
          {daysList.map(d => (
            <button key={d.day} onClick={() => setSelectedDay(d.day)}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                selectedDay === d.day ? 'bg-sky-500 text-white shadow' : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
              <span className="font-bold">Day{d.day}</span>
              <span className="text-[10px] opacity-80">({d.city})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 지도 본체 */}
      <div style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }} className="w-full relative z-10">
        <MapContainer
          key={`map-${selectedDay}-${mapType}`}
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapResizer center={center} zoom={zoom} />

          <TileLayer
            url={tile.url}
            subdomains={tile.sub}
            maxZoom={19}
            attribution="&copy; Google Maps / OpenStreetMap"
          />

          {/* 이동 동선 Polyline */}
          {routeCoords.length > 1 && (
            <>
              <Polyline positions={routeCoords} color="#0284c7" weight={5} opacity={0.75} />
              <Polyline positions={routeCoords} color="#7dd3fc" weight={2.5} dashArray="10 8" opacity={1} />
            </>
          )}

          {/* 장소 마커 */}
          {mapItems.map((item, idx) => {
            const deepLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;
            const hasHighlights = item.highlights && item.highlights.length > 0;

            return (
              <Marker key={item.id} position={[item.lat, item.lng]} icon={createMarkerIcon(idx + 1, item.category)}>
                <Popup maxWidth={280} minWidth={220}>
                  <div style={{ fontFamily: 'sans-serif', padding: '4px 2px' }}>

                    {/* 순번 + 날짜 배지 */}
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
                      <div style={{
                        background: CATEGORY_COLORS[item.category] || '#0284c7',
                        color: '#fff', fontWeight: 800, fontSize: '11px',
                        width: '22px', height: '22px', borderRadius: '50%',
                        display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0
                      }}>{idx + 1}</div>
                      <span style={{ fontSize:'11px', fontWeight:700, background:'#f1f5f9', padding:'2px 8px', borderRadius:'6px', color:'#334155' }}>
                        Day {item.day} · {item.city}
                      </span>
                      <span style={{ fontSize:'11px', color:'#0284c7', fontWeight:600 }}>{item.time}</span>
                    </div>

                    {/* 제목 */}
                    <h4 style={{ fontWeight:800, fontSize:'14px', color:'#0f172a', margin:'0 0 4px', lineHeight:'1.3' }}>
                      {item.title}
                    </h4>

                    {/* 위치 */}
                    <div style={{ fontSize:'11px', color:'#64748b', marginBottom:'6px' }}>
                      📍 {item.location}
                    </div>

                    {/* 메모 (주의사항) */}
                    {item.notes && (
                      <div style={{
                        background:'#fffbeb', border:'1px solid #fde68a',
                        borderRadius:'8px', padding:'6px 8px',
                        fontSize:'11px', color:'#92400e', lineHeight:'1.5',
                        marginBottom:'6px', whiteSpace:'pre-line'
                      }}>
                        {item.notes}
                      </div>
                    )}

                    {/* 역사·관광 포인트 하이라이트 */}
                    {hasHighlights && (
                      <div style={{ marginBottom:'8px' }}>
                        <div style={{ fontSize:'11px', fontWeight:700, color:'#0369a1', marginBottom:'4px', display:'flex', alignItems:'center', gap:'4px' }}>
                          ✦ 역사·관광 포인트
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
                          {item.highlights.map((h, i) => (
                            <div key={i} style={{
                              fontSize:'11px', color:'#1e293b', background:'#f0f9ff',
                              border:'1px solid #bae6fd', borderRadius:'6px',
                              padding:'4px 8px', lineHeight:'1.4'
                            }}>
                              {h}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 구글맵 딥링크 버튼 */}
                    <a href={deepLink} target="_blank" rel="noopener noreferrer"
                      style={{
                        display:'flex', alignItems:'center', justifyContent:'center', gap:'4px',
                        background:'#0284c7', color:'#fff', fontWeight:700, fontSize:'12px',
                        padding:'8px 12px', borderRadius:'10px', textDecoration:'none',
                        boxShadow:'0 2px 8px rgba(2,132,199,0.3)'
                      }}>
                      <span>구글 맵 앱에서 열기 ↗</span>
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

    </div>
  );
}
