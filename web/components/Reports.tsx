import { Row, Col, Card, Table, Tag, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ApexOptions } from "apexcharts";
import { DashboardChart } from "./DashboardChart";

const { Title, Paragraph } = Typography;

interface ReportShipment {
  key: string;
  trackingNumber: string;
  courier: string;
  destination: string;
  status: "delivered" | "in_transit" | "pending" | "returned";
  amount: number;
  date: string;
}

const STATUS_CONFIG: Record<
  ReportShipment["status"],
  { label: string; color: string }
> = {
  delivered: { label: "Entregado", color: "green" },
  in_transit: { label: "En Tránsito", color: "blue" },
  pending: { label: "Pendiente", color: "orange" },
  returned: { label: "Devuelto", color: "red" },
};

const DUMMY_SHIPMENTS: ReportShipment[] = [
  {
    key: "1",
    trackingNumber: "CE-2026-00128",
    courier: "Cargo Expreso",
    destination: "Guatemala City",
    status: "in_transit",
    amount: 125.0,
    date: "2026-07-09",
  },
  {
    key: "2",
    trackingNumber: "CE-2026-00127",
    courier: "Cargo Expreso",
    destination: "Mixco",
    status: "delivered",
    amount: 89.5,
    date: "2026-07-09",
  },
  {
    key: "3",
    trackingNumber: "CE-2026-00126",
    courier: "Forza",
    destination: "Villa Nueva",
    status: "pending",
    amount: 210.0,
    date: "2026-07-08",
  },
  {
    key: "4",
    trackingNumber: "CE-2026-00125",
    courier: "Guatex",
    destination: "Antigua Guatemala",
    status: "returned",
    amount: 45.0,
    date: "2026-07-07",
  },
  {
    key: "5",
    trackingNumber: "CE-2026-00124",
    courier: "Cargo Expreso",
    destination: "Quetzaltenango",
    status: "delivered",
    amount: 175.0,
    date: "2026-07-06",
  },
  {
    key: "6",
    trackingNumber: "CE-2026-00123",
    courier: "Forza",
    destination: "Escuintla",
    status: "in_transit",
    amount: 95.0,
    date: "2026-07-06",
  },
];

interface CourierSummary {
  key: string;
  courier: string;
  totalShipments: number;
  delivered: number;
  inTransit: number;
  pending: number;
  returned: number;
  revenue: number;
}

const DUMMY_COURIER_SUMMARY: CourierSummary[] = [
  {
    key: "1",
    courier: "Cargo Expreso",
    totalShipments: 65,
    delivered: 48,
    inTransit: 10,
    pending: 5,
    returned: 2,
    revenue: 4820.5,
  },
  {
    key: "2",
    courier: "Forza",
    totalShipments: 38,
    delivered: 27,
    inTransit: 6,
    pending: 4,
    returned: 1,
    revenue: 2650.0,
  },
  {
    key: "3",
    courier: "Guatex",
    totalShipments: 25,
    delivered: 14,
    inTransit: 8,
    pending: 3,
    returned: 0,
    revenue: 1875.25,
  },
];

export function Reports() {
  const monthlyVolumeOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    colors: ["#00b4d8"],
    stroke: { curve: "smooth", width: 3 },
    xaxis: {
      categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
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
    labels: ["Entregados", "En Tránsito", "Pendientes", "Devueltos"],
    colors: ["#00b4d8", "#722ed1", "#ff00ff", "#ffcc00"],
    stroke: { show: false },
    legend: { position: "bottom", labels: { colors: "#e0e0ff" } },
    tooltip: { theme: "dark" },
  };

  const courierOptions: ApexOptions = {
    chart: { toolbar: { show: false }, background: "transparent" },
    colors: ["#722ed1"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "40%" } },
    xaxis: {
      categories: DUMMY_COURIER_SUMMARY.map((d) => d.courier),
      labels: { style: { colors: "#888" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#888" } } },
    grid: { borderColor: "#2a2a4a", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
  };

  const shipmentColumns: ColumnsType<ReportShipment> = [
    {
      title: "Nº Guía",
      dataIndex: "trackingNumber",
      key: "trackingNumber",
      render: (text: string) => (
        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {text}
        </span>
      ),
    },
    { title: "Courier", dataIndex: "courier", key: "courier" },
    { title: "Destino", dataIndex: "destination", key: "destination" },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: ReportShipment["status"]) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) =>
        new Intl.NumberFormat("es-GT", {
          style: "currency",
          currency: "GTQ",
        }).format(amount),
    },
    { title: "Fecha", dataIndex: "date", key: "date" },
  ];

  const courierColumns: ColumnsType<CourierSummary> = [
    { title: "Courier", dataIndex: "courier", key: "courier" },
    {
      title: "Total Envíos",
      dataIndex: "totalShipments",
      key: "totalShipments",
    },
    { title: "Entregados", dataIndex: "delivered", key: "delivered" },
    { title: "En Tránsito", dataIndex: "inTransit", key: "inTransit" },
    { title: "Pendientes", dataIndex: "pending", key: "pending" },
    { title: "Devueltos", dataIndex: "returned", key: "returned" },
    {
      title: "Ingresos",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) =>
        new Intl.NumberFormat("es-GT", {
          style: "currency",
          currency: "GTQ",
        }).format(revenue),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Reportes
        </Title>
        <Paragraph type="secondary">
          Análisis de envíos y desempeño por courier (Modo Simulación)
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <DashboardChart
            title="Volumen Mensual de Envíos"
            type="line"
            options={monthlyVolumeOptions}
            series={[{ name: "Envíos", data: [85, 102, 95, 130, 150, 175] }]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <DashboardChart
            title="Distribución de Estados"
            type="donut"
            options={statusOptions}
            series={[89, 24, 12, 3]}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <DashboardChart
            title="Envíos por Courier"
            type="bar"
            options={courierOptions}
            series={[
              {
                name: "Total Envíos",
                data: DUMMY_COURIER_SUMMARY.map((d) => d.totalShipments),
              },
            ]}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} style={{ marginBottom: 16 }}>
          <Card title="Resumen por Courier">
            <Table<CourierSummary>
              columns={courierColumns}
              dataSource={DUMMY_COURIER_SUMMARY}
              pagination={false}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Envíos Recientes">
            <Table<ReportShipment>
              columns={shipmentColumns}
              dataSource={DUMMY_SHIPMENTS}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
