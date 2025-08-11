import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // 여기에 플러그인 등록
);

interface Props {
  chartData: any;
}

const TodayChart: React.FC<Props> = ({ chartData }) => {

  const labels: string[] = [];
  const temps: number[] = [];

  for (let i = 0; i < 5; i++) {
    let tempTime1 = new Date(chartData[i].date * 1000);
    let tempTime2 = tempTime1.toLocaleTimeString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      hour12: false,
    });
    labels.push(tempTime2);

    let tempTemp = chartData[i].temp;
    temps.push(tempTemp);
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: '',
        data: temps,
        tension: 0.2,
        fill: false,
        backgroundColor: 'rgba(135, 206, 250, 0.5)',
        borderColor: 'rgba(30, 144, 255, 1)'
      },
    ],
  };

  // 차트 옵션
  const chartOptions: ChartOptions<'line'> = {
    plugins: {
      datalabels: {
        align: 'top',
        anchor: 'end',
        offset: -4,
        display: true,
        color: 'black',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        formatter: (value: any) => value,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grace: '30%',
        ticks: {
          display: false,
        },
        grid: {
          drawTicks: false,
          display: false,      // ← 격자선 제거
          drawOnChartArea: false, // ← 이게 핵심!!
        },
        border: {
          display: false, // ← y축 왼쪽선 제거
        },
      },
      x: {
        ticks: {
          display: true,
        },
        grid: {
          drawTicks: false,
          display: false,
          drawOnChartArea: false, // x축 격자선 제거
        },
      },
    },
  };

  return (
    <div style={{ width: '450px', margin: '10px auto' }} >
      <Line data={data} options={chartOptions} />
    </div >
  )
}

export default TodayChart