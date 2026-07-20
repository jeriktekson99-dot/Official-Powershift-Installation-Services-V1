import { useState, useEffect } from 'react';
import { supabaseService } from './lib/supabaseClient';

export interface ProjectRecord {
  id: string;
  name: string;
  segment: string;
  capacity: string;
  cost: string;
  status: string;
  date: string;
  description: string;
  images: (string | { url: string; label?: string })[];
  client_name?: string;
  location?: string; // Geographic Location matching admin.html
  hide_segment?: string;
  roi_savings?: string;
  case_study_overview?: string;
  technical_framework?: string;
  panel_specs?: string;
  inverter_type?: string;
  created_at?: string | number;
}

export interface MeetingRecord {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: string;
  personnel: string;
  location: string;
  notes?: string;
  status: string;
}

export interface SpecialOfferRecord {
  id: string;
  image: string;
  timestamp: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  stock: string;
  price: string;
  status: string;
  location: string;
  description: string;
  images: (string | { url: string; label?: string })[];
  dispatch_description?: string;
  created_at?: string | number;
}

export interface PackageRecord {
  id: string;
  name: string;
  tier: string;
  capacity: string;
  ribbon: string;
  onGridPrice: string;
  hybridPrice: string;
  status: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  contact: string;
  service: string;
  consumption: string;
  status: string;
  region: string;
  date?: string;
  description?: string;
  images?: (string | { url: string; label?: string })[];
  propertyType?: string;
}

export interface SyncDb {
  portfolio: ProjectRecord[];
  products: ProductRecord[];
  packages: PackageRecord[];
  leads: LeadRecord[];
}

export interface CategoryItem {
  name: string;
  active: boolean;
}

export interface SyncCategories {
  products: CategoryItem[];
  packages: CategoryItem[];
}

