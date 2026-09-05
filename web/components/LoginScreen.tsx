import { useState } from "react";
import { Card, Typography, Input, Button, App as AntApp } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { login } from "../auth";

const { Title, Text } = Typography;

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("demo@multienvios.gt");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const { message } = AntApp.useApp();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      message.error("Ingrese email y contraseña");
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      onLogin();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Credenciales inválidas";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        padding: 16,
      }}
    >
      <Card
        style={{ width: "100%", maxWidth: 380, borderRadius: 12 }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ color: "#1976d2", marginBottom: 4 }}>
            MULTIENVÍOS GT
          </Title>
          <Text type="secondary">Inicie sesión para continuar</Text>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: "#999" }} />}
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: "#999" }} />}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleLogin}
          />
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleLogin}
          >
            Ingresar
          </Button>
          <Text type="secondary" style={{ textAlign: "center", fontSize: 12 }}>
            Usuario demo: demo@multienvios.gt / demo123
          </Text>
        </div>
      </Card>
    </div>
  );
}