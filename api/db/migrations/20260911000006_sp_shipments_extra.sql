-- Stored Procedure para obtener los paquetes de un envio por usuario.
-- Devuelve los paquetes de todos los shipments del usuario indicado.

CREATE PROCEDURE sp_GetPackagesByUser(
    IN p_userId VARCHAR(255)
)
BEGIN
    SELECT p.id, p.shipmentId, p.type, p.content, p.weight, p.quantity
    FROM packages p
    INNER JOIN shipments s ON p.shipmentId = s.id
    WHERE s.userId = p_userId;
END;