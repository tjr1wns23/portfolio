export interface ForecastItem {
  dt: string;
  main: {
    feels_like: number;
    temp: number;
  };
  weather: {
    id: number,
    description: string;
    icon: string;
  }[];
  dayTemp: {
    temp: number;
  }[];
}
