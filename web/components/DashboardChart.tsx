import Chart from "react-apexcharts";
import { Card } from "antd";
import type { ApexOptions } from "apexcharts";

interface DashboardChartProps {
  title: string;
  type: "line" | "bar" | "donut" | "area";
  options: ApexOptions;
  series: any[];
  height?: string | number;
}

export function DashboardChart({
  title,
  type,
  options,
  series,
  height = "300px",
}: DashboardChartProps) {
  return (
    <Card title={title} style={{ height: "100%" }}>
      <div style={{ height }}>
        <Chart options={options} series={series} type={type} height="100%" width="100%" />
      </div>
    </Card>
  );
}
