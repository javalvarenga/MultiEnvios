import { useState } from "react";
import type { ApexOptions } from "apexcharts";
import { DashboardChart } from "./DashboardChart.tsx";

function formatMoney(value: number): string {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
  }).format(value);
}

// Datos dummy estáticos para evitar dependencias de API durante el desarrollo de UI
const DUMMY_DATA = {
  shipmentsToday: 24,
  shipmentsInTransit: 15,
  estimatedRevenue: 1250.75,
  weeklyActivity: [
    { day: 'Lun', value: 30 },
    { day: 'Mar', value: 40 },
    { day: 'Mie', value: 35 },
    { day: 'Jue', value: 50 },
    { day: 'Vie', value: 49 },
    { day: 'Sab', value: 60 },
    { day: 'Dom', value: 70 },
  ],
  statusDistribution: [
    { label: 'Entregados', value: 45 },
    { label: 'En Tránsito', value: 30 },
    { label: 'Pendientes', value: 15 },
    { label: 'Devueltos', value: 10 },
  ],
  monthlyGrowth: [
    { month: 'Ene', value: 100 },
    { month: 'Feb', value: 120 },
    { month: 'Mar', value: 110 },
    { month: 'Abr', value: 150 },
    { month: 'May', value: 180 },
    { month: 'Jun', value: 200 },
  ]
};

export function Dashboard() {
  const [data] = useState(DUMMY_DATA);

  const activityOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: 'transparent' },
    colors: ['#00f2ff'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: data.weeklyActivity.map(d => d.day),
      labels: { style: { colors: '#8888aa' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: '#8888aa' } }
    },
    grid: {
      borderColor: '#2a2a4a',
      strokeDashArray: 4
    },
    tooltip: { theme: 'dark' }
  };

  const statusOptions: ApexOptions = {
    chart: { background: 'transparent' },
    labels: data.statusDistribution.map(d => d.label),
    colors: ['#00f2ff', '#bc13fe', '#ff00ff', '#ffcc00'],
    stroke: { show: false },
    legend: {
      position: 'bottom',
      labels: { colors: '#e0e0ff' }
    },
    tooltip: { theme: 'dark' }
  };

  const growthOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: 'transparent' },
    colors: ['#bc13fe'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
      }
    },
    xaxis: {
      categories: data.monthlyGrowth.map(d => d.month),
      labels: { style: { colors: '#8888aa' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: '#8888aa' } }
    },
    grid: {
      borderColor: '#2a2a4a',
      strokeDashArray: 4
    },
    tooltip: { theme: 'dark' }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="neon-text">Dashboard</h1>
        <p className="muted">Panel de control central de envíos (Modo Simulación)</p>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Envíos Hoy</div>
          <div className="kpi-value">{data.shipmentsToday}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">En Tránsito</div>
          <div className="kpi-value">{data.shipmentsInTransit}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Ingresos Est.</div>
          <div className="kpi-value">{formatMoney(data.estimatedRevenue)}</div>
        </div>
      </div>

      <div className="charts-grid">
        <DashboardChart 
          title="Actividad Semanal"
          type="line"
          options={activityOptions}
          series={[{ name: 'Envíos', data: data.weeklyActivity.map(d => d.value) }]}
        />
        <DashboardChart 
          title="Distribución de Estados"
          type="donut"
          options={statusOptions}
          series={data.statusDistribution.map(d => d.value)}
        />
        <DashboardChart 
          title="Crecimiento Mensual"
          type="bar"
          options={growthOptions}
          series={[{ name: 'Total', data: data.monthlyGrowth.map(d => d.value) }]}
        />
      </div>
    </div>
  );
}
