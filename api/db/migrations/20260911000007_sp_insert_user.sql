-- Stored Procedure para la inserción de nuevos usuarios.

CREATE PROCEDURE sp_InsertUser(
    IN p_email    VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_name     VARCHAR(255)
)
BEGIN
    INSERT INTO users (id, email, password, name, balance)
    VALUES (UUID(), p_email, p_password, p_name, 0);
END;