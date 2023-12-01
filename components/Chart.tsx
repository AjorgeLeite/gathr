import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

type PollDoughnutChartProps = {
  pollData: {
    name: string;
    option_1: string;
    option_2: string;
    option_3: string;
    vote_1: number;
    vote_2: number;
    vote_3: number;
  };
};

const PollDoughnutChart: React.FC<PollDoughnutChartProps> = ({ pollData }) => {
  const chartData = {
    labels: [pollData.option_1, pollData.option_2, pollData.option_3],
    datasets: [
      {
        data: [pollData.vote_1, pollData.vote_2, pollData.vote_3],
        backgroundColor: ['#f57265', '#f3d8b6', '#f48675'],
        hoverBackgroundColor: ['#f57265', '#f3d8b6', '#f48675'],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white', 
        },
      },
    },
  };

  return <Doughnut data={chartData} options={chartOptions} />;
};

export default PollDoughnutChart;
