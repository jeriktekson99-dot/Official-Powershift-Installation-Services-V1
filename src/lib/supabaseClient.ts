import { createClient } from '@supabase/supabase-js';
import { SyncDb, ProjectRecord, ProductRecord, PackageRecord, LeadRecord, MeetingRecord, SpecialOfferRecord, PhotobucketRecord } from '../sync.ts';

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
        .select('id, client_name, date, time, type, personnel, location, notes, status')
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
  },

  /**
   * Fetch pictures from the photobucket media catalog
   */
  async getPhotobucketPictures(category?: string): Promise<PhotobucketRecord[]> {
    try {
      let query = supabase
        .from('photobucket')
        .select('*')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) {
        console.log('Error fetching photobucket from Supabase:', error.message);
        throw error;
      }

      return (data || []).map((p: any) => ({
        id: p.id,
        fileName: p.file_name,
        fileUrl: p.file_url,
        storagePath: p.storage_path,
        bucketName: p.bucket_name,
        mimeType: p.mime_type,
        fileSizeBytes: p.file_size_bytes,
        width: p.width,
        height: p.height,
        title: p.title,
        caption: p.caption,
        category: p.category,
        entityType: p.entity_type,
        entityId: p.entity_id,
        uploadedBy: p.uploaded_by,
        isPublic: p.is_public,
        metadata: p.metadata,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      })) as PhotobucketRecord[];
    } catch (err: any) {
      console.log('Network or configuration error fetching photobucket from Supabase:', err.message || err);
      throw err;
    }
  },

  /**
   * Register a new admin-uploaded picture into the photobucket catalog
   */
  async registerPhotobucketPicture(record: Partial<PhotobucketRecord> & { fileName: string; fileUrl: string }): Promise<PhotobucketRecord> {
    const id = record.id || `PHOTO-${Date.now()}`;
    const payload = {
      id,
      file_name: record.fileName,
      file_url: record.fileUrl,
      storage_path: record.storagePath || `photobucket/uploads/${record.fileName}`,
      bucket_name: record.bucketName || 'photobucket',
      mime_type: record.mimeType || 'image/jpeg',
      file_size_bytes: record.fileSizeBytes || 0,
      width: record.width || null,
      height: record.height || null,
      title: record.title || record.fileName,
      caption: record.caption || '',
      category: record.category || 'General',
      entity_type: record.entityType || 'general',
      entity_id: record.entityId || null,
      uploaded_by: record.uploadedBy || 'Admin',
      is_public: record.isPublic ?? true,
      metadata: record.metadata || {},
    };

    try {
      const { data, error } = await supabase
        .from('photobucket')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.log('Error inserting picture to photobucket:', error.message);
        throw error;
      }

      return {
        id: data.id,
        fileName: data.file_name,
        fileUrl: data.file_url,
        storagePath: data.storage_path,
        bucketName: data.bucket_name,
        mimeType: data.mime_type,
        fileSizeBytes: data.file_size_bytes,
        width: data.width,
        height: data.height,
        title: data.title,
        caption: data.caption,
        category: data.category,
        entityType: data.entity_type,
        entityId: data.entity_id,
        uploadedBy: data.uploaded_by,
        isPublic: data.is_public,
        metadata: data.metadata,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err: any) {
      console.log('Network or configuration error inserting to photobucket:', err.message || err);
      throw err;
    }
  }
};
