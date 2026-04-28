-- Add tsvector column populated by trigger from name, description, tags
ALTER TABLE "Vendor" ADD COLUMN "searchVector" tsvector;

-- Build the search vector from textual fields. Tags are stored as a JSON
-- string; strip JSON syntax characters so words index cleanly.
CREATE OR REPLACE FUNCTION vendor_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(regexp_replace(NEW.tags, '[\[\]\"]', ' ', 'g'), '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER vendor_search_vector_trigger
BEFORE INSERT OR UPDATE OF name, description, tags ON "Vendor"
FOR EACH ROW EXECUTE FUNCTION vendor_search_vector_update();

-- Backfill existing rows
UPDATE "Vendor" SET "name" = "name";

-- GIN index for fast match
CREATE INDEX "Vendor_searchVector_idx" ON "Vendor" USING GIN ("searchVector");
