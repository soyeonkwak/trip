// 구글 시트 URL 파싱 및 CSV 데이터 처리 유틸리티

// 시티별 기본 대표 좌표 (좌표가 없는 일정용)
const CITY_COORDS = {
  "프라하": { lat: 50.0878, lng: 14.4205 },
  "잘츠부르크": { lat: 47.8095, lng: 13.0550 },
  "인스부르크": { lat: 47.2692, lng: 11.4041 },
  "빈": { lat: 48.2082, lng: 16.3738 },
  "부다페스트": { lat: 47.4979, lng: 19.0402 },
  "인천": { lat: 37.4602, lng: 126.4407 }
};

// 카테고리 정규화
export function normalizeCategory(categoryStr) {
  if (!categoryStr) return "sightseeing";
  const cat = categoryStr.toLowerCase();
  if (cat.includes("이동") || cat.includes("비행") || cat.includes("기차") || cat.includes("버스") || cat.includes("transport")) return "transport";
  if (cat.includes("숙소") || cat.includes("호텔") || cat.includes("체크인") || cat.includes("hotel")) return "hotel";
  if (cat.includes("식사") || cat.includes("맛집") || cat.includes("점심") || cat.includes("저녁") || cat.includes("food")) return "food";
  if (cat.includes("카페") || cat.includes("디저트") || cat.includes("coffee") || cat.includes("cafe")) return "cafe";
  if (cat.includes("야경") || cat.includes("밤") || cat.includes("night")) return "night";
  if (cat.includes("공연") || cat.includes("행사") || cat.includes("온천") || cat.includes("event")) return "event";
  return "sightseeing";
}

// 구글 시트 공유 URL을 CSV 다운로드 URL로 변환
export function convertToCsvUrl(url) {
  if (!url) return null;
  
  // 이미 CSV URL인 경우
  if (url.includes("format=csv") || url.includes("out:csv")) return url;
  
  // 구글 시트 ID 추출
  const sheetIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch) return url;
  
  const sheetId = sheetIdMatch[1];
  
  // gid 추출 (특정 탭 ID가 있는 경우)
  const gidMatch = url.match(/gid=([0-9]+)/);
  const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
  
  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;
}

// 간단한 CSV 행 분리 (따옴표 처리 포함)
export function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const parseLine = (text) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^"|"$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length < 2) continue;

    const rowObj = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

// CSV 객체 배열을 여행 일정 배열로 포맷팅
export function convertRowsToItinerary(rows) {
  return rows.map((r, index) => {
    // 필드 탐색
    const dayVal = parseInt(r['day'] || r['일차'] || r['일자'] || r['날짜'] || (index + 1));
    const dateVal = r['date'] || r['날짜'] || r['일자'] || `Day ${dayVal}`;
    const timeVal = r['time'] || r['시간'] || r['시각'] || '09:00';
    const cityVal = r['city'] || r['도시'] || '프라하';
    const titleVal = r['title'] || r['일정'] || r['제목'] || r['장소'] || `일정 ${index + 1}`;
    const locationVal = r['location'] || r['장소'] || r['위치'] || titleVal;
    const categoryVal = normalizeCategory(r['category'] || r['카테고리'] || r['구분'] || '');
    const notesVal = r['notes'] || r['메모'] || r['비고'] || r['세부동선'] || '';
    
    let lat = parseFloat(r['lat'] || r['위도'] || 0);
    let lng = parseFloat(r['lng'] || r['경도'] || 0);

    if (!lat || !lng) {
      const defaultCoord = CITY_COORDS[cityVal] || CITY_COORDS["프라하"];
      // 약간의 지터(jitter)를 주어 핀이 포개지지 않게 함
      lat = defaultCoord.lat + (Math.random() - 0.5) * 0.01;
      lng = defaultCoord.lng + (Math.random() - 0.5) * 0.01;
    }

    return {
      id: `custom-${index}-${Date.now()}`,
      day: isNaN(dayVal) ? index + 1 : dayVal,
      date: dateVal,
      time: timeVal,
      city: cityVal,
      title: titleVal,
      location: locationVal,
      lat: lat,
      lng: lng,
      category: categoryVal,
      notes: notesVal
    };
  });
}
