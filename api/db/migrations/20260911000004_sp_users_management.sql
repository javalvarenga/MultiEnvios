-- Stored Procedures para la gestion de usuarios.

CREATE PROCEDURE sp_GetUserByEmail(
    IN p_email VARCHAR(255)
)
BEGIN
    SELECT id, email, password, name, balance
    FROM users
    WHERE email = p_email;
END;

CREATE PROCEDURE sp_GetUserById(
    IN p_id VARCHAR(36)
)
BEGIN
    SELECT id, email, password, name, balance
    FROM users
    WHERE id = p_id;
END;

CREATE PROCEDURE sp_UpdateUserBalance(
    IN p_id VARCHAR(36),
    IN p_delta DOUBLE
)
BEGIN
    UPDATE users SET balance = balance + p_delta WHERE id = p_id;
END;