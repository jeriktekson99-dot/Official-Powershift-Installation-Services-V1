-- =============================================================
-- Supabase Database Schema for Powershift Solar Installation Services
-- Centralized Data & Media Bucket Infrastructure
-- =============================================================
-- This schema establishes all relational tables, the dedicated 'photobucket' 
-- storage bucket & media registry for admin image uploads, Row-Level Security 
-- (RLS) policies, performance indexes, and initial seed datasets.

-- -------------------------------------------------------------
-- 1. Database Schema Definitions
-- -------------------------------------------------------------

-- Drop existing tables if they exist (for clean deployment and migrations)
DROP TABLE IF EXISTS public.photobucket CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.portfolio CASCADE;
DROP TABLE IF EXISTS public.meetings CASCADE;
DROP TABLE IF EXISTS public.special_offers CASCADE;
DROP TABLE IF EXISTS public.system_config CASCADE;

-- -------------------------------------------------------------
-- Photobucket: Central repository for all admin-uploaded pictures
-- Stores image metadata, URLs, storage paths, associated entity links,
-- and categorized tags for portfolio, products, flyers, and site audits.
-- -------------------------------------------------------------
CREATE TABLE public.photobucket (
    id TEXT PRIMARY KEY, -- e.g. 'PHOTO-2026-001', 'PB-001' or UUID
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL, -- Public CDN or Supabase Storage bucket URL
    storage_path TEXT, -- Internal storage path, e.g. 'photobucket/portfolio/array-1.jpg'
    bucket_name TEXT NOT NULL DEFAULT 'photobucket',
    mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    title TEXT,
    caption TEXT,
    category TEXT NOT NULL DEFAULT 'General', -- 'Portfolio', 'Product', 'Flyers', 'Site Audit', 'Branding', 'General'
    entity_type TEXT, -- 'portfolio', 'products', 'special_offers', 'leads', 'system'
    entity_id TEXT, -- Associated record ID (e.g. 'PROJ-206-01', 'PROD-206-10')
    uploaded_by TEXT NOT NULL DEFAULT 'Admin',
    is_public BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Portfolio / Projects Table
CREATE TABLE public.portfolio (
    id TEXT PRIMARY KEY, -- String IDs like 'PROJ-206-01'
    name TEXT NOT NULL,
    segment TEXT NOT NULL DEFAULT 'Residential',
    capacity TEXT NOT NULL,
    cost TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'COMPLETED',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    client_name TEXT,
    location TEXT, -- Geographic location matching admin dashboard
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
    id TEXT PRIMARY KEY, -- String IDs like 'PROD-206-10'
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
    id TEXT PRIMARY KEY, -- String IDs like 'PKG-206-20'
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    capacity TEXT NOT NULL,
    ribbon TEXT NOT NULL DEFAULT 'None',
    on_grid_price TEXT NOT NULL,
    hybrid_price TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Leads Table (Free Quote & Site Inquiry form submissions)
CREATE TABLE public.leads (
    id TEXT PRIMARY KEY, -- String IDs like 'LEAD-206-30'
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

-- Special Offers / Promotional Flyers Table
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
-- 2. Supabase Storage Configuration (photobucket)
-- -------------------------------------------------------------
-- Initialize the dedicated 'photobucket' storage bucket in Supabase Storage.
-- This bucket holds all raw binary picture files uploaded by the admin.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photobucket',
    'photobucket',
    true,
    52428800, -- 50 Megabytes maximum per picture
    ARRAY[
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/heic',
        'image/heif'
    ]
)
ON CONFLICT (id) DO UPDATE SET 
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- -------------------------------------------------------------
-- 3. Indexes for Performance & Scalability
-- -------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_photobucket_category ON public.photobucket(category);
CREATE INDEX IF NOT EXISTS idx_photobucket_entity ON public.photobucket(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_photobucket_created_at ON public.photobucket(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photobucket_bucket_name ON public.photobucket(bucket_name);
CREATE INDEX IF NOT EXISTS idx_photobucket_uploaded_by ON public.photobucket(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_portfolio_segment ON public.portfolio(segment);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_special_offers_timestamp ON public.special_offers(timestamp DESC);

-- -------------------------------------------------------------
-- 4. Row-Level Security (RLS) Configuration
-- -------------------------------------------------------------

-- Enable RLS on all relational tables
ALTER TABLE public.photobucket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- Photobucket Table Security Policies
DROP POLICY IF EXISTS "Allow public read access to photobucket" ON public.photobucket;
CREATE POLICY "Allow public read access to photobucket"
    ON public.photobucket FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public read/write access to photobucket" ON public.photobucket;
CREATE POLICY "Allow public read/write access to photobucket" 
    ON public.photobucket FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Storage Objects Policies for 'photobucket' Bucket
DROP POLICY IF EXISTS "Public can view images in photobucket" ON storage.objects;
CREATE POLICY "Public can view images in photobucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'photobucket');

DROP POLICY IF EXISTS "Allow upload to photobucket" ON storage.objects;
CREATE POLICY "Allow upload to photobucket"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'photobucket');

DROP POLICY IF EXISTS "Allow update to photobucket" ON storage.objects;
CREATE POLICY "Allow update to photobucket"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'photobucket')
    WITH CHECK (bucket_id = 'photobucket');

DROP POLICY IF EXISTS "Allow delete from photobucket" ON storage.objects;
CREATE POLICY "Allow delete from photobucket"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'photobucket');

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
-- 5. Helper Functions & Triggers
-- -------------------------------------------------------------

-- Automatically update updated_at timestamp on photobucket records
CREATE OR REPLACE FUNCTION public.handle_photobucket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_photobucket_updated_at ON public.photobucket;
CREATE TRIGGER trigger_photobucket_updated_at
    BEFORE UPDATE ON public.photobucket
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_photobucket_updated_at();

-- Aggregated Photobucket Summary View by Category
CREATE OR REPLACE VIEW public.photobucket_summary AS
SELECT 
    category,
    COUNT(*) AS total_pictures,
    COALESCE(SUM(file_size_bytes), 0) AS total_bytes,
    ROUND(COALESCE(SUM(file_size_bytes), 0) / 1048576.0, 2) AS total_megabytes,
    MAX(created_at) AS latest_upload_at
FROM public.photobucket
GROUP BY category
ORDER BY total_pictures DESC;

-- -------------------------------------------------------------
-- 6. Initial Seed Data
-- -------------------------------------------------------------

-- Seed Photobucket (Central Admin Picture Bucket)
INSERT INTO public.photobucket (
    id, file_name, file_url, storage_path, bucket_name, mime_type, file_size_bytes, title, caption, category, entity_type, entity_id, uploaded_by
) VALUES 
(
    'PHOTO-101', 
    'qc-residential-pv-array.jpg', 
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80', 
    'photobucket/portfolio/qc-residential-pv-array.jpg', 
    'photobucket', 
    'image/jpeg', 
    245000, 
    'Quezon City Residential Array', 
    'High-efficiency residential PV setup with Tier-1 monocrystalline panels', 
    'Portfolio', 
    'portfolio', 
    'PROJ-206-01', 
    'Admin'
),
(
    'PHOTO-102', 
    'cavite-cold-storage-grid.jpg', 
    'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg', 
    'photobucket/portfolio/cavite-cold-storage-grid.jpg', 
    'photobucket', 
    'image/jpeg', 
    512000, 
    'Cavite Cold Storage Solar Grid', 
    'Industrial cold storage backup array with automatic transfer', 
    'Portfolio', 
    'portfolio', 
    'PROJ-206-02', 
    'Admin'
),
(
    'PHOTO-103', 
    'mandaluyong-penthouse-array.jpg', 
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80', 
    'photobucket/portfolio/mandaluyong-penthouse-array.jpg', 
    'photobucket', 
    'image/jpeg', 
    198000, 
    'Mandaluyong Penthouse Eco Array', 
    'Urban rooftop ultra-low profile mounting system', 
    'Portfolio', 
    'portfolio', 
    'PROJ-206-04', 
    'Admin'
),
(
    'PHOTO-104', 
    'dah-solar-450w-mono.jpg', 
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', 
    'photobucket/products/dah-solar-450w-mono.jpg', 
    'photobucket', 
    'image/jpeg', 
    185000, 
    'Tier-1 450W Mono PV Panel', 
    'High-density multi-busbar monocrystalline solar panel', 
    'Product', 
    'products', 
    'PROD-206-10', 
    'Admin'
),
(
    'PHOTO-105', 
    'deye-hybrid-10kw-inverter.jpg', 
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80', 
    'photobucket/products/deye-hybrid-10kw-inverter.jpg', 
    'photobucket', 
    'image/jpeg', 
    192000, 
    'Hybrid 10kW Smart Inverter', 
    'Seamless power transfer grid-tied hybrid controller engine', 
    'Product', 
    'products', 
    'PROD-206-11', 
    'Admin'
),
(
    'PHOTO-106', 
    'powershift-summer-promo-banner.jpg', 
    'https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=600&q=80', 
    'photobucket/offers/powershift-summer-promo-banner.jpg', 
    'photobucket', 
    'image/jpeg', 
    320000, 
    'Summer 2026 Solar Package Promo', 
    'Exclusive discount flyer campaign for hybrid solar installations', 
    'Flyers', 
    'special_offers', 
    'FLYER-901', 
    'Admin'
);

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
('social_tiktok', 'https://tiktok.com/@powershift'),
('photobucket_bucket_name', 'photobucket'),
('photobucket_max_mb', '50')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
