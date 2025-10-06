/*
  # Add nodes_cache column to adventures table

  ## Changes
  - Adds `nodes_cache` JSONB column to store generated adventure nodes in memory
  - This replaces the need for a separate nodes table

  ## Notes
  - The nodes_cache will store an array of node objects
  - Each node contains: id, depth, content, choices
  - This simplifies the data model and improves performance
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'adventures' AND column_name = 'nodes_cache'
  ) THEN
    ALTER TABLE adventures ADD COLUMN nodes_cache jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;
