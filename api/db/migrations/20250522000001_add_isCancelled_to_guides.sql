-- Migration to add isCancelled column to guides table
ALTER TABLE guides 
ADD COLUMN isCancelled BOOLEAN NOT NULL DEFAULT FALSE;
