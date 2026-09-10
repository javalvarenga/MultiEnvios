CREATE PROCEDURE sp_CreateGuide(
    IN p_id VARCHAR(255),
    IN p_userId VARCHAR(255),
    IN p_trackingNumber VARCHAR(255),
    IN p_courier VARCHAR(50),
    IN p_courierId BIGINT,
    IN p_recipient JSON,
    IN p_parcel JSON,
    IN p_status VARCHAR(50),
    IN p_cost DOUBLE,
    IN p_pdf LONGBLOB
)
BEGIN
    INSERT INTO guides (id, userId, trackingNumber, courier, courierId, recipient, parcel, status, cost, pdf, createdAt, isCancelled)
    VALUES (p_id, p_userId, p_trackingNumber, p_courier, p_courierId, p_recipient, p_parcel, p_status, p_cost, p_pdf, NOW(), 0);
END;

CREATE PROCEDURE sp_UpdateGuide(
    IN p_id VARCHAR(255),
    IN p_trackingNumber VARCHAR(255),
    IN p_status VARCHAR(50),
    IN p_isCancelled TINYINT,
    IN p_pdf LONGBLOB
)
BEGIN
    UPDATE guides 
    SET trackingNumber = p_trackingNumber,
        status = p_status,
        isCancelled = p_isCancelled,
        pdf = p_pdf
    WHERE id = p_id;
END;

CREATE PROCEDURE sp_GetGuidesByUser(
    IN p_userId VARCHAR(255)
)
BEGIN
    SELECT id, userId, trackingNumber, courier, courierId, recipient, parcel, status, cost, pdf, createdAt, isCancelled
    FROM guides
    WHERE userId = p_userId
    ORDER BY createdAt DESC;
END;
