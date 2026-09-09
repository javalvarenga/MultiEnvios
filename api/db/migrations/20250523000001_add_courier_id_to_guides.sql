-- Migration to add courier_id to guides table
-- Default value is 1 for 'Cargo Expreso' as per DUMMY_COURIERS mapping

ALTER TABLE guides 
ADD COLUMN courier_id BIGINT NOT NULL DEFAULT 1;
