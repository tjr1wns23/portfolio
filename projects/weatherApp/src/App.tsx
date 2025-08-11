import TodayInfo from './components/TodayInfo';
import ForecastCard from './components/ForecastCard';
import { useWeather, todayWeather } from './hooks/useWeather';
import { useState, useEffect, useRef } from 'react';
import './App.css'

function App() {
  const [city, setCity] = useState('Seoul');
  const { weekData, error } = useWeather(city);
  const [todayData, setTodayData] = useState<null | {
    temp: number;
    weather: string;
    description: string;
    icon: string;
    pm10: number;
    pm25: number;
    aqi: number;
  }>(null);

  useEffect(() => {
    const getData = async () => {
      const todayData = await todayWeather(city);
      setTodayData(todayData);
    };
    getData();
  }, [city]);

  const cityNames: { [key: string]: string } = {
    Seoul: "서울",
    Daejeon: "대전",
    Busan: "부산",
    Incheon: "인천",
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="App">
      <h1>{cityNames[city]} 날씨정보</h1>

      <select name="city" value={city} onChange={handleCityChange}>
        <option value="Seoul">{cityNames['Seoul']}</option>
        <option value="Daejeon">{cityNames['Daejeon']}</option>
        <option value="Busan">{cityNames['Busan']}</option>
        <option value="Incheon">{cityNames['Incheon']}</option>
      </select>
      <div className="contents-wrap">
        <div onClick={handlePrev} className="scroll-btn left">&lt;</div>
        
        <nav className="scroll-container" ref={containerRef}>

          {error && <p>Error: {error}</p>}
          {weekData.length > 0 && todayData ? (
            <>
              <div className="page">
                <TodayInfo todayData={todayData} chartData={weekData} />
              </div>
              <div className="page">
                <ForecastCard forecastData={weekData} />
              </div>
            </>
          ) : (
            <p>날씨 데이터를 불러오는 중입니다...</p>
          )}
        </nav>

        <div onClick={handleNext} className="scroll-btn right">&gt;</div>
      </div>

    </div>
  );
}

export default App;
