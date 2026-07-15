export type MenuPath = 
  | "/dashboard"
  | "/shipment/new"
  | "/shipments"
  | "/reports";

interface MenuItem {
  label: string;
  path: MenuPath;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Nuevo envío", path: "/shipment/new" },
  { label: "Historial", path: "/shipments" },
  { label: "Reportes", path: "/reports" },
];

export function Sidebar({
  active,
  onNavigate,
  isOpen,
}: {
  active: MenuPath;
  onNavigate: (path: MenuPath) => void;
  isOpen?: boolean;
}) {
  return (
    <nav 
      className={`sidebar ${isOpen ? 'open' : ''}`}
      aria-label="Menu principal"
    >
      <div className="sidebar-brand">MULTIENVÍOS GT</div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              type="button"
              className={ 
                active === item.path ? "sidebar-link active" : "sidebar-link"
              }
              onClick={() => onNavigate(item.path)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
// Añadido soporte para prop 'isOpen' para controlar visibilidad en móviles via CSS.