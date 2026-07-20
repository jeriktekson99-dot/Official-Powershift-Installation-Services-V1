import { createClient } from '@supabase/supabase-js';
import { SyncDb, ProjectRecord, ProductRecord, PackageRecord, LeadRecord, MeetingRecord, SpecialOfferRecord } from '../sync.ts';

// Get Supabase environment variables from import.meta.env (Vite standard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Robust database integration helpers to synchronise with Supabase.
 * These functions allow you to easily query and write to Supabase tables.
 */
export const supabaseService = {
  /**
   * Fetch all portfolio items from Supabase
   */
  async getPortfolio(): Promise<ProjectRecord[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio')
        .select('id, name, segment, capacity, cost, status, date, description, images, client_name, location, hide_segment, roi_savings, case_study_overview, technical_framework, panel_specs, inverter_type, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching portfolio from Supabase:', error.message);
        throw error;
      }

      return data as ProjectRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching portfolio from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Fetch all products from Supabase
   */
  async getProducts(): Promise<ProductRecord[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, stock, price, status, location, description, images, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching products from Supabase:', error.message);
        throw error;
      }

      return data as ProductRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching products from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Fetch all packages from Supabase
   */
  async getPackages(): Promise<PackageRecord[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('id, name, tier, capacity, ribbon, on_grid_price, hybrid_price, status')
        .order('created_at', { ascending: true });

      if (error) {
        console.log('Error fetching packages from Supabase:', error.message);
        throw error;
      }

      // Map database snake_case keys back to camelCase for the frontend if necessary
      return (data || []).map((pkg: any) => ({
        id: pkg.id,
        name: pkg.name,
        tier: pkg.tier,
        capacity: pkg.capacity,
        ribbon: pkg.ribbon,
        onGridPrice: pkg.on_grid_price,
        hybridPrice: pkg.hybrid_price,
        status: pkg.status,
      })) as PackageRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching packages from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Fetch all leads from Supabase (Only works if user is authenticated/admin)
   */
  async getLeads(): Promise<LeadRecord[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('id, name, contact, service, consumption, status, region, date, description, images, property_type')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Error fetching leads from Supabase:', error.message);
        throw error;
      }

      return (data || []).map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        contact: lead.contact,
        service: lead.service,
        consumption: lead.consumption,
        status: lead.status,
        region: lead.region,
        date: lead.date,
        description: lead.description,
        images: lead.images,
        propertyType: lead.property_type,
      })) as LeadRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching leads from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Submit a new lead to Supabase (Can be called by anyone - public access policy)
   */
  async submitLead(payload: {
    id?: string;
    name: string;
    contact: string;
    service: string;
    consumption: string;
    region: string;
    date: string;
    description?: string;
    images?: any[];
    propertyType?: string;
  }): Promise<LeadRecord> {
    const token = Math.floor(100 + Math.random() * 900);
    const id = payload.id || `LEAD-206-${token}`;

    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          {
            id,
            name: payload.name,
            contact: payload.contact,
            service: payload.service,
            consumption: payload.consumption,
            status: 'New',
            region: payload.region,
            date: payload.date,
            description: payload.description || '',
            images: payload.images || [],
            property_type: payload.propertyType || 'Residential',
          }
        ]);

      if (error) {
        console.log('Error inserting lead to Supabase:', error.message);
        throw error;
      }
    } catch (err: any) {
      console.log('Network or configuration error inserting lead to Supabase:', err.message || err);
      throw err;
    }

    return {
      id,
      name: payload.name,
      contact: payload.contact,
      service: payload.service,
      consumption: payload.consumption,
      status: 'New',
      region: payload.region,
      date: payload.date,
      description: payload.description || '',
      images: payload.images || [],
      propertyType: payload.propertyType || 'Residential',
    };
  },

  /**
   * Fetch all scheduled meetings from Supabase (Requires authenticated/admin access)
   */
  async getMeetings(): Promise<MeetingRecord[]> {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('id, client_name, date, time, type, personnel, location, notes, status, title')
        .order('date', { ascending: true });

      if (error) {
        console.log('Error fetching meetings from Supabase:', error.message);
        throw error;
      }

      return (data || []).map((meet: any) => ({
        id: meet.id,
        clientName: meet.client_name,
        date: meet.date,
        time: meet.time,
        type: meet.type,
        personnel: meet.personnel,
        location: meet.location,
        notes: meet.notes,
        status: meet.status,
      })) as MeetingRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching meetings from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Submit a new meeting to Supabase (Can be called by anyone - public access policy)
   */
  async submitMeeting(payload: {
    id: string;
    clientName: string;
    date: string;
    time: string;
    type: string;
    personnel: string;
    location: string;
    notes?: string;
    status: string;
  }): Promise<MeetingRecord> {
    try {
      const { error } = await supabase
        .from('meetings')
        .insert([
          {
            id: payload.id,
            client_name: payload.clientName,
            date: payload.date,
            time: payload.time,
            type: payload.type,
            personnel: payload.personnel,
            location: payload.location,
            notes: payload.notes || '',
            status: payload.status,
          }
        ]);

      if (error) {
        console.log('Error inserting meeting to Supabase:', error.message);
        throw error;
      }
    } catch (err: any) {
      console.log('Network or configuration error inserting meeting to Supabase:', err.message || err);
      throw err;
    }

    return payload as MeetingRecord;
  },

  /**
   * Fetch all active special offers / promo flyers from Supabase (Public read access)
   */
  async getSpecialOffers(): Promise<SpecialOfferRecord[]> {
    try {
      const { data, error } = await supabase
        .from('special_offers')
        .select('id, image, timestamp')
        .order('timestamp', { ascending: false });

      if (error) {
        console.log('Error fetching special offers from Supabase:', error.message);
        throw error;
      }

      return data as SpecialOfferRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching special offers from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Fetch all system configuration parameters from Supabase
   */
  async getSystemConfig(): Promise<{ key: string; value: string }[]> {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('key, value');

      if (error) {
        console.log('Error fetching system_config from Supabase:', error.message);
        throw error;
      }

      return data as { key: string; value: string }[];
    } catch (err: any) {
      console.log('Network or configuration error fetching system_config from Supabase:', err.message || err);
      throw err;
    }
  }
};
