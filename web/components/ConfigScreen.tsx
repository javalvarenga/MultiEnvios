import { useState, useEffect, useCallback } from "react";
import {
  Tabs,
  Table,
  Tag,
  Typography,
  Card,
  Button,
  Space,
  message,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  EditCourierModal,
  type CourierConfig,
} from "./EditCourierModal";
import {
  fetchCourierSettings,
  saveCourierSettings,
  type CourierSettings,
} from "../api";

const { Title, Paragraph } = Typography;

/**
 * Metadatos estáticos de los couriers soportados: nombre, servicio y
 * descripción. Estos datos no se persisten en la BD; solo sirven para
 * mostrar la tabla. La configuración editable (credenciales, URLs, etc.)
 * se guarda en `integration_settings` vía la API.
 */
const COURIER_METADATA: Array<{
  key: string;
  courier: string;
  name: string;
  service: string;
  description: string;
}> = [
  {
    key: "caex",
    courier: "caex",
    name: "Cargo",
    service: "Cargo Expreso (CAEX)",
    description: "Generación y anulación de guías de envío.",
  },
  {
    key: "forza",
    courier: "forza",
    name: "Forza",
    service: "Forza Express",
    description: "Generación de guías y seguimiento de envíos.",
  },
  {
    key: "guatex",
    courier: "guatex",
    name: "Guatex",
    service: "Guatex",
    description: "Generación de guías de envío nacionales.",
  },
];

/** Configuración por defecto cuando un courier no tiene fila en la BD. */
const DEFAULT_CONFIG: Record<string, Record<string, string>> = {
  caex: {
    remitente: "CATTLEYA",
    usuario: "CATTLEYA",
    password: "",
    codigoCredito: "0040256",
    formatoImpresion: "4",
    codigoPobladoOrigen: "1963",
    direccionOrigen: "QUETZALTENANGO",
    telefonoOrigen: "58024372",
    hostServicio: "https://api.cargoexpreso.com",
    urlGeneracion: "/guias/generar",
    urlCancelacion: "/guias/cancelar",
  },
  forza: {
    remitente: "CATTLEYA",
    usuario: "forza_user",
    password: "",
    codigoCredito: "1000250",
    formatoImpresion: "2",
    codigoPobladoOrigen: "1001",
    direccionOrigen: "GUATEMALA",
    telefonoOrigen: "55551234",
    hostServicio: "https://api.forzaexpress.com",
    urlGeneracion: "/guias/generar",
    urlCancelacion: "/guias/cancelar",
  },
  guatex: {
    remitente: "CATTLEYA",
    usuario: "guatex_user",
    password: "",
    codigoCredito: "2000333",
    formatoImpresion: "1",
    codigoPobladoOrigen: "0901",
    direccionOrigen: "MIXCO",
    telefonoOrigen: "55559876",
    hostServicio: "",
    urlGeneracion: "",
    urlCancelacion: "",
  },
};

/** Convierte una lista de CourierSettings (API) a CourierConfig[] (UI). */
function settingsToCouriers(
  settings: CourierSettings[],
): CourierConfig[] {
  const byCourier = new Map(settings.map((s) => [s.courier, s]));

  return COURIER_METADATA.map((meta) => {
    const stored = byCourier.get(meta.courier);
    const isEnabled = stored?.isEnabled ?? false;
    const config = stored?.config ?? DEFAULT_CONFIG[meta.courier] ?? {};

    return {
      key: meta.key,
      name: meta.name,
      service: meta.service,
      description: meta.description,
      status: isEnabled ? "Activa" : "Inactiva",
      integration: isEnabled ? "Integración activa" : "Integración pendiente",
      remitente: config.remitente ?? "",
      usuario: config.usuario ?? "",
      password: config.password ?? "",
      codigoCredito: config.codigoCredito ?? "",
      formatoImpresion: config.formatoImpresion ?? "",
      codigoPobladoOrigen: config.codigoPobladoOrigen ?? "",
      direccionOrigen: config.direccionOrigen ?? "",
      telefonoOrigen: config.telefonoOrigen ?? "",
      hostServicio: config.hostServicio ?? "",
      urlGeneracion: config.urlGeneracion ?? "",
      urlCancelacion: config.urlCancelacion ?? "",
    };
  });
}

/** Convierte un CourierConfig (UI) al formato esperado por la API. */
function courierToSettings(
  courier: CourierConfig,
): { courier: string; isEnabled: boolean; config: Record<string, string> } {
  return {
    courier: courier.key,
    isEnabled: courier.status === "Activa",
    config: {
      remitente: courier.remitente,
      usuario: courier.usuario,
      password: courier.password,
      codigoCredito: courier.codigoCredito,
      formatoImpresion: courier.formatoImpresion,
      codigoPobladoOrigen: courier.codigoPobladoOrigen,
      direccionOrigen: courier.direccionOrigen,
      telefonoOrigen: courier.telefonoOrigen,
      hostServicio: courier.hostServicio,
      urlGeneracion: courier.urlGeneracion,
      urlCancelacion: courier.urlCancelacion,
    },
  };
}

export function ConfigScreen() {
  const [couriers, setCouriers] = useState<CourierConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CourierConfig | null>(null);

  const loadCouriers = useCallback(async () => {
    setLoading(true);
    try {
      const settings = await fetchCourierSettings();
      setCouriers(settingsToCouriers(settings));
    } catch {
      // Si la API falla, cargamos defaults para que la UI no quede vacía.
      setCouriers(settingsToCouriers([]));
      message.error("No se pudieron cargar las configuraciones de couriers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCouriers();
  }, [loadCouriers]);

  const handleEdit = (courier: CourierConfig) => {
    setEditing(courier);
    setModalOpen(true);
  };

  const handleSave = async (updated: CourierConfig) => {
    setSaving(true);
    try {
      const { courier, isEnabled, config } = courierToSettings(updated);
      await saveCourierSettings(courier, isEnabled, config);
      // Actualizamos el estado local con el resultado guardado.
      setCouriers((prev) =>
        prev.map((c) => (c.key === updated.key ? updated : c)),
      );
      message.success(`Configuración de ${updated.name} guardada`);
    } catch {
      message.error("No se pudo guardar la configuración");
    } finally {
      setSaving(false);
    }
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
      render: (password: string) =>
        password ? (
          <span>•••• (ya configurado)</span>
        ) : (
          <span style={{ color: "#999" }}>No configurado</span>
        ),
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
          <div style={{ marginBottom: 16, textAlign: "right" }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCouriers}
              loading={loading}
            >
              Recargar
            </Button>
          </div>
          <Spin spinning={loading}>
            <Table<CourierConfig>
              columns={columns}
              dataSource={couriers}
              pagination={false}
              scroll={{ x: 800 }}
              rowKey="key"
            />
          </Spin>
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
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}