CREATE PROCEDURE sp_CreateShipment(
    IN p_id VARCHAR(255),
    IN p_userId VARCHAR(255),
    IN p_recipientName VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_status VARCHAR(50),
    IN p_cost DOUBLE
)
BEGIN
    INSERT INTO shipments (id, userId, recipientName, address, status, cost, createdAt)
    VALUES (p_id, p_userId, p_recipientName, p_address, p_status, p_cost, NOW());
END;

CREATE PROCEDURE sp_CreatePackage(
    IN p_id VARCHAR(255),
    IN p_shipmentId VARCHAR(255),
    IN p_type VARCHAR(50),
    IN p_content VARCHAR(255),
    IN p_weight DOUBLE,
    IN p_quantity INT
)
BEGIN
    INSERT INTO packages (id, shipmentId, type, content, weight, quantity)
    VALUES (p_id, p_shipmentId, p_type, p_content, p_weight, p_quantity);
END;

CREATE PROCEDURE sp_GetShipmentsByUser(
    IN p_userId VARCHAR(255)
)
BEGIN
    SELECT id, userId, recipientName, address, status, cost, createdAt
    FROM shipments
    WHERE userId = p_userId
    ORDER BY createdAt DESC;
END;
