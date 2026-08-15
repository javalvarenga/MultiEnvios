import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Table,
  Popconfirm,
  App as AntApp,
  Alert,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SendOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import {
  createShipment,
  type PackageType,
  type ShipmentResponse,
} from "../api";

const { Title, Paragraph, Text } = Typography;

interface PackageItem {
  key: string;
  type: string; // Spanish label for display
  content: string;
  weight: number;
  quantity: number;
}

const PACKAGE_TYPE_OPTIONS = [
  { value: "Paquete", label: "Paquete", apiValue: "package" as PackageType },
  { value: "Sobre", label: "Sobre", apiValue: "envelope" as PackageType },
  { value: "Otros", label: "Otros", apiValue: "other" as PackageType },
];

/** Maps the Spanish display label to the API's PackageType. */
function mapPackageType(label: string): PackageType {
  const found = PACKAGE_TYPE_OPTIONS.find((o) => o.value === label);
  return found ? found.apiValue : "package";
}

let packageKeyCounter = 0;

export function ShipmentForm() {
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdShipment, setCreatedShipment] = useState<ShipmentResponse | null>(null);

  // Campos del formulario de paquete
  const [pkgType, setPkgType] = useState<string>("Paquete");
  const [pkgContent, setPkgContent] = useState<string>("");
  const [pkgWeight, setPkgWeight] = useState<number | null>(null);
  const [pkgQuantity, setPkgQuantity] = useState<number | null>(null);

  const resetPkgFields = () => {
    setPkgType("Paquete");
    setPkgContent("");
    setPkgWeight(null);
    setPkgQuantity(null);
    setEditingKey(null);
  };

  const handleAddPackage = () => {
    if (!pkgContent.trim()) {
      message.warning("Ingrese el contenido del paquete");
      return;
    }
    if (pkgWeight === null || pkgWeight <= 0) {
      message.warning("Ingrese el peso del paquete");
      return;
    }
    if (pkgQuantity === null || pkgQuantity <= 0) {
      message.warning("Ingrese la cantidad");
      return;
    }

    if (editingKey) {
      setPackages((prev) =>
        prev.map((p) =>
          p.key === editingKey
            ? { ...p, type: pkgType, content: pkgContent.trim(), weight: pkgWeight, quantity: pkgQuantity }
            : p,
        ),
      );
    } else {
      const newPkg: PackageItem = {
        key: `pkg-${++packageKeyCounter}`,
        type: pkgType,
        content: pkgContent.trim(),
        weight: pkgWeight,
        quantity: pkgQuantity,
      };
      setPackages((prev) => [...prev, newPkg]);
    }

    resetPkgFields();
  };

  const handleEditPackage = (record: PackageItem) => {
    setEditingKey(record.key);
    setPkgType(record.type);
    setPkgContent(record.content);
    setPkgWeight(record.weight);
    setPkgQuantity(record.quantity);
  };

  const handleDeletePackage = (key: string) => {
    setPackages((prev) => prev.filter((p) => p.key !== key));
    if (editingKey === key) {
      resetPkgFields();
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (packages.length === 0) {
      message.error("Debe agregar al menos un paquete para generar la guía");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setCreatedShipment(null);

    try {
      const recipientName = String(values.recipient ?? "").trim();
      const address = String(values.address ?? "").trim();

      const payload = {
        recipientName,
        address,
        packages: packages.map((p) => ({
          type: mapPackageType(p.type),
          content: p.content,
          weight: p.weight,
          quantity: p.quantity,
        })),
      };

      const result = await createShipment(payload);
      setCreatedShipment(result);
      message.success("Envío creado con éxito");
      form.resetFields();
      setPackages([]);
      resetPkgFields();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error desconocido al crear el envío";
      setSubmitError(errorMsg);
      message.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const packageColumns: ColumnsType<PackageItem> = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Contenido",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Peso (lb)",
      dataIndex: "weight",
      key: "weight",
      width: 100,
      render: (w: number) => w.toFixed(2),
    },
    {
      title: "Cantidad",
      dataIndex: "quantity",
      key: "quantity",
      width: 90,
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      render: (_: unknown, record: PackageItem) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditPackage(record)}
          />
          <Popconfirm
            title="¿Eliminar este paquete?"
            onConfirm={() => handleDeletePackage(record.key)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <Title level={2}>Nuevo Envío</Title>
        <Paragraph type="secondary">
          Complete los datos del destinatario para generar la guía
        </Paragraph>
      </div>

      {submitError && (
        <Alert
          type="error"
          message="Error al generar la guía"
          description={submitError}
          showIcon
          closable
          onClose={() => setSubmitError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {createdShipment && (
        <Alert
          type="success"
          message="Guía generada correctamente"
          description={
            <div>
              <Text strong>ID: </Text>
              <Text code>{createdShipment.id}</Text>
              <br />
              <Text strong>Estado: </Text>
              <Text>{createdShipment.status}</Text>
              <br />
              <Text strong>Costo: </Text>
              <Text>
                {new Intl.NumberFormat("es-GT", {
                  style: "currency",
                  currency: "GTQ",
                }).format(createdShipment.cost)}
              </Text>
              <br />
              <Text strong>Fecha: </Text>
              <Text>
                {new Date(createdShipment.createdAt).toLocaleString("es-GT")}
              </Text>
            </div>
          }
          showIcon
          closable
          onClose={() => setCreatedShipment(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Destinatario"
                name="recipient"
                rules={[{ required: true, message: "Ingrese el nombre del destinatario" }]}
              >
                <Input placeholder="Nombre completo" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Teléfono"
                name="phone"
                rules={[{ required: true, message: "Ingrese el teléfono" }]}
              >
                <Input placeholder="+502 xxxx xxxx" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Dirección Exacta"
            name="address"
            rules={[{ required: true, message: "Ingrese la dirección" }]}
          >
            <Input placeholder="Calle, Zona, Ciudad" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Referencia 1" name="reference1">
                <Input placeholder="Ejemplo: Casa color verde" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Referencia 2" name="reference2">
                <Input placeholder="Ejemplo: Cerca de tienda X" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Sección de Paquetes */}
          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ marginBottom: 4 }}>
              Paquetes
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
              Agregue al menos un paquete, sobre u otro. Sin paquetes agregados no
              es posible generar la guía.
            </Paragraph>
          </div>

          {/* Formulario de captura de paquete */}
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              background: "#fafafa",
            }}
          >
            <Row gutter={12} align="bottom">
              <Col xs={24} sm={6}>
                <label style={{ display: "block", marginBottom: 4 }}>Tipo</label>
                <Select
                  value={pkgType}
                  onChange={setPkgType}
                  options={PACKAGE_TYPE_OPTIONS.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col xs={24} sm={6}>
                <label style={{ display: "block", marginBottom: 4 }}>Contenido</label>
                <Input
                  value={pkgContent}
                  onChange={(e) => setPkgContent(e.target.value)}
                  placeholder="Ej: Ropa"
                />
              </Col>
              <Col xs={24} sm={5}>
                <label style={{ display: "block", marginBottom: 4 }}>Peso (lb)</label>
                <InputNumber
                  value={pkgWeight}
                  onChange={(v) => setPkgWeight(v ?? null)}
                  min={0.01}
                  step={0.1}
                  style={{ width: "100%" }}
                  placeholder="0.00"
                />
              </Col>
              <Col xs={24} sm={4}>
                <label style={{ display: "block", marginBottom: 4 }}>Cantidad</label>
                <InputNumber
                  value={pkgQuantity}
                  onChange={(v) => setPkgQuantity(v ?? null)}
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="1"
                />
              </Col>
              <Col xs={24} sm={3}>
                <Button
                  block
                  icon={<PlusOutlined />}
                  onClick={handleAddPackage}
                >
                  {editingKey ? "Actualizar" : "Agregar"}
                </Button>
              </Col>
            </Row>
            {editingKey && (
              <div style={{ marginTop: 8 }}>
                <Button type="link" size="small" onClick={resetPkgFields}>
                  Cancelar edición
                </Button>
              </div>
            )}
          </div>

          {/* Lista de paquetes agregados */}
          <Table<PackageItem>
            columns={packageColumns}
            dataSource={packages}
            rowKey="key"
            pagination={false}
            size="small"
            locale={{ emptyText: "No hay paquetes agregados" }}
            style={{ marginBottom: 16 }}
          />

          {packages.length === 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text type="danger">
                Debe agregar al menos un paquete para generar la guía
              </Text>
            </div>
          )}

          <Divider />

          <Space style={{ width: "100%", justifyContent: "flex-end", marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              size="large"
              loading={submitting}
              disabled={packages.length === 0}
            >
              Generar Guía
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
