import { useState } from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import type { ApexOptions } from "apexcharts";
import { DashboardChart } from "./DashboardChart";

const { Title, Paragraph } = Typography;

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
    colors: ["#00b4d8"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: data.weeklyActivity.map((d) => d.day),
      labels: { style: { colors: "#888" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#888" } } },
    grid: { borderColor: "#2a2a4a", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
  };

  const statusOptions: ApexOptions = {
    chart: { background: "transparent" },
    labels: data.statusDistribution.map((d) => d.label),
    colors: ["#00b4d8", "#722ed1", "#ff00ff", "#ffcc00"],
    stroke: { show: false },
    legend: { position: "bottom", labels: { colors: "#e0e0ff" } },
    tooltip: { theme: "dark" },
  };

  const growthOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    colors: ["#722ed1"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "40%" } },
    xaxis: {
      categories: data.monthlyGrowth.map((d) => d.month),
      labels: { style: { colors: "#888" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#888" } } },
    grid: { borderColor: "#2a2a4a", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>
        <Paragraph type="secondary">
          Panel de control central de envíos (Modo Simulación)
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Envíos Hoy" value={data.shipmentsToday} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="En Tránsito" value={data.shipmentsInTransit} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Ingresos Est."
              value={formatMoney(data.estimatedRevenue)}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <DashboardChart
            title="Actividad Semanal"
            type="line"
            options={activityOptions}
            series={[{ name: "Envíos", data: data.weeklyActivity.map((d) => d.value) }]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <DashboardChart
            title="Distribución de Estados"
            type="donut"
            options={statusOptions}
            series={data.statusDistribution.map((d) => d.value)}
          />
        </Col>
        <Col xs={24}>
          <DashboardChart
            title="Crecimiento Mensual"
            type="bar"
            options={growthOptions}
            series={[{ name: "Total", data: data.monthlyGrowth.map((d) => d.value) }]}
          />
        </Col>
      </Row>
    </div>
  );
}
