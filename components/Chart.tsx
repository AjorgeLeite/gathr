import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

type PollDoughnutChartProps = {
  pollData: {
    name: string;
    option_1: string;
    option_2: string;
    option_3: string;
    option_4: string;
    option_5: string;
    option_6: string;
    option_7: string;
    option_8: string;
    option_9: string;
    option_10: string;
    vote_1: number;
    vote_2: number;
    vote_3: number;
    vote_4: number;
    vote_5: number;
    vote_6: number;
    vote_7: number;
    vote_8: number;
    vote_9: number;
    vote_10: number;
  };
};

const PollDoughnutChart: React.FC<PollDoughnutChartProps> = ({ pollData }) => {
  const noEmptyLabels = [
    pollData.option_1,
    pollData.option_2,
    pollData.option_3,
    pollData.option_4,
    pollData.option_5,
    pollData.option_6,
    pollData.option_7,
    pollData.option_8,
    pollData.option_9,
    pollData.option_10,
  ]
    .filter((label) => label !== undefined && label.trim() !== "");

  const chartData = {
    labels: noEmptyLabels,
    datasets: [
      {
        data: [
          pollData.vote_1,
          pollData.vote_2,
          pollData.vote_3,
          pollData.vote_4,
          pollData.vote_5,
          pollData.vote_6,
          pollData.vote_7,
          pollData.vote_8,
          pollData.vote_9,
          pollData.vote_10,
        ],
        backgroundColor: ["#f57265", "#f3d8b6", "#f48675", "#f64a45","#f55e55","#e0a080","#f8a090","#f57c64","#f69d8a","#f4a98a" ],
        hoverBackgroundColor: ["#f57265", "#f3d8b6", "#f48675", "#f64a45","#f55e55","#e0a080","#f8a090","#f57c64","#f69d8a","#f4a98a"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#f64a45",
        },
      },
    },
  };

  return (
    <>
      {noEmptyLabels.length > 0 && (
        <Doughnut data={chartData} options={chartOptions} />
      )}
    </>
  );
};

export default PollDoughnutChart;
