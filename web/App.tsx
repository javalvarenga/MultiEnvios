import { useState, type ReactNode } from "react";
import {
  Layout,
  Button,
  Drawer,
  Table,
  Tag,
  Typography,
  Card,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  MenuOutlined,
  EyeOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Dashboard } from "./components/Dashboard";
import { Sidebar, type MenuPath } from "./components/Sidebar";
import { ShipmentForm } from "./components/ShipmentForm";
import { Reports } from "./components/Reports";

const { Sider, Header, Content } = Layout;
const { Title, Paragraph } = Typography;

interface ShipmentRecord {
  key: string;
  trackingNumber: string;
  recipient: string;
  status: "delivered" | "in_transit" | "pending" | "returned";
  amount: number;
  date: string;
}

const STATUS_CONFIG: Record<
  ShipmentRecord["status"],
  { label: string; color: string }
> = {
  delivered: { label: "Entregado", color: "green" },
  in_transit: { label: "En Tránsito", color: "blue" },
  pending: { label: "Pendiente", color: "orange" },
  returned: { label: "Devuelto", color: "red" },
};

const DUMMY_SHIPMENTS: ShipmentRecord[] = [
  {
    key: "1",
    trackingNumber: "CE-2026-00128",
    recipient: "María López",
    status: "in_transit",
    amount: 125.0,
    date: "2026-07-09",
  },
  {
    key: "2",
    trackingNumber: "CE-2026-00127",
    recipient: "Carlos Ruiz",
    status: "delivered",
    amount: 89.5,
    date: "2026-07-09",
  },
  {
    key: "3",
    trackingNumber: "CE-2026-00126",
    recipient: "Ana Morales",
    status: "pending",
    amount: 210.0,
    date: "2026-07-08",
  },
  {
    key: "4",
    trackingNumber: "CE-2026-00125",
    recipient: "Luis Hernández",
    status: "returned",
    amount: 45.0,
    date: "2026-07-07",
  },
];

function ShipmentsHistory() {
  const columns: ColumnsType<ShipmentRecord> = [
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
    {
      title: "Destinatario",
      dataIndex: "recipient",
      key: "recipient",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: ShipmentRecord["status"]) => {
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
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Acciones",
      key: "actions",
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<PrinterOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Historial de Envíos
        </Title>
        <Paragraph type="secondary">
          Listado completo de guías generadas (Modo Simulación)
        </Paragraph>
      </div>
      <Card>
        <Table<ShipmentRecord>
          columns={columns}
          dataSource={DUMMY_SHIPMENTS}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState<MenuPath>("/dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  let content: ReactNode;
  switch (path) {
    case "/dashboard":
      content = <Dashboard />;
      break;
    case "/shipment/new":
      content = <ShipmentForm />;
      break;
    case "/shipments":
      content = <ShipmentsHistory />;
      break;
    case "/reports":
      content = <Reports />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
        width={240}
        style={{ background: "#141b2d" }}
      >
        <Sidebar active={path} onNavigate={setPath} />
      </Sider>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
        width={240}
        styles={{ header: { display: "none" }, body: { padding: 0 } }}
      >
        <Sidebar
          active={path}
          onNavigate={(p) => {
            setPath(p);
            setDrawerOpen(false);
          }}
        />
      </Drawer>

      <Layout style={{ background: "#0d1117" }}>
        <Header
          style={{
            background: "#141b2d",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="mobile-menu-btn"
            style={{ color: "#fff" }}
          />
          <span
            style={{
              color: "#00b4d8",
              fontWeight: 800,
              fontSize: "1.2rem",
              marginLeft: 12,
            }}
          >
            MULTIENVÍOS GT
          </span>
        </Header>
        <Content style={{ padding: 24 }}>{content}</Content>
      </Layout>
    </Layout>
  );
}
