-- Stored Procedures adicionales para guias: busqueda por id y borrado.

CREATE PROCEDURE sp_GetGuideById(
    IN p_id VARCHAR(255)
)
BEGIN
    SELECT id, userId, trackingNumber, courier, courierId, recipient, parcel,
           status, cost, pdf, createdAt, isCancelled
    FROM guides
    WHERE id = p_id;
END;

CREATE PROCEDURE sp_DeleteGuide(
    IN p_id VARCHAR(255),
    IN p_userId VARCHAR(255)
)
BEGIN
    DELETE FROM guides WHERE id = p_id AND userId = p_userId;
END;