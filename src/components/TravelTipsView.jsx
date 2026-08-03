import React, { useState } from 'react';
import { CheckSquare, Square, AlertTriangle, Hotel, CreditCard, Camera, Sparkles, ChevronLeft, ChevronRight, User, Users } from 'lucide-react';

// 포토스팟 데이터 (예시 이미지 + 촬영 팁)
const PHOTO_SPOTS = [
  {
    flag: '🇨🇿',
    city: '프라하 (Prague)',
    spots: [
      {
        name: '레트나 공원 전망대 (Letná Park)',
        desc: '프라하 주황 지붕 파노라마와 블타바 강이 한눈에 — 일몰 골든아워 최고',
        tipFemale: '얼굴 60% 채우는 클로즈업 셀카, 카메라 살짝 비껴보기, 노을 방향',
        tipMale: '손 주머니 넣고 전경 바라보는 뒷태샷, 로우앵글, 인물 좌측 1/3',
        imgFemale: '/photo-spots/prague-letna-female.jpg',
        imgMale: '/photo-spots/prague-letna-male.jpg',
      },
      {
        name: '카를교 (Charles Bridge)',
        desc: '이른 아침 07:00~08:00 — 안개 낀 교각과 성이 배경, 인파 없음',
        tipFemale: '입술 살짝 벌리고 먼 곳 바라보기, 흰 상의 추천, 안개 배경',
        tipMale: '3m 뒤에서 걷는 캔디드샷, 손 후디 주머니, 혼자 걸어가는 뒷모습',
        imgFemale: '/photo-spots/prague-charles-female.jpg',
        imgMale: '/photo-spots/prague-charles-male.jpg',
      },
    ]
  },
  {
    flag: '🇦🇹',
    city: '잘츠부르크 & 할슈타트',
    spots: [
      {
        name: '미라벨 정원 (Mirabell Gardens)',
        desc: '바로크 꽃밭 + 호엔잘츠부르크 성 배경 — 사운드 오브 뮤직 촬영지',
        tipFemale: '돌담에 비스듬히 앉기, 한 다리 교차, 옆 바라보기, 궁전 배경 넣기',
        tipMale: '계단에 앉아 성 방향 바라보기, 오버핏 셋업, 로우앵글 full body',
        imgFemale: '/photo-spots/salzburg-mirabell-female.jpg',
        imgMale: '/photo-spots/salzburg-mirabell-male.jpg',
      },
      {
        name: '할슈타트 카페 테라스 (Hallstatt)',
        desc: '호수 마을 배경 야외 카페 — 엽서 속 뷰를 배경으로 캔디드샷',
        tipFemale: '챙 넓은 모자 + 아이스 음료, 호수 방향 시선, 카메라 안 보기',
        tipMale: '선착장 난간에 기대고 호수 내려다보기, 쿨톤 수면 반사 배경',
        imgFemale: '/photo-spots/hallstatt-cafe-female.jpg',
        imgMale: '/photo-spots/hallstatt-cafe-male.jpg',
      },
    ]
  },
  {
    flag: '🇦🇹',
    city: '인스부르크 (Innsbruck)',
    spots: [
      {
        name: '마리아 테레지아 거리 + 노르트케테',
        desc: '성 안나 기념탑 뒤로 알프스 만년설 산맥 — 인스부르크 시그니처',
        tipFemale: '알프스가 후광처럼 뒤에 오도록, 클로즈업 셀카, 시선은 산 방향',
        tipMale: '거리 중앙 서서 알프스 바라보기, 친구가 아래서 올려찍기, 뒷태샷',
        imgFemale: '/photo-spots/innsbruck-alps-female.jpg',
        imgMale: '/photo-spots/innsbruck-alps-male.jpg',
      },
    ]
  },
  {
    flag: '🇦🇹',
    city: '빈 / 비엔나 (Vienna)',
    spots: [
      {
        name: '벨베데레 상궁 정원 계단',
        desc: '09:00 오픈런 — 궁전 전체가 데칼코마니로 연못에 반사되는 스팟',
        tipFemale: '궁전 앞 계단에 비스듬히 앉기, 팔 무릎에 걸치기, 옆 바라보기',
        tipMale: '계단에 앉아 뒤돌아 궁전 바라보기, 멀리서 광각 full body',
        imgFemale: '/photo-spots/vienna-belvedere-female.jpg',
        imgMale: '/photo-spots/vienna-belvedere-male.jpg',
      },
      {
        name: '미술사박물관 돔 카페 (KHM)',
        desc: '세계 1위 아름다운 카페 — 황금 돔 천장 배경 인생샷',
        tipFemale: '황금 천장 올려다보기, 클로즈업, 플래시 금지, 카페 조명만 활용',
        tipMale: '난간에 팔 올리고 아래 홀 내려다보기, 쿨한 측면 프로필 구도',
        imgFemale: '/photo-spots/vienna-cafe-female.jpg',
        imgMale: '/photo-spots/vienna-cafe-male.jpg',
      },
    ]
  },
  {
    flag: '🇭🇺',
    city: '부다페스트 (Budapest)',
    spots: [
      {
        name: '어부의 요새 (Fisherman\'s Bastion)',
        desc: '흰 아치 액자 속 국회의사당 — 일몰 18:00~20:00 황금빛 최고',
        tipFemale: '아치 안에 서서 국회의사당 바라보기, 친구가 멀리서 광각으로',
        tipMale: '아치 기둥에 한 팔 기대기, 측면 프로필 or 뒷태샷, 일몰 배경',
        imgFemale: '/photo-spots/budapest-bastion-female.jpg',
        imgMale: '/photo-spots/budapest-bastion-male.jpg',
      },
      {
        name: '아난타라 뉴욕 카페 (New York Café)',
        desc: '세계 1위 화려한 카페 — 황금 샹들리에 천장 배경',
        tipFemale: '황금 천장 올려다보기, 진한 조명 속 클로즈업, 2층 계단 난간',
        tipMale: '2층 계단에 기대 아래 홀 내려다보기, 무심한 측면 응시',
        imgFemale: '/photo-spots/budapest-newyork-female.jpg',
        imgMale: '/photo-spots/budapest-newyork-male.jpg',
      },
    ]
  },
];

