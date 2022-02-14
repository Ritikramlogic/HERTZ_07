import React, { useEffect, useState } from "react";
import { volData } from "../Api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
export default function LineChart(props) {
  const [CharTimeData, setCharTimeData] = useState([]);
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const [ChartTime, setChartTime] = useState([0]);
  // const Dataset =

  console.log(props.Dataset);
  useEffect(() => {
    props.Dataset.map((data) => {
      setCharTimeData((TimeData) => [
        ...TimeData,
        month[new Date(data[0]).getMonth()] + " " + new Date(data[0]).getDate(),
      ]);
    });
  }, []);

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
    labels: CharTimeData,
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
