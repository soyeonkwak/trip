// 현재 여행지 현지 시각 & 오늘 여행 Day 자동 계산 훅
// 여행 경로의 모든 도시(프라하, 잘츠부르크, 인스부르크, 빈, 부다페스트)가
// 모두 중앙유럽 서머타임(CEST = UTC+2)에 해당합니다.
import { useState, useEffect } from 'react';

// 여행 일정: 날짜(YYYY-MM-DD) → Day 번호 매핑
const TRIP_SCHEDULE = {
  '2026-08-06': { day: 1,  city: '프라하',       tz: 'Europe/Prague'    },
  '2026-08-07': { day: 2,  city: '프라하',       tz: 'Europe/Prague'    },
  '2026-08-08': { day: 3,  city: '잘츠부르크',   tz: 'Europe/Vienna'    },
  '2026-08-09': { day: 4,  city: '잘츠부르크',   tz: 'Europe/Vienna'    },
  '2026-08-10': { day: 5,  city: '인스부르크',   tz: 'Europe/Vienna'    },
  '2026-08-11': { day: 6,  city: '인스부르크',   tz: 'Europe/Vienna'    },
  '2026-08-12': { day: 7,  city: '빈',           tz: 'Europe/Vienna'    },
  '2026-08-13': { day: 8,  city: '빈',           tz: 'Europe/Vienna'    },
  '2026-08-14': { day: 9,  city: '부다페스트',   tz: 'Europe/Budapest'  },
  '2026-08-15': { day: 10, city: '부다페스트',   tz: 'Europe/Budapest'  },
  '2026-08-16': { day: 11, city: '부다페스트',   tz: 'Europe/Budapest'  },
  '2026-08-17': { day: 12, city: '인천',         tz: 'Asia/Seoul'       },
};

// 현재 여행지 현지 날짜/시각 반환 함수
function getLocalTripTime(tz = 'Europe/Vienna') {
  const now = new Date();
  const tzStr = now.toLocaleString('sv-SE', { timeZone: tz }); // "2026-08-09 14:32:00"
  const [datePart, timePart] = tzStr.split(' ');
  return { datePart, timePart }; // "2026-08-09", "14:32:00"
}

export function useTripTime() {
  const [tripTime, setTripTime] = useState(() => computeTripTime());

  function computeTripTime() {
    // 일단 유럽 표준 타임존으로 날짜 확인
    const { datePart, timePart } = getLocalTripTime('Europe/Vienna');
    const schedule = TRIP_SCHEDULE[datePart];

    if (schedule) {
      // 여행 중인 날짜인 경우: 해당 도시의 타임존 기준 시각 사용
      const { datePart: d2, timePart: t2 } = getLocalTripTime(schedule.tz);
      return {
        isInTrip: true,
        currentDay: schedule.day,
        currentCity: schedule.city,
        localDate: d2,
        localTime: t2,        // "HH:MM:SS"
        localTimeShort: t2.slice(0, 5), // "HH:MM"
        timezone: schedule.tz,
        status: 'active',
      };
    }

    // 여행 전
    const tripStart = new Date('2026-08-06T00:00:00+02:00');
    const now = new Date();
    if (now < tripStart) {
      const diffMs = tripStart - now;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHrs  = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return {
        isInTrip: false,
        currentDay: 1,        // 여행 전이면 Day 1로 기본 이동
        status: 'before',
        daysLeft: diffDays,
        hoursLeft: diffHrs,
        minsLeft: diffMins,
        localTime: getLocalTripTime('Europe/Vienna').timePart,
        localTimeShort: getLocalTripTime('Europe/Vienna').timePart.slice(0, 5),
        timezone: 'Europe/Vienna',
      };
    }

    // 여행 종료 후
    return {
      isInTrip: false,
      currentDay: 12,
      status: 'after',
      localTime: getLocalTripTime('Asia/Seoul').timePart,
      localTimeShort: getLocalTripTime('Asia/Seoul').timePart.slice(0, 5),
      timezone: 'Asia/Seoul',
    };
  }

  // 1분마다 갱신 (시각 변경 반영)
  useEffect(() => {
    const timer = setInterval(() => {
      setTripTime(computeTripTime());
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return tripTime;
}

// 일정 아이템 목록에서 현재 시각 기준 '지금 진행 중' 또는 '다음 일정' 찾기
export function findCurrentAndNextEvent(items, currentTimeStr) {
  if (!items || items.length === 0) return { current: null, next: null };

  // "HH:MM" 형태 비교
  const timeToMin = (t) => {
    const [h, m] = t.slice(0, 5).split(':').map(Number);
    return h * 60 + m;
  };

  const nowMin = timeToMin(currentTimeStr);
  const sorted = [...items].sort((a, b) => timeToMin(a.time) - timeToMin(b.time));

  let current = null;
  let next = null;

  for (let i = 0; i < sorted.length; i++) {
    const itemMin = timeToMin(sorted[i].time);
    const nextMin = sorted[i + 1] ? timeToMin(sorted[i + 1].time) : 24 * 60;

    if (itemMin <= nowMin && nowMin < nextMin) {
      current = sorted[i];
      next = sorted[i + 1] || null;
      break;
    } else if (itemMin > nowMin && !next) {
      next = sorted[i];
    }
  }

  return { current, next };
}
