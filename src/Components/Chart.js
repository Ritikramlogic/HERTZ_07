import React, { useEffect, useState } from "react";
import { volData } from "../Api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
export default function LineChart(props) {
  // const [CharData, setCharData] = useState([0, 0]);
  // const [ChartTime, setChartTime] = useState([0]);
  console.log(props.Datase);
  const optionsChart = {
    legend: {
      display: true,
      position: "top",
      labels: {
        fontColor: "#8898AA",
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            color: "#DEE2E6",
            zeroLineColor: "#DEE2E6",
          },
          ticks: {
            fontColor: "black",
          },
          stacked: true,
        },
      ],
      xAxes: [
        {
          ticks: {
            fontColor: "black",
          },
          stacked: true,
        },
      ],
    },

    tooltips: {
      enabled: true,
      mode: "index",
      intersect: true,
    },
  };

  const data = {
    labels: [1, 2, 3, 5, 7],
    datasets: [
      {
        label: props.label,
        data: props.Dataset,
        backgroundColor: "#716aca82",
        fontColor: "white",
        fill: true,
        borderColor: "#716ACA",
      },
    ],
  };
  return <Line data={data} options={optionsChart} />;
}
