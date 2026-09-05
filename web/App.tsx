import { useState, useEffect, type ReactNode } from "react";
import {
  Layout,
  Button,
  Drawer,
  Table,
  Tag,
  Typography,
  Card,
  Space,
  Dropdown,
  Avatar,
  App as AntApp,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  MenuOutlined,
  EyeOutlined,
  PrinterOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Dashboard } from "./components/Dashboard";
import { Sidebar, type MenuPath } from "./components/Sidebar";
import { ShipmentForm } from "./components/ShipmentForm";
import { Reports } from "./components/Reports";
import { ConfigScreen } from "./components/ConfigScreen";
import { LoginScreen } from "./components/LoginScreen";
import { getToken, getUser, logout } from "./auth";
import type { GuideRecord } from "./api";
import { getGuides, cancelGuide } from "./guidesStorage";

const { Sider, Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function ShipmentsHistory() {
  const { message } = AntApp.useApp();
  const [guides, setGuides] = useState<GuideRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    setGuides(getGuides());
    setLoading(false);
  }, []);

  const handleCancel = (id: string) => {
    setCancellingId(id);
    try {
      const updated = cancelGuide(id);
      if (updated) {
        setGuides((prev) =>
          prev.map((g) => (g.id === id ? { ...g, isCancelled: true, status: "Anulada" } : g)),
        );
        message.success("Guía anulada correctamente");
      } else {
        message.error("No se pudo anular la guía");
      }
    } catch {
      message.error("No se pudo anular la guía");
    } finally {
      setCancellingId(null);
    }
  };

  const columns: ColumnsType<GuideRecord> = [
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
      key: "recipient",
      render: (_: unknown, record: GuideRecord) => record.recipient.name,
    },
    {
      title: "Courier",
      dataIndex: "courier",
      key: "courier",
    },
    {
      title: "Estado",
      key: "status",
      render: (_: unknown, record: GuideRecord) =>
        record.isCancelled ? (
          <Tag color="red">Anulada</Tag>
        ) : (
          <Tag color="blue">{record.status}</Tag>
        ),
    },
    {
      title: "Monto",
      dataIndex: "cost",
      key: "cost",
      render: (amount: number) =>
        new Intl.NumberFormat("es-GT", {
          style: "currency",
          currency: "GTQ",
        }).format(amount),
    },
    {
      title: "Fecha",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString("es-GT"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: GuideRecord) => (
        <Space>
          <Button type="text" size="small" icon={<EyeOutlined />} />
          <Button type="text" size="small" icon={<PrinterOutlined />} />
          {!record.isCancelled && (
            <Button
              type="text"
              size="small"
              danger
              loading={cancellingId === record.id}
              onClick={() => handleCancel(record.id)}
            >
              Anular
            </Button>
          )}
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
          Listado completo de guías generadas
        </Paragraph>
      </div>
      <Card>
        <Table<GuideRecord>
          columns={columns}
          dataSource={guides}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => !!getToken());
  const [path, setPath] = useState<MenuPath>("/dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setPath("/dashboard");
  };

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
    case "/config":
      content = <ConfigScreen />;
      break;
    default:
      content = <Dashboard />;
  }

  const user = getUser();

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        trigger={null}
        width={240}
        style={{ background: "#ffffff", borderRight: "1px solid #e0e0e0" }}
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

      <Layout style={{ background: "#f5f5f5" }}>
        <Header
          style={{
            background: "#ffffff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerOpen(true)}
            className="mobile-menu-btn"
          />
          <span
            style={{
              color: "#1976d2",
              fontWeight: 800,
              fontSize: "1.2rem",
              marginLeft: 12,
            }}
          >
            MULTIENVÍOS GT
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: "Cerrar sesión",
                    onClick: handleLogout,
                  },
                ],
              }}
              placement="bottomRight"
            >
              <Button type="text" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: "#1976d2" }} />
                <span style={{ fontSize: 14 }}>{user?.name ?? "Usuario"}</span>
                <LogoutOutlined />
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: 24 }}>{content}</Content>
      </Layout>
    </Layout>
  );
}
