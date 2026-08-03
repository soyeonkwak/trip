import React, { useState } from 'react';
import { CheckSquare, Square, AlertTriangle, Hotel, CreditCard, Camera, Sparkles } from 'lucide-react';

export default function TravelTipsView({ tripInfo }) {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Bolt 앱 설치 + 트래블월렛 카드 연동', checked: true },
    { id: 2, text: '오스트리아 ÖBB 앱 & 체코 PID Litacka 앱 설치', checked: true },
    { id: 3, text: '8/8 Felsenreitschule 오케스트라 e-티켓 PDF 저장 & 출력', checked: false },
    { id: 4, text: '8/9 잘츠부르크 호텔에서 게스트 모빌리티 티켓 수령 (할슈타트 버스 무료)', checked: false },
    { id: 5, text: '할슈타트 페리 현금 4유로/인 준비', checked: false },
    { id: 6, text: '8/12 15:00 성베드로성당 오르간 -> 카페 데멜 -> 16:30 Vollpension 방문', checked: false },
    { id: 7, text: '8/13 09:00 벨베데레 상궁 오픈런 -> 11:20 미술사박물관(KHM) 방문', checked: false },
    { id: 8, text: '8/13 13:20 미술사박물관 돔 카페 점심 -> 14:30 호프부르크 왕궁(Sisi)', checked: false },
    { id: 9, text: '8/14 RJX 19929 열차 시간 변경 확정 확인 (09:42~12:35)', checked: false },
    { id: 10, text: '8/16 부다페스트 공항 이동 miniBUD 셔틀 사전 예약', checked: false },
  ]);

  const toggle = (id) => setChecklist(p => p.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  const done = checklist.filter(i => i.checked).length;
  const pct = Math.round((done / checklist.length) * 100);

  const photoSpots = [
    {
      flag: '🇨🇿',
      city: '프라하 (Prague)',
      spots: [
        { name: '레트나 공원 (Letná Park)', desc: '블타바 강과 프라하 다리들이 한눈에 들어오는 파노라마 일몰·노을 스팟' },
        { name: '프라하성 스타벅스 테라스', desc: '붉은 지붕 지평선을 배경으로 커피 한 잔과 함께 찍는 필수 포토존' },
        { name: '카를교 (Charles Bridge)', desc: '이른 아침(07~08시) 인파가 없을 때나 일몰 직후 카를교와 프라하성 조망' },
        { name: '황금소로 (Golden Lane)', desc: '카프카 작업실(No.22) 및 아기자기한 파스텔톤 중세 골목 배경' }
      ]
    },
    {
      flag: '🇦🇹',
      city: '잘츠부르크 & 할슈타트 (Salzburg & Hallstatt)',
      spots: [
        { name: '미라벨 궁전 정원 (Mirabell Gardens)', desc: '화려한 바로크 꽃밭 + 호엔잘츠부르크 성 배경 (영화 도레미송 촬영지)' },
        { name: '게트라이데 거리 (Getreidegasse)', desc: '가게마다 매달린 고풍스러운 수공예 철제 간판 낭만 골목' },
        { name: '할슈타트 클래식 뷰포인트 (Classic Viewpoint)', desc: '엽서에 나오는 호수 마을 전경과 삼각 성당 포토스팟 (페리 북쪽 산책로)' },
        { name: '고사우제 호수 (Gosausee)', desc: '다흐슈타인 만년설 빙하 산이 물에 비치는 투명한 산정 호수 선착장' }
      ]
    },
    {
      flag: '🇦🇹',
      city: '인스부르크 (Innsbruck)',
      spots: [
        { name: '마리아 테레지아 거리', desc: '성 안나 기념탑 뒤로 웅장한 알프스 만년설 노르트케테 산맥이 펼쳐지는 명소' },
        { name: '인강 (River Inn) 다리 위', desc: '알프스 산맥 아래 줄지어 선 파스텔톤 컬러풀 하우스 배경 인생샷' },
        { name: '노르트케테 (Nordkette, 2,334m)', desc: '자하 하디드 설계 역건축물 & 알프스 360도 절벽 파노라마 뷰' }
      ]
    },
    {
      flag: '🇦🇹',
      city: '빈 / 비엔나 (Vienna)',
      spots: [
        { name: '벨베데레 상궁 정원', desc: '09:00 오픈런 시 바로크 정원 연못에 벨베데레 궁전이 비치는 데칼코마니 구도' },
        { name: '알베르티나 미술관 테라스', desc: '에스컬레이터 위에서 국립 오페라 하우스 전체 야경이 가장 예쁘게 담기는 스팟' },
        { name: '미술사박물관 (KHM) 2층 돔 카페', desc: '세계에서 가장 아름다운 돔 카페 난간 및 웅장한 대리석 계단 포토존' }
      ]
    },
    {
      flag: '🇭🇺',
      city: '부다페스트 (Budapest)',
      spots: [
        { name: '어부의 요새 (Fisherman\'s Bastion)', desc: '하얀 성벽 아치 틈 사이로 황금빛 국회의사당이 프레임에 쏙 들어오는 구도' },
        { name: '부티크 빅토리아 / 바챠니 광장 강변', desc: '다뉴브 강 건너편 웅장한 국회의사당 야경을 정면으로 담는 시그니처 뷰' },
        { name: '아난타라 뉴욕 카페 2층 계단', desc: '세계 1위 뉴욕카페의 화려한 황금빛 천장 샹들리에 배경 인생샷' }
      ]
    }
  ];

  const hotels = [
    { flag:'🇨🇿', city:'프라하 (2박)', name:'엠버서더 즐라타 후사', cost:'330,000원 (환불불가)', detail:'조식 포함 | 도시세 10유로', warn: null },
    { flag:'🇦🇹', city:'잘츠부르크 (2박)', name:'오스트리아 H+ 호텔', cost:'629,242원 (환불불가)', detail:'조식 미포함 | 도시세 14.22유로', warn:'💡 체크인 즉시 게스트 모빌리티 티켓 수령 필수!' },
    { flag:'🇦🇹', city:'인스부르크 (2박)', name:'골든 크로네 인스부르크', cost:'407,088원 (환불불가)', detail:'조식 포함 | 도시세 16유로', warn: null },
    { flag:'🇦🇹', city:'빈 (2박)', name:'레오나르도 호텔 하우프트반호프', cost:'345,784원 (무료취소 가능)', detail:'조식 미포함 | 도시세 포함', warn: null },
    { flag:'🇭🇺', city:'부다페스트 1박', name:'부티크 빅토리아', cost:'265,358원 (환불불가)', detail:'조식 포함 | 도시세 포함', warn: null },
    { flag:'🇭🇺', city:'부다페스트 2박', name:'아난타라 뉴욕 호텔', cost:'575,048원', detail:'조식 포함 | 도시세 15유로', warn:'💡 공항 이동 시 miniBUD 셔틀 예약 권장' },
  ];

  return (
    <div className="pb-32 px-4 pt-4 space-y-4">

      {/* 여행지별 인생샷 포토스팟 가이드 (NEW) */}
      <div className="trip-card p-4 border-l-4 border-sky-500">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-sky-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">📸 도시별 대표 인생샷 포토스팟</h3>
            <p className="text-[11px] text-slate-400 font-medium">사진이 가장 예쁘게 나오는 구도 및 시크릿 장소</p>
          </div>
        </div>

        <div className="space-y-3">
          {photoSpots.map((ps, i) => (
            <div key={i} className="p-3 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-2">
              <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5 border-b border-sky-100 pb-1.5">
                <span>{ps.flag}</span>
                <span>{ps.city}</span>
              </div>
              <div className="space-y-1.5 pt-0.5">
                {ps.spots.map((spot, sIdx) => (
                  <div key={sIdx} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-[12px] font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>{spot.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                      {spot.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주요 필수 체크포인트 */}
      <div className="trip-card p-4 border-l-4 border-orange-400">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-800">필수 체크포인트</h3>
        </div>
        <div className="space-y-2">
          {(tripInfo.checkpoints || []).map((cp, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 bg-orange-50 rounded-xl border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
              <p className="text-[12px] text-slate-700 font-medium leading-relaxed">{cp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 체크리스트 */}
      <div className="trip-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-500" />
            <h3 className="text-sm font-bold text-slate-800">여행 준비 체크리스트</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              {done}/{checklist.length}
            </span>
            <span className="text-[11px] font-bold text-sky-600">{pct}%</span>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="h-2 bg-slate-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="space-y-2">
          {checklist.map(item => (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                item.checked
                  ? 'bg-slate-50 border-slate-100 opacity-60'
                  : 'bg-white border-slate-200 hover:border-sky-200 hover:bg-sky-50/50'
              }`}>
              {item.checked
                ? <CheckSquare className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" style={{ width:18, height:18 }} />
                : <Square className="w-4.5 h-4.5 text-slate-300 flex-shrink-0" style={{ width:18, height:18 }} />}
              <span className={`text-[12px] font-medium leading-snug ${
                item.checked ? 'text-slate-400 line-through' : 'text-slate-700'
              }`}>{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 숙소 정보 */}
      <div className="trip-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Hotel className="w-5 h-5 text-violet-500" />
          <h3 className="text-sm font-bold text-slate-800">도시별 숙소 & 비용</h3>
        </div>
        <div className="space-y-2.5">
          {hotels.map((h, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-700">{h.flag} {h.city}</div>
                  <div className="text-[12px] text-slate-500 mt-0.5">{h.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg">{h.cost}</div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mt-1.5">{h.detail}</div>
              {h.warn && <div className="text-[11px] text-amber-600 font-semibold mt-1">{h.warn}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 결제/환전 */}
      <div className="trip-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-800">결제 & 환전 팁</h3>
        </div>
        <div className="space-y-2">
          {[
            '트래블월렛 / 트래블로그 카드 — 대부분 장소에서 결제 가능',
            '현금 필수: 할슈타트 페리 (4유로/인) · 유료 화장실 등',
            '소액 유로 현금 지참 권장 (코루나는 프라하 한정)',
            'Bolt 택시: 트래블월렛 카드 사전 연동 필수',
            '현대카드 + 국민은행 카드 모두 비상용 지참',
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2.5 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
              <p className="text-[12px] text-slate-700 font-medium">{t}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
