CREATE PROCEDURE CT_Orders_AssignGuides(
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
END
