import { useState } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import type { ApexOptions } from "apexcharts";
import { DashboardChart } from "./DashboardChart";

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(value);
}

const DUMMY_DATA = {
  shipmentsToday: 24,
  shipmentsInTransit: 15,
  estimatedRevenue: 1250.75,
  weeklyActivity: [
    { day: "Lun", value: 30 },
    { day: "Mar", value: 40 },
    { day: "Mie", value: 35 },
    { day: "Jue", value: 50 },
    { day: "Vie", value: 49 },
    { day: "Sab", value: 60 },
    { day: "Dom", value: 70 },
  ],
  statusDistribution: [
    { label: "Entregados", value: 45 },
    { label: "En Tránsito", value: 30 },
    { label: "Pendientes", value: 15 },
    { label: "Devueltos", value: 10 },
  ],
  monthlyGrowth: [
    { month: "Ene", value: 100 },
    { month: "Feb", value: 120 },
    { month: "Mar", value: 110 },
    { month: "Abr", value: 150 },
    { month: "May", value: 180 },
    { month: "Jun", value: 200 },
  ],
};

export function Dashboard() {
  const [data] = useState(DUMMY_DATA);

  const activityOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    colors: ["#1976d2"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: data.weeklyActivity.map((d) => d.day),
      labels: { style: { colors: "#666" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#666" } } },
    grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };

  const statusOptions: ApexOptions = {
    chart: { background: "transparent" },
    labels: data.statusDistribution.map((d) => d.label),
    colors: ["#1976d2", "#9c27b0", "#ff4081", "#ffb300"],
    stroke: { show: false },
    legend: { position: "bottom", labels: { colors: "#333" } },
    tooltip: { theme: "light" },
  };

  const growthOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    colors: ["#9c27b0"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "40%" } },
    xaxis: {
      categories: data.monthlyGrowth.map((d) => d.month),
      labels: { style: { colors: "#666" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#666" } } },
    grid: { borderColor: "#e0e0e0", strokeDashArray: 4 },
    tooltip: { theme: "light" },
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Panel de control central de envíos (Modo Simulación)
          </Typography>
        </Box>
        <Button variant="contained" color="primary" size="small">
          Actualizar
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Paper sx={{ flex: "1 1 0", minWidth: 200, p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Envíos Hoy
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {data.shipmentsToday}
          </Typography>
        </Paper>
        <Paper sx={{ flex: "1 1 0", minWidth: 200, p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            En Tránsito
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {data.shipmentsInTransit}
          </Typography>
        </Paper>
        <Paper sx={{ flex: "1 1 0", minWidth: 200, p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Ingresos Est.
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {formatMoney(data.estimatedRevenue)}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 8px)" } }}>
          <DashboardChart
            title="Actividad Semanal"
            type="line"
            options={activityOptions}
            series={[{ name: "Envíos", data: data.weeklyActivity.map((d) => d.value) }]}
          />
        </Box>
        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 calc(50% - 8px)" } }}>
          <DashboardChart
            title="Distribución de Estados"
            type="donut"
            options={statusOptions}
            series={data.statusDistribution.map((d) => d.value)}
          />
        </Box>
        <Box sx={{ flex: "1 1 100%" }}>
          <DashboardChart
            title="Crecimiento Mensual"
            type="bar"
            options={growthOptions}
            series={[{ name: "Total", data: data.monthlyGrowth.map((d) => d.value) }]}
          />
        </Box>
      </Box>
    </Box>
  );
}
