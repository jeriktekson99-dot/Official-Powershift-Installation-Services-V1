import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpecialOffersGallery from './SpecialOffersGallery';
import { useSyncDb, useSyncCategories, idToNumber, getImageUrl } from '../sync';
import { 
  ArrowRight, 
  ArrowLeftCircle, 
  ArrowRightCircle, 
  Check, 
  Sun, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Settings, 
  Wrench, 
  Layers, 
  Inbox, 
  CheckCircle,
  HelpCircle,
  Info,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';


interface ProductsPageProps {
  onStartConsultation: () => void;
  onSelectProduct: (id: number) => void;
  onExploreServices?: () => void;
  selectedCategories?: string[];
  onSelectedCategoriesChange?: (categories: string[]) => void;
}

interface ProductItem {
  id: number;
  name: string;
  category: string;
  classification: string;
  specs: string[];
  imageUrl: string;
  price: string;
  rating: number;
  unitsSold: number;
  numericPrice: number;
  createdAt: number;
}

export default function ProductsPage({ 
  onStartConsultation, 
  onSelectProduct, 
  onExploreServices,
  selectedCategories: propsSelectedCategories,
  onSelectedCategoriesChange: propsOnSelectedCategoriesChange
}: ProductsPageProps) {
  // Page state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  // Selected categories state
  const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>([]);
  const selectedCategories = propsSelectedCategories !== undefined ? propsSelectedCategories : localSelectedCategories;
  const setSelectedCategories = propsOnSelectedCategoriesChange !== undefined ? propsOnSelectedCategoriesChange : setLocalSelectedCategories;

  // Search filter query state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting state: latest, A-Z, Z-A
  const [sortBy, setSortBy] = useState<string>('latest');

  const handleSelectProduct = (id: number) => {
    onSelectProduct(id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    const element = document.getElementById('products-grid-start');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // No active inquiry form states needed

  const { db } = useSyncDb();
  const { categories } = useSyncCategories();

  // Dynamically map admin database products to frontend ProductItem structures
  const products: ProductItem[] = useMemo(() => {
    return (db.products || []).map((p, index) => {
      let specs: string[] = ["Availability: " + p.status, "Location: " + p.location, "In Stock: " + p.stock];
      if (p.description) {
        try {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = p.description;
          const lis = tempDiv.getElementsByTagName('li');
          if (lis.length > 0) {
            specs = Array.from(lis).map(li => li.textContent || '');
          }
        } catch (err) {
          console.error("Error parsing description specs:", err);
        }
      }

      const numId = idToNumber(p.id);

      // Calculate stable numeric price
      const cleanPrice = (p.price || '').replace(/[^0-9]/g, '');
      const parsedPrice = parseInt(cleanPrice, 10);
      const numericPrice = isNaN(parsedPrice) ? 0 : parsedPrice;

      // Stable ratings based on product id
      const ratingOptions = [4.9, 4.8, 5.0, 4.7];
      const rating = ratingOptions[numId % ratingOptions.length];

      // Stable units sold counts based on product id
      const salesOptions = [1420, 850, 3210, 412, 1950, 680];
      const unitsSold = salesOptions[numId % salesOptions.length];

      return {
        id: numId,
        name: p.name,
        category: p.category,
        classification: p.status === "IN STOCK" ? "Available Tier-1" : p.status,
        specs: specs,
        imageUrl: (p.images && p.images.length > 0) ? getImageUrl(p.images[0]) : "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
        price: p.price || "Contact Us",
        rating: rating,
        unitsSold: unitsSold,
        numericPrice: numericPrice,
        createdAt: p.created_at ? (typeof p.created_at === 'number' ? p.created_at : new Date(p.created_at).getTime()) : (1000000000 - index)
      };
    });
  }, [db.products]);

  // Load category filter list dynamically from active taxonomy categories
  const categoriesList = useMemo(() => {
    return (categories?.products || [])
      .filter(c => c && c.active)
      .map(c => c.name);
  }, [categories?.products]);

  // Filter and sort products by selected categories, search query, and sort type
  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.classification.toLowerCase().includes(query) ||
        p.specs.some(s => s.toLowerCase().includes(query))
      );
    }

    // Sort order: latest, A-Z, Z-A
    if (sortBy === 'latest') {
      result = [...result].sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'A-Z') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'Z-A') {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [products, selectedCategories, searchQuery, sortBy]);

  // Paginated products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Adjust page number if filtered list shrinks
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1); // reset to page 1 upon filtering change
  };

  const selectProductForMessage = (prodName: string) => {
    // Redirect to the interactive procurement consultation planner
    onStartConsultation();
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen">
      
      {/* 1. HERO / BANNER SECTION */}
      <section className="relative min-h-[50vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-24 border-b border-forest-900">
        
        {/* Full-width background display showcasing high-capacity solar tracking arrays under clear lighting */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1500&q=80"
            alt="High-capacity solar tracking arrays"
            className="w-full h-full object-cover object-center opacity-45 scale-102 select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl text-left"
          >
            <span className="inline-flex items-center gap-2 text-solar-yellow-400 text-xs font-mono font-black tracking-widest uppercase mb-6 select-none">
              <Zap className="w-3.5 h-3.5 fill-solar-yellow-400 text-solar-yellow-400 shrink-0" />
              <span>INDUSTRIAL-GRADE CATALOG</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6 uppercase">
              Products Catalog
            </h1>
            <p className="text-stone-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-xl md:max-w-2xl">
              Industrial-grade solar hardware engineered for maximum yield, structural resilience, and long-term peak performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. GRID DISPLAY SECTION (Layout: Full-Width 3x3 Catalog Grid) */}
      <section id="products-grid-start" className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          
          {/* Top Bar: Search, Category, and Sorting Dropdowns Grid Container */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full bg-white p-5 rounded-2xl border border-stone-200 shadow-sm mb-12 items-end">
                
                {/* Search Input (50% Width / md:col-span-2) */}
                <div className="space-y-1.5 md:col-span-2 text-left">
                  <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                    Search Hardware
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search hardware..."
                      className="w-full bg-stone-50 border border-stone-200 hover:border-forest-700 text-stone-850 pl-10 pr-12 py-2.5 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-forest-900 focus:bg-white transition-all placeholder:text-stone-400 placeholder:font-normal"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <Search className="w-4 h-4" />
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                        className="absolute inset-y-0 right-3 flex items-center text-stone-400 hover:text-stone-700 font-mono text-[10px] font-black uppercase cursor-pointer"
                      >
                        CLEAR
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Dropdown (25% Width / md:col-span-1) */}
                <div className="space-y-1.5 md:col-span-1 text-left">
                  <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                    Hardware Category
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategories.length === 1 ? selectedCategories[0] : (selectedCategories.length === 0 ? "" : "multiple")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "multiple") {
                          // Maintain multiple filter
                        } else if (val === "") {
                          setSelectedCategories([]);
                        } else {
                          setSelectedCategories([val]);
                        }
                        setCurrentPage(1);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 hover:border-forest-700 text-stone-850 px-3.5 py-2.5 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-forest-900 transition-all cursor-pointer appearance-none"
                    >
                      <option value="">All Categories</option>
                      {categoriesList.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                      {selectedCategories.length > 1 && (
                        <option value="multiple" disabled>Multiple Selected ({selectedCategories.length})</option>
                      )}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Sorting Dropdown (25% Width / md:col-span-1) */}
                <div className="space-y-1.5 md:col-span-1 text-left">
                  <label className="block text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                    Sort By
                  </label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-stone-50 border border-stone-200 hover:border-forest-700 text-stone-850 px-3.5 py-2.5 rounded-lg text-sm font-semibold outline-none focus:ring-2 focus:ring-forest-900 transition-all cursor-pointer appearance-none"
                    >
                      <option value="latest">Latest</option>
                      <option value="A-Z">Alphabetical: A to Z</option>
                      <option value="Z-A">Alphabetical: Z to A</option>
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-600">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </div>

              </div>

              {/* No items fallback state */}
              {filteredProducts.length === 0 && (
                <div className="py-20 text-center max-w-md mx-auto">
                  <Inbox className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <h3 className="font-display font-black text-xl text-stone-400 mb-2">No matching hardware components</h3>
                  <p className="text-stone-400 text-sm font-light max-w-md mx-auto">
                    Please try clear or uncheck some filter boxes to view Powershift's entire Tier-1 industrial catalog.
                  </p>
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="mt-6 px-4 py-2 border border-stone-300 font-mono text-xs font-bold text-forest-950 rounded-xl hover:bg-stone-50 uppercase tracking-widest cursor-pointer"
                  >
                    RESET CATEGORY FILTERS
                  </button>
                </div>
              )}

              {/* Product Grid: 3x3 product display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <AnimatePresence mode="wait">
                    {currentProducts.map((p, idx) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
                      >
                        {/* Container design: Image */}
                        <div 
                          onClick={() => handleSelectProduct(p.id)}
                          className="relative aspect-[4/3.3] bg-stone-100 overflow-hidden border-b border-stone-100 cursor-pointer"
                        >
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Content block section: Title Only */}
                        <div className="p-5 text-left flex-grow flex flex-col justify-between">
                          <h3 
                            onClick={() => handleSelectProduct(p.id)}
                            className="font-display font-black text-sm sm:text-base text-forest-950 leading-snug hover:text-solar-yellow-600 transition-colors cursor-pointer line-clamp-2"
                          >
                            {p.name}
                          </h3>
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
      </section>

      {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
      <SpecialOffersGallery />

      {/* 3. BOTTOM CLOSING CTA SECTION */}
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
