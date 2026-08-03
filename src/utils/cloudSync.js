// =========================================================
// 기기 간 실시간 일정 공유 & 클라우드 동기화 (Multi-Device Cloud Sync)
// 핸드폰 A에서 일정을 수정하면, 핸드폰 B, C에도 실시간으로 동기화됩니다!
// =========================================================

// 동유럽 2026 여행 전용 공유 클라우드 엔드포인트 (Public JSON Storage)
const SHARED_CLOUD_API = 'https://api.jsonstorage.net/v1/json/019fc6c0-shared-trip-2026';

// 로컬 스토리지 키
const CLOUD_SYNC_KEY = 'travel_app_cloud_timestamp';

// 1. 클라우드에 최신 일정 업로드 (핸드폰에서 수정/추가/삭제 시 실행)
export async function pushItineraryToCloud(itinerary, tripInfo) {
  try {
    const timestamp = Date.now();
    const payload = {
      itinerary,
      tripInfo,
      updatedAt: timestamp,
      updatedAtStr: new Date().toLocaleString('ko-KR')
    };

    // 로컬 타임스탬프 기록
    localStorage.setItem(CLOUD_SYNC_KEY, String(timestamp));

    // 백그라운드 클라우드 전송
    const response = await fetch(SHARED_CLOUD_API, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // POST 백업시도
      await fetch(SHARED_CLOUD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    console.log('☁️ 클라우드 일정 전송 성공 (타임스탬프:', timestamp, ')');
    return { success: true, timestamp };
  } catch (error) {
    console.warn('클라우드 업로드 네트워크 지연 (오프라인 모드로 로컬 저장됨):', error);
    return { success: false, error };
  }
}

// 2. 클라우드에서 최신 일정 불러오기 (다른 핸드폰이 수정한 내용 가져오기)
export async function pullItineraryFromCloud() {
  try {
    const response = await fetch(`${SHARED_CLOUD_API}?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !data.itinerary || !Array.isArray(data.itinerary)) return null;

    const localTimestamp = Number(localStorage.getItem(CLOUD_SYNC_KEY) || '0');

    // 클라우드 타임스탬프가 로컬보다 새로우면 업데이트 데이터 반환
    if (data.updatedAt && data.updatedAt > localTimestamp) {
      localStorage.setItem(CLOUD_SYNC_KEY, String(data.updatedAt));
      return {
        hasUpdate: true,
        itinerary: data.itinerary,
        tripInfo: data.tripInfo,
        updatedAtStr: data.updatedAtStr
      };
    }

    return { hasUpdate: false };
  } catch (error) {
    console.warn('클라우드 동기화 조회 지연:', error);
    return null;
  }
}
