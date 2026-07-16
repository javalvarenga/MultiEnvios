import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
} from "antd";

export interface CourierConfig {
  key: string;
  name: string;
  service: string;
  description: string;
  status: string;
  integration: string;
  remitente: string;
  usuario: string;
  password: string;
  codigoCredito: string;
  formatoImpresion: string;
  codigoPobladoOrigen: string;
  direccionOrigen: string;
  telefonoOrigen: string;
}

interface EditCourierModalProps {
  open: boolean;
  courier: CourierConfig | null;
  onClose: () => void;
  onSave: (updated: CourierConfig) => void;
}

export function EditCourierModal({
  open,
  courier,
  onClose,
  onSave,
}: EditCourierModalProps) {
  const [form] = Form.useForm<CourierConfig>();

  useEffect(() => {
    if (open && courier) {
      form.setFieldsValue(courier);
    }
  }, [open, courier, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (courier) {
        onSave({ ...courier, ...values });
      }
      onClose();
    } catch {
      // validation errors handled by form
    }
  };

  return (
    <Modal
      title={`Editar courier: ${courier?.name ?? ""}`}
      open={open}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="primary" onClick={handleOk}>
            Guardar
          </Button>
        </Space>
      }
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={courier ?? undefined}
      >
        <Form.Item name="remitente" label="Remitente">
          <Input />
        </Form.Item>
        <Form.Item name="usuario" label="Usuario">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Contraseña">
          <Input.Password />
        </Form.Item>
        <Form.Item name="codigoCredito" label="Código de crédito">
          <Input />
        </Form.Item>
        <Form.Item name="formatoImpresion" label="Formato de impresión">
          <Select
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "4", label: "4" },
            ]}
          />
        </Form.Item>
        <Form.Item name="codigoPobladoOrigen" label="Código poblado origen">
          <Input />
        </Form.Item>
        <Form.Item name="direccionOrigen" label="Dirección origen">
          <Input />
        </Form.Item>
        <Form.Item name="telefonoOrigen" label="Teléfono origen">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
