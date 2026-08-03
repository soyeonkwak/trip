/**
 * 장소명 → 위경도 변환 유틸리티
 * Nominatim (OpenStreetMap) 무료 지오코딩 API 사용 — API 키 불필요
 */

// 도시별 기본 좌표 (폴백용)
const CITY_DEFAULT_COORDS = {
  '프라하': { lat: 50.0755, lng: 14.4378 },
  '잘츠부르크': { lat: 47.8095, lng: 13.0550 },
  '인스부르크': { lat: 47.2692, lng: 11.4041 },
  '빈': { lat: 48.2082, lng: 16.3738 },
  '부다페스트': { lat: 47.4979, lng: 19.0402 },
};

// 알려진 장소 좌표 캐시 (API 요청 절약 + 정확도 향상)
const KNOWN_PLACES = {
  '프라하성': { lat: 50.0902, lng: 14.4000 },
  '성 비투스 대성당': { lat: 50.0906, lng: 14.4004 },
  '카를교': { lat: 50.0865, lng: 14.4114 },
  '구시가지 광장': { lat: 50.0876, lng: 14.4213 },
  '천문시계탑': { lat: 50.0870, lng: 14.4205 },
  "Pork's Mostecka": { lat: 50.0872, lng: 14.4092 },
  '레트나 공원': { lat: 50.0983, lng: 14.4161 },
  'Letna Park': { lat: 50.0983, lng: 14.4161 },
  'Reduta Jazz Club': { lat: 50.0817, lng: 14.4180 },
  'Jazz Dock': { lat: 50.0712, lng: 14.4118 },

  '게트라이데 거리': { lat: 47.7992, lng: 13.0426 },
  '모차르트 생가': { lat: 47.7993, lng: 13.0430 },
  '호엔잘츠부르크 성': { lat: 47.7952, lng: 13.0469 },
  '미라벨 정원': { lat: 47.8070, lng: 13.0409 },
  '할슈타트': { lat: 47.5623, lng: 13.6493 },
  'Augustinerbräu': { lat: 47.8054, lng: 13.0394 },

  '황금지붕': { lat: 47.2682, lng: 11.3933 },
  '노르트케테 케이블카': { lat: 47.2941, lng: 11.3924 },
  '인강': { lat: 47.2683, lng: 11.3936 },

  '슈테판 대성당': { lat: 48.2085, lng: 16.3731 },
  '성베드로성당': { lat: 48.2082, lng: 16.3695 },
  '카페 데멜': { lat: 48.2076, lng: 16.3680 },
  '벨베데레 상궁': { lat: 48.1914, lng: 16.3806 },
  '미술사박물관': { lat: 48.2035, lng: 16.3614 },
  '호프부르크 왕궁': { lat: 48.2064, lng: 16.3641 },
  'Vollpension 카페': { lat: 48.2026, lng: 16.3663 },

  '어부의 요새': { lat: 47.5018, lng: 19.0344 },
  '겔레르트 언덕': { lat: 47.4864, lng: 19.0466 },
  '아난타라 뉴욕카페': { lat: 47.4976, lng: 19.0677 },
  '부티크 빅토리아': { lat: 47.5085, lng: 19.0345 },
  '중앙재래시장': { lat: 47.4852, lng: 19.0563 },
  '도나우강 유람선': { lat: 47.5046, lng: 19.0463 },
};

// 메모이제이션 캐시
const geocodeCache = new Map();

/**
 * 장소명 + 도시명으로 위경도 반환
 * 1) 알려진 장소 캐시 확인
 * 2) Nominatim API 호출
 * 3) 도시 기본 좌표 폴백
 */
export async function geocodeLocation(locationName, cityName = '') {
  if (!locationName) return null;

  const cacheKey = `${locationName}__${cityName}`.toLowerCase().trim();

  // 캐시 확인
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // 알려진 장소 사전 확인 (정확도 최고)
  for (const [key, coords] of Object.entries(KNOWN_PLACES)) {
    if (locationName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(locationName.toLowerCase())) {
      geocodeCache.set(cacheKey, coords);
      return coords;
    }
  }

  // Nominatim API 호출 (무료, 키 불필요)
  try {
    const query = cityName ? `${locationName}, ${cityName}` : locationName;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&accept-language=ko,en`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'TravelPlannerApp/1.0' }
    });

    if (response.ok) {
      const results = await response.json();
      if (results && results.length > 0) {
        const coords = {
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon),
        };
        geocodeCache.set(cacheKey, coords);
        return coords;
      }
    }
  } catch (err) {
    console.warn('Nominatim geocoding 실패:', err);
  }

  // 도시 기본 좌표 폴백
  const cityCoords = CITY_DEFAULT_COORDS[cityName];
  if (cityCoords) {
    geocodeCache.set(cacheKey, cityCoords);
    return cityCoords;
  }

  return null;
}
