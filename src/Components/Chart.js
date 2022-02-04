import { Chart } from "react-charts";
import React, { useMemo } from "react";
export default function LineChart(Chartdata) {
  const data = useMemo(
    () => [
      {
        label: "Series 1",
        data: [
          [0, 1],
          [1, 2],
          [2, 4],
          [3, 2],
          [4, 7],
        ],
      },
    ],
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "linear", position: "bottom" },
      { type: "linear", position: "left" },
    ],
    []
  );
  return (
    <>
      <Chart data={data} axes={axes} />
    </>
  );
}
