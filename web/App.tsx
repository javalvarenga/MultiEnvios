import { useState, type ReactNode } from "react";
import { Dashboard } from "./components/Dashboard";
import { Sidebar, type MenuPath } from "./components/Sidebar";
import { ShipmentForm } from "./components/ShipmentForm";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="dashboard-state">
      <p>{title}</p>
      <p className="muted">Seccion pendiente de implementar.</p>
    </div>
  );
}

export default function App() {
  const [path, setPath] = useState<MenuPath>("/dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  let content: ReactNode;
  switch (path) {
    case "/dashboard":
      content = <Dashboard />;
      break;
    case "/shipment/new":
      content = <ShipmentForm />;
      break;
    case "/shipments":
      content = <Placeholder title="Historial de envios" />;
      break;
    case "/reports":
      content = <Placeholder title="Reportes" />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menú"
        >
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className="mobile-brand">MULTIENVÍOS GT</div>
      </header>

      <Sidebar 
        active={path} 
        onNavigate={(p) => {
          setPath(p);
          setIsMenuOpen(false);
        }}
        isOpen={isMenuOpen}
      />
      <main className="app-content">{content}</main>
    </div>
  );
}
