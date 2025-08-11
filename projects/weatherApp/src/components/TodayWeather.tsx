import React from 'react';
import styles from './TodayWeather.module.css';
import { getPM10Level, getPM25Level, getAQILevel, getLevelColor } from '../utils/airQualityHelpers';

interface Props {
  temp?: number;
  weather?: string;
  description?: string;
  icon?: string;
  pm10?: number;
  pm25?: number;
  aqi?: number;
}

const TodayWeather: React.FC<Props> = ({ temp, description, icon, pm10, pm25, aqi }) => (
  <div>
    <div className={styles.todayWrap}>
      <img
        className={styles.weatherIcon}
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={description || 'weather icon'}
      />
      <p className={styles.tempText}>{temp}°</p>
    </div>
    <p className={styles.description}>{description}</p>
    <div className={styles.airContainer}>
      {pm10 !== undefined && (
      <div className={styles.airCard}>
        <div className={styles.airTitle}>미세먼지</div>
        <div className={styles.airValue}>{pm10}㎍/㎥</div>
        <div className={styles.airLevel} style={{color: getLevelColor(getPM10Level(pm10))}}>{getPM10Level(pm10)}</div>
      </div>
      )}
      {pm25 !== undefined && (
      <div className={styles.airCard}>
        <div className={styles.airTitle}>초미세먼지</div>
        <div className={styles.airValue}>{pm25}㎍/㎥</div>
        <div className={styles.airLevel} style={{color: getLevelColor(getPM25Level(pm25))}}>{getPM25Level(pm25)}</div>
      </div>
      )}
      {aqi !== undefined && (
      <div className={styles.airCard}>
        <div className={styles.airTitle}>대기질 지수</div>
        <div className={styles.airValue}>{aqi}</div>
        <div className={styles.airLevel} style={{color: getLevelColor(getAQILevel(aqi))}}>{getAQILevel(aqi)}</div>
      </div>
      )}
    </div>

  </div>
);



export default TodayWeather