// Initial seed data matching admin.html exactly
export const DEFAULT_DB: SyncDb = {
  portfolio: [
    { 
      id: "PROJ-206-01", 
      name: "Quezon City Residential Array / HIGH-EFFICIENCY RESIDENTIAL PV SETUP", 
      segment: "Residential", 
      capacity: "5.0 kWp", 
      cost: "PHP 285,000", 
      status: "COMPLETED", 
      date: "2026-03-12",
      location: "Quezon City, Metro Manila",
      description: "<h2>High-efficiency residential PV setup</h2><p>This premium system delivers robust output using <strong>Tier-1 monocrystalline panels</strong> coupled with a smart hybrid inverter to power all heavy appliances.</p><ul><li>Zero export configuration</li><li>10-year warranty on PV array</li></ul>",
      images: [
        "https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/715710298_122204691866538051_1254492833041665807_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHwaFCWupCdXZdCoN8DdcAOhKu4GTAopGqEq7gZMCikamtZD9pihIyz5u1-vTJMEsXFNyhqaASdYSBaDR1bPr75&_nc_ohc=gwE_5JVCKa4Q7kNvwGHOD1E&_nc_oc=AdoNeIkSfSDh4Jx47BdpDjzFpb4lFre7rz_5zzy6lHQHImP_CUK30aua988bf21ZbL4&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=jxnLKYc5h39jjaxNLGo10A&_nc_ss=7b2a8&oh=00_AQBMDFnti4eRBczAnJOnZ7wmjNTFbwKY5JIL9FfjfitDOQ&oe=6A62C08C"
      ]
    },
    { 
      id: "PROJ-206-02", 
      name: "Cavite Cold Storage Solar Grid / MULTI-MW READY LOGISTICS EXPANSION", 
      segment: "Industrial", 
      capacity: "120.0 kWp", 
      cost: "PHP 4,820,000", 
      status: "IN PROGRESS", 
      date: "2026-05-30",
      location: "Imus, Cavite",
      description: "<h2>Industrial cold storage backup</h2><p>Designed to maintain continuous cooling. The system handles <strong>high-amperage peaks</strong> during thermal regulation cycles.</p><ul><li>Automatic backup transfer</li><li>Intelligent peak shedding algorithm</li></ul>",
      images: [
        "https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/729855439_122206540016538051_2794935983518101920_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGHx-veDSmtdaqArfiQumXvJxBwUUU5yC0nEHBRRTnILbL125vGLzwvaCjPoiuM7W6FH9Rjz0KLb3PWAadsOb8V&_nc_ohc=tnZrdJBwyOAQ7kNvwH4Fw4R&_nc_oc=AdoZl5AEQGcNiQjmhJsZkUJgKZPowK195uCE-rvfy_PYpOJwPmGIAlkE2esyOYp3pyw&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=iwhFNwCz5K3ML4RK-lZoSg&_nc_ss=7b2a8&oh=00_AQC_jH0NqGE1zfMOEHhFzXTZH6Q4A0_4Sa6lRDit-cz5kg&oe=6A62E7A3"
      ]
    },
    { 
      id: "PROJ-206-03", 
      name: "St. Jude Specialized Solar Setup / COMPREHENSIVE COMMERCIAL GRID SYSTEM", 
      segment: "Commercial", 
      capacity: "15.5 kWp", 
      cost: "PHP 720,000", 
      status: "MAINTENANCE", 
      date: "2026-07-15",
      location: "St. Jude, PH",
      description: "<h2>Commercial medical facility setup</h2><p>Engineered with <strong>continuous medical safety power backup</strong> specifications. Features complete clean-room isolation compliance.</p>",
      images: []
    },
    { 
      id: "PROJ-206-04", 
      name: "Mandaluyong Penthouse Eco Array / PREMIUM ROOFTOP MOUNTED CONFIGURATION", 
      segment: "Residential", 
      capacity: "3.5 kWp", 
      cost: "PHP 220,000", 
      status: "COMPLETED", 
      date: "2026-04-10",
      location: "Mandaluyong, Metro Manila",
      description: "<h2>Urban penthouse aesthetic array</h2><p>Ultra-low-profile mounting system styled beautifully in matte black structure to preserve <strong>architectural skyline views</strong>.</p><ul><li>Premium custom matte rail systems</li><li>Integrated smart app performance tracker</li></ul>",
      images: [
        "https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/727277137_122206181006538051_4645898725046553359_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1155&ctp=s2048x1155&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGpd8S-Lxjw_yTQgkbNZOs7Ax1_mohjr58DHX-aiGOvn7dKyPvMRJbFUXnUjDldbZ5MvHOc1FxuBOy9zG7j9cz3&_nc_ohc=FQbeOb5vhe4Q7kNvwGua_lc&_nc_oc=AdoAAB7Fo50FSR82wqG_moJ7CNGNUl2KsOorxDa62f_TJmEZxxq3WESMMoR9nHXQPVI&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=7aKwoICHzqp2QyqG4Ij22g&_nc_ss=7b2a8&oh=00_AQCooUg_CrvqsBUucO-Ha-U4jH-9tLI7XLp2jR23YDze2Q&oe=6A62CDA5"
      ]
    }
  ],
  products: [
    { 
      id: "PROD-206-10", 
      name: "Tier-1 450W Mono PV Panel / ULTIMATE OUTPUT MONOCRYSTALLINE PANEL", 
      category: "DAH Solar", 
      stock: "340 Units", 
      price: "PHP 12,500", 
      status: "IN STOCK", 
      location: "Main Depot",
      description: "<h2>Ultimate Output Monocrystalline Panel</h2><p>High-density solar cells equipped with <strong>advanced multi-busbar technology</strong>. Engineered for extreme wind loads up to 5400 Pa.</p><ul><li>20.8% peak efficiency rating</li><li>Excellent low-light performance coefficient</li></ul>",
      images: [
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"
      ]
    },
    { 
      id: "PROD-206-11", 
      name: "Hybrid 10kW Smart Inverter / GRID-TIED HYBRID CONTROLLER ENGINE", 
      category: "Deye", 
      stock: "24 Units", 
      price: "PHP 85,000", 
      status: "LOW STOCK", 
      location: "Main Depot",
      description: "<h2>Grid-Tied Hybrid Controller Engine</h2><p>Seamless power transfer switching within <strong>less than 10 milliseconds</strong>. Features dual MPPT trackers with high tracking precision.</p>",
      images: [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
      ]
    },
    { 
      id: "PROD-206-12", 
      name: "LiFePO4 5kWh Battery Bank / MODULAR LITHIUM IRON PHOSPHATE STORAGE UNIT", 
      category: "Pylontech", 
      stock: "45 Units", 
      price: "PHP 145,000", 
      status: "IN STOCK", 
      location: "Warehouse B",
      description: "<h2>Modular Lithium Iron Phosphate Storage Unit</h2><p>Outstanding safety profile backing <strong>over 6,000 full design charge/discharge cycles</strong>. Features integrated state-of-charge tracking microchip.</p>",
      images: []
    },
    { 
      id: "PROD-206-13", 
      name: "Alu-Channel Roof Rails (Set) / HIGH-TENSILE EXTRUDED ALUMINUM RAILS", 
      category: "Accessories", 
      stock: "18 Sets", 
      price: "PHP 4,200", 
      status: "OUT OF STOCK", 
      location: "Main Depot",
      description: "<h2>High-Tensile Dynamic Extruded Aluminum Rails</h2><p>Pre-drilled heavy duty segments crafted specifically for <strong>high-seismic environments</strong>. Quick-clamp design compatible with all frame standards.</p>",
      images: []
    }
  ],
  packages: [
    { id: "PKG-206-20", name: "6KW PACKAGE", tier: "6KW", capacity: "6 kW", ribbon: "BEST SELLER", onGridPrice: "160,000", hybridPrice: "257,000", status: "Active" },
    { id: "PKG-206-21", name: "8KW PACKAGE", tier: "8KW", capacity: "8 kW", ribbon: "RECOMMENDED", onGridPrice: "200,000", hybridPrice: "350,000", status: "Active" },
    { id: "PKG-206-22", name: "9KW PACKAGE", tier: "9KW", capacity: "9 kW", ribbon: "None", onGridPrice: "220,000", hybridPrice: "390,000", status: "Active" },
    { id: "PKG-206-23", name: "10KW PACKAGE", tier: "10KW", capacity: "10 kW", ribbon: "PREMIUM CHOICE", onGridPrice: "250,000", hybridPrice: "420,000", status: "Active" }
  ],
  leads: [
    { id: "LEAD-206-30", name: "Atty. Juan Dela Cruz", contact: "+63 917 123 4567", service: "6KW PACKAGE", consumption: "320 kWh", status: "New", region: "Metro Manila", date: "2026-07-13" },
    { id: "LEAD-206-31", name: "Pioneer Packaging Inc", contact: "facilities@pioneer.ph", service: "10KW PACKAGE", consumption: "45,000 kWh", status: "Contacted", region: "Cavite Zone", date: "2026-07-08" },
    { id: "LEAD-206-32", name: "Dr. Albert Santos Jr", contact: "+63 920 888 1122", service: "8KW PACKAGE", consumption: "650 kWh", status: "In Progress", region: "Laguna South", date: "2026-07-02" },
    { id: "LEAD-206-33", name: "Maria Clara Premium Boutique", contact: "accounts@claraboutique.com", service: "8KW PACKAGE", consumption: "1,200 kWh", status: "Archived", region: "Makati Core", date: "2026-06-25" }
  ]
};

