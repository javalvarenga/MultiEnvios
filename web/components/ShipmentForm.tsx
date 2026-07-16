import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Space,
  App as AntApp,
} from "antd";
import { SendOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export function ShipmentForm() {
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();

  const handleSubmit = (values: unknown) => {
    console.log("Formulario enviado:", values);
    message.success("Envío creado con éxito (simulado)");
    form.resetFields();
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <Title level={2}>Nuevo Envío</Title>
        <Paragraph type="secondary">
          Complete los datos del destinatario para generar la guía
        </Paragraph>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Destinatario"
                name="recipient"
                rules={[
                  { required: true, message: "Ingrese el nombre del destinatario" },
                ]}
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

          <Space style={{ width: "100%", justifyContent: "flex-end", marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              size="large"
            >
              Generar Guía
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
