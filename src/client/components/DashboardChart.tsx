import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface DashboardChartProps {
  title: string;
  type: "line" | "bar" | "donut" | "area";
  options: ApexOptions;
  series: any[];
  height?: string | number;
}

export function DashboardChart({ title, type, options, series, height = "300px" }: DashboardChartProps) {
  return (
    <div className="panel neon-border-card">
      <h2 className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{title}</h2>
      <div style={{ height }}>
        <Chart
          options={options}
          series={series}
          type={type}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}