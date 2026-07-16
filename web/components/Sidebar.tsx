import { Menu } from "antd";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";
import {
  DashboardOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export type MenuPath =
  | "/dashboard"
  | "/shipment/new"
  | "/shipments"
  | "/reports"
  | "/config";

const menuItems: { key: MenuPath; label: string; icon: ReactNode }[] = [
  { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
  { key: "/shipment/new", label: "Nuevo envío", icon: <PlusCircleOutlined /> },
  { key: "/shipments", label: "Historial", icon: <UnorderedListOutlined /> },
  { key: "/reports", label: "Reportes", icon: <BarChartOutlined /> },
  { key: "/config", label: "Configuración", icon: <SettingOutlined /> },
];

interface SidebarProps {
  active: MenuPath;
  onNavigate: (path: MenuPath) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const items: MenuProps["items"] = menuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  return (
    <div style={{ height: "100%", background: "#141b2d" }}>
      <div
        style={{
          padding: "24px 20px",
          fontWeight: 800,
          fontSize: "1.3rem",
          color: "#00b4d8",
        }}
      >
        MULTIENVÍOS GT
      </div>
      <Menu
        mode="inline"
        selectedKeys={[active]}
        items={items}
        onClick={(e) => onNavigate(e.key as MenuPath)}
        style={{ background: "transparent", borderInlineEnd: "none" }}
      />
    </div>
  );
}
