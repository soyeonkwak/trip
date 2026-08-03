// =========================================================
// 한성소연 동유럽 여행 일정 (구글 시트 2026-08-03 최신 반영)
// 기간: 2026년 8월 6일(목) ~ 8월 17일(월) (10박 12일)
// 경로: 프라하 → 잘츠부르크 → 인스부르크 → 빈 → 부다페스트
// =========================================================

export const INITIAL_TRIP_INFO = {
  title: "한성소연 동유럽 일정 🗺️",
  period: "2026년 8월 6일(목) ~ 8월 17일(월) (10박 12일)",
  cities: ["프라하", "잘츠부르크", "인스부르크", "빈", "부다페스트"],
  checkpoints: [
    "[8/6 프라하] 공항 기차역 없음 → 볼트(Bolt) 앱 + 트래블월렛 카드 연동 필수",
    "[8/6 프라하] Pork's Mostecka (카를교 옆 꼴레뇨 맛집) 저녁 식사",
    "[8/8 이동] 프라하→잘츠부르크 기차 10:21 표 → 08:21 조기 출발 권장 (환승 3회 가능성)",
    "[8/9 잘츠부르크] 호텔 카운터에서 '게스트 모빌리티 티켓' 필수 수령 (150X번 버스 무료)",
    "[8/8 잘츠부르크] Felsenreitschule 공연 e-티켓(PDF) 사전 출력 또는 저장 필수",
    "[8/12 비엔나] 15:00 성베드로성당 오르간 → 카페 데멜 → 16:30 Vollpension → 슈테판 대성당",
    "[8/13 비엔나] 09:00 벨베데레 오픈런 → 11:20 미술사박물관 → 13:20 돔 카페 → 14:30 호프부르크(Sisi)",
    "[8/14 부다페스트] RJX 19929 열차 시각 변경 완료 (09:42 출발 → 12:35 도착)",
    "[8/16 귀국] 공항 이동 miniBUD 셔틀 또는 호텔 픽업 사전 예약 필요"
  ]
};

