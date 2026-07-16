import { Shipment } from '../models/types.js';

export const shipmentRepository = {
  create(shipment: Shipment): Shipment {
    // Implementar lógica para crear una nueva remisión
    return shipment;
  },
  findByUser(userId: string): Shipment[] {
    // Implementar lógica para obtener todas las remisiones por usuario
    return [];
  }
};
