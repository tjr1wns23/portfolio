import React from 'react';
import styles from './ForecastCard.module.css';

interface Props {
  forecastData: any;
}

type Weather = {
  isDummy?: boolean;
  date: string;
  temp: number;
  description: string;
  icon: string;
  temps: number[];
};

const weekKo: { [key: number]: string } = { 0: "일", 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토" } as const

const ForecastCard: React.FC<Props> = ({ forecastData }) => {

  let weathers: Weather[][] = new Array(7).fill(null).map(() => []);
  let today = new Date().getDay();

  if (forecastData.length > 0) {
    for (let i = 0; i < forecastData.length; i++) {
      let tempTime1 = new Date(forecastData[i].date * 1000);
      let day = tempTime1.getDay();

      weathers[day].push(forecastData[i]);
    }
  }
  const sortedWeather = [...weathers.slice(today), ...weathers.slice(0, today)];
  if (sortedWeather[0].length > 0 && sortedWeather[0].length < 8) {
    while (sortedWeather[0].length < 8) {
      sortedWeather[0].unshift({ isDummy: true, date: 'isDummy', temp: -1, description: '', icon: '', temps: [] });
    }
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.row}>
        <h3 style={{ visibility: 'hidden' }}>시간</h3>
        <img alt="맑음" src="https://openweathermap.org/img/wn/01d@2x.png" className={styles.SummaryIcon} style={{ visibility: 'hidden' }}></img>
        <div className={styles.cell}>00시</div>
        <div className={styles.cell}>03시</div>
        <div className={styles.cell}>06시</div>
        <div className={styles.cell}>09시</div>
        <div className={styles.cell}>12시</div>
        <div className={styles.cell}>15시</div>
        <div className={styles.cell}>18시</div>
        <div className={styles.cell}>21시</div>
      </div>
      {sortedWeather[0] && sortedWeather.map((item, idx) => item[idx] && (
        <div key={idx} className={styles.row}>
          <h3>{weekKo[(today + idx) % 7]}</h3>
          {(!item[4].isDummy ? (
            <img
              alt={item[4].description}
              src={`https://openweathermap.org/img/wn/${item[4].icon}@2x.png`}
              className={styles.SummaryIcon}
            />
          ) : (
            (() => {
              const found = item.find(d => !d.isDummy && d.icon);
              return found ? (
                <img
                  alt={found.description}
                  src={`https://openweathermap.org/img/wn/${found.icon}@2x.png`}
                  className={styles.SummaryIcon}
                />
              ) : null;
            })()
          ))}
          {item.map((d, wIdx) => (
            <div key={wIdx} className={styles.cell}>
              {!d.isDummy ? d.temp + "°" : ''}
            </div>
          ))}
        </div>
      ))}
    </div>

  );
}

export default ForecastCard;
