import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpecialOffersGallery from './SpecialOffersGallery';
import {
  ArrowRight,
  MapPin,
  Briefcase,
  Layers,
  Sparkles,
  Zap,
  Filter,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useSyncDb, idToNumber, getImageUrl } from '../sync';

interface PortfolioPageProps {
  onStartConsultation: () => void;
  onSelectService: (serviceId: number) => void;
  onSelectProject: (projectId: number) => void;
  onExploreServices?: () => void;
}

interface Project {
  id: number;
  name: string;
  segment: 'Residential' | 'Commercial' | 'Industrial';
  capacity: 'Under 10kW' | '10kW - 100kW' | '100kW+ Arrays';
  sector: string;
  location: string;
  image: string;
  serviceId: number;
  specs: string;
  hideSegment?: boolean;
  clientName?: string;
  date?: string;
  createdAt: number;
}

export default function PortfolioPage({ onStartConsultation, onSelectService, onSelectProject, onExploreServices }: PortfolioPageProps) {
  const [segmentFilter, setSegmentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset pagination to page 1 whenever filters or search query change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [segmentFilter, sortBy, searchQuery]);

  const { db } = useSyncDb();

  // Dynamic products mapped to PortfolioItem structures
  const projects: Project[] = useMemo(() => {
    return (db.portfolio || []).map((proj, index) => {
      let segment: 'Residential' | 'Commercial' | 'Industrial' = 'Residential';
      const lowerSeg = (proj.segment || '').toLowerCase();
      if (lowerSeg.includes('indus')) {
        segment = 'Industrial';
      } else if (lowerSeg.includes('commer')) {
        segment = 'Commercial';
      } else {
        segment = 'Residential';
      }

      let capacityCat: 'Under 10kW' | '10kW - 100kW' | '100kW+ Arrays' = 'Under 10kW';
      const capVal = parseFloat(proj.capacity || '0');
      if (capVal >= 100) {
        capacityCat = '100kW+ Arrays';
      } else if (capVal >= 10) {
        capacityCat = '10kW - 100kW';
      }

      let specs = proj.capacity + ' Output PV Array, fully integrated.';
      if (proj.description) {
        try {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = proj.description;
          const text = tempDiv.textContent || '';
          if (text) {
            specs = text.split('\n').map(s => s.trim()).filter(Boolean).join(', ');
          }
        } catch (e) {
          console.error(e);
        }
      }

      const parts = proj.name.split('/');
      const title = parts[0].trim();
      const sector = parts[1] ? parts[1].trim() : (proj.segment + ' Array');

      const locationParts = title.split('Solar');
      const loc = locationParts[0]?.trim() || 'Luzon, PH';

      const hideSegment = proj.hide_segment === 'Hide Segment';

      return {
        id: idToNumber(proj.id),
        name: title,
        segment,
        capacity: capacityCat,
        sector: sector,
        location: proj.location || loc,
        image: proj.images && proj.images.length > 0 ? getImageUrl(proj.images[0]) : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        serviceId: segment === 'Residential' ? 1 : segment === 'Commercial' ? 3 : 4,
        specs: specs.slice(0, 150),
        hideSegment,
        clientName: proj.client_name || title,
        date: proj.date,
        createdAt: proj.created_at ? (typeof proj.created_at === 'number' ? proj.created_at : new Date(proj.created_at).getTime()) : (1000000000 - index)
      };
    });
  }, [db.portfolio]);

  // Filtering & Sorting Logic
  const filteredProjects = useMemo(() => {
    let result = projects.filter((project) => {
      const matchesSegment = segmentFilter === 'All' || project.segment === segmentFilter;
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.specs.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSegment && matchesSearch;
    });

    if (sortBy === 'latest') {
      result = [...result].sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'A-Z') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Z-A') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [projects, segmentFilter, searchQuery, sortBy]);

  // Pagination Calculations
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    const element = document.getElementById('portfolio-grid-start');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-24 animate-fade-in">
        {/* Full-width premium background displaying integrated tracking arrays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80"
            alt="Powershift Solar high-yield commercial trackers in development"
            className="w-full h-full object-cover object-center opacity-45 scale-102 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-left"
          >
            <span className="inline-flex items-center gap-2 text-solar-yellow-400 text-xs font-mono font-black tracking-widest uppercase mb-6 select-none">
              <Zap className="w-3.5 h-3.5 fill-solar-yellow-400 text-solar-yellow-400 shrink-0" />
              <span>BLUEPRINT EXECUTION HISTORY</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6 uppercase">
              ACTIVE PROJECTS
            </h1>
            <p className="text-stone-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-xl md:max-w-3xl">
              Explore our blueprint execution history. Real-world solar engineering projects tracking verified utility savings and long-term carbon offsets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. FILTER CONTROLS & DESCRIPTION */}
      <section id="portfolio-grid-start" className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Elongated Filter Interface with Search, Segment and Capacity (50% / 25% / 25%) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-12 items-end">
            
            {/* 50% search bar */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Search Projects
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, location, specs, or sector..."
                  className="w-full bg-stone-50 border border-stone-200 hover:border-forest-700 text-stone-850 pl-10 pr-4 py-2.5 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-forest-900 focus:bg-white transition-all placeholder:text-stone-400 placeholder:font-normal"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 25% selector dropdown: Segment */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Filter by Segment
              </label>
              <div className="relative">
                <select
                  value={segmentFilter}
                  onChange={(e) => setSegmentFilter(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 hover:border-forest-700 text-stone-850 px-3 py-2.5 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-forest-900 transition-all cursor-pointer appearance-none"
                >
                  <option value="All">All Segments</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 25% selector dropdown: Sort By Alphabetical */}
            <div className="space-y-1.5 md:col-span-1">
              <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 hover:border-forest-700 text-stone-850 px-3 py-2.5 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-forest-900 transition-all cursor-pointer appearance-none"
                >
                  <option value="latest">Latest</option>
                  <option value="A-Z">Alphabetical: A to Z</option>
                  <option value="Z-A">Alphabetical: Z to A</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>

          {/* PROJECT SHOWCASE GRID (Precise 2-Column Desktop Grid, 4 Rows) */}
          {filteredProjects.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <Zap className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="font-display font-black text-xl text-stone-400 mb-2">No Matching Assets Found</h3>
              <p className="text-stone-400 text-sm font-light max-w-md mx-auto">
                No active installations correspond exactly to your filter selection. Try adjusting the filters or search terms.
              </p>
              <button
                onClick={() => { setSegmentFilter('All'); setSortBy('latest'); setSearchQuery(''); }}
                className="mt-6 px-4 py-2 border border-stone-300 font-mono text-xs font-bold text-forest-950 rounded-xl hover:bg-stone-50 uppercase tracking-widest cursor-pointer"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <AnimatePresence mode="popLayout">
                  {displayedProjects.map((project) => (
                    <motion.div
                      layout
                      key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                    onClick={() => onSelectProject(project.id)}
                  >
                    
                    {/* Top Half: Large, crisp image placeholder card slot with fixed aspect ratio */}
                    <div className="relative h-64 sm:h-72 lg:h-[320px] overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={project.image}
                        alt={`Powershift ${project.name} Solar asset`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" />
                    </div>

                    {/* Bottom Half: Crisp white flat graphic container */}
                    <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white relative">
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-500 text-xs font-mono uppercase tracking-wide">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-solar-yellow-600" />
                            <span>{project.location}</span>
                          </span>
                          <span className="text-stone-300">•</span>
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5 text-solar-yellow-600" />
                            <span>{project.segment}</span>
                          </span>
                        </div>
                        
                        <h3 className="font-display font-black text-xl sm:text-2xl text-forest-950 tracking-tight leading-snug">
                          {project.name}
                        </h3>
                      </div>

                    </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Dynamic Design-Aligned Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 pt-6">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-forest-950 hover:border-forest-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-stone-600 disabled:hover:border-stone-200 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95 disabled:active:scale-100"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                        currentPage === pageNum
                          ? 'bg-forest-950 text-white border border-forest-950'
                          : 'bg-white text-stone-600 border border-stone-200 hover:text-forest-950 hover:border-forest-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-forest-950 hover:border-forest-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-stone-600 disabled:hover:border-stone-200 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95 disabled:active:scale-100"
                    title="Next Page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
      <SpecialOffersGallery />

      {/* 4. BOTTOM CLOSING CTA SECTION (Layout: Minimalist Full-Width Block) */}
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
