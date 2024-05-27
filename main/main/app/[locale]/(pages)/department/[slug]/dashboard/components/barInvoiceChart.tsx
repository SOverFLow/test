import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const BarInvoiceChart: React.FC<{
  data: { [key: string]: { paid: number; pending: number; draft: number } };
  title?: string;
}> = ({ data, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current!);

    // Prepare categories and series data from the provided data
    const categories = Object.keys(data);
    const paidData = categories.map((month) => data[month].paid);
    const pendingData = categories.map((month) => data[month].pending);
    const draftData = categories.map((month) => data[month].draft);

    chart.setOption({
      legend: {
        data: ["Paid", "Pending", "Draft"],
        align: "left",
        bottom: 0,
      },
      // title: {
      //   text: title,
      //   top: "0",
      //   left: "center",
      //   textStyle: {
      //     fontSize: 16,
      //   },
      // },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      xAxis: {
        type: "category",
        data: categories,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "xxxx",
          type: "bar",
          stack: "total",
        },
        {
          name: "Paid",
          type: "bar",
          data: paidData,
          stack: "total",
        },
        {
          name: "Pending",
          type: "bar",
          data: pendingData,
          stack: "total",
        },
        {
          name: "Draft",
          type: "bar",
          data: draftData,
          stack: "total",
        },
      ],
    });

    return () => {
      chart.dispose();
    };
  }, [data, title]);

  return <div ref={chartRef} style={{ width: "100%", height: "239px" }} />;
};

export default BarInvoiceChart;
