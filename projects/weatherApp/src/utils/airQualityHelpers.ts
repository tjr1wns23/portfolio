// 미세먼지 (PM10)
export const getPM10Level = (value: number): string => {
  if (value <= 30) return '좋음';
  if (value <= 80) return '보통';
  if (value <= 150) return '나쁨';
  return '매우나쁨';
};

// 초미세먼지 (PM2.5)
export const getPM25Level = (value: number): string => {
  if (value <= 15) return '좋음';
  if (value <= 35) return '보통';
  if (value <= 75) return '나쁨';
  return '매우나쁨';
};

// 종합 대기질 지수 (AQI, 1~5)
export const getAQILevel = (value: number): string => {
  switch (value) {
    case 1: return '좋음';
    case 2: return '보통';
    case 3: return '나쁨';
    case 4:
    case 5:
      return '매우나쁨';
    default:
      return '정보없음';
  }
};

export const getLevelColor = (level: string): string => {
  switch (level) {
    case '좋음':
      return '#2ecc71'; // Green
    case '보통':
      return '#f1c40f'; // Yellow
    case '나쁨':
      return '#e67e22'; // Orange
    case '매우 나쁨':
      return '#e74c3c'; // Red
    default:
      return '#95a5a6'; // Gray
  }
}
