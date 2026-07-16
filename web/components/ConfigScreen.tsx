import { useState } from "react";
import {
  Tabs,
  Table,
  Tag,
  Typography,
  Card,
  Button,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import {
  EditCourierModal,
  type CourierConfig,
} from "./EditCourierModal";

const { Title, Paragraph } = Typography;

const DUMMY_COURIERS: CourierConfig[] = [
  {
    key: "1",
    name: "Cargo",
    service: "Cargo Expreso (CAEX)",
    description: "Generación y anulación de guías de envío.",
    status: "Activa",
    integration: "Integración activa",
    remitente: "CATTLEYA",
    usuario: "CATTLEYA",
    password: "secret123",
    codigoCredito: "0040256",
    formatoImpresion: "4",
    codigoPobladoOrigen: "1963",
    direccionOrigen: "QUETZALTENANGO",
    telefonoOrigen: "58024372",
  },
  {
    key: "2",
    name: "Forza",
    service: "Forza Express",
    description: "Generación de guías y seguimiento de envíos.",
    status: "Activa",
    integration: "Integración activa",
    remitente: "CATTLEYA",
    usuario: "forza_user",
    password: "forza_pass",
    codigoCredito: "1000250",
    formatoImpresion: "2",
    codigoPobladoOrigen: "1001",
    direccionOrigen: "GUATEMALA",
    telefonoOrigen: "55551234",
  },
  {
    key: "3",
    name: "Guatex",
    service: "Guatex",
    description: "Generación de guías de envío nacionales.",
    status: "Inactiva",
    integration: "Integración pendiente",
    remitente: "CATTLEYA",
    usuario: "guatex_user",
    password: "guatex_pass",
    codigoCredito: "2000333",
    formatoImpresion: "1",
    codigoPobladoOrigen: "0901",
    direccionOrigen: "MIXCO",
    telefonoOrigen: "55559876",
  },
];

export function ConfigScreen() {
  const [couriers, setCouriers] = useState<CourierConfig[]>(DUMMY_COURIERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CourierConfig | null>(null);

  const handleEdit = (courier: CourierConfig) => {
    setEditing(courier);
    setModalOpen(true);
  };

  const handleSave = (updated: CourierConfig) => {
    setCouriers((prev) =>
      prev.map((c) => (c.key === updated.key ? updated : c)),
    );
  };

  const columns: ColumnsType<CourierConfig> = [
    {
      title: "Courier",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: CourierConfig) => (
        <div>
          <span style={{ fontWeight: 600 }}>{text}</span>
          <br />
          <span style={{ fontSize: 12, color: "#888" }}>{record.service}</span>
        </div>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Activa" ? "green" : "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Integración",
      dataIndex: "integration",
      key: "integration",
      render: (integration: string) => (
        <Tag color={integration === "Integración activa" ? "blue" : "orange"}>
          {integration}
        </Tag>
      ),
    },
    {
      title: "Remitente",
      dataIndex: "remitente",
      key: "remitente",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
    },
    {
      title: "Contraseña",
      dataIndex: "password",
      key: "password",
      render: () => <span>•••• (ya configurado)</span>,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: CourierConfig) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "couriers",
      label: "Couriers",
      children: (
        <Card>
          <Table<CourierConfig>
            columns={columns}
            dataSource={couriers}
            pagination={false}
            scroll={{ x: 800 }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          Configuración
        </Title>
        <Paragraph type="secondary">
          Administra couriers, credenciales y variables de configuración
        </Paragraph>
      </div>

      <Tabs defaultActiveKey="couriers" items={tabItems} />

      <EditCourierModal
        open={modalOpen}
        courier={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
