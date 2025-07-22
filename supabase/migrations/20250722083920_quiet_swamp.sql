-- Database schema for washroom review system
-- Run this SQL to set up your database tables

-- Create the main feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS scanned_feedback (
  id BIGSERIAL PRIMARY KEY,
  toilet_id BIGINT NOT NULL DEFAULT 1,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  rating FLOAT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  description TEXT DEFAULT '',
  reason_ids INTEGER[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scanned_feedback_created_at ON scanned_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scanned_feedback_rating ON scanned_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_scanned_feedback_location ON scanned_feedback(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_scanned_feedback_toilet_id ON scanned_feedback(toilet_id);

-- Create a locations table for future use (optional)
CREATE TABLE IF NOT EXISTS locations (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  type VARCHAR(50) DEFAULT 'public',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert a default location
INSERT INTO locations (id, name, address, latitude, longitude, type) 
VALUES (1, 'Default Location', 'Unknown Location', 0.0, 0.0, 'public')
ON CONFLICT (id) DO NOTHING;

-- Create a reasons table for better data structure (optional)
CREATE TABLE IF NOT EXISTS washroom_issues (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert common washroom issues
INSERT INTO washroom_issues (id, description, category) VALUES
(1, 'Dirty or unflushed toilets (Western or Indian)', 'Cleanliness'),
(2, 'Wet, slippery, or muddy floors', 'Cleanliness'),
(3, 'Unpleasant or strong odor', 'Cleanliness'),
(4, 'Paan / Gutka spit stains', 'Cleanliness'),
(5, 'Overflowing dustbins', 'Cleanliness'),
(6, 'General grime (stained walls, dirty mirrors)', 'Cleanliness'),
(7, 'No water in taps or for flush', 'Water & Fixtures'),
(8, 'Leaking taps, pipes, or cisterns', 'Water & Fixtures'),
(9, 'Broken or missing health faucet (jet spray)', 'Water & Fixtures'),
(10, 'No mug or lota available', 'Water & Fixtures'),
(11, 'Broken or missing toilet seat', 'Water & Fixtures'),
(12, 'Faulty or broken door lock/latch', 'Water & Fixtures'),
(13, 'Low water pressure', 'Water & Fixtures'),
(14, 'No hand-washing soap', 'Supplies & Amenities'),
(15, 'No toilet paper available', 'Supplies & Amenities'),
(16, 'Faulty hand dryer or no paper towels', 'Supplies & Amenities'),
(17, 'Poor or no lighting', 'Supplies & Amenities'),
(18, 'No hooks for bags or clothes', 'Supplies & Amenities'),
(19, 'Poor ventilation (no fan or window)', 'Supplies & Amenities')
ON CONFLICT (id) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_scanned_feedback_updated_at ON scanned_feedback;
CREATE TRIGGER update_scanned_feedback_updated_at
    BEFORE UPDATE ON scanned_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();