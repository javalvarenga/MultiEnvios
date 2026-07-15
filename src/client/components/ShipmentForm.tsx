import { useState } from "react";

export function ShipmentForm() {
  const [formData, setFormData] = useState({
    recipient: "",
    phone: "",
    address: "",
    reference1: "",
    reference2: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("Envío creado con éxito (simulado)");
  };

  return (
    <div className="shipment-form">
      <header className="form-header">
        <h1 className="neon-text">Nuevo Envío</h1>
        <p className="muted">Complete los datos del destinatario para generar la guía</p>
      </header>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label>Destinatario</label>
          <input name="recipient" value={formData.recipient} onChange={handleChange} placeholder="Nombre completo" required />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+502 xxxx xxxx" required />
        </div>
        <div className="form-group">
          <label>Dirección Exacta</label>
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Calle, Zona, Ciudad" required />
        </div>
        <div className="form-group">
          <label>Referencia 1</label>
          <input name="reference1" value={formData.reference1} onChange={handleChange} placeholder="Ej. Casa color verde" />
        </div>
        <div className="form-group">
          <label>Referencia 2</label>
          <input name="reference2" value={formData.reference2} onChange={handleChange} placeholder="Ej. Cerca de tienda X" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-neon">Generar Guía</button>
        </div>
      </form>
    </div>
  );
}