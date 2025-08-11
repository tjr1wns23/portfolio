import type { ForecastItem } from '../types/weather';
import { weatherDescriptionKo } from '../types/weatherDescription';

export const groupForecastByDay = (list: ForecastItem[]) => {
  const daily: { [date: string]: ForecastItem[] } = {};
  list.forEach((item) => {
    const date = item.dt;
    if (!daily[date]) daily[date] = [];
    daily[date].push(item);
    
  });
  return daily;
};

export const getDailySummaries = (grouped: { [date: string]: ForecastItem[] }) => {
  return Object.entries(grouped).map(([date, items]) => {
    const temps: Array<number> = [];
    for (let i=0; i<items.length; i++) {
      temps.push(Math.round(items[i].main.temp*10)/10);
    }

    const target = items.find(i => i.dt) || items[0];
    const description = codeToDescription(target.weather[0].id);
    return {
      date,
      temp: Math.round(target.main.temp*10)/10,
      description: description,
      icon: target.weather[0].icon,
      temps: temps
    };
  });
};

export const codeToDescription = (code: any) => {
  return weatherDescriptionKo[code] || '알 수 없음';
}