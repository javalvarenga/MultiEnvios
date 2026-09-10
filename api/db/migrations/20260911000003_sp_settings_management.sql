CREATE PROCEDURE sp_UpsertIntegrationSettings(
    IN p_courier VARCHAR(50),
    IN p_isEnabled TINYINT,
    IN p_config JSON
)
BEGIN
    INSERT INTO integration_settings (courier, isEnabled, config)
    VALUES (p_courier, p_isEnabled, p_config)
    ON DUPLICATE KEY UPDATE isEnabled = p_isEnabled, config = p_config;
END;

CREATE PROCEDURE sp_GetIntegrationSettings(
    IN p_courier VARCHAR(50)
)
BEGIN
    SELECT courier, isEnabled, config 
    FROM integration_settings 
    WHERE courier = p_courier;
END;

CREATE PROCEDURE sp_ListIntegrationSettings()
BEGIN
    SELECT courier, isEnabled, config 
    FROM integration_settings;
END;
