import React from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Poll } from "./EventItem";

type PollDoughnutChartProps = {
  pollData: Poll;
};

const PollDoughnutChart: React.FC<PollDoughnutChartProps> = ({ pollData }) => {
  console.log("polldata", pollData);

  const optionKeys = Object.keys(pollData).filter(
    (key) => key.startsWith("option_") && pollData[key] !== undefined
  );

  const noEmptyLabels = optionKeys
    .map((key) => {
      const label = pollData[key];
      return typeof label === "string" ? label.trim() : "";
    })
    .filter((label) => label !== "");

  const voteKeys = optionKeys.map((key) => key.replace("option_", "vote_"));
  const votes = voteKeys.map((key) =>
    typeof pollData[key] === "number" ? pollData[key] : 0
  );

  const chartData = {
    labels: noEmptyLabels,
    datasets: [
      {
        data: votes,
        backgroundColor: [
          "#f57265",
          "#f3d8b6",
          "#f48675",
          "#f64a45",
          "#f55e55",
          "#e0a080",
          "#f8a090",
          "#f57c64",
          "#f69d8a",
          "#f4a98a",
        ],
        hoverBackgroundColor: [
          "#f57265",
          "#f3d8b6",
          "#f48675",
          "#f64a45",
          "#f55e55",
          "#e0a080",
          "#f8a090",
          "#f57c64",
          "#f69d8a",
          "#f4a98a",
        ],
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
