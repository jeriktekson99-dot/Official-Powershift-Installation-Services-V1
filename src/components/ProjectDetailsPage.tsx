import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpecialOffersGallery from './SpecialOffersGallery';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  Mail,
  Phone,
  HardHat,
  CheckCircle,
  Clock,
  ShieldCheck,
  UserCheck,
  Building2,
  TrendingUp,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useSyncDb, idToNumber, getImageUrl } from '../sync';
import MultiPageQuoteForm from './MultiPageQuoteForm';

interface ProjectDetailsPageProps {
  projectId: number;
  onBack: () => void;
  onStartConsultation: () => void;
  onExploreServices?: () => void;
}

interface StaffMember {
  name: string;
  role: string;
}

interface ProjectData {
  id: number;
  name: string;
  client: string;
  segment: string;
  sector: string;
  location: string;
  systemSize: string;
  savings: string;
  challenge: string;
  solution: string;
  image: string;
  thumbnails: string[];
  moduleCount: number;
  co2Offset: string;
  status: string;
  payback: string;
  personnel: StaffMember[];
  hideSegment?: boolean;
  caseStudyOverview?: string;
  technicalFramework?: string;
  panelSpecs: string;
  inverterType: string;
}

export default function ProjectDetailsPage({ projectId, onBack, onStartConsultation, onExploreServices }: ProjectDetailsPageProps) {
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState<number>(0);
  const thumbScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbScrollRef.current) {
      const scrollAmount = 240;
      thumbScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 8 projects data matching Portfolio selection exactly with staff members
  const projectsData: Record<number, ProjectData> = {
    1: {
      id: 1,
      name: '150kW Industrial Rooftop Array Deployment',
      client: 'Apex Manufacturing, Inc.',
      segment: 'Commercial & Industrial',
      sector: 'Factory Infrastructure',
      location: 'Imus, Cavite',
      systemSize: '150kW Total Capacity',
      savings: '40% Monthly Bill Reduction',
      challenge: 'Apex Manufacturing was confronting skyrocketing grid tariffs and severe peak-demand charges during peak daylight manufacturing cycles. The plant’s enormous overhead was directly threatening operating margins, making long-term cost forecasting highly volatile and unsustainable.',
      solution: 'Powershift Solar deployed a state-of-the-art 150kW high-capacity grid-synchronized solar system. We installed 395 premium Tier-1 monocrystalline panels with extreme degradation resilience. The electrical network is driven by 3 industrial-grade high-voltage string inverters. For maximum wind-load resilience in typhoon-prone Cavite, our engineers anchored a zero-penetration self-ballasted aluminum framing structure certified lists up to 250 kph wind fields.',
      image: 'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg',
      thumbnails: [
        'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg',
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 395,
      co2Offset: '145 Tons / Year',
      status: 'Fully Operational & Certified',
      payback: '3.8 Years Estimated',
      personnel: [
        { name: 'Jaime Cruz', role: 'Master Electrician' }
      ],
      panelSpecs: '395x 380W Tier-1 Mono PV Modules',
      inverterType: '3x High-Voltage Commercial String Inverters'
    },
    2: {
      id: 2,
      name: '25kW Smart Estate Microgrid Integration',
      client: 'Monte Vista Villas Association',
      segment: 'Residential Solar',
      sector: 'Luxury Residential',
      location: 'Tagaytay, Cavite',
      systemSize: '25kW Microgrid System',
      savings: '85% Grid Utility Savings',
      challenge: 'The Monte Vista residential estate was plagued by unstable overhead power line connections along the Tagaytay Ridge, leading to frequent voltage drops and regular blackouts. The homeowners required an aesthetically elegant clean backup setup that could function independently during prolonged utility grid outages.',
      solution: 'We engineered a seamless 25kW Smart Estate Microgrid. This high-density system combines premium ultra-black monocrystalline cells with micro-inverter power optimizers beneath each module to maximize output during misty mountain days. The system integrates a synchronized high-voltage lithium chemical battery bank that triggers backup power instantly with 0ms transfer lag—eliminating loud, toxic diesel generator dependency.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 64,
      co2Offset: '24 Tons / Year',
      status: 'Fully Active & Commissioned',
      payback: '4.5 Years Estimated',
      personnel: [
        { name: 'Mateo Alcantara', role: 'Lead Microgrid Specialist' },
        { name: 'Dr. Helen Sison', role: 'Battery Solutions Architect' },
        { name: 'Jose Reyes', role: 'Powerwall Specialist' }
      ],
      panelSpecs: '64x 390W Ultra-Black Monocrystalline Modules',
      inverterType: 'Enphase IQ8 Micro-inverter Network'
    },
    3: {
      id: 3,
      name: '80kW Commercial Cold Storage Gird Installation',
      client: 'Southern Luzon Cold-Chain Logistics',
      segment: 'Commercial & Industrial',
      sector: 'Agricultural Supply Chain',
      location: 'Lucena City, Quezon',
      systemSize: '80kW Commercial Array',
      savings: '45% Monthly Demand Reduction',
      challenge: 'Southern Luzon Logistics operates an enormous refrigeration warehouse to stabilize local fresh agricultural supplies. Their chillers generate massive, continuous power consumption, and peak mid-day grid pricing was causing severe operational cost shocks during critical summer operations.',
      solution: 'Powershift designed a customized 80kW roof microgrid. Due to food standard requirements, zero-penetration ballasted clamping rails were selected to guard roof integrity. This system includes active solar tracking parameters, high-voltage isolators, and an intelligent peak-shaving program that dynamically drops grid consumption whenever ambient temperatures peak outside.',
      image: 'https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=800&q=80',
        'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg',
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 210,
      co2Offset: '78 Tons / Year',
      status: 'Fully Operational & Certified',
      payback: '3.6 Years Estimated',
      personnel: [
        { name: 'Engr. David Lim', role: 'Thermal/PV Synchronizer' },
        { name: 'Arthur Pendelton', role: 'Commercial Project Manager' },
        { name: 'George Lucas', role: 'Lead Electrical Inspector' }
      ],
      panelSpecs: '210x 380W Tier-1 Mono PV Modules',
      inverterType: '80kW Intelligent String Inverters'
    },
    4: {
      id: 4,
      name: '12kW Net-Metered Eco-Home System',
      client: 'Rivera Green Sanctuary Residence',
      segment: 'Residential Solar',
      sector: 'Modern Residential',
      location: 'Tayabas, Quezon',
      systemSize: '12kW Net-Metered System',
      savings: '100% Daylight Offset & Credits',
      challenge: 'The Rivera family decided to transition their architectural modern home into a model of active municipal sustainability. They wanted to capture Tayabas’ high daylight irradiance, completely offset their home cooling power costs, and sell excess solar energy directly back to the grid.',
      solution: 'We installed a beautiful, symmetrical 12kW Net-Metered array. Utilizing PID-free architectural-grade all-black monocrystalline modules that flush-mount flush with the roofline. Integrated with micro-inverters for safe low-voltage operation and rapid automatic utility shutdown switches conforming to strict municipal safety guidelines. A smart bi-directional net meter translates real-time surplus into substantial financial energy credits.',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 32,
      co2Offset: '11 Tons / Year',
      status: 'Net-Meter Synchronized & Active',
      payback: '4.8 Years Estimated',
      personnel: [
        { name: 'Engr. Luis Fernandez', role: 'Grid Interconnection Lead' },
        { name: 'Jaime Cruz', role: 'Master Electrician' }
      ],
      panelSpecs: '32x 375W Symmetrical All-Black Modules',
      inverterType: 'Symmetrical Micro-inverters with Net-Metering Node'
    },
    5: {
      id: 5,
      name: '200kW Warehouse Net-Metering Deployment',
      client: 'Pacific Logistics Hub Depot',
      segment: 'Commercial & Industrial',
      sector: 'Logistics Infrastructure',
      location: 'Batangas Port, Batangas',
      systemSize: '200kW Roof Array System',
      savings: 'P280,000 Average Saved / Mo',
      challenge: 'Pacific Logistics Hub operates a massive transit terminal immediately beside the Batangas coastal shipping zone. Their enormous structural roof workspace was entirely empty and unutilized, while rising commercial daylight HVAC and logistics power rates were cutting deeply into narrow freight storage margins.',
      solution: 'Powershift installed a heavy-duty 200kW Net-Metered power array. Built with anti-soiling, coastal marine-grade materials to prevent saltwater corrosion. This array includes intelligent grid synchronizers, high-voltage surge blocks, and active utility dispatch switches. The system exports huge volumes of daylight energy back to the local grid, generating massive financial credits that reduce night lighting costs to almost zero.',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg',
        'https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 520,
      co2Offset: '195 Tons / Year',
      status: 'Fully Operational & Certified',
      payback: '3.4 Years Estimated',
      personnel: [
        { name: 'Carlos Mendoza', role: 'Lead Systems Architect' },
        { name: 'Diana Prince', role: 'Logistics Coordinator' }
      ],
      panelSpecs: '520x 385W Anti-Soiling Marine Modules',
      inverterType: 'High-voltage Grid-Tied Synchronizers'
    },
    6: {
      id: 6,
      name: 'Hybrid Battery Storage Backup System (BESS)',
      client: 'CoreTech Solutions Head Office',
      segment: 'Utility-Scale Batteries',
      sector: 'Critical Corporate Facility',
      location: 'Metro Manila',
      systemSize: '120kW Array / 240kWh Storage',
      savings: 'Absolute Zero-Downtime Guarantee',
      challenge: 'As a global data center operator, CoreTech was susceptible to sudden electrical grid outages and voltage fluctuations in main Metro Manila lines. A power loss of even 5 seconds would trigger severe operational data drop penalties. Their mechanical diesel backup was expensive, slow, and dirty.',
      solution: 'We deployed a massive Hybrid Battery Energy Storage System (BESS). Combining a 120kW rooftop solar array with an advanced, liquid-cooled 240kWh LiFePO4 battery rack layout. Managed by an intelligent BMS computer, the facility has a zero-latency fast-acting switch that shifts the load to battery power in 0ms during grid dropouts, keeping global server lines entirely undisturbed.',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=600&q=80',
        'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 312,
      co2Offset: '65 Tons / Year',
      status: 'Fully Operational & Active',
      payback: '4.2 Years Estimated',
      personnel: [
        { name: 'Dr. Helen Sison', role: 'Lead Battery Scientist' },
        { name: 'Miguel Cabrera', role: 'BESS Grid Synchronizer' },
        { name: 'Robert Chen', role: 'Automation Systems Developer' }
      ],
      panelSpecs: '312x 385W Monocrystalline Modules',
      inverterType: '120kW Hybrid Smart Inverter BMS'
    },
    7: {
      id: 7,
      name: '45kW Agri-Solar Irrigation Network',
      client: 'Grains of Hope Agricultural Co-op',
      segment: 'Commercial & Industrial',
      sector: 'Sustainable Farming',
      location: 'Central Luzon Plains',
      systemSize: '45kW Ground-Mounted Array',
      savings: '100% Diesel Fuel Displacement',
      challenge: 'Grains of Hope cooperative represents 120 family-owned rice and grain farms that depend on deep-well pump systems for continuous water irrigation. Operating pump motors was entirely dependent on soaring diesel fuel supplies, consuming up to 60% of small farms’ monthly earnings.',
      solution: 'Powershift built a rugged 45kW Agri-Solar Ground Array. Built on heavy hot-dip galvanized steel ground piles raised above regional pooling lines. The array integrates direct water-pump variable frequency converters that match solar power generation with pump speeds—driving massive deep-well water flows directly from morning light with zero diesel usage.',
      image: 'https://www.dfopoultry.com/wp-content/uploads/20230425075057.jpg',
      thumbnails: [
        'https://www.dfopoultry.com/wp-content/uploads/20230425075057.jpg',
        'https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg',
        'https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 120,
      co2Offset: '44 Tons / Year',
      status: 'Fully Active & Commissioned',
      payback: '3.1 Years Estimated',
      personnel: [
        { name: 'Juan dela Cruz', role: 'Agricultural Solar Specialist' },
        { name: 'Engr. Clara Reyes', role: 'Hydraulics Coordinator' },
        { name: 'Danilo Santos', role: 'Community Field Foreman' }
      ],
      panelSpecs: '120x 375W Ground-Mounted Solar Modules',
      inverterType: 'Direct Pump Variable Frequency Converters'
    },
    8: {
      id: 8,
      name: '15kW High-Yield Residential Roof Array',
      client: 'Bernardo Residence Smart Estate',
      segment: 'Residential Solar',
      sector: 'Urban Smart Home',
      location: 'Quezon City, Metro Manila',
      systemSize: '15kW Residential Array',
      savings: '90% Peak Aircon Bill Reduction',
      challenge: 'The Bernardo residence, a three-story urban block home, struggled with massive mid-day utility bills. Running high-consumption dual inverter thermal air conditioners to offset the urban heat dome effect was putting their household energy expenses into the highest possible billing premium rate brackets.',
      solution: 'We engineered a compact, ultra-efficient 15kW residential roof microgrid. Utilizing specialized multi-busbar solar chips which significantly outperform standard residential models under indirect shade and city particulate dust. Integrated with intelligent optimization units under every solar tile, allowing the homeowners to track individual cell generation through their smart home tablets.',
      image: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80',
      thumbnails: [
        'https://images.unsplash.com/photo-1592833159155-c62df1b65534?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80',
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=550&q=80',
        'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=600&q=80'
      ],
      moduleCount: 40,
      co2Offset: '14 Tons / Year',
      status: 'Fully Active & Commissioned',
      payback: '4.6 Years Estimated',
      personnel: [
        { name: 'Arthur Pendelton', role: 'Project Coordinator' },
        { name: 'Jaime Cruz', role: 'Master Electrician' }
      ],
      panelSpecs: '40x 375W Multi-busbar Solar Modules',
      inverterType: 'Under-tile Smart Micro-optimization Units'
    }
  };

  const staticProject = projectsData[projectId] || projectsData[1];
  const { db } = useSyncDb();

  const project: ProjectData = useMemo(() => {
    const foundProj = (db.portfolio || []).find(p => p && idToNumber(p.id) === projectId);
    if (!foundProj) {
      return staticProject;
    }

    const parts = (foundProj.name || "").split('/');
    const title = (parts[0] || "").trim();
    const client = foundProj.client_name ? foundProj.client_name.trim() : (title.split(' ').slice(0, 3).join(' ') + ' Solar Segment');
    
    let challenge = "";
    let solution = "";
    if (foundProj.description) {
      try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = foundProj.description;
        const pElements = tempDiv.getElementsByTagName('p');
        if (pElements.length > 0) {
          solution = pElements[0].textContent || solution;
        }
        const strongElements = tempDiv.getElementsByTagName('strong');
        if (strongElements.length > 0) {
          challenge = `Integration challenges resolving power stability using ${strongElements[0].textContent || 'premium inverter hardware'}.`;
        }
      } catch (e) {
        console.error(e);
      }
    }

    const hideSegment = foundProj.hide_segment === 'Hide Segment';

    let segVal = 'Residential';
    const lowerSeg = (foundProj.segment || '').toLowerCase();
    if (lowerSeg.includes('indus')) {
      segVal = 'Industrial';
    } else if (lowerSeg.includes('commer')) {
      segVal = 'Commercial';
    } else {
      segVal = 'Residential';
    }
    const isCommercialOrIndustrial = segVal === 'Industrial' || segVal === 'Commercial';
    const computedModCount = Math.round(parseFloat(foundProj.capacity || '10') * 2.5) || 24;

    return {
      id: projectId,
      name: title,
      client: client,
      segment: segVal,
      sector: parts[1] ? parts[1].trim() : (foundProj.segment + ' Installation'),
      location: foundProj.location ? foundProj.location.trim() : (title.split('Solar')[0]?.trim() || 'Luzon, PH'),
      systemSize: foundProj.capacity || '10 kW',
      savings: foundProj.roi_savings ? foundProj.roi_savings.trim() : (isCommercialOrIndustrial ? '₱120k/month' : '85% Reduction'),
      challenge: challenge,
      solution: solution,
      image: foundProj.images && foundProj.images.length > 0 ? getImageUrl(foundProj.images[0]) : staticProject.image,
      thumbnails: foundProj.images && foundProj.images.length > 0 ? foundProj.images.map(getImageUrl) : staticProject.thumbnails,
      moduleCount: computedModCount,
      co2Offset: `${Math.round(parseFloat(foundProj.capacity || '10') * 1.2)} Tons/Yr`,
      status: foundProj.status === 'COMPLETED' ? 'Fully Active & Commissioned' : foundProj.status === 'IN PROGRESS' ? 'Under active commissioning' : 'Maintenance Status',
      payback: isCommercialOrIndustrial ? '3.8 Years' : '4.5 Years',
      personnel: staticProject.personnel || [],
      hideSegment,
      caseStudyOverview: foundProj.description,
      technicalFramework: foundProj.technical_framework,
      panelSpecs: foundProj.panel_specs ? foundProj.panel_specs.trim() : `${computedModCount}x Tier-1 Monocrystalline Solar Modules`,
      inverterType: foundProj.inverter_type ? foundProj.inverter_type.trim() : (isCommercialOrIndustrial ? 'Commercial Intelligent Multi-MPPT String Inverters' : 'Premium Hybrid Smart Inverters')
    };
  }, [db.portfolio, projectId, staticProject]);

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen">
      


      {/* 1. TITLE SECTION (Font size 40px, no hero image background) */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
          <span className="inline-flex items-center gap-2 text-forest-750 text-xs font-mono font-black tracking-widest uppercase mb-4 select-none">
            <Zap className="w-3.5 h-3.5 fill-forest-750 text-forest-750 shrink-0" />
            <span>CRAFTED SYSTEM CASE STUDY</span>
          </span>
          <h1 className="font-display text-[40px] font-black text-forest-950 tracking-tight leading-tight uppercase">
            {project.name}
          </h1>
        </div>
      </div>

      {/* 2. PROJECT METADATA GRID (3x2 Layout: 3 Columns, 2 Rows on Large Screens) */}
      <div className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-8">
            
            {/* Block 1: Client Name */}
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 text-forest-750" />
              </div>
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                  CLIENT NAME
                </span>
                <span className="text-forest-950 font-display font-black text-base sm:text-lg leading-tight truncate">
                  {project.client}
                </span>
              </div>
            </div>

            {/* Block 2: Geographic Location */}
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-forest-750" />
              </div>
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                  GEOGRAPHIC LOCATION
                </span>
                <span className="text-forest-950 font-display font-black text-base sm:text-lg leading-tight">
                  {project.location}
                </span>
              </div>
            </div>

            {/* Block 3: Sector / Segment */}
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-forest-750" />
              </div>
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                  SECTOR / SEGMENT
                </span>
                <span className="text-forest-950 font-display font-black text-base sm:text-lg leading-tight truncate">
                  {project.segment}
                </span>
              </div>
            </div>

            {/* Block 4: Panel Specs */}
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-forest-750" />
              </div>
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                  PANEL SPECS
                </span>
                <span className="text-forest-950 font-display font-black text-base sm:text-lg leading-tight">
                  {project.panelSpecs}
                </span>
              </div>
            </div>

            {/* Block 5: Inverter Type */}
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-forest-750" />
              </div>
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                  INVERTER TYPE
                </span>
                <span className="text-forest-950 font-display font-black text-base sm:text-lg leading-tight">
                  {project.inverterType}
                </span>
              </div>
            </div>

            {/* Block 6: ROI & Yield Targets */}
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-forest-750" />
              </div>
              <div className="flex flex-col space-y-1 min-w-0">
                <span className="text-[10px] font-mono font-black text-stone-400 uppercase tracking-widest block">
                  ROI & YIELD TARGETS
                </span>
                <span className="text-solar-yellow-600 font-display font-black text-base sm:text-lg leading-tight">
                  {project.savings}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT LAYOUT (Display Images aligned, to show details below) */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Image Showcase at top, followed by Case Study & Technical Framework details below */}
            <div className="lg:col-span-8 space-y-12 text-left">
              
              {/* Image Showcase */}
              <div className="space-y-4">
                {/* Large Display Image */}
                <div 
                  className="relative w-full max-w-[940px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm aspect-[940/788]"
                  style={{ aspectRatio: "940 / 788" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeThumbnailIndex}
                      src={project.thumbnails[activeThumbnailIndex]}
                      alt="Completed clean solar projects detailed angle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-forest-950/5 pointer-events-none" />
                </div>

                {/* Thumbnail Slider Sequence */}
                {project.thumbnails.length <= 4 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {project.thumbnails.map((thumbUrl, tIdx) => (
                      <button
                        key={tIdx}
                        onClick={() => setActiveThumbnailIndex(tIdx)}
                        className={`relative rounded-lg overflow-hidden aspect-[4/3] border transition-all cursor-pointer shadow-xs ${
                          activeThumbnailIndex === tIdx
                            ? 'border-solar-yellow-500 ring-2 ring-solar-yellow-500/15 scale-[1.01]'
                            : 'border-stone-200 opacity-75 hover:opacity-100 hover:scale-[1.01]'
                        }`}
                      >
                        <img
                          src={thumbUrl}
                          alt={`Alternate angle view thumbnail slot ${tIdx + 1}`}
                          className="w-full h-full object-cover object-center"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-forest-950/5" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative group/thumbs">
                    <div 
                      ref={thumbScrollRef}
                      className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {project.thumbnails.map((thumbUrl, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => setActiveThumbnailIndex(tIdx)}
                          className={`relative rounded-lg overflow-hidden aspect-[4/3] border transition-all cursor-pointer shadow-xs shrink-0 snap-start w-[calc((100%-12px*3)/4)] min-w-[110px] sm:min-w-[140px] ${
                            activeThumbnailIndex === tIdx
                              ? 'border-solar-yellow-500 ring-2 ring-solar-yellow-500/15 scale-[1.01]'
                              : 'border-stone-200 opacity-75 hover:opacity-100 hover:scale-[1.01]'
                          }`}
                        >
                          <img
                            src={thumbUrl}
                            alt={`Alternate angle view thumbnail slot ${tIdx + 1}`}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-forest-950/5" />
                        </button>
                      ))}
                    </div>

                    {/* Light grey arrow buttons (not in a container but a light grey arrow button) */}
                    <button
                      onClick={() => scrollThumbnails('left')}
                      className="absolute left-1 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer z-10 p-1"
                      title="Scroll thumbnails left"
                    >
                      <ChevronLeft className="w-8 h-8 stroke-[3]" />
                    </button>
                    <button
                      onClick={() => scrollThumbnails('right')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500 transition-colors cursor-pointer z-10 p-1"
                      title="Scroll thumbnails right"
                    >
                      <ChevronRight className="w-8 h-8 stroke-[3]" />
                    </button>
                  </div>
                )}
              </div>

              {/* Contact via Channels */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
                <div className="shrink-0 md:h-[42px] flex items-center">
                  <span className="block text-[25px] font-display font-black text-stone-900 tracking-tight leading-none">
                    Contact via:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://wa.me/639354796321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-display font-black text-xs tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <img src="https://img.icons8.com/?size=100&id=ZeQPTbzIF4jw&format=png&color=FFFFFF" alt="WhatsApp" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://m.me/426690707193295"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#0084FF] hover:bg-[#0074e0] text-white font-display font-black text-xs tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <img src="https://img.icons8.com/?size=100&id=4PiUK80MorY7&format=png&color=FFFFFF" alt="Messenger" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                    <span>Messenger</span>
                  </a>
                  <a
                    href="viber://chat?number=09354796321"
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#7309F3] hover:bg-[#6208de] text-white font-display font-black text-xs tracking-wider uppercase transition-all shadow-xs hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/viber-white-icon.png" alt="Viber" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />
                    <span>Viber</span>
                  </a>
                </div>
              </div>

              {/* Project Scope & Details */}
              <div className="space-y-4 pt-4">
                <div className="border-b border-stone-200 pb-4">
                  <h2 className="font-display font-black text-[28px] text-stone-900 tracking-tight leading-tight">
                    Project Scope & Details
                  </h2>
                </div>
                <div className="text-stone-700 text-sm space-y-4 leading-relaxed">
                  {project.caseStudyOverview ? (
                    <div 
                      className="text-stone-600 text-[14px] leading-relaxed rich-text-preview break-all break-words overflow-x-auto font-display" 
                      dangerouslySetInnerHTML={{ __html: project.caseStudyOverview }}
                    />
                  ) : (
                    <p className="text-stone-600 text-[14px] leading-relaxed font-display">
                      Prior to commissioning, the site of <strong className="font-bold text-forest-950">{project.client}</strong> was subjected to extensive electricity metrics evaluation. The analysis revealed that traditional utilities structured rates around heavy tariff bracket multipliers, compounding financial stress whenever operations reached peak cooling cycles.
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Project Personnel & Inquiry Cards (4/12 Columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Project Personnel Info Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm text-left">
                
                {/* Info Card Header */}
                <div className="border-b border-stone-200 pb-3 mb-5">
                  <h3 className="text-sm sm:text-base font-sans font-bold text-[#05300a] tracking-wider uppercase leading-tight">
                    Project Team
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-1 leading-normal">
                    PROJECT PERSONNEL
                  </p>
                </div>

                {/* Team roster content structured exactly like requested */}
                <div className="space-y-4">
                  {project.personnel.map((person, index) => {
                    let affiliation = "Senior PV Systems Specialist, Powershift Engineering";
                    if (person.role.toLowerCase().includes('architect')) {
                      affiliation = "Lead Infrastructure Designer, Powershift Solar";
                    } else if (person.role.toLowerCase().includes('engineer')) {
                      affiliation = "Certified Professional Energy Engineer, Powershift Solar";
                    } else if (person.role.toLowerCase().includes('electrician') || person.role.toLowerCase().includes('specialist')) {
                      affiliation = "Field Operations Lead, Powershift Deployments";
                    }

                    return (
                      <div key={index} className="border-b border-stone-100 pb-4">
                        <span className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                          {person.role}
                        </span>
                        <span className="block text-base font-extrabold text-stone-900 font-sans mt-0.5">
                          {person.name}
                        </span>
                        <span className="block text-xs text-stone-500 font-sans mt-0.5">
                          {affiliation}
                        </span>
                      </div>
                    );
                  })}

                  {/* General Contractor divider & item */}
                  <div className="border-b border-stone-100 pb-4">
                    <span className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                      GENERAL CONTRACTOR
                    </span>
                    <span className="block text-base font-extrabold text-stone-900 font-sans mt-0.5 uppercase">
                      POWERSHIFT SOLAR TEAM
                    </span>
                  </div>

                  {/* Company Email Address divider & item */}
                  <div className="border-b border-stone-100 pb-4">
                    <span className="block text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest">
                      COMPANY EMAIL ADDRESS
                    </span>
                    <a 
                      href="mailto:c2r2gsm@gmail.com" 
                      className="block text-sm font-semibold font-mono text-forest-700 hover:text-solar-yellow-600 transition-colors mt-0.5"
                    >
                      c2r2gsm@gmail.com
                    </a>
                  </div>

                  {/* Descriptive Paragraph at the very bottom */}
                  <div className="pt-1">
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Professional clean energy engineers coordinating structural components, high-voltage electrical safety, local permit compliance, and grid-synchronization plans.
                    </p>
                  </div>
                </div>

              </div>

              {/* Inquiry Form Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm text-left">
                
                {/* Info Card Header */}
                <div className="border-b border-stone-200 pb-3 mb-5">
                  <h3 className="text-sm sm:text-base font-sans font-bold text-[#05300a] tracking-wider uppercase leading-tight">
                    Inquire Service
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-1 leading-normal">
                    SEND US A MESSAGE
                  </p>
                </div>

                {/* Form content */}
                <div className="text-stone-900">
                  <MultiPageQuoteForm theme="light" layout="default" />
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
      <SpecialOffersGallery />

      {/* 5. BOTTOM CLOSING CTA SECTION (Layout: Minimalist Full-Width Block) */}
      <section className="relative bg-forest-950 text-white py-20 sm:py-24 border-t-2 border-[#808000] overflow-hidden">
        {/* Full-width gradient-over-image background resembling hero section */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1600&q=80"
            alt="Ready to Work Together"
            className="w-full h-full object-cover object-center opacity-45 scale-102 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-6">
          <span className="inline-block text-solar-yellow-500 text-xs font-mono font-black tracking-widest uppercase">
            LET'S PARTNER
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            READY TO WORK TOGETHER?
          </h2>
          <p className="max-w-3xl text-stone-300 font-sans text-base sm:text-lg lg:text-xl font-light leading-relaxed">
            Whether it's a home solar installation or complex commercial systems, our team delivers absolute mathematical and electrical precision to your projects.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
            <button
              onClick={onStartConsultation}
              className="group inline-flex items-center gap-3 bg-solar-yellow-500 hover:bg-solar-yellow-400 text-forest-950 px-8 py-4 rounded-xl font-display font-black text-base tracking-wider shadow-lg hover:shadow-solar-yellow-500/20 transition-all duration-300 transform active:scale-95 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-5 h-5 text-forest-950 group-hover:translate-x-1 transition-transform" />
            </button>

            {onExploreServices && (
              <button
                onClick={onExploreServices}
                className="group inline-flex items-center gap-3 bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl font-display font-black text-base tracking-wider transition-all duration-300 transform active:scale-95 w-full sm:w-auto justify-center cursor-pointer"
              >
                <span>EXPLORE OUR SERVICES</span>
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
