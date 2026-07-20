-- Supabase Database Schema for Powershift Solar Installation Services
-- This file defines the tables, row-level security (RLS) policies, and seed data matching the app structures.

-- -------------------------------------------------------------
-- 1. Database Schema Definitions
-- -------------------------------------------------------------

-- Drop existing tables if they exist (for easy re-running)
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.portfolio CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.special_offers CASCADE;
DROP TABLE IF EXISTS public.system_config CASCADE;

-- Portfolio / Projects Table
CREATE TABLE public.portfolio (
    id TEXT PRIMARY KEY, -- Matches the string IDs like 'PROJ-206-01'
    name TEXT NOT NULL,
    segment TEXT NOT NULL DEFAULT 'Residential',
    capacity TEXT NOT NULL,
    cost TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_name TEXT,
    location TEXT, -- Geographic Location added for admin dashboard parity
    hide_segment TEXT,
    roi_savings TEXT,
    case_study_overview TEXT,
    technical_framework TEXT,
    panel_specs TEXT,
    inverter_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products Table
CREATE TABLE public.products (
    id TEXT PRIMARY KEY, -- Matches the string IDs like 'PROD-206-10'
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock TEXT NOT NULL DEFAULT '0 Units',
    price TEXT NOT NULL DEFAULT 'PHP 0',
    status TEXT NOT NULL DEFAULT 'IN STOCK',
    location TEXT NOT NULL DEFAULT 'Main Depot',
    description TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    dispatch_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Packages Table
CREATE TABLE public.packages (
    id TEXT PRIMARY KEY, -- Matches the string IDs like 'PKG-206-20'
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    capacity TEXT NOT NULL,
    ribbon TEXT NOT NULL DEFAULT 'None',
    on_grid_price TEXT NOT NULL, -- Stored as text to match php prices or formatted numbers
    hybrid_price TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Leads Table (For Free Quote form submissions)
CREATE TABLE public.leads (
    id TEXT PRIMARY KEY, -- Matches string IDs like 'LEAD-206-30'
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    service TEXT NOT NULL,
    consumption TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    region TEXT NOT NULL DEFAULT 'Metro Manila',
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    property_type TEXT DEFAULT 'Residential',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Meetings / Ocular Assessments Table
CREATE TABLE public.meetings (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Ocular Assessment',
    personnel TEXT NOT NULL,
    location TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Special Offers / Promos Table
CREATE TABLE public.special_offers (
    id TEXT PRIMARY KEY,
    image TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- System Configuration Table
CREATE TABLE public.system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -------------------------------------------------------------
-- 2. Indexes for Performance Optimization
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_portfolio_segment ON public.portfolio(segment);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_special_offers_timestamp ON public.special_offers(timestamp DESC);

-- -------------------------------------------------------------
-- 3. Row-Level Security (RLS) Configuration
-- -------------------------------------------------------------

-- Enable RLS for all tables
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Portfolio Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to portfolio" ON public.portfolio;
CREATE POLICY "Allow public read/write access to portfolio" 
    ON public.portfolio FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Products Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to products" ON public.products;
CREATE POLICY "Allow public read/write access to products" 
    ON public.products FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Packages Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to packages" ON public.packages;
CREATE POLICY "Allow public read/write access to packages" 
    ON public.packages FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Leads Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to leads" ON public.leads;
CREATE POLICY "Allow public read/write access to leads" 
    ON public.leads FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Meetings Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to meetings" ON public.meetings;
CREATE POLICY "Allow public read/write access to meetings" 
    ON public.meetings FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Special Offers Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to special_offers" ON public.special_offers;
CREATE POLICY "Allow public read/write access to special_offers" 
    ON public.special_offers FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- System Config Security Policies
DROP POLICY IF EXISTS "Allow public read/write access to system_config" ON public.system_config;
CREATE POLICY "Allow public read/write access to system_config" 
    ON public.system_config FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- -------------------------------------------------------------
-- 4. Initial Seed Data
-- -------------------------------------------------------------

-- Seed Portfolio
INSERT INTO public.portfolio (
    id, name, segment, capacity, cost, status, date, description, images
) VALUES 
(
    'PROJ-206-01', 
    'Quezon City Residential Array / HIGH-EFFICIENCY RESIDENTIAL PV SETUP', 
    'Residential', 
    '5.0 kWp', 
    'PHP 285,000', 
    'COMPLETED', 
    '2026-03-12', 
    '<h2>High-efficiency residential PV setup</h2><p>This premium system delivers robust output using <strong>Tier-1 monocrystalline panels</strong> coupled with a smart hybrid inverter to power all heavy appliances.</p><ul><li>Zero export configuration</li><li>10-year warranty on PV array</li></ul>', 
    '["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80"]'::jsonb
),
(
    'PROJ-206-02', 
    'Cavite Cold Storage Solar Grid / MULTI-MW READY LOGISTICS EXPANSION', 
    'Industrial', 
    '120.0 kWp', 
    'PHP 4,820,000', 
    'IN PROGRESS', 
    '2026-05-30', 
    '<h2>Industrial cold storage backup</h2><p>Designed to maintain continuous cooling. The system handles <strong>high-amperage peaks</strong> during thermal regulation cycles.</p><ul><li>Automatic backup transfer</li><li>Intelligent peak shedding algorithm</li></ul>', 
    '["https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg"]'::jsonb
),
(
    'PROJ-206-03', 
    'St. Jude Specialized Solar Setup / COMPREHENSIVE COMMERCIAL GRID SYSTEM', 
    'Commercial', 
    '15.5 kWp', 
    'PHP 720,000', 
    'MAINTENANCE', 
    '2026-07-15', 
    '<h2>Commercial medical facility setup</h2><p>Engineered with <strong>continuous medical safety power backup</strong> specifications. Features complete clean-room isolation compliance.</p>', 
    '[]'::jsonb
),
(
    'PROJ-206-04', 
    'Mandaluyong Penthouse Eco Array / PREMIUM ROOFTOP MOUNTED CONFIGURATION', 
    'Residential', 
    '3.5 kWp', 
    'PHP 220,000', 
    'COMPLETED', 
    '2026-04-10', 
    '<h2>Urban penthouse aesthetic array</h2><p>Ultra-low-profile mounting system styled beautifully in matte black structure to preserve <strong>architectural skyline views</strong>.</p><ul><li>Premium custom matte rail systems</li><li>Integrated smart app performance tracker</li></ul>', 
    '["https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80"]'::jsonb
);

-- Seed Products
INSERT INTO public.products (
    id, name, category, stock, price, status, location, description, images
) VALUES
(
    'PROD-206-10', 
    'Tier-1 450W Mono PV Panel / ULTIMATE OUTPUT MONOCRYSTALLINE PANEL', 
    'DAH Solar', 
    '340 Units', 
    'PHP 12,500', 
    'IN STOCK', 
    'Main Depot', 
    '<h2>Ultimate Output Monocrystalline Panel</h2><p>High-density solar cells equipped with <strong>advanced multi-busbar technology</strong>. Engineered for extreme wind loads up to 5400 Pa.</p><ul><li>20.8% peak efficiency rating</li><li>Excellent low-light performance coefficient</li></ul>', 
    '["https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"]'::jsonb
),
(
    'PROD-206-11', 
    'Hybrid 10kW Smart Inverter / GRID-TIED HYBRID CONTROLLER ENGINE', 
    'Deye', 
    '24 Units', 
    'PHP 85,000', 
    'LOW STOCK', 
    'Main Depot', 
    '<h2>Grid-Tied Hybrid Controller Engine</h2><p>Seamless power transfer switching within <strong>less than 10 milliseconds</strong>. Features dual MPPT trackers with high tracking precision.</p>', 
    '["https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"]'::jsonb
),
(
    'PROD-206-12', 
    'LiFePO4 5kWh Battery Bank / MODULAR LITHIUM IRON PHOSPHATE STORAGE UNIT', 
    'Pylontech', 
    '45 Units', 
    'PHP 145,000', 
    'IN STOCK', 
    'Warehouse B', 
    '<h2>Modular Lithium Iron Phosphate Storage Unit</h2><p>Outstanding safety profile backing <strong>over 6,000 full design charge/discharge cycles</strong>. Features integrated state-of-charge tracking microchip.</p>', 
    '[]'::jsonb
),
(
    'PROD-206-13', 
    'Alu-Channel Roof Rails (Set) / HIGH-TENSILE EXTRUDED ALUMINUM RAILS', 
    'Accessories', 
    '18 Sets', 
    'PHP 4,200', 
    'OUT OF STOCK', 
    'Main Depot', 
    '<h2>High-Tensile Dynamic Extruded Aluminum Rails</h2><p>Pre-drilled heavy duty segments crafted specifically for <strong>high-seismic environments</strong>. Quick-clamp design compatible with all frame standards.</p>', 
    '[]'::jsonb
);

-- Seed Packages
INSERT INTO public.packages (
    id, name, tier, capacity, ribbon, on_grid_price, hybrid_price, status
) VALUES
('PKG-206-20', '6KW PACKAGE', '6KW', '6 kW', 'BEST SELLER', '160,000', '257,000', 'Active'),
('PKG-206-21', '8KW PACKAGE', '8KW', '8 kW', 'RECOMMENDED', '200,000', '350,000', 'Active'),
('PKG-206-22', '9KW PACKAGE', '9KW', '9 kW', 'None', '220,000', '390,000', 'Active'),
('PKG-206-23', '10KW PACKAGE', '10KW', '10 kW', 'PREMIUM CHOICE', '250,000', '420,000', 'Active');

-- Seed Leads
INSERT INTO public.leads (
    id, name, contact, service, consumption, status, region, date, property_type
) VALUES
('LEAD-206-30', 'Atty. Juan Dela Cruz', '+63 917 123 4567', '6KW PACKAGE', '320 kWh', 'New', 'Metro Manila', '2026-07-13', 'Residential'),
('LEAD-206-31', 'Pioneer Packaging Inc', 'facilities@pioneer.ph', '10KW PACKAGE', '45,000 kWh', 'Contacted', 'Cavite Zone', '2026-07-08', 'Industrial'),
('LEAD-206-32', 'Dr. Albert Santos Jr', '+63 920 888 1122', '8KW PACKAGE', '650 kWh', 'In Progress', 'Laguna South', '2026-07-02', 'Residential'),
('LEAD-206-33', 'Maria Clara Premium Boutique', 'accounts@claraboutique.com', '8KW PACKAGE', '1,200 kWh', 'Archived', 'Makati Core', '2026-06-25', 'Commercial');

-- Seed Meetings
INSERT INTO public.meetings (
    id, client_name, date, time, type, personnel, location, notes, status
) VALUES 
(
    'MEET-001', 
    'Atty. Juan Dela Cruz', 
    '2026-07-20', 
    '10:00 AM', 
    'Ocular Assessment', 
    'Engr. Marco Solis', 
    'Quezon City Elite Villas', 
    'Confirm roof structure and line of sight clearance.', 
    'Scheduled'
),
(
    'MEET-002', 
    'Pioneer Packaging Inc', 
    '2026-07-22', 
    '02:30 PM', 
    'Industrial Sizing Audit', 
    'Engr. Marco Solis', 
    'Cavite Industrial Park', 
    'Peak-load analysis on primary conveyor lines.', 
    'Scheduled'
),
(
    'MEET-003', 
    'Dr. Albert Santos Jr', 
    '2026-07-16', 
    '01:00 PM', 
    'Ocular Assessment', 
    'Technical Inspector Ramos', 
    'Laguna Residential Sector', 
    'Check physical roof angle and shadows from neighbors tree.', 
    'Completed'
);

-- Seed Special Offers
INSERT INTO public.special_offers (
    id, image, timestamp
) VALUES
(
    'FLYER-901', 
    'https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=600&q=80', 
    1784344448000
),
(
    'FLYER-902', 
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', 
    1784258048000
);

-- Seed System Configuration
INSERT INTO public.system_config (key, value) VALUES 
('social_facebook', 'https://facebook.com/powershift'),
('social_instagram', 'https://instagram.com/powershift'),
('social_tiktok', 'https://tiktok.com/@powershift')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