export const DEFAULT_CATEGORIES: SyncCategories = {
  products: [
    { name: "Accessories", active: true },
    { name: "Astronergy", active: true },
    { name: "DAH Solar", active: true },
    { name: "Deye", active: true },
    { name: "GenixGreen", active: true },
    { name: "Menred ESS", active: true },
    { name: "Pylontech", active: true },
    { name: "Solis", active: true },
    { name: "SRNE", active: true },
    { name: "Uncategorized", active: true }
  ],
  packages: [
    { name: "6KW", active: true },
    { name: "8KW", active: true },
    { name: "9KW", active: true },
    { name: "10KW", active: true }
  ]
};

// Robust ID string-to-number converter
export function idToNumber(id: string | number): number {
  if (typeof id === 'number') return id;
  const cleaned = id.replace(/\D/g, '');
  if (cleaned.length > 0) {
    const parsed = parseInt(cleaned, 10);
    if (!isNaN(parsed)) return parsed;
  }
  // Hash fallback
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 1000000;
}

// Global Storage Handlers
export function getSavedDb(): SyncDb {
  const data = localStorage.getItem("powershift_db");
  if (!data) {
    localStorage.setItem("powershift_db", JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  }
  try {
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== 'object') {
      localStorage.setItem("powershift_db", JSON.stringify(DEFAULT_DB));
      return DEFAULT_DB;
    }
    let modified = false;
    if (!parsed.portfolio) { parsed.portfolio = []; modified = true; }
    if (!parsed.products) { parsed.products = []; modified = true; }
    if (!parsed.packages) { parsed.packages = []; modified = true; }
    if (!parsed.leads) { parsed.leads = []; modified = true; }
    
    // Migration: Map old product categories to the new ones
    if (parsed.products && parsed.products.length > 0) {
      parsed.products.forEach((p: any) => {
        if (p.category === "PV Panels") {
          p.category = "DAH Solar";
          modified = true;
        } else if (p.category === "Inverters") {
          p.category = "Deye";
          modified = true;
        } else if (p.category === "Lithium Batteries") {
          p.category = "Pylontech";
          modified = true;
        } else if (p.category === "Balance of System") {
          p.category = "Accessories";
          modified = true;
        }
      });
    }

    if (modified) {
      localStorage.setItem("powershift_db", JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse powershift_db, resetting:", e);
    localStorage.setItem("powershift_db", JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  }
}

export function getSavedCategories(): SyncCategories {
  const data = localStorage.getItem("powershift_categories");
  if (!data) {
    localStorage.setItem("powershift_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  try {
    const parsed = JSON.parse(data);
    if (!parsed || typeof parsed !== 'object') {
      localStorage.setItem("powershift_categories", JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    let modified = false;
    if (!parsed.products || !Array.isArray(parsed.products)) {
      parsed.products = DEFAULT_CATEGORIES.products;
      modified = true;
    }
    if (!parsed.packages || !Array.isArray(parsed.packages)) {
      parsed.packages = DEFAULT_CATEGORIES.packages;
      modified = true;
    }
    // Migration check: if any active category is "PV Panels", reset or migrate to new categories list
    if (parsed.products.some((c: any) => c && (c.name === "PV Panels" || c.name === "Inverters"))) {
      localStorage.setItem("powershift_categories", JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    if (modified) {
      localStorage.setItem("powershift_categories", JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error("Failed to parse powershift_categories, resetting:", e);
    localStorage.setItem("powershift_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
}

export function saveDb(db: SyncDb) {
  try {
    localStorage.setItem("powershift_db", JSON.stringify(db));
    // Dispatch custom storage event for same-window updates
    window.dispatchEvent(new Event('powershift_db_update'));
  } catch (e: any) {
    console.warn("Storage write failed in sync.ts. Entering progressive pruning and recovery mode:", e);
    
    // 1. Try stripping all lead images first (the main culprit)
    if (db.leads && db.leads.length > 0) {
      const clonedLeads = db.leads.map(lead => ({ ...lead }));
      let hadImages = false;
      for (let i = 0; i < clonedLeads.length; i++) {
        if (clonedLeads[i].images && clonedLeads[i].images.length > 0) {
          clonedLeads[i].images = [];
          hadImages = true;
        }
      }
      
      if (hadImages) {
        try {
          const prunedDb = { ...db, leads: clonedLeads };
          localStorage.setItem("powershift_db", JSON.stringify(prunedDb));
          db.leads = clonedLeads;
          window.dispatchEvent(new Event('powershift_db_update'));
          console.log("Successfully saved database after stripping all lead images.");
          return;
        } catch (err1) {
          console.warn("Save still failed after stripping all lead images, trying further pruning...");
        }
      }
      
      // 2. Try slicing leads to latest 10
      if (clonedLeads.length > 10) {
        const slicedLeads = clonedLeads.slice(0, 10);
        try {
          const prunedDb = { ...db, leads: slicedLeads };
          localStorage.setItem("powershift_db", JSON.stringify(prunedDb));
          db.leads = slicedLeads;
          window.dispatchEvent(new Event('powershift_db_update'));
          console.log("Successfully saved database after pruning to 10 latest leads.");
          return;
        } catch (err2) {
          console.warn("Save failed after pruning to 10 leads, trying further...");
        }
      }
      
      // 3. Try slicing leads to latest 2
      if (clonedLeads.length > 2) {
        const slicedLeads = clonedLeads.slice(0, 2);
        try {
          const prunedDb = { ...db, leads: slicedLeads };
          localStorage.setItem("powershift_db", JSON.stringify(prunedDb));
          db.leads = slicedLeads;
          window.dispatchEvent(new Event('powershift_db_update'));
          console.log("Successfully saved database after pruning to 2 latest leads.");
          return;
        } catch (err3) {
          console.warn("Save failed after pruning to 2 leads, trying further...");
        }
      }

      // 4. Try completely clearing leads array
      try {
        const prunedDb = { ...db, leads: [] };
        localStorage.setItem("powershift_db", JSON.stringify(prunedDb));
        db.leads = [];
        window.dispatchEvent(new Event('powershift_db_update'));
        console.log("Successfully saved database after completely clearing leads.");
        return;
      } catch (err4) {
        console.warn("Save failed even after completely clearing leads.");
      }
    }
  }
}

export function saveCategories(categories: SyncCategories) {
  localStorage.setItem("powershift_categories", JSON.stringify(categories));
  window.dispatchEvent(new Event('powershift_categories_update'));
}

// React Hooks for real-time reactive updates and global throttling
let lastDbFetchTime = 0;
let lastOffersFetchTime = 0;
let lastSocialsFetchTime = 0;

export function useSyncDb() {
  const [db, setDb] = useState<SyncDb>(() => getSavedDb());

  useEffect(() => {
    const handleUpdate = () => {
      setDb(getSavedDb());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('powershift_db_update', handleUpdate);

    // Background fetch helper to pull fresh listings from Supabase
    const syncWithSupabase = () => {
      if (document.visibilityState === 'hidden') {
        // Skip background syncing when tab is in the background to minimize egress and prevent admin race conditions
        return;
      }
      
      const now = Date.now();
      
      // Multi-tab Cache Validation Strategy (Egress prevention):
      // Store the timestamp of the last successful DB fetch in localStorage.
      // If we synced within the last hour (3,600,000 ms), completely skip fetching.
      const lastSyncStr = localStorage.getItem("powershift_db_last_synced");
      const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;
      if (now - lastSync < 3600000) {
        return;
      }

      // Single-session dynamic guard (max 1 fetch every 5 minutes in memory)
      if (now - lastDbFetchTime < 300000) {
        return;
      }
      lastDbFetchTime = now;

      Promise.all([
        supabaseService.getPortfolio().catch(err => { console.warn("[Supabase Sync] Portfolio fetch error:", err); return null; }),
        supabaseService.getProducts().catch(err => { console.warn("[Supabase Sync] Products fetch error:", err); return null; }),
        supabaseService.getPackages().catch(err => { console.warn("[Supabase Sync] Packages fetch error:", err); return null; })
      ]).then(([portfolio, products, packages]) => {
        // Update the last synced timestamp in localStorage so other tabs and future reloads instantly benefit
        localStorage.setItem("powershift_db_last_synced", String(Date.now()));

        const localDb = getSavedDb();
        let modified = false;

        if (portfolio !== null && Array.isArray(portfolio)) {
          if (JSON.stringify(localDb.portfolio) !== JSON.stringify(portfolio)) {
            localDb.portfolio = portfolio;
            modified = true;
          }
        }
        if (products !== null && Array.isArray(products)) {
          if (JSON.stringify(localDb.products) !== JSON.stringify(products)) {
            localDb.products = products;
            modified = true;
          }
        }
        if (packages !== null && Array.isArray(packages)) {
          if (JSON.stringify(localDb.packages) !== JSON.stringify(packages)) {
            localDb.packages = packages;
            modified = true;
          }
        }

        if (modified) {
          saveDb(localDb);
          setDb(localDb);
        }
      }).catch(err => {
        console.log("[Powershift Sync] Failed to load database from Supabase:", err);
      });
    };

    // Initial background load from Supabase to catch up (only if stale)
    syncWithSupabase();

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('powershift_db_update', handleUpdate);
    };
  }, []);

  return { db, updateDb: (newDb: SyncDb) => { saveDb(newDb); setDb(newDb); } };
}

export function useSyncCategories() {
  const [categories, setCategories] = useState<SyncCategories>(() => getSavedCategories());

  useEffect(() => {
    const handleUpdate = () => {
      setCategories(getSavedCategories());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('powershift_categories_update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('powershift_categories_update', handleUpdate);
    };
  }, []);

  return { categories, updateCategories: (newCats: SyncCategories) => { saveCategories(newCats); setCategories(newCats); } };
}

// Inbound lead intake submission handler
export function submitInboundLead(payload: {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  consumption?: string;
  region?: string;
  description?: string;
  images?: (string | { url: string; label?: string })[];
  propertyType?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
}) {
  const currentDb = getSavedDb();
  
  // Generate random unique numeric token for lead
  const token = Math.floor(100 + Math.random() * 900);
  const randomId = `LEAD-206-${token}`;

  const cleanName = (payload.name || "").trim() || "Anonymous Client";
  const cleanPhone = (payload.phone || "").trim();
  const cleanEmail = (payload.email || "").trim();
  const cleanLocation = (payload.region || "").trim() || "Metro Manila";

  const now = new Date();
  const yearStr = now.getFullYear();
  const monthStr = String(now.getMonth() + 1).padStart(2, '0');
  const dayStr = String(now.getDate()).padStart(2, '0');
  const formattedDate = `${yearStr}-${monthStr}-${dayStr}`;

  const newLead: LeadRecord = {
    id: randomId,
    name: cleanName,
    contact: cleanPhone && cleanEmail ? `${cleanPhone} / ${cleanEmail}` : (cleanPhone || cleanEmail || "No Contact Info"),
    service: payload.service || "Solar Consultation",
    consumption: payload.consumption || "N/A",
    status: "New",
    region: payload.region || "Metro Manila",
    date: formattedDate,
    description: payload.description || "",
    images: payload.images || [],
    propertyType: payload.propertyType || "Residential"
  };

  if (!currentDb.leads) {
    currentDb.leads = [];
  }
  currentDb.leads.unshift(newLead);
  saveDb(currentDb);

  // If user entered a preferred ocular visit date, automatically schedule both the Ocular Trip and Master Schedule Pipeline entry!
  if (payload.preferredDate) {
    const pDate = payload.preferredDate;
    const pSlot = payload.preferredTimeSlot || "9:00 AM - 12:00 PM";
    
    // 1. Create a Master Schedule Pipeline Meeting (MeetingRecord)
    const meetingsData = getSavedMeetings();
    const newMeetId = `MEET-${Math.floor(100000 + Math.random() * 900000)}`;
    const newMeeting: MeetingRecord = {
      id: newMeetId,
      clientName: cleanName,
      date: pDate,
      time: pSlot,
      type: "Ocular Visit / Site Audit",
      personnel: "Unassigned Team",
      location: cleanLocation,
      notes: `Auto-scheduled via client online inquiry. Reference Lead ID: ${randomId}. Service Category: ${newLead.service}.`,
      status: "Scheduled"
    };
    meetingsData.unshift(newMeeting);
    saveMeetings(meetingsData);

    // Sync Meeting to Supabase
    supabaseService.submitMeeting({
      id: newMeetId,
      clientName: cleanName,
      date: pDate,
      time: pSlot,
      type: "Ocular Visit / Site Audit",
      personnel: "Unassigned Team",
      location: cleanLocation,
      notes: `Auto-scheduled via client online inquiry. Reference Lead ID: ${randomId}. Service Category: ${newLead.service}.`,
      status: "Scheduled"
    }).then((savedMeeting) => {
      console.log("[Powershift Supabase Sync] Auto-scheduled Meeting successfully synchronized to remote:", savedMeeting);
    }).catch((err) => {
      console.warn("[Powershift Supabase Sync] Failed to sync auto-scheduled Meeting to Supabase:", err);
    });

    // 2. Create an Ocular Trip (AssessmentRecord)
    const assessmentsStr = localStorage.getItem("powershift_assessments");
    let assessmentsList = [];
    if (assessmentsStr) {
      try {
        assessmentsList = JSON.parse(assessmentsStr);
      } catch (e) {
        console.error("Error parsing saved assessments in sync:", e);
      }
    } else {
      assessmentsList = [];
    }

    const newTripId = `TRIP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTrip = {
      id: newTripId,
      client: cleanName,
      date: pDate,
      time: pSlot.split(" - ")[0] || pSlot, // e.g., "9:00 AM" from "9:00 AM - 12:00 PM"
      location: cleanLocation,
      ratio: "60/40 Split"
    };
    assessmentsList.unshift(newTrip);
    localStorage.setItem("powershift_assessments", JSON.stringify(assessmentsList));
    window.dispatchEvent(new Event('powershift_assessments_update'));
  }

  // Sync to Supabase
  supabaseService.submitLead({
    id: randomId,
    name: newLead.name,
    contact: newLead.contact,
    service: newLead.service,
    consumption: newLead.consumption,
    region: newLead.region,
    date: newLead.date || formattedDate,
    description: newLead.description,
    images: newLead.images,
    propertyType: newLead.propertyType
  }).then((savedLead) => {
    console.log("[Powershift Supabase Sync] Lead successfully synchronized to remote:", savedLead);
  }).catch((err) => {
    console.warn("[Powershift Supabase Sync] Failed to submit lead to Supabase (might be offline or unconfigured):", err);
  });

  // Increment unread notifications count in localStorage using unified JSON array format
  const unreadStr = localStorage.getItem("powershift_unread_leads");
  let unreadList: string[] = [];
  if (unreadStr) {
    if (unreadStr.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(unreadStr);
        unreadList = Array.isArray(parsed) ? parsed : [];
      } catch {
        unreadList = [];
      }
    } else {
      const parsedNum = parseInt(unreadStr, 10);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        unreadList = Array(parsedNum).fill("");
      }
    }
  }
  unreadList.push(randomId);
  localStorage.setItem("powershift_unread_leads", JSON.stringify(unreadList));
  window.dispatchEvent(new Event('powershift_unread_leads_update'));
  
  console.log(`[Powershift Data Link] Dispatched fresh inbound intake token: ${randomId}`);
}

// Helpers for extracting URL and Labels from images
export function getImageUrl(image: any): string {
  if (!image) return "";
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;
  return "";
}

export function getImageLabel(image: any): string {
  if (!image) return "";
  if (typeof image === 'object' && image.label) return image.label;
  return "";
}

// Meetings / Ocular Assessments Synchronizers
export function getSavedMeetings(): MeetingRecord[] {
  const data = localStorage.getItem("powershift_meetings");
  if (!data) {
    const defaultMeetings: MeetingRecord[] = [];
    localStorage.setItem("powershift_meetings", JSON.stringify(defaultMeetings));
    return defaultMeetings;
  }
  try {
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

export function saveMeetings(meetings: MeetingRecord[]) {
  localStorage.setItem("powershift_meetings", JSON.stringify(meetings));
  window.dispatchEvent(new Event('powershift_meetings_update'));
}

export function useSyncMeetings() {
  const [meetings, setMeetings] = useState<MeetingRecord[]>(() => getSavedMeetings());

  useEffect(() => {
    const handleUpdate = () => {
      setMeetings(getSavedMeetings());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('powershift_meetings_update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('powershift_meetings_update', handleUpdate);
    };
  }, []);

  return { meetings, updateMeetings: (newMeetings: MeetingRecord[]) => { saveMeetings(newMeetings); setMeetings(newMeetings); } };
}

// Special Offers / Promos Synchronizers
export function getSavedSpecialOffers(): SpecialOfferRecord[] {
  const data = localStorage.getItem("powershift_special_offers");
  if (!data) {
    const emptyOffers: SpecialOfferRecord[] = [];
    localStorage.setItem("powershift_special_offers", JSON.stringify(emptyOffers));
    return emptyOffers;
  }
  try {
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

export function saveSpecialOffers(offers: SpecialOfferRecord[]) {
  localStorage.setItem("powershift_special_offers", JSON.stringify(offers));
  window.dispatchEvent(new Event('powershift_special_offers_update'));
}

export function useSyncSpecialOffers() {
  const [offers, setOffers] = useState<SpecialOfferRecord[]>(() => getSavedSpecialOffers());

  useEffect(() => {
    const handleUpdate = () => {
      setOffers(getSavedSpecialOffers());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('powershift_special_offers_update', handleUpdate);

    const fetchOffers = () => {
      if (document.visibilityState === 'hidden') {
        // Skip background syncing when tab is in the background to minimize egress and prevent admin race conditions
        return;
      }
      
      const now = Date.now();
      
      // Multi-tab Cache Validation Strategy (Egress prevention):
      // Store the timestamp of the last successful offers fetch in localStorage.
      // If we synced within the last hour (3,600,000 ms), completely skip fetching.
      const lastSyncStr = localStorage.getItem("powershift_offers_last_synced");
      const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;
      if (now - lastSync < 3600000) {
        return;
      }

      // Single-session dynamic guard (max 1 fetch every 5 minutes in memory)
      if (now - lastOffersFetchTime < 300000) {
        return;
      }
      lastOffersFetchTime = now;

      supabaseService.getSpecialOffers()
        .then((remoteOffers) => {
          // Update the last synced timestamp in localStorage so other tabs and future reloads instantly benefit
          localStorage.setItem("powershift_offers_last_synced", String(Date.now()));

          if (remoteOffers !== null && Array.isArray(remoteOffers)) {
            const localOffers = getSavedSpecialOffers();
            if (JSON.stringify(localOffers) !== JSON.stringify(remoteOffers)) {
              saveSpecialOffers(remoteOffers);
              setOffers(remoteOffers);
            }
          }
        })
        .catch((err) => {
          console.log("[Powershift Sync] Failed to load special offers from Supabase (using cached):", err);
        });
    };

    // Initial load from Supabase to catch up (only if stale)
    fetchOffers();

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('powershift_special_offers_update', handleUpdate);
    };
  }, []);

  return { offers, updateOffers: (newOffers: SpecialOfferRecord[]) => { saveSpecialOffers(newOffers); setOffers(newOffers); } };
}

// Social Media Integration Synchronizers
export interface SocialLinks {
  facebook: string;
  instagram: string;
  tiktok: string;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: "https://facebook.com/powershift",
  instagram: "https://instagram.com/powershift",
  tiktok: "https://tiktok.com/@powershift"
};

export function getSavedSocialLinks(): SocialLinks {
  return {
    facebook: localStorage.getItem("powershift_social_facebook") || DEFAULT_SOCIAL_LINKS.facebook,
    instagram: localStorage.getItem("powershift_social_instagram") || DEFAULT_SOCIAL_LINKS.instagram,
    tiktok: localStorage.getItem("powershift_social_tiktok") || DEFAULT_SOCIAL_LINKS.tiktok
  };
}

export function saveSocialLinks(links: SocialLinks) {
  localStorage.setItem("powershift_social_facebook", links.facebook);
  localStorage.setItem("powershift_social_instagram", links.instagram);
  localStorage.setItem("powershift_social_tiktok", links.tiktok);
  window.dispatchEvent(new Event('powershift_social_links_update'));
}

export function useSyncSocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => getSavedSocialLinks());

  useEffect(() => {
    const handleUpdate = () => {
      setSocialLinks(getSavedSocialLinks());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('powershift_social_links_update', handleUpdate);

    // Multi-tab Cache Validation Strategy (Egress prevention):
    // Store the timestamp of the last successful config fetch in localStorage.
    // If we synced within the last hour (3,600,000 ms), completely skip fetching.
    const now = Date.now();
    const lastSyncStr = localStorage.getItem("powershift_social_links_last_synced");
    const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;
    
    const shouldFetch = (now - lastSync >= 3600000) && (now - lastSocialsFetchTime >= 300000);

    if (shouldFetch) {
      lastSocialsFetchTime = now;
      // Initial load from Supabase to catch up
      supabaseService.getSystemConfig()
        .then((configs) => {
          // Update the last synced timestamp in localStorage so other tabs and future reloads instantly benefit
          localStorage.setItem("powershift_social_links_last_synced", String(Date.now()));

          if (configs && configs.length > 0) {
            const fb = configs.find(c => c.key === 'social_facebook')?.value || DEFAULT_SOCIAL_LINKS.facebook;
            const ig = configs.find(c => c.key === 'social_instagram')?.value || DEFAULT_SOCIAL_LINKS.instagram;
            const tt = configs.find(c => c.key === 'social_tiktok')?.value || DEFAULT_SOCIAL_LINKS.tiktok;
            
            saveSocialLinks({ facebook: fb, instagram: ig, tiktok: tt });
          }
        })
        .catch((err) => {
          console.log("[Powershift Sync] Failed to load social links from Supabase (using cached/default):", err);
        });
    }

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('powershift_social_links_update', handleUpdate);
    };
  }, []);

  return socialLinks;
}