export const SAMPLE_ITINERARY = [
  // ============================================================
  // DAY 1 — 8.6(목) 인천 T2 → 프라하 T1
  // ============================================================
  {
    id: "d1-1",
    day: 1,
    date: "8. 6(목)",
    time: "10:45",
    city: "프라하",
    title: "인천 T2 → 프라하 T1 (아시아나 항공)",
    location: "인천국제공항 제2여객터미널",
    lat: 37.4602,
    lng: 126.4407,
    category: "transport",
    notes: "아시아나 항공 탑승 (10:45 출발 → 16:45 도착)",
    highlights: ["출발 3시간 전 공항 도착 권장", "트래블월렛·트래블로그 해외 결제 및 볼트(Bolt) 연동 확인"]
  },
  {
    id: "d1-2",
    day: 1,
    date: "8. 6(목)",
    time: "16:45",
    city: "프라하",
    title: "프라하 공항 → 숙소 이동 (Bolt 택시)",
    location: "바츨라프 하벨 프라하 공항 (PRG)",
    lat: 50.1018,
    lng: 14.2632,
    category: "transport",
    notes: "볼트(Bolt) 택시 이용 숙소 이동. 트래블월렛 카드 연동. 공항 내 기차역 없음.",
    highlights: ["볼트 앱 사전 설치 필수", "트래블월렛 연동 후 카드 결제"]
  },
  {
    id: "d1-3",
    day: 1,
    date: "8. 6(목)",
    time: "18:00",
    city: "프라하",
    title: "저녁 식사 — Pork's Mostecká",
    location: "Pork's Mostecká, Prague",
    lat: 50.0872,
    lng: 14.4092,
    category: "food",
    notes: "꼴레뇨 저녁 식사. 카를교 바로 옆 위치.",
    highlights: ["꼴레뇨(돼지 족발 구이) 대표 맛집", "예약 권장"]
  },
  {
    id: "d1-4",
    day: 1,
    date: "8. 6(목)",
    time: "19:30",
    city: "프라하",
    title: "구시가지 야경 & 카를교 산책",
    location: "카를교 (Charles Bridge)",
    lat: 50.0865,
    lng: 14.4114,
    category: "night",
    notes: "구시가지 야경 및 카를교 야간 산책. 입장료 무료. 숙소: 엠버서더 즐라타 후사 (조식 O / 도시세 10€)",
    highlights: ["야간 카를교는 낮보다 훨씬 아름다움", "조명 켜진 프라하성 뷰 최고"]
  },

  // ============================================================
  // DAY 2 — 8.7(금) 프라하 시내 + Jazz Dock
  // ============================================================
  {
    id: "d2-1",
    day: 2,
    date: "8. 7(금)",
    time: "08:00",
    city: "프라하",
    title: "조식 (숙소)",
    location: "엠버서더 즐라타 후사",
    lat: 50.0823,
    lng: 14.4265,
    category: "food",
    notes: "숙소 조식 이용",
    highlights: ["조식 포함 숙소"]
  },
  {
    id: "d2-2",
    day: 2,
    date: "8. 7(금)",
    time: "09:30",
    city: "프라하",
    title: "프라하성 & 성 비투스 대성당",
    location: "프라하성 (Prague Castle)",
    lat: 50.0902,
    lng: 14.4000,
    category: "sightseeing",
    notes: "프라하성 통합권 구매 필요. 숙소에서 도보 약 12분.",
    highlights: ["성 비투스 대성당", "황금가지", "구왕궁 관람", "프라하성 통합권 구매"]
  },
  {
    id: "d2-3",
    day: 2,
    date: "8. 7(금)",
    time: "13:00",
    city: "프라하",
    title: "점심 식사 (구시가지 광장 주변)",
    location: "구시가지 광장 (Old Town Square)",
    lat: 50.0876,
    lng: 14.4213,
    category: "food",
    notes: "구시가지 광장 주변 점심 식사",
    highlights: []
  },
  {
    id: "d2-4",
    day: 2,
    date: "8. 7(금)",
    time: "14:30",
    city: "프라하",
    title: "구시가지 광장 & 시내 탐방",
    location: "천문시계탑 (Astronomical Clock)",
    lat: 50.0870,
    lng: 14.4205,
    category: "sightseeing",
    notes: "천문시계탑, 틴 성모 교회, 구시가지 골목 탐방. 시계탑 전망대 선택.",
    highlights: ["천문시계 정시 퍼포먼스", "틴 성모 교회", "구시가지 골목 탐방"]
  },
  {
    id: "d2-5",
    day: 2,
    date: "8. 7(금)",
    time: "21:00",
    city: "프라하",
    title: "저녁 식사 & Jazz Dock 재즈 공연",
    location: "Jazz Dock, Prague",
    lat: 50.0712,
    lng: 14.4118,
    category: "event",
    notes: "재즈 음악 감상 및 라이브 공연. 강변 위 재즈 클럽. 숙소: 엠버서더 즐라타 후사",
    highlights: ["블타바 강변 재즈 클럽", "Yo Soy Indigo 공연 (Freak-Folk-Jazz)", "창가 좌석 사전 예약 권장", "jazzdock.cz에서 티켓 구매"]
  },

  // ============================================================
  // DAY 3 — 8.8(토) 프라하 → 잘츠부르크 이동 + 구시가지 + 오케스트라
  // ============================================================
  {
    id: "d3-1",
    day: 3,
    date: "8. 8(토)",
    time: "07:00",
    city: "잘츠부르크",
    title: "조식 및 이동 준비",
    location: "엠버서더 즐라타 후사",
    lat: 50.0823,
    lng: 14.4265,
    category: "food",
    notes: "아침 식사 및 이동 시 먹을 간단한 도시락/간식 준비",
    highlights: []
  },
  {
    id: "d3-2",
    day: 3,
    date: "8. 8(토)",
    time: "08:21",
    city: "잘츠부르크",
    title: "프라하 → 잘츠부르크 이동 (기차)",
    location: "Praha Hlavní Nádraží (프라하 중앙역)",
    lat: 50.0832,
    lng: 14.4356,
    category: "transport",
    notes: "기차표 10:21 표 구매했으나 08:21 조기 출발 권장. 체코/오스트리아 국경 이동 (환승 3회 가능성). 14:00 도착.",
    highlights: ["08:21 출발 시 가장 빠름", "대체 버스 포함 환승 3회 가능성 있음"]
  },
  {
    id: "d3-3",
    day: 3,
    date: "8. 8(토)",
    time: "14:00",
    city: "잘츠부르크",
    title: "호텔 체크인 (오스트리아 H+ 호텔)",
    location: "오스트리아 H+ 호텔 잘츠부르크",
    lat: 47.7986,
    lng: 13.0556,
    category: "hotel",
    notes: "짐 보관 및 가벼운 정돈. 조식 X / 도시세 14.22€. 게스트 모빌리티 티켓 체크인 시 수령 필수!",
    highlights: ["체크인 즉시 게스트 모빌리티 티켓 수령", "할슈타트 150X번 버스 무료 이용 가능"]
  },
  {
    id: "d3-4",
    day: 3,
    date: "8. 8(토)",
    time: "15:00",
    city: "잘츠부르크",
    title: "잘츠부르크 구시가지 탐방",
    location: "게트라이데 거리 (Getreidegasse)",
    lat: 47.7992,
    lng: 13.0426,
    category: "sightseeing",
    notes: "게트라이데 거리, 모차르트 생가, 발칸그릴 핫도그 맛보기. 모차르트 생가 입장료 선택.",
    highlights: ["게트라이데 거리 중세 철제 간판", "모차르트 생가 방문 (선택)", "발칸그릴 핫도그 꼭 먹기"]
  },
  {
    id: "d3-5",
    day: 3,
    date: "8. 8(토)",
    time: "18:30",
    city: "잘츠부르크",
    title: "저녁 식사",
    location: "잘츠부르크 구시가지",
    lat: 47.7998,
    lng: 13.0440,
    category: "food",
    notes: "구시가지 근처 저녁 식사",
    highlights: []
  },
  {
    id: "d3-6",
    day: 3,
    date: "8. 8(토)",
    time: "20:30",
    city: "잘츠부르크",
    title: "Felsenreitschule 오케스트라 연주회",
    location: "Felsenreitschule, Salzburg",
    lat: 47.7975,
    lng: 13.0443,
    category: "event",
    notes: "부다페스트 오케스트라 클래식 연주 감상. 공연 e-티켓(PDF) 사전 준비 필수! 22:30 종료.",
    highlights: ["e-티켓 PDF 사전 출력 또는 핸드폰 저장 필수", "헬브룬 궁전은 일정에서 생략"]
  },

  // ============================================================
  // DAY 4 — 8.9(일) 잘츠부르크 & 할슈타트 당일치기
  // ============================================================
  {
    id: "d4-1",
    day: 4,
    date: "8. 9(일)",
    time: "08:00",
    city: "잘츠부르크",
    title: "잘츠부르크 → 할슈타트 이동 (150X번 버스)",
    location: "잘츠부르크 중앙역",
    lat: 47.8129,
    lng: 13.0451,
    category: "transport",
    notes: "150X번 버스 이용 (150번보다 빠름). 게스트 모빌리티 티켓으로 무료 이용.",
    highlights: ["게스트 모빌리티 티켓 지참 필수", "150X번이 150번보다 빠름"]
  },
  {
    id: "d4-2",
    day: 4,
    date: "8. 9(일)",
    time: "09:00",
    city: "잘츠부르크",
    title: "할슈타트 & 고사우제 관람",
    location: "할슈타트 (Hallstatt)",
    lat: 47.5623,
    lng: 13.6493,
    category: "sightseeing",
    notes: "호수 마을 산책, 고사우제 호수 풍경 감상. 할슈타트 페리 4€ — 현금 준비!",
    highlights: ["할슈타트 페리 4€ (현금 준비)", "고사우제 호수 풍경", "호수 마을 산책"]
  },
  {
    id: "d4-3",
    day: 4,
    date: "8. 9(일)",
    time: "13:30",
    city: "잘츠부르크",
    title: "할슈타트 → 잘츠부르크 복귀",
    location: "할슈타트 버스 정류장",
    lat: 47.5623,
    lng: 13.6493,
    category: "transport",
    notes: "버스 탑승 후 잘츠부르크 복귀. 게스트 모빌리티 티켓 무료 이용.",
    highlights: []
  },
  {
    id: "d4-4",
    day: 4,
    date: "8. 9(일)",
    time: "15:00",
    city: "잘츠부르크",
    title: "호엔잘츠부르크 성 관람",
    location: "호엔잘츠부르크 성 (Festung Hohensalzburg)",
    lat: 47.7952,
    lng: 13.0469,
    category: "sightseeing",
    notes: "성 전망대 및 내부 관람. 푸니쿨라 포함 입장권 구매.",
    highlights: ["푸니쿨라 포함 입장권", "잘츠부르크 전경 전망대"]
  },
  {
    id: "d4-5",
    day: 4,
    date: "8. 9(일)",
    time: "18:00",
    city: "잘츠부르크",
    title: "저녁 식사 & 전망대 야경",
    location: "Augustinerbräu Salzburg",
    lat: 47.8054,
    lng: 13.0394,
    category: "night",
    notes: "Augustinerbräu 야외 맥주집 또는 Triangel / 묀히스부르크 전망대 야경. 숙소: H+ 호텔.",
    highlights: ["Augustinerbräu 야외 맥주집", "묀히스부르크 전망대 야경"]
  },

  // ============================================================
  // DAY 5 — 8.10(월) 잘츠부르크 → 인스부르크 이동
  // ============================================================
  {
    id: "d5-1",
    day: 5,
    date: "8. 10(월)",
    time: "08:00",
    city: "인스부르크",
    title: "미라벨 궁전 & 브런치",
    location: "미라벨 궁전 (Schloss Mirabell)",
    lat: 47.8070,
    lng: 13.0409,
    category: "sightseeing",
    notes: "미라벨 궁전 대리석 홀(08:00~16:00) 관람 & 브런치. 노케를 맛보기. 정원 무료.",
    highlights: ["미라벨 궁전 대리석 홀 무료", "노케를(오스트리아 전통 달걀 요리) 브런치"]
  },
  {
    id: "d5-2",
    day: 5,
    date: "8. 10(월)",
    time: "11:56",
    city: "인스부르크",
    title: "잘츠부르크 → 인스부르크 (RJX 19952)",
    location: "잘츠부르크 중앙역",
    lat: 47.8129,
    lng: 13.0451,
    category: "transport",
    notes: "RJX 19952 기차 이동. 열차 지정석 (복도 64 / 창가 66). 14:11 인스부르크 도착.",
    highlights: ["열차 지정석: 복도 64 / 창가 66"]
  },
  {
    id: "d5-3",
    day: 5,
    date: "8. 10(월)",
    time: "14:11",
    city: "인스부르크",
    title: "호텔 체크인 (골든 크로네 인스부르크)",
    location: "골든 크로네 인스부르크 (Hotel Goldene Krone)",
    lat: 47.2652,
    lng: 11.3930,
    category: "hotel",
    notes: "짐 보관 및 휴식. 조식 O / 도시세 16€.",
    highlights: ["조식 포함", "도시세 16€ 별도"]
  },
  {
    id: "d5-4",
    day: 5,
    date: "8. 10(월)",
    time: "15:00",
    city: "인스부르크",
    title: "인스부르크 구시가지",
    location: "황금 지붕 (Goldenes Dachl)",
    lat: 47.2682,
    lng: 11.3933,
    category: "sightseeing",
    notes: "황금 지붕, 헬블링하우스, 구시가지 거닐기.",
    highlights: ["황금 지붕 (2657개 금동 기와)", "헬블링하우스 로코코 양식"]
  },
  {
    id: "d5-5",
    day: 5,
    date: "8. 10(월)",
    time: "19:00",
    city: "인스부르크",
    title: "저녁 식사 (티롤 전통 음식)",
    location: "인스부르크 구시가지",
    lat: 47.2683,
    lng: 11.3936,
    category: "food",
    notes: "티롤 지방 전통 음식 저녁 식사. 숙소: 골든 크로네 인스부르크.",
    highlights: ["티롤 전통 요리 추천"]
  },

  // ============================================================
  // DAY 6 — 8.11(화) 인스부르크 노르트케테 & 시내 산책
  // ============================================================
  {
    id: "d6-1",
    day: 6,
    date: "8. 11(화)",
    time: "09:00",
    city: "인스부르크",
    title: "조식 (숙소)",
    location: "골든 크로네 인스부르크",
    lat: 47.2652,
    lng: 11.3930,
    category: "food",
    notes: "숙소 조식 이용",
    highlights: []
  },
  {
    id: "d6-2",
    day: 6,
    date: "8. 11(화)",
    time: "10:00",
    city: "인스부르크",
    title: "노르트케테 케이블카 & 알프스 전망대",
    location: "노르트케테 케이블카 (Nordkettenbahn)",
    lat: 47.2941,
    lng: 11.3924,
    category: "sightseeing",
    notes: "알프스 산맥 전망대 관람 및 하이킹. 노르트케테 왕복 케이블카 티켓. 날씨 좋은 시간대 방문.",
    highlights: ["알프스 전망대 하이킹", "날씨 확인 후 방문 결정 권장"]
  },
  {
    id: "d6-3",
    day: 6,
    date: "8. 11(화)",
    time: "14:00",
    city: "인스부르크",
    title: "인스부르크 시내 & 인강 변 산책",
    location: "인강 (Inn River)",
    lat: 47.2683,
    lng: 11.3936,
    category: "night",
    notes: "인강 변 산책 및 자유 시간.",
    highlights: ["인강 변 알록달록 건물 배경 사진"]
  },
  {
    id: "d6-4",
    day: 6,
    date: "8. 11(화)",
    time: "18:00",
    city: "인스부르크",
    title: "저녁 식사 & 내일 이동 준비",
    location: "인스부르크 시내",
    lat: 47.2683,
    lng: 11.3936,
    category: "food",
    notes: "시내 저녁 식사 및 내일 이동 준비. 숙소: 골든 크로네 인스부르크.",
    highlights: []
  },

  // ============================================================
  // DAY 7 — 8.12(수) 인스부르크 → 빈 이동 + 비엔나 [함께]
  // ============================================================
  {
    id: "d7-1",
    day: 7,
    date: "8. 12(수)",
    time: "08:48",
    city: "빈",
    title: "인스부르크 → 빈 중앙역 (RJX 19983)",
    location: "인스부르크 중앙역 (Innsbruck Hbf)",
    lat: 47.2636,
    lng: 11.4003,
    category: "transport",
    notes: "RJX 19983 기차 이동. 기차 예약 완료. 13:32 빈 도착.",
    highlights: ["기차 예약 완료"]
  },
  {
    id: "d7-2",
    day: 7,
    date: "8. 12(수)",
    time: "13:32",
    city: "빈",
    title: "호텔 체크인 (레오나르도 호텔 비엔나)",
    location: "레오나르도 호텔 빈 하우프트반호프",
    lat: 48.1845,
    lng: 16.3779,
    category: "hotel",
    notes: "짐 보관 및 체크인. 도시세 포함. 조식 X.",
    highlights: ["도시세 포함", "조식 미포함 — 근처 카페 이용"]
  },
  {
    id: "d7-3",
    day: 7,
    date: "8. 12(수)",
    time: "14:30",
    city: "빈",
    title: "구시가지 이동 (성베드로성당)",
    location: "성베드로성당 (Peterskirche)",
    lat: 48.2082,
    lng: 16.3695,
    category: "transport",
    notes: "대중교통 이동. 교통권 이용.",
    highlights: []
  },
  {
    id: "d7-4",
    day: 7,
    date: "8. 12(수)",
    time: "15:00",
    city: "빈",
    title: "성베드로성당 오르간 연주 🎵 [함께]",
    location: "성베드로성당 (Peterskirche Wien)",
    lat: 48.2082,
    lng: 16.3695,
    category: "event",
    notes: "15:00 정시 시작 무료 오르간 연주 감상. 무료 입장.",
    highlights: ["15:00 정시 시작", "무료 입장", "약 45분 공연"]
  },
  {
    id: "d7-5",
    day: 7,
    date: "8. 12(수)",
    time: "15:45",
    city: "빈",
    title: "카페 데멜 & 그라벤 거리 [함께]",
    location: "Café Demel, Vienna",
    lat: 48.2076,
    lng: 16.3680,
    category: "cafe",
    notes: "왕실 납품 베이커리 수제 디저트 구경 및 맛보기. 카페 이용료 별도.",
    highlights: ["왕실 납품 베이커리", "수제 케이크 및 초콜릿"]
  },
  {
    id: "d7-6",
    day: 7,
    date: "8. 12(수)",
    time: "16:30",
    city: "빈",
    title: "Vollpension Generationencafé [함께]",
    location: "Vollpension, Johannesgasse 4A, Vienna",
    lat: 48.2026,
    lng: 16.3763,
    category: "cafe",
    notes: "할머니들이 직접 구워주시는 정통 수제 케이크 & 커피. Johannesgasse 4A 위치.",
    highlights: ["할머니 손맛 케이크 맛집", "수제 케이크 강력 추천"]
  },
  {
    id: "d7-7",
    day: 7,
    date: "8. 12(수)",
    time: "18:00",
    city: "빈",
    title: "슈테판 대성당 & 구시가지 [함께]",
    location: "슈테판 대성당 (Stephansdom)",
    lat: 48.2085,
    lng: 16.3731,
    category: "sightseeing",
    notes: "137m 첨탑, 대리석 강론대, 슈테판 광장 산책. 성당 내부 관람.",
    highlights: ["137m 첨탑", "대리석 강론대", "슈테판 광장 산책"]
  },
  {
    id: "d7-8",
    day: 7,
    date: "8. 12(수)",
    time: "19:30",
    city: "빈",
    title: "저녁 식사 & 비엔나 야경 [함께]",
    location: "빈 구시가지",
    lat: 48.2085,
    lng: 16.3731,
    category: "night",
    notes: "구시가지 저녁 식사 및 야경 산책. 숙소: 레오나르도 호텔 비엔나.",
    highlights: []
  },

  // ============================================================
  // DAY 8 — 8.13(목) 비엔나 [함께] 풀 일정
  // ============================================================
  {
    id: "d8-1",
    day: 8,
    date: "8. 13(목)",
    time: "09:00",
    city: "빈",
    title: "벨베데레 상궁 오픈런 🎨 [함께]",
    location: "벨베데레 상궁 (Upper Belvedere)",
    lat: 48.1914,
    lng: 16.3806,
    category: "sightseeing",
    notes: "오픈 직후 클림트 <키스>, <유디트> 원화 감상 & 정원 산책. 상궁 2인 티켓 (1인 약 23€). 09:00 오픈 첫 타임슬롯 예매. 오전에 사람 적어 쾌적.",
    highlights: ["클림트 <키스> 원화 감상", "09:00 오픈런 — 첫 타임슬롯 예매", "정원 반영 연못 포토스팟"]
  },
  {
    id: "d8-2",
    day: 8,
    date: "8. 13(목)",
    time: "11:00",
    city: "빈",
    title: "벨베데레 → 미술사박물관 이동 (트램)",
    location: "트램 D번 (마리아 테레지아 광장 방향)",
    lat: 48.2035,
    lng: 16.3614,
    category: "transport",
    notes: "트램(D번) 타고 마리아 테레지아 광장 이동. 교통권 이용.",
    highlights: []
  },
  {
    id: "d8-3",
    day: 8,
    date: "8. 13(목)",
    time: "11:20",
    city: "빈",
    title: "미술사박물관 (KHM) 관람 [함께]",
    location: "미술사박물관 (Kunsthistorisches Museum)",
    lat: 48.2035,
    lng: 16.3614,
    category: "sightseeing",
    notes: "1층 이집트·바빌로니아관(파라오관/미라) & 2층 회화관 명화 감상. 2인 티켓 (1인 약 22€). 에어컨 가동으로 매우 쾌적.",
    highlights: ["이집트관 미라", "2층 회화관 명화", "에어컨 가동으로 쾌적"]
  },
  {
    id: "d8-4",
    day: 8,
    date: "8. 13(목)",
    time: "13:20",
    city: "빈",
    title: "미술사박물관 돔 카페 점심 [함께]",
    location: "KHM 돔 카페 (Café im Kunsthistorischen Museum)",
    lat: 48.2035,
    lng: 16.3614,
    category: "cafe",
    notes: "미술사박물관 내 웅장한 돔 카페에서 식사 및 디저트. 세계에서 가장 아름다운 박물관 카페.",
    highlights: ["세계에서 가장 아름다운 박물관 카페", "황금 돔 천장 배경 사진"]
  },
  {
    id: "d8-5",
    day: 8,
    date: "8. 13(목)",
    time: "14:30",
    city: "빈",
    title: "호프부르크 왕궁 — Sisi 박물관 [함께]",
    location: "호프부르크 왕궁 (Hofburg Palace)",
    lat: 48.2064,
    lng: 16.3641,
    category: "sightseeing",
    notes: "황제 거실 & 시시 박물관 (합스부르크가 화려한 의상/가구/생활양식). Sisi Museum 2인 티켓 (1인 약 20€). 도보 5분 거리.",
    highlights: ["Sisi 박물관", "황제 거실", "합스부르크 의상 컬렉션"]
  },
  {
    id: "d8-6",
    day: 8,
    date: "8. 13(목)",
    time: "16:30",
    city: "빈",
    title: "저녁 식사 & 자유 시간 [함께]",
    location: "빈 구시가지",
    lat: 48.2082,
    lng: 16.3738,
    category: "food",
    notes: "시내 저녁 식사 및 비엔나 야경. 숙소: 레오나르도 호텔 비엔나.",
    highlights: []
  },

  // ============================================================
  // DAY 9 — 8.14(금) 빈 → 부다페스트 이동
  // ============================================================
  {
    id: "d9-1",
    day: 9,
    date: "8. 14(금)",
    time: "09:00",
    city: "부다페스트",
    title: "호텔 → 빈 중앙역 이동 (체크아웃)",
    location: "레오나르도 호텔 빈",
    lat: 48.1845,
    lng: 16.3779,
    category: "transport",
    notes: "체크아웃 후 빈 중앙역으로 이동.",
    highlights: []
  },
  {
    id: "d9-2",
    day: 9,
    date: "8. 14(금)",
    time: "09:42",
    city: "부다페스트",
    title: "빈 → 부다페스트 Keleti (RJX 19929)",
    location: "Wien Hauptbahnhof (빈 중앙역)",
    lat: 48.1845,
    lng: 16.3779,
    category: "transport",
    notes: "RJX 19929 기차 이동. 열차 지정석 (복도 38 / 창가 32). 12:35 부다페스트 켈레티역 도착. 열차 시각 변경 완료.",
    highlights: ["열차 지정석: 복도 38 / 창가 32", "열차 시각 변경 완료 (09:42 출발)"]
  },
  {
    id: "d9-3",
    day: 9,
    date: "8. 14(금)",
    time: "12:35",
    city: "부다페스트",
    title: "호텔 체크인 (부티크 빅토리아)",
    location: "부티크 빅토리아 호텔 부다페스트",
    lat: 47.5085,
    lng: 19.0345,
    category: "hotel",
    notes: "체크인 및 짐 보관. 조식 O / 도시세 포함.",
    highlights: ["조식 포함", "도나우강 뷰 호텔"]
  },
  {
    id: "d9-4",
    day: 9,
    date: "8. 14(금)",
    time: "13:30",
    city: "부다페스트",
    title: "중앙재래시장 관람 & 점심",
    location: "부다페스트 중앙재래시장 (Nagy Vásárcsarnok)",
    lat: 47.4852,
    lng: 19.0563,
    category: "food",
    notes: "시장 구경 및 랑고스 등 점심 식사. 시장 자율 구매.",
    highlights: ["랑고스 (헝가리 튀김빵)", "파프리카 기념품 구매", "2층 자수 공예품"]
  },
  {
    id: "d9-5",
    day: 9,
    date: "8. 14(금)",
    time: "16:00",
    city: "부다페스트",
    title: "겔레르트 언덕 & 어부의 요새",
    location: "어부의 요새 (Fisherman's Bastion)",
    lat: 47.5018,
    lng: 19.0344,
    category: "sightseeing",
    notes: "언덕 산책(파노라마 전경) 및 로마네스크 양식 어부의 요새. 어부의 요새 일부 구역 무료.",
    highlights: ["어부의 요새 아치 액자 구도 포토스팟", "겔레르트 언덕 파노라마", "일몰 시간대 추천"]
  },
  {
    id: "d9-6",
    day: 9,
    date: "8. 14(금)",
    time: "19:00",
    city: "부다페스트",
    title: "포르투너 거리 저녁 & 야경",
    location: "어부의 요새 인근 야경",
    lat: 47.5018,
    lng: 19.0344,
    category: "night",
    notes: "포르투너 거리 식사 및 도나우강 야경 감상. 숙소: 부티크 빅토리아.",
    highlights: ["세계적인 도나우강 야경", "부다성 야간 조명"]
  },

  // ============================================================
  // DAY 10 — 8.15(토) 부다페스트 에르제베트 다리 & 뉴욕카페
  // ============================================================
  {
    id: "d10-1",
    day: 10,
    date: "8. 15(토)",
    time: "08:00",
    city: "부다페스트",
    title: "조식 & 아난타라 뉴욕 호텔로 이동",
    location: "부티크 빅토리아 호텔",
    lat: 47.5085,
    lng: 19.0345,
    category: "food",
    notes: "조식 후 아난타라 뉴욕 호텔로 숙소 이동. 숙소: 아난타라 뉴욕 호텔 (조식 O / 도시세 15€).",
    highlights: []
  },
  {
    id: "d10-2",
    day: 10,
    date: "8. 15(토)",
    time: "09:30",
    city: "부다페스트",
    title: "에르제베트 다리 & 겔레르트 언덕",
    location: "에르제베트 다리 (Erzsébet híd)",
    lat: 47.4919,
    lng: 19.0520,
    category: "sightseeing",
    notes: "에르제베트 다리 따라 20분 산책 및 파노라마 전경 감상.",
    highlights: ["에르제베트 다리 산책", "겔레르트 언덕 파노라마"]
  },
  {
    id: "d10-3",
    day: 10,
    date: "8. 15(토)",
    time: "13:00",
    city: "부다페스트",
    title: "도나우 강변 산책 & 아난타라 뉴욕카페",
    location: "아난타라 뉴욕 카페 (New York Café)",
    lat: 47.4976,
    lng: 19.0677,
    category: "cafe",
    notes: "도나우 강변 산책 및 아난타라 뉴욕카페 디저트 타임. 카페 이용료.",
    highlights: ["세계에서 가장 화려한 카페", "황금 샹들리에 천장 포토스팟", "2층 난간 포즈 추천"]
  },
  {
    id: "d10-4",
    day: 10,
    date: "8. 15(토)",
    time: "18:00",
    city: "부다페스트",
    title: "저녁 식사 & 도나우강 야경",
    location: "도나우강 유람선",
    lat: 47.5046,
    lng: 19.0463,
    category: "night",
    notes: "도나우강 유람선 또는 야경 산책. 숙소: 아난타라 뉴욕 호텔.",
    highlights: ["도나우강 야경 유람선 추천", "세체니 다리 야간 조명"]
  },

  // ============================================================
  // DAY 11 — 8.16(일) 부다페스트 쇼핑 & 귀국 출발
  // ============================================================
  {
    id: "d11-1",
    day: 11,
    date: "8. 16(일)",
    time: "08:00",
    city: "부다페스트",
    title: "럭셔리 조식 & 시내 쇼핑",
    location: "아난타라 뉴욕 호텔",
    lat: 47.4976,
    lng: 19.0677,
    category: "food",
    notes: "아난타라 뉴욕 호텔 럭셔리 조식 및 마지막 쇼핑.",
    highlights: ["호텔 럭셔리 조식", "마지막 쇼핑 시간"]
  },
  {
    id: "d11-2",
    day: 11,
    date: "8. 16(일)",
    time: "16:00",
    city: "부다페스트",
    title: "숙소 → 부다페스트 공항 T2B",
    location: "부다페스트 리스트 페렌츠 국제공항 (BUD)",
    lat: 47.4298,
    lng: 19.2611,
    category: "transport",
    notes: "miniBUD 공항 셔틀 또는 호텔 픽업 서비스 이용. 셔틀 예약 필요.",
    highlights: ["miniBUD 셔틀 사전 예약 필수", "공항까지 약 30~40분 소요"]
  },
  {
    id: "d11-3",
    day: 11,
    date: "8. 16(일)",
    time: "20:00",
    city: "부다페스트",
    title: "부다페스트 T2B 출발 → 인천 귀국",
    location: "부다페스트 국제공항 T2B",
    lat: 47.4298,
    lng: 19.2611,
    category: "transport",
    notes: "아시아나 항공 탑승. 8/17(월) 13:35 인천공항 T2 도착.",
    highlights: ["아시아나 항공", "8/17 13:35 인천 T2 도착"]
  },

  // ============================================================
  // DAY 12 — 8.17(월) 인천 도착
  // ============================================================
  {
    id: "d12-1",
    day: 12,
    date: "8. 17(월)",
    time: "13:35",
    city: "인천",
    title: "인천공항 T2 도착 (귀국 완료)",
    location: "인천국제공항 제2여객터미널",
    lat: 37.4602,
    lng: 126.4407,
    category: "transport",
    notes: "동유럽 10박 12일 여행 완료! 즐거운 여행이었길 바랍니다 🎉",
    highlights: ["수하물 찾기 후 귀가"]
  }
];
