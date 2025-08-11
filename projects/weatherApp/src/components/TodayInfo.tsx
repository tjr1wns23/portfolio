import React from "react";
import TodayWeather from "./TodayWeather";
import TodayChart from "./TodayChart";

interface TodayData {
  temp?: number;
  weather?: string;
  description?: string;
  icon?: string;
  pm10?: number;
  pm25?: number;
  aqi?: number;
}

interface Props {
  todayData: TodayData;
  chartData: any;
}

const TodayInfo: React.FC<Props> = ({todayData, chartData}) => (
  <div>
    <TodayWeather {...todayData} />
    <TodayChart chartData={chartData} />
  </div>
)

export default TodayInfo;
