-- Esquema inicial de MultiEnviosGT (MySQL).
-- Crea las tablas y el stored procedure base. Las migraciones posteriores
-- añaden columnas a `guides` (isCancelled, courier_id).

CREATE TABLE IF NOT EXISTS users (
  id       VARCHAR(36)  NOT NULL PRIMARY KEY,
  email    VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name     VARCHAR(255) NOT NULL,
  balance  DOUBLE       NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS guides (
  id             VARCHAR(36)  NOT NULL PRIMARY KEY,
  userId         VARCHAR(36)  NOT NULL,
  trackingNumber VARCHAR(64)  NOT NULL,
  courier        VARCHAR(32)  NOT NULL,
  recipient      JSON         NOT NULL,
  parcel         JSON         NOT NULL,
  status         VARCHAR(32)  NOT NULL DEFAULT 'created',
  cost           DOUBLE       NOT NULL DEFAULT 0,
  pdf            LONGBLOB     NULL,
  createdAt      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_guides_user FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS shipments (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  userId        VARCHAR(36)  NOT NULL,
  recipientName VARCHAR(255) NOT NULL,
  address       VARCHAR(512) NOT NULL,
  status        VARCHAR(32)  NOT NULL DEFAULT 'pending',
  cost          DOUBLE       NOT NULL DEFAULT 0,
  createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_shipments_user FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS packages (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  shipmentId  VARCHAR(36)  NOT NULL,
  type        VARCHAR(32)  NOT NULL,
  content     VARCHAR(512) NOT NULL,
  weight      DOUBLE       NOT NULL,
  quantity    INT          NOT NULL DEFAULT 1,
  CONSTRAINT fk_packages_shipment FOREIGN KEY (shipmentId) REFERENCES shipments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS integration_settings (
  courier    VARCHAR(32) NOT NULL PRIMARY KEY,
  isEnabled  BOOLEAN     NOT NULL DEFAULT FALSE,
  config     JSON        NULL
);

-- Procedimiento almacenado de asignacion de guias contra el courier.
-- typeOfService: 0 = cancelada, >0 = creada/activa.
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CT_Orders_AssignGuides(
  IN p_orderId       VARCHAR(36),
  IN p_guideNumber   VARCHAR(64),
  IN p_typeOfService INT
)
BEGIN
  IF p_typeOfService = 0 THEN
    UPDATE guides
       SET status = 'cancelled'
     WHERE id = p_orderId;
  ELSE
    UPDATE guides
       SET trackingNumber = COALESCE(NULLIF(p_guideNumber, ''), trackingNumber),
           status = 'created'
     WHERE id = p_orderId;
  END IF;
END //
DELIMITER ;