// 스팟별 이미지 카드 컴포넌트
function SpotCard({ spot }) {
  const [gender, setGender] = useState('female'); // 'female' | 'male'
  const img = gender === 'female' ? spot.imgFemale : spot.imgMale;
  const tip = gender === 'female' ? spot.tipFemale : spot.tipMale;
  const hasMale = !!spot.imgMale;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* 이미지 영역 */}
      <div className="relative w-full" style={{ aspectRatio: '3/4', maxHeight: 280, overflow: 'hidden', background: '#f1f5f9' }}>
        {img ? (
          <img
            src={img}
            alt={spot.name}
            className="w-full h-full object-cover"
            style={{ maxHeight: 280 }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2 p-4">
            <Camera className="w-8 h-8 opacity-40" />
            <p className="text-[11px] font-semibold text-center opacity-60">예시 이미지 준비 중<br/>(곧 추가됩니다)</p>
          </div>
        )}

        {/* 성별 토글 */}
        <div className="absolute top-2 right-2 flex bg-black/50 backdrop-blur-sm rounded-full p-0.5 gap-0.5">
          <button
            onClick={() => setGender('female')}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
              gender === 'female' ? 'bg-white text-slate-800' : 'text-white/70'
            }`}
          >
            <User className="w-3 h-3" />
            <span>여</span>
          </button>
          <button
            onClick={() => setGender('male')}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
              gender === 'male'
                ? hasMale ? 'bg-white text-slate-800' : 'bg-white/20 text-white/50 cursor-not-allowed'
                : 'text-white/70'
            }`}
            disabled={!hasMale}
          >
            <Users className="w-3 h-3" />
            <span>남 {!hasMale && '(준비중)'}</span>
          </button>
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span className="text-[12px] font-bold text-slate-800">{spot.name}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-medium mb-2 leading-relaxed">{spot.desc}</p>
        <div className={`text-[11px] font-semibold px-2.5 py-2 rounded-xl leading-relaxed ${
          gender === 'female'
            ? 'bg-pink-50 text-pink-700 border border-pink-100'
            : 'bg-slate-800 text-slate-100 border border-slate-700'
        }`}>
          📐 {gender === 'female' ? '여성 포즈 팁' : '남성 포즈 팁'}: {tip}
        </div>
      </div>
    </div>
  );
}

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

      {/* 인생샷 포토스팟 가이드 */}
      <div className="trip-card p-4 border-l-4 border-sky-500">
        <div className="flex items-center gap-2 mb-1">
          <Camera className="w-5 h-5 text-sky-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">📸 도시별 인생샷 포토스팟</h3>
            <p className="text-[11px] text-slate-400 font-medium">여/남 탭 전환으로 포즈 예시 확인 · 남성 예시는 순차 업데이트 중</p>
          </div>
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-3 mb-4 mt-2 px-1">
          <div className="flex items-center gap-1 text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-full border border-pink-100">
            <User className="w-3 h-3" /> 여성 K-인스타 감성
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-100 bg-slate-800 px-2 py-1 rounded-full">
            <Users className="w-3 h-3" /> 남성 스냅 무심체
          </div>
        </div>

        {PHOTO_SPOTS.map((citySpots, ci) => (
          <div key={ci} className="mb-5">
            <div className="text-xs font-extrabold text-sky-900 flex items-center gap-1.5 mb-2.5 pb-1.5 border-b border-sky-100">
              <span>{citySpots.flag}</span>
              <span>{citySpots.city}</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {citySpots.spots.map((spot, si) => (
                <SpotCard key={si} spot={spot} />
              ))}
            </div>
          </div>
        ))}
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
