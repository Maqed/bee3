-- Turn on trigram support
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for Ad title using trigram
CREATE INDEX ON "Ad" USING GIN (title gin_trgm_ops);