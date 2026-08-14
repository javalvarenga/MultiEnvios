import Chart from "react-apexcharts";
import { Paper, Typography } from "@mui/material";
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
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <div style={{ height }}>
        <Chart options={options} series={series} type={type} height="100%" width="100%" />
      </div>
    </Paper>
  );
}
