import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Zap,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Video,
  ArrowRight,
  Menu,
  X,
  FileText,
  TrendingUp,
  Wrench,
  Battery,
  Home,
  Briefcase,
  ArrowLeftRight,
  Award,
  ShieldCheck,
  Check,
  AlertTriangle,
  Leaf,
  MessageSquare,
  Send,
  Info,
  Factory,
  Inbox
} from 'lucide-react';

import heroSolarPanels from './assets/images/hero_solar_panels_1781181448662.jpg';
import powerGridBurden from './assets/images/power_grid_burden_1781181463504.jpg';
import solarTechnicianWork from './assets/images/solar_technician_work_1781181477493.jpg';

import { servicesData, valuePillarsData, projectShowcasesData, testimonialsData } from './data';
import { useSyncDb, getImageUrl, idToNumber, useSyncSocialLinks } from './sync';
import AboutPage from './components/AboutPage';
import ServicesPage from './components/ServicesPage';
import PortfolioPage from './components/PortfolioPage';
import ProjectDetailsPage from './components/ProjectDetailsPage';
import ProductsPage from './components/ProductsPage';
import ProductDetailsPage from './components/ProductDetailsPage';
import FreeQuotePage from './components/FreeQuotePage';
import MultiPageQuoteForm from './components/MultiPageQuoteForm';
import SpecialOffersGallery from './components/SpecialOffersGallery';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfUsePage from './components/TermsOfUsePage';
import SafetyStandardPage from './components/SafetyStandardPage';

const previewProducts = [
  {
    id: 1,
    name: "550W Monocrystalline Solar Module",
    category: "DAH Solar",
    classification: "Tier-1 High-Efficiency",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "10kW Three-Phase Hybrid Inverter",
    category: "Deye",
    classification: "Smart Grid-Tied System",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "48V 100Ah LiFePO4 Battery Bank",
    category: "Pylontech",
    classification: "Deep Cycle Storage Pod",
    imageUrl: "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Bifacial Double-Glass Solar Panel",
    category: "Astronergy",
    classification: "Maximum Albedo Yield Class",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&q=80"
  }
];

function renderMessageText(text: string, isUser: boolean) {
  if (text === "Thinking...") {
    return <span className="animate-pulse italic text-stone-400 font-medium">Thinking...</span>;
  }

  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
        const isNumbered = /^\d+\.\s/.test(trimmed);
        
        let content = line;
        if (isBullet) {
          content = trimmed.replace(/^[\*\-]\s+/, '');
        } else if (isNumbered) {
          content = trimmed.replace(/^\d+\.\s+/, '');
        }

        // Parse bold text (**bold**)
        const parts: React.ReactNode[] = [];
        const regex = /\*\*([\s\S]*?)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(content)) !== null) {
          const index = match.index;
          if (index > lastIndex) {
            parts.push(content.substring(lastIndex, index));
          }
          parts.push(
            <strong 
              key={index} 
              className={isUser ? "font-bold text-solar-yellow-400" : "font-black text-forest-900"}
            >
              {match[1]}
            </strong>
          );
          lastIndex = regex.lastIndex;
        }
        if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
        }

        const renderedContent = parts.length > 0 ? parts : content;

        if (isBullet) {
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className={isUser ? "text-solar-yellow-400 mt-1" : "text-forest-700 mt-1"}>•</span>
              <span className="flex-1">{renderedContent}</span>
            </div>
          );
        }

        if (isNumbered) {
          const matchNum = trimmed.match(/^(\d+)\.\s+/);
          const num = matchNum ? matchNum[1] : '1';
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1">
              <span className={`font-bold text-[11px] mt-0.5 ${isUser ? "text-solar-yellow-400" : "text-forest-700"}`}>{num}.</span>
              <span className="flex-1">{renderedContent}</span>
            </div>
          );
        }

        if (trimmed === '') {
          return <div key={lineIdx} className="h-1" />;
        }

        return <p key={lineIdx}>{renderedContent}</p>;
      })}
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'services' | 'portfolio' | 'project-details' | 'products' | 'product-details' | 'free-quote' | 'privacy' | 'terms' | 'safety'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [selectedProductCategories, setSelectedProductCategories] = useState<string[]>([]);
  const [detailsSourcePage, setDetailsSourcePage] = useState<'services' | 'portfolio'>('services');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [productStartIndex, setProductStartIndex] = useState(0);

  const { db } = useSyncDb();
  const socialLinks = useSyncSocialLinks();

  // Dynamic projects derived from synchronized portfolio entries
  const projects = React.useMemo(() => {
    if (!db.portfolio) {
      return [];
    }
    const sortedPortfolio = [...db.portfolio].sort((a, b) => {
      const timeA = a.created_at ? (typeof a.created_at === 'number' ? a.created_at : new Date(a.created_at).getTime()) : 0;
      const timeB = b.created_at ? (typeof b.created_at === 'number' ? b.created_at : new Date(b.created_at).getTime()) : 0;
      return timeB - timeA;
    });
    return sortedPortfolio.map((proj) => {
      let segment = 'Residential';
      const lowerSeg = (proj.segment || '').toLowerCase();
      if (lowerSeg.includes('indus')) {
        segment = 'Industrial';
      } else if (lowerSeg.includes('commer')) {
        segment = 'Commercial';
      } else {
        segment = 'Residential';
      }

      const parts = proj.name.split('/');
      const title = proj.client_name ? proj.client_name.trim() : parts[0].trim();
      const loc = title.split('Solar')[0]?.trim() || 'Luzon, PH';

      return {
        id: proj.id,
        name: title,
        location: loc,
        powerCapacity: proj.capacity || '5.0 kWp',
        segment,
        metrics: { label: 'Peak Capacity', value: `${proj.capacity || '5.0 kWp'} Peak Yield` },
        imagePath: proj.images && proj.images.length > 0 ? getImageUrl(proj.images[0]) : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        description: proj.description || ""
      };
    });
  }, [db.portfolio]);

  // Dynamic products derived from synchronized database entries
  const allProductsList = React.useMemo(() => {
    if (!db.products) {
      return [];
    }
    const sortedProducts = [...db.products].sort((a, b) => {
      const timeA = a.created_at ? (typeof a.created_at === 'number' ? a.created_at : new Date(a.created_at).getTime()) : 0;
      const timeB = b.created_at ? (typeof b.created_at === 'number' ? b.created_at : new Date(b.created_at).getTime()) : 0;
      return timeB - timeA;
    });
    return sortedProducts.map((p) => {
      return {
        id: idToNumber(p.id),
        name: p.name,
        category: p.category,
        classification: p.classification || "Tier-1 High-Efficiency",
        imageUrl: p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80'
      };
    });
  }, [db.products]);

  // Keep track of window width to determine visible items per page
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Limit preview section to only 6 products maximum
  const previewProductsList = React.useMemo(() => {
    return allProductsList.slice(0, 6);
  }, [allProductsList]);

  const itemsPerPage = windowWidth >= 768 ? 3 : 1;
  const maxStartIndex = Math.max(0, previewProductsList.length - itemsPerPage);

  // Safely clamp productStartIndex when the bounds change
  useEffect(() => {
    if (productStartIndex > maxStartIndex) {
      setProductStartIndex(Math.max(0, maxStartIndex));
    }
  }, [maxStartIndex, productStartIndex]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    const idParam = params.get('id');
    if (pageParam === 'project-details' && idParam) {
      setSelectedProjectId(Number(idParam));
      setCurrentPage('project-details');
    } else if (pageParam === 'product-details' && idParam) {
      setSelectedProductId(Number(idParam));
      setCurrentPage('product-details');
    } else if (pageParam) {
      const allowedPages = ['home', 'about', 'services', 'portfolio', 'products', 'free-quote'];
      if (allowedPages.includes(pageParam)) {
        setCurrentPage(pageParam as any);
      }
    }
  }, []);

  const navigateToSection = (sectionId: string) => {
    setCurrentPage('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const navigateToService = (id: number) => {
    setSelectedServiceId(id);
    setCurrentPage('services');
    setTimeout(() => {
      const element = document.getElementById(`service-card-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 150);
  };
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Hero Contact Form State
  const [heroFormData, setHeroFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Residential',
    message: ''
  });
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);

  // Floating Chatbot Widget State
  const [chatWidgetState, setChatWidgetState] = useState<'closed' | 'menu' | 'viber' | 'messenger' | 'whatsapp' | 'chatbot'>('closed');
  const [showChatBadge, setShowChatBadge] = useState(true);
  const [routingFormData, setRoutingFormData] = useState({ name: '', email: '', phone: '', inquiry: '' });
  const [routingSubmitted, setRoutingSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; text: string; sender: 'user' | 'assistant'; time: string }>>([
    {
      id: '1',
      text: "Hello! I'm your Powershift Assistant. How can I help you transition to clean, cost-efficient solar energy today?",
      sender: 'assistant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [platformChatInput, setPlatformChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatWidgetState]);

  const handleSendChatMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      text: textToSend.trim(),
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    if (!overrideText) {
      setChatInput('');
    }

    // Add a temporary typing placeholder
    const typingId = (Date.now() + 1).toString();
    const typingMsg = {
      id: typingId,
      text: "Thinking...",
      sender: 'assistant' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, typingMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text })) })
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      
      setChatMessages(prev => {
        // Remove the "Thinking..." typing message and add the real reply
        const filtered = prev.filter(m => m.id !== typingId);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          text: data.reply || "I am sorry, I couldn't process your request.",
          sender: 'assistant' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => {
        const filtered = prev.filter(m => m.id !== typingId);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          text: "My apologies, but I'm having trouble connecting right now. Please try again or reach out to us directly at 0935 479 6321.",
          sender: 'assistant' as const,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeroInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHeroFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      return;
    }
    setFormSubmitted(true);
  };

  const handleHeroFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFormData.name || !heroFormData.email || !heroFormData.phone) {
      return;
    }
    setHeroFormSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: 'Residential',
      message: ''
    });
    setFormSubmitted(false);
  };

  const resetHeroForm = () => {
    setHeroFormData({
      name: '',
      email: '',
      phone: '',
      projectType: 'Residential',
      message: ''
    });
    setHeroFormSubmitted(false);
  };

  // Helper to resolve Icons beautifully based on service id
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'residential':
        return <Home className="w-8 h-8 text-solar-yellow-500" />;
      case 'commercial':
        return <Briefcase className="w-8 h-8 text-solar-yellow-500" />;
      case 'net-metering':
        return <ArrowLeftRight className="w-8 h-8 text-solar-yellow-500" />;
      case 'off-grid':
      case 'hybrid-bess':
        return <Battery className="w-8 h-8 text-solar-yellow-500" />;
      case 'industrial-arrays':
        return <Factory className="w-8 h-8 text-solar-yellow-500" />;
      case 'pure-offgrid':
        return <Zap className="w-8 h-8 text-solar-yellow-500" />;
      case 'maintenance':
        return <Wrench className="w-8 h-8 text-solar-yellow-500" />;
      case 'consultation':
        return <FileText className="w-8 h-8 text-solar-yellow-500" />;
      default:
        return <Zap className="w-8 h-8 text-solar-yellow-500" />;
    }
  };

  // Helper to get Value Pillar icon
  const getPillarIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Sun className="w-6 h-6 text-solar-yellow-500" />;
      case 1:
        return <ShieldCheck className="w-6 h-6 text-solar-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-solar-yellow-500" />;
      default:
        return <Zap className="w-6 h-6 text-solar-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-forest-50 font-sans text-stone-850 antialiased selection:bg-solar-yellow-500 selection:text-forest-950">
      
      {/* HEADER & MOBILE NAVIGATION BAR */}
      <header id="header" className="sticky top-0 z-50 bg-forest-950 border-b border-forest-800/40 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo placeholder left */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('home');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 group"
            >
              <img
                src="https://lh3.googleusercontent.com/d/1Sjk5AyJUHg4LPT6_4FeUYRVJUJnUtNRE"
                alt="Powershift Solar Logo"
                className="h-[59px] w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                referrerPolicy="no-referrer"
              />
            </a>

            {/* Links center */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => {
                  setCurrentPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`font-semibold transition-colors duration-200 cursor-pointer ${
                  currentPage === 'home' ? 'text-solar-yellow-500 font-bold' : 'text-white hover:text-solar-yellow-500'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentPage('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`font-semibold transition-colors duration-200 cursor-pointer ${
                  currentPage === 'about' ? 'text-solar-yellow-500 font-bold' : 'text-white hover:text-solar-yellow-500'
                }`}
              >
                About
              </button>
              <button
                onClick={() => {
                  setCurrentPage('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`font-semibold transition-colors duration-200 cursor-pointer ${
                  currentPage === 'services' ? 'text-solar-yellow-500 font-bold' : 'text-white hover:text-solar-yellow-500'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => {
                  setCurrentPage('portfolio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`font-semibold transition-colors duration-200 cursor-pointer ${
                  currentPage === 'portfolio' ? 'text-solar-yellow-500 font-bold' : 'text-white hover:text-solar-yellow-500'
                }`}
              >
                Gallery
              </button>
              <button
                onClick={() => {
                  setCurrentPage('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`font-semibold transition-colors duration-200 cursor-pointer ${
                  currentPage === 'products' || currentPage === 'product-details' ? 'text-solar-yellow-500 font-bold' : 'text-white hover:text-solar-yellow-500'
                }`}
              >
                Products
              </button>
            </nav>

            {/* CTA action button right */}
            <div className="hidden md:block">
              <button
                onClick={() => {
                  setCurrentPage('free-quote');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 bg-solar-yellow-500 hover:bg-solar-yellow-400 text-forest-950 px-5 py-2.5 rounded-lg font-display font-bold text-sm tracking-wide shadow-md transition-all duration-250 transform active:scale-95 cursor-pointer"
              >
                <span>Get A Quotation</span>
                <ChevronRight className="w-4 h-4 text-forest-950 stroke-[3]" />
              </button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-forest-900 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-forest-950 border-t border-forest-800"
            >
              <div className="px-4 pt-4 pb-6 space-y-3">
                <button
                  onClick={() => {
                    setCurrentPage('home');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === 'home' ? 'text-solar-yellow-500 bg-forest-900 font-bold' : 'text-white hover:bg-forest-900'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('about');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === 'about' ? 'text-solar-yellow-500 bg-forest-900 font-bold' : 'text-white hover:bg-forest-900'
                  }`}
                >
                  About Our Engr
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === 'services' ? 'text-solar-yellow-500 bg-forest-900 font-bold' : 'text-white hover:bg-forest-900'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('portfolio');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === 'portfolio' ? 'text-solar-yellow-500 bg-forest-900 font-bold' : 'text-white hover:bg-forest-900'
                  }`}
                >
                  Gallery
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === 'products' || currentPage === 'product-details' ? 'text-solar-yellow-500 bg-forest-900 font-bold' : 'text-white hover:bg-forest-900'
                  }`}
                >
                  Products
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('free-quote');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-3 py-2.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    currentPage === 'free-quote' ? 'text-solar-yellow-500 bg-forest-900 font-bold' : 'text-white hover:bg-forest-900'
                  }`}
                >
                  Get A Quotation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {currentPage === 'home' ? (
        <>
          {/* 1. HERO SECTION */}
      <section id="hero" className="relative min-h-[85vh] flex items-center bg-forest-950 overflow-hidden">
        {/* Background Image with Dark Tint Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroSolarPanels}
            alt="Modern solar panels aligned beautifully under high daylight irradiance representing Powershift Solar excellence"
            className="w-full h-full object-cover object-center opacity-45 scale-105 motion-safe:animate-[pulse_12s_infinite]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-80" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Bold, left-aligned typography */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <div
                className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-solar-yellow-400 mb-6"
              >
                <Zap className="w-4 h-4 fill-solar-yellow-400 text-solar-yellow-400" />
                <span>Renewable Energy System Specialist</span>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-6"
              >
                Power Smarter.<br />
                <span className="text-solar-yellow-500">Save Bigger.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-stone-300 font-sans leading-relaxed mb-8 max-w-2xl font-light"
              >
                Driving Global Change through reliable, high-efficiency solar installation services. Unlocking <strong className="font-semibold text-white">100% of your roof's power potential</strong> to immediately drop electric liabilities.
              </motion.p>

              {/* Overlapping Client Profiles & Served Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 mb-8 w-full"
              >
                {/* Overlapping Circles with real photos */}
                <div className="flex -space-x-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-forest-950 shadow-sm animate-fade-in"
                    src="https://lh3.googleusercontent.com/d/1CUv3Fdy8AfGY4gtES5lW18l3uh_B9CAl"
                    alt="Julian"
                    title="Julian De Castro"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-forest-950 shadow-sm animate-fade-in"
                    src="https://lh3.googleusercontent.com/d/1SJjjETlB-dHhaRwrKdm42WEE7eeygry9"
                    alt="Victoria"
                    title="Victoria Morente"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-forest-950 shadow-sm animate-fade-in"
                    src="https://lh3.googleusercontent.com/d/1yiqYbpJ2Z9F9TdHFhyHnq4FJUlZelsq_"
                    alt="Marcus"
                    title="Marcus Vance"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="w-10 h-10 rounded-full object-cover border-2 border-forest-950 shadow-sm animate-fade-in"
                    src="https://lh3.googleusercontent.com/d/1M72QIrIqKo0MDqamfsUbVbP3iLUydFhC"
                    alt="Elena"
                    title="Elena Cruz - Satisfied Customer"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-white/20 self-center mx-1" />

                {/* Quantitative Metric */}
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-solar-yellow-500 fill-solar-yellow-500" />
                    ))}
                    <span className="font-mono text-xs font-bold text-solar-yellow-400 ml-1">5.0 Rating</span>
                  </div>
                  <p className="text-stone-300 text-sm mt-0.5 font-light">
                    Join <strong className="font-semibold text-white">1,450+ homes & businesses</strong>.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4"
              >
                <button
                  onClick={() => {
                    setCurrentPage('free-quote');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-center bg-solar-yellow-500 hover:bg-solar-yellow-400 text-forest-950 font-display font-extrabold px-8 py-4 rounded-xl text-base tracking-wide shadow-lg hover:shadow-solar-yellow-500/15 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Get A Quotation
                </button>
                <a
                  href="tel:09354796321"
                  className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-display font-bold px-8 py-4 border-2 border-white/80 hover:border-white rounded-xl text-base tracking-wide transition-all duration-200"
                >
                  <Phone className="w-4 h-4 text-solar-yellow-500 fill-solar-yellow-500" />
                  <span>Call: 0935 479 6321</span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: High-conversion assessment form card */}
            <div className="lg:col-span-6 w-full">
              <div className="w-full bg-forest-900/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-solar-yellow-500 shadow-2xl text-white">
                <MultiPageQuoteForm theme="dark" layout="hero" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PARTNERED COMPANIES SECTION */}
      <section className="bg-stone-100 border-b border-stone-200/80 py-14 overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <p className="text-center text-[10px] font-mono uppercase tracking-[0.15em] text-stone-500 font-bold">
            Authorized Tier-1 Technology Integration Partners
          </p>
        </div>
        <div className="relative flex overflow-x-hidden w-full">
          {/* Outer sliding container */}
          <div className="flex items-center shrink-0 animate-scroll-right whitespace-nowrap">
            {/* Block 1 */}
            <div className="flex items-center gap-[190px] shrink-0 pr-[190px]">
              <img 
                src="https://lh3.googleusercontent.com/d/1YaIILjBXynQDq7tZ1knXZUzy5fqrzrC-" 
                alt="Astroenergy logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1oRs0f-QkQ2ySh6XUNNeqfisw4nDen4lb" 
                alt="DAH Solar logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1LkwphFA1aB3ru7KgoJZTpucqkt66OBNL" 
                alt="Deye logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1Lv8lfrqZCuMFeJE4oZElnsXvRiTE4Ojp" 
                alt="Genix Green logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1CZGUORD-TA3rTsI5VCTGDgPeMclOySPX" 
                alt="Menred ESS logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1_lcEuf6Jf5tSS66jYAeFGhEob0UwwgsO" 
                alt="Pylon Tech logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1ZUeuezVxo8ARz916o6L3nyi4Lko2I_84" 
                alt="Solis logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1aiWmm9iInRNLxqLRq3xD_ZbtcWm1GRZU" 
                alt="SRNE logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Block 2 (Identical clone) */}
            <div className="flex items-center gap-[190px] shrink-0 pr-[190px]">
              <img 
                src="https://lh3.googleusercontent.com/d/1YaIILjBXynQDq7tZ1knXZUzy5fqrzrC-" 
                alt="Astroenergy logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1oRs0f-QkQ2ySh6XUNNeqfisw4nDen4lb" 
                alt="DAH Solar logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1LkwphFA1aB3ru7KgoJZTpucqkt66OBNL" 
                alt="Deye logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1Lv8lfrqZCuMFeJE4oZElnsXvRiTE4Ojp" 
                alt="Genix Green logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1CZGUORD-TA3rTsI5VCTGDgPeMclOySPX" 
                alt="Menred ESS logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1_lcEuf6Jf5tSS66jYAeFGhEob0UwwgsO" 
                alt="Pylon Tech logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1ZUeuezVxo8ARz916o6L3nyi4Lko2I_84" 
                alt="Solis logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
              <img 
                src="https://lh3.googleusercontent.com/d/1aiWmm9iInRNLxqLRq3xD_ZbtcWm1GRZU" 
                alt="SRNE logo representing premium clean energy technology" 
                className="h-[75px] w-auto object-contain max-w-[250px] opacity-100 transition-opacity duration-200" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM STATEMENT SECTION */}
      <section id="problem-section" className="py-24 lg:py-32 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Image Left Column */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center">
              <div className="relative group w-full">
                {/* Offset shadow background block (Green) */}
                <div className="absolute inset-0 bg-forest-950 border border-forest-950 rounded-2xl -translate-x-3.5 translate-y-3.5 transition-transform group-hover:-translate-x-2.5 group-hover:translate-y-2.5 duration-300" />
                <div className="relative overflow-hidden rounded-2xl h-64 sm:h-80 lg:h-[420px] bg-stone-100 border-2 border-forest-950 shadow-xl flex">
                  <img
                    src="https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/736592771_122207306126538051_3506228588848963698_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=103&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFBsQSGx40IMf4reW4cN2beOJLmZf0DGeQ4kuZl_QMZ5Euy9tA0sYr4pw-4siQkyuRFeEnLZl_R10POkVDw1dWK&_nc_ohc=PWMRQraa_UQQ7kNvwG6Q1Hb&_nc_oc=Adpup5vlzpJkAMLyvlKPiucuwWtjFhhsbuLThn8lOa1zh04gjjge--L1NcRdkXurf84&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=vnVQo8tjzFR4YMD9AsILwg&_nc_ss=7b2a8&oh=00_AQDi7whrgA7L4Y7ZhHJdTAlYNTAPiJLwk90qTtOXOLz4cQ&oe=6A62C26E"
                    alt="Traditional aging electrical infrastructure against a dense smoky sky representing burden of coal dependency"
                    className="w-full h-full object-cover transform transition duration-700 hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Text Right Column */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center lg:pl-6">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
                The Energy Vulnerability
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5.5xl font-black text-forest-900 leading-tight mb-4">
                The Burden of Traditional Power
              </h2>
              
              <div className="text-stone-700 font-light leading-relaxed text-base sm:text-lg">
                <p>
                  Today's homeowners and businesses face skyrocketing electricity rates, chronic grid instability, and frequent blackouts from aging, fossil-fuel-reliant grids. Beyond immediate financial costs, a massive carbon footprint compromises your budget and the environment. Our advanced solar solutions eliminate these vulnerabilities, providing clean, independent power and permanent relief from volatile utility expenses.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SOLUTION STATEMENT SECTION */}
      <section id="solution-section" className="py-24 lg:py-32 bg-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Text Left Column */}
            <div className="lg:col-span-6 flex flex-col justify-center lg:pr-6">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
                The Powershift Path
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5.5xl font-black text-forest-900 leading-tight mb-4">
                Take Control of Your Energy Future
              </h2>
              
              <div className="text-stone-700 font-light leading-relaxed text-base sm:text-lg">
                <p>
                  Powershift Solar Services delivers custom, master-engineered designs to permanently break grid dependence, reducing monthly electricity bills by up to 80%. We manage the entire transition end-to-end—from digital modeling to seamless grid synchronization. Our comprehensive approach guarantees a stress-free, highly efficient switch optimized for maximum long-term financial savings.
                </p>
              </div>
            </div>

            {/* Image Right Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="relative group w-full">
                {/* Offset shadow background block (Yellow) */}
                <div className="absolute inset-0 bg-solar-yellow-500 border border-solar-yellow-500 rounded-2xl translate-x-3.5 translate-y-3.5 transition-transform group-hover:translate-x-2.5 group-hover:translate-y-2.5 duration-300" />
                <div className="relative overflow-hidden rounded-2xl h-64 sm:h-80 lg:h-[420px] bg-stone-100 border-2 border-solar-yellow-500 shadow-xl flex">
                  <img
                    src="https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/746002240_122208599054538051_3490561687419345478_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFNCp8_tG3nUbg3pzIFi3PDTG7P9uy7ShNMbs_27LtKE1GeHMej08KZWlXoj1GSE7pSkkZw--FtafR0OPdDYl9e&_nc_ohc=9s4d90O_Jo8Q7kNvwFk6mlu&_nc_oc=AdqFtzjWTg5LEKhfN08GOBupLuJlsmT382Jms-ebQWkd3BopdQouwp59dtER1V3_-pA&_nc_zt=23&_nc_ht=scontent.fmnl4-6.fna&_nc_gid=bA7rE76srbvipZt2TFcCSQ&_nc_ss=7b2a8&oh=00_AQB3L8BSZntpE6P2v3cKjtsnz2QxqBiJIrBdEBh6ftQDtA&oe=6A62F407"
                    alt="Attentive certified solar technician inspects beautiful tight solar panel frames in daytime"
                    className="w-full h-full object-cover transform transition duration-700 hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. OFFERED SERVICES SECTION (3x2 Clean Grid) */}
      <section id="services" className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-16 lg:mb-20 w-full">
            <span className="text-xs font-mono uppercase tracking-widest text-solar-yellow-600 font-bold block mb-4">
              Our Capabilities Gallery
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 w-full">
              <div className="max-w-2xl text-left">
                <h2 className="font-display text-4xl sm:text-5xl font-black text-forest-900 tracking-tight leading-tight">
                  What We Offer: Engineered <span className="whitespace-nowrap">for Efficiency</span>
                </h2>
              </div>
              <div className="flex md:justify-end shrink-0">
                <button
                  onClick={() => {
                    setCurrentPage('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2.5 text-forest-900 hover:text-solar-yellow-600 font-display font-extrabold text-sm tracking-widest uppercase pb-1.5 border-b-2 border-forest-900/15 hover:border-solar-yellow-600 transition-all duration-300 cursor-pointer"
                  id="btn-explore-capabilities"
                >
                  <span>Explore All Capabilities</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-forest-900 group-hover:text-solar-yellow-600" />
                </button>
              </div>
            </div>
          </div>

          {/* 4-Column Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.slice(0, 4).map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden bg-forest-50 border border-stone-200 hover:border-forest-700 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                id={`service-card-${service.id}`}
                onClick={() => {
                  setCurrentPage('services');
                  setTimeout(() => {
                    const idMap: Record<string, number> = {
                      'residential': 1,
                      'commercial': 2,
                      'industrial-arrays': 3,
                      'hybrid-bess': 4
                    };
                    const targetId = idMap[service.id];
                    if (targetId) {
                      const el = document.getElementById(`service-card-${targetId}`);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }, 150);
                }}
              >
                <div>
                  {/* Service Card Image Header */}
                  <div className="relative h-44 sm:h-48 w-full bg-stone-100 rounded-t-2xl">
                    {/* Image Mask Wrapper */}
                    <div className="w-full h-full overflow-hidden rounded-t-2xl relative">
                      <img
                        src={service.imagePath}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Floating Icon Container */}
                    <div className="absolute -bottom-7 left-6 w-14 h-14 bg-forest-950 flex items-center justify-center rounded-xl shadow-lg border-2 border-forest-50 group-hover:bg-forest-800 transition-colors z-10">
                      {getServiceIcon(service.id)}
                    </div>
                  </div>

                  {/* Title & Description with safe padding to clear floating icon */}
                  <div className="px-6 pt-12">
                    <h3 className="font-display text-lg font-bold text-forest-950 mb-2 group-hover:text-forest-800 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {service.title}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans mb-4 line-clamp-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-stone-200/60 mt-auto">
                  <div className="inline-flex items-center gap-1.5 text-xs font-display font-medium text-forest-900 group-hover:text-solar-yellow-600 transition-colors">
                    <span>View Specifications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. PROJECT SHOWCASES SECTION (2 Large top, 3 Small below Grid) */}
      <section id="portfolio" className="py-20 lg:py-28 bg-forest-950 text-white relative overflow-hidden">
        {/* Subtle low-opacity background image overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1920&q=80")' }}
        />
        {/* Abstract background vector accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-forest-800 rounded-full blur-3xl opacity-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-solar-yellow-600 rounded-full blur-3xl opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-solar-yellow-400 font-bold block mb-4">
              Pristine Infrastructure Deployments
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight leading-none mb-6">
              Excellence in Action: Featured Installations
            </h2>
          </div>

          {/* Masonry / Structured Grid Layout */}
          {projects.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto bg-forest-900/40 border border-forest-800 rounded-3xl p-8">
              <Zap className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="font-display font-black text-xl text-stone-300 mb-2">No Featured Installations Found</h3>
              <p className="text-stone-400 text-sm font-light">
                All projects have been cleared or archived from the admin control panel.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
                         {/* Top 2 Large Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.slice(0, 2).map((project, idx) => (
                  <div
                    key={project.id}
                    className="relative group rounded-2xl overflow-hidden h-[400px] border border-forest-800 shadow-2xl cursor-pointer"
                    onClick={() => {
                      setSelectedProjectId(idToNumber(project.id));
                      setCurrentPage('project-details');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    id={`project-lg-${project.id}`}
                  >
                    {/* Photo bg */}
                    <img
                      src={project.imagePath}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent object-cover" />
                    
                    {/* Bottom details */}
                    <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col justify-end">
                      <h3 className="font-display text-2xl font-black text-white mb-2 leading-tight">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-5 h-5 text-solar-yellow-500" />
                        <span className="font-mono text-sm sm:text-base font-bold text-white tracking-wide">
                          {project.location}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom 3 Smaller Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.slice(2, 5).map((project, idx) => (
                  <div
                    key={project.id}
                    className="relative group rounded-2xl overflow-hidden h-[300px] border border-forest-800/80 shadow-xl cursor-pointer"
                    onClick={() => {
                      setSelectedProjectId(idToNumber(project.id));
                      setCurrentPage('project-details');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    id={`project-sm-${project.id}`}
                  >
                    {/* Photo bg */}
                    <img
                      src={project.imagePath}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Tint overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    {/* Bottom Details */}
                    <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end">
                      <h4 className="font-display text-lg font-bold text-white mb-2 line-clamp-1">
                        {project.name}
                      </h4>
                      <span className="text-xs text-stone-300 font-mono flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-solar-yellow-500" />
                        {project.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for detail lookup (optional interactivity without bloat) */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setActiveProject(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="bg-forest-900 border border-forest-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-left shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 p-2 bg-forest-950 rounded-full text-stone-300 hover:text-white hover:bg-forest-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
                {(() => {
                  const p = projects.find(proj => proj.id === activeProject);
                  if (!p) return null;
                  return (
                    <div>
                      <div className="rounded-xl overflow-hidden h-48 mb-6 bg-forest-950">
                        <img src={p.imagePath} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="inline-block bg-forest-950/90 text-solar-yellow-500 font-mono text-[9px] font-black tracking-widest px-2.5 py-1 rounded shadow-sm uppercase border border-forest-800 mb-2">
                        {p.segment}
                      </span>
                      <h3 className="font-display text-2xl font-black text-white tracking-tight mb-4">
                        {p.name}
                      </h3>
                      
                      <div className="bg-forest-950 p-4 rounded-xl border border-forest-800 space-y-2">
                        <span className="text-[11px] font-mono text-stone-400 block uppercase tracking-wider">{p.metrics.label}</span>
                        <span className="text-xl font-display font-extrabold text-white block">{p.metrics.value}</span>
                      </div>
                      
                      <p className="text-stone-300 text-sm font-sans mt-5 leading-relaxed">
                        Deploying premium Tier-1 technologies and certified mounting blueprints under the oversight of Powershift Solar guarantees seamless operation and verified grid synergy.
                      </p>

                      <div className="mt-6">
                        <a
                          href="#contact"
                          onClick={() => setActiveProject(null)}
                          className="block text-center bg-solar-yellow-500 text-forest-950 font-display font-bold py-3 rounded-lg text-sm tracking-wide"
                        >
                          Request Consultation Like This
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>

      {/* PRODUCTS PREVIEW SECTION */}
      <section id="products-preview" className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="mb-16 lg:mb-20 w-full">
            <span className="text-xs font-mono uppercase tracking-widest text-solar-yellow-600 font-bold block mb-4">
              Premium Hardware Inventory
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-12 w-full">
              <div className="max-w-2xl text-left">
                <h2 className="font-display text-4xl sm:text-5xl font-black text-forest-900 tracking-tight leading-tight">
                  Our Products: Engineered <span className="inline-block">for Efficiency</span>
                </h2>
              </div>
              <div className="flex md:justify-end shrink-0">
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group inline-flex items-center gap-2.5 text-forest-900 hover:text-solar-yellow-600 font-display font-extrabold text-sm tracking-widest uppercase pb-1.5 border-b-2 border-forest-900/15 hover:border-solar-yellow-600 transition-all duration-300 cursor-pointer"
                  id="btn-view-inventory"
                >
                  <span>View Full Inventory</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-forest-900 group-hover:text-solar-yellow-600" />
                </button>
              </div>
            </div>
          </div>          {/* 1x3 Product Grid with Nav Arrows */}
          <div className="relative w-full">
            {previewProductsList.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto">
                <Inbox className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <h3 className="font-display font-black text-xl text-stone-400 mb-2">No Engineered Products Found</h3>
                <p className="text-stone-500 text-sm font-light">
                  All hardware inventory SKUs have been cleared from the admin control panel.
                </p>
              </div>
            ) : (
              <>
                {previewProductsList.length > itemsPerPage && (
                  <button
                    onClick={() => setProductStartIndex((prev) => Math.max(0, prev - 1))}
                    disabled={productStartIndex === 0}
                    className={`absolute left-[-45px] xl:left-[-65px] top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center transition-colors select-none z-10 ${
                      productStartIndex === 0
                        ? 'text-stone-300 opacity-45 pointer-events-none cursor-default'
                        : 'text-stone-500 hover:text-solar-yellow-500 cursor-pointer'
                    }`}
                    aria-label="Previous Product"
                  >
                    <ChevronLeft className="w-10 h-10 stroke-[2.5]" />
                  </button>
                )}

                <div className="overflow-hidden py-4 -my-4 px-1 -mx-1">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out gap-6 [--slide-step:calc(100%+24px)] md:[--slide-step:calc(33.333%+8px)]"
                    style={{ transform: `translate3d(calc(-${productStartIndex} * var(--slide-step)), 0, 0)` }}
                  >
                    {previewProductsList.map((p, idx) => (
                      <div
                        key={`${p.id}-${idx}`}
                        className="w-full md:w-[calc(33.333%-16px)] shrink-0 bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
                      >
                        {/* Container design: Image */}
                        <div 
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setCurrentPage('product-details');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
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
                            onClick={() => {
                              setSelectedProductId(p.id);
                              setCurrentPage('product-details');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="font-display font-black text-sm sm:text-base text-forest-950 leading-snug hover:text-solar-yellow-600 transition-colors cursor-pointer line-clamp-2"
                          >
                            {p.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {previewProductsList.length > itemsPerPage && (
                  <button
                    onClick={() => setProductStartIndex((prev) => Math.min(prev + 1, maxStartIndex))}
                    disabled={productStartIndex >= maxStartIndex}
                    className={`absolute right-[-45px] xl:right-[-65px] top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center transition-colors select-none z-10 ${
                      productStartIndex >= maxStartIndex
                        ? 'text-stone-300 opacity-45 pointer-events-none cursor-default'
                        : 'text-stone-500 hover:text-solar-yellow-500 cursor-pointer'
                    }`}
                    aria-label="Next Product"
                  >
                    <ChevronRight className="w-10 h-10 stroke-[2.5]" />
                  </button>
                )}

                {/* Inline arrows below grid on smaller viewports */}
                {previewProductsList.length > itemsPerPage && (
                  <div className="flex items-center justify-center gap-6 mt-8 lg:hidden">
                    <button
                      onClick={() => setProductStartIndex((prev) => Math.max(0, prev - 1))}
                      disabled={productStartIndex === 0}
                      className={`flex items-center justify-center transition-all select-none p-2 ${
                        productStartIndex === 0
                          ? 'text-stone-300 opacity-45 pointer-events-none cursor-default'
                          : 'text-stone-600 hover:text-solar-yellow-600 cursor-pointer active:scale-90'
                      }`}
                      aria-label="Previous Product"
                    >
                      <ChevronLeft className="w-8 h-8 stroke-[2.5]" />
                    </button>

                    {/* Sliding pagination dots in the middle */}
                    <div className="flex items-center gap-1.5 px-2">
                      {Array.from({ length: maxStartIndex + 1 }).map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setProductStartIndex(dotIdx)}
                          className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            productStartIndex === dotIdx
                              ? 'w-5 bg-solar-yellow-500'
                              : 'w-2 bg-stone-300 hover:bg-stone-400'
                          }`}
                          aria-label={`Go to slide ${dotIdx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setProductStartIndex((prev) => Math.min(prev + 1, maxStartIndex))}
                      disabled={productStartIndex >= maxStartIndex}
                      className={`flex items-center justify-center transition-all select-none p-2 ${
                        productStartIndex >= maxStartIndex
                          ? 'text-stone-300 opacity-45 pointer-events-none cursor-default'
                          : 'text-stone-600 hover:text-solar-yellow-600 cursor-pointer active:scale-90'
                      }`}
                      aria-label="Next Product"
                    >
                      <ChevronRight className="w-8 h-8 stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </section>

      {/* 6. WHY CHOOSE US SECTION (Asymmetrical Split) */}
      <section id="why-choose-us" className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* Left Side Column: Large high-contrast text card block aligned to stretch to equal height */}
            <div className="lg:col-span-5 flex flex-col relative group">
              {/* Offset shadow background block (Yellow) */}
              <div className="absolute inset-0 bg-solar-yellow-500 border border-solar-yellow-500 rounded-3xl -translate-x-3 translate-y-3 md:-translate-x-3.5 md:translate-y-3.5 transition-transform group-hover:-translate-x-2 group-hover:translate-y-2 duration-300" />
              
              <div className="w-full h-full relative bg-forest-900 text-white rounded-3xl p-8 sm:p-10 border-2 border-solar-yellow-500 shadow-2xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-solar-yellow-500 rounded-full blur-3xl opacity-10" />
                  
                  <span className="text-[11px] font-mono uppercase tracking-widest text-solar-yellow-400 font-bold block mb-4">
                    Uncompromised Integrity
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-6">
                    Built Different.<br />Engineered for Performance.
                  </h3>
                  
                  <p className="text-stone-300 leading-relaxed text-sm sm:text-base font-light mb-8">
                    We refuse to sell low-grade components or perform cookie-cutter installs. Our primary directive is to maximize actual kilowatt-hour production. That means custom roof engineering, perfect angle offsets, premium structural clamps, and standard circuit testing.
                  </p>
                </div>

                <div className="pt-6 border-t border-forest-800 flex items-center gap-4 mt-auto">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center font-mono text-[10px] font-bold ring-2 ring-forest-900 text-white">99%</div>
                    <div className="w-8 h-8 rounded-full bg-solar-yellow-500 flex items-center justify-center font-mono text-[10px] font-bold ring-2 ring-forest-900 text-forest-950 font-sans">ROI</div>
                  </div>
                  <div>
                    <span className="text-xs text-stone-300 font-mono block">Active Performance Rating</span>
                    <span className="text-sm font-bold text-white block">100% Roof Area Optimization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Column: Stacked list of 3 vertical value pillars aligned height-wise */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-6">
              <ul className="space-y-6 h-full flex flex-col justify-between">
                {valuePillarsData.map((pillar, i) => (
                  <li
                    key={pillar.id}
                    className="group flex gap-6 sm:gap-8 bg-stone-50/60 hover:bg-forest-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/75 transition-all duration-300 flex-1 flex items-center hover:shadow-md"
                  >
                    {/* Big double-digit number + diagonal slash visual separation */}
                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                      <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-forest-900 tracking-tighter leading-none select-none">
                        0{pillar.id}
                      </span>
                      <span className="text-stone-300/80 font-light text-2xl sm:text-4.5xl select-none leading-none">/</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-lg sm:text-xl font-extrabold text-forest-950 mb-2 leading-tight group-hover:text-forest-800 transition-colors">
                        {pillar.title}
                      </h4>
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                        {pillar.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIAL SECTION (3-Column Grid) */}
      <section id="testimonials" className="py-20 lg:py-28 bg-forest-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <span className="text-xs font-mono uppercase tracking-widest text-solar-yellow-600 font-bold block mb-4">
              Real-World Verified Gains
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-forest-900 tracking-tight leading-none mb-6">
              Let Our Savings Do the Talking
            </h2>
            <p className="text-stone-600 font-sans text-base sm:text-lg">
              We monitor home energy accounts live. Read verified statements from industrial partners and private homeowners alike who made the Powershift switch.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white border border-stone-200 rounded-2xl p-8 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-250 relative"
                id={`testimonial-card-${testimonial.id}`}
              >
                <div>
                  {/* Rating block */}
                  <div className="flex items-center gap-1 text-solar-yellow-500 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-solar-yellow-500 animate-pulse text-solar-yellow-600" />
                    ))}
                  </div>

                  {/* Quote block */}
                  <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-sans mb-8">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Author Block */}
                <div className="pt-6 border-t border-stone-100 flex items-center gap-4">
                  {testimonial.imageUrl ? (
                    <img
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-forest-100 shadow-sm"
                      src={testimonial.imageUrl}
                      alt={testimonial.author}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-forest-800 rounded-full flex items-center justify-center text-white ring-2 ring-forest-100">
                      <span className="font-mono font-bold text-sm text-solar-yellow-500">
                        {testimonial.author.split(' ').pop()?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h5 className="font-display font-bold text-stone-900 text-sm sm:text-base leading-tight">
                      {testimonial.author}
                    </h5>
                    <span className="text-xs text-stone-500 block">
                      {testimonial.role} — <strong className="font-mono text-[9px] uppercase font-semibold text-forest-700">{testimonial.location}</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
          <SpecialOffersGallery noSectionWrapper={true} />

        </div>
      </section>

      {/* 8. CTA SECTION (Layout: Full-Width High-Contrast Contact Banner) */}
      <section id="contact" className="relative bg-forest-950 text-white py-20 sm:py-24 border-t-2 border-[#808000] overflow-hidden">
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
              onClick={() => {
                setCurrentPage('free-quote');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group inline-flex items-center gap-3 bg-solar-yellow-500 hover:bg-solar-yellow-400 text-forest-950 px-8 py-4 rounded-xl font-display font-black text-base tracking-wider shadow-lg hover:shadow-solar-yellow-500/20 transition-all duration-300 transform active:scale-95 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>GET STARTED NOW</span>
              <ArrowRight className="w-5 h-5 text-forest-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group inline-flex items-center gap-3 bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl font-display font-black text-base tracking-wider transition-all duration-300 transform active:scale-95 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>EXPLORE OUR SERVICES</span>
            </button>
          </div>
        </div>
      </section>
        </>
      ) : currentPage === 'about' ? (
        <AboutPage 
          onStartConsultation={() => navigateToSection('contact')} 
          onExploreServices={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        />
      ) : currentPage === 'services' ? (
        <ServicesPage
          onStartConsultation={() => navigateToSection('contact')}
          onSelectService={(id) => {
            let projectType = 'Residential';
            if (id === 2 || id === 3 || id === 7) projectType = 'Commercial';
            else if (id === 4 || id === 5) projectType = 'Off-Grid';
            
            setFormData(prev => ({
              ...prev,
              projectType: projectType,
              message: `Hi Powershift team, I am interested in inquiring about your solar services.`
            }));
            navigateToSection('contact');
          }}
          onExploreServices={() => { setCurrentPage('portfolio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      ) : currentPage === 'portfolio' ? (
        <PortfolioPage
          onStartConsultation={() => navigateToSection('contact')}
          onSelectService={(id) => {
            navigateToService(id);
          }}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
            setCurrentPage('project-details');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreServices={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      ) : currentPage === 'products' ? (
        <ProductsPage
          onStartConsultation={() => navigateToSection('contact')}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            setCurrentPage('product-details');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExploreServices={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          selectedCategories={selectedProductCategories}
          onSelectedCategoriesChange={setSelectedProductCategories}
        />
      ) : currentPage === 'product-details' ? (
        <ProductDetailsPage
          productId={selectedProductId}
          onBack={() => {
            setCurrentPage('products');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectProduct={(id) => {
            setSelectedProductId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartConsultation={() => navigateToSection('contact')}
          onExploreServices={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onSelectCategory={(category) => setSelectedProductCategories([category])}
        />
      ) : currentPage === 'project-details' ? (
        <ProjectDetailsPage
          projectId={selectedProjectId}
          onBack={() => {
            setCurrentPage('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onStartConsultation={() => navigateToSection('contact')}
          onExploreServices={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
      ) : currentPage === 'privacy' ? (
        <PrivacyPolicyPage
          onBack={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentPage === 'terms' ? (
        <TermsOfUsePage
          onBack={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentPage === 'safety' ? (
        <SafetyStandardPage
          onBack={() => {
            setCurrentPage('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <FreeQuotePage />
      )}

      {/* FOOTER */}
      <footer className="bg-forest-950 text-white border-t border-forest-900/60 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-900/80">
            {/* Column 1: Info & Brand */}
            <div className="space-y-4 lg:col-span-4">
              <img
                src="https://lh3.googleusercontent.com/d/1Sjk5AyJUHg4LPT6_4FeUYRVJUJnUtNRE"
                alt="Powershift Solar Logo"
                className="h-[60px] w-auto object-contain mb-2 animate-pulse-slow"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                Powershift Solar delivers premium, Tier-1 engineered solar power solutions across the Philippines, establishing the absolute gold standard of clean energy performance and structural integrity.
              </p>
              <div className="flex items-center gap-3 pt-2" id="footer-social-media-links">
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-forest-900/40 hover:bg-solar-yellow-500 hover:text-forest-950 flex items-center justify-center text-stone-300 transition-all duration-300 border border-forest-800/50 cursor-pointer"
                    aria-label="Facebook"
                    id="footer-social-fb"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-forest-900/40 hover:bg-solar-yellow-500 hover:text-forest-950 flex items-center justify-center text-stone-300 transition-all duration-300 border border-forest-800/50 cursor-pointer"
                    aria-label="Instagram"
                    id="footer-social-ig"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a
                    href={socialLinks.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-forest-900/40 hover:bg-solar-yellow-500 hover:text-forest-950 flex items-center justify-center text-stone-300 transition-all duration-300 border border-forest-800/50 cursor-pointer"
                    aria-label="Tiktok"
                    id="footer-social-tt"
                  >
                    <Video className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Our Services */}
            <div className="space-y-4 lg:col-span-3">
              <div>
                <h4 className="text-xs font-mono font-black tracking-widest text-solar-yellow-400 uppercase">
                  Our Services
                </h4>
                <div className="h-[1px] w-10 bg-solar-yellow-500 mt-1.5" id="footer-underline-services"></div>
              </div>
              <ul className="space-y-1 text-xs font-mono text-stone-400">
                <li>
                  <button 
                    onClick={() => navigateToService(1)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Residential Solar Engineering
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(2)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Commercial Rooftop Microgrids
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(3)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Industrial Scale Arrays
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(4)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Hybrid Battery Storage / BESS
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(5)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Pure Off-Grid Power Systems
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(6)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Smart Net Metering Integration
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(7)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Solar Microgrid Design
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(8)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    System Optimization & Panel Wash
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigateToService(9)} 
                    className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer"
                  >
                    Technical Feasibility & Energy Audits
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Navigation */}
            <div className="space-y-4 lg:col-span-2">
              <div>
                <h4 className="text-xs font-mono font-black tracking-widest text-solar-yellow-400 uppercase">
                  Quick Links
                </h4>
                <div className="h-[1px] w-10 bg-solar-yellow-500 mt-1.5" id="footer-underline-links"></div>
              </div>
              <ul className="space-y-1.5 text-xs font-mono text-stone-400">
                <li>
                  <button onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage('portfolio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer">
                    Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full text-left py-1 hover:text-solar-yellow-500 transition-colors cursor-pointer">
                    Products
                  </button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage('free-quote'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="w-full text-left py-1 text-solar-yellow-400 font-bold hover:text-solar-yellow-300 transition-colors cursor-pointer">
                    Get A Quotation
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Hotline & Support */}
            <div className="space-y-4 lg:col-span-3">
              <div>
                <h4 className="text-xs font-mono font-black tracking-widest text-solar-yellow-400 uppercase">
                  Contact Details & Address
                </h4>
                <div className="h-[1px] w-10 bg-solar-yellow-500 mt-1.5" id="footer-underline-ops"></div>
              </div>
              <ul className="space-y-2.5 text-xs font-mono text-stone-400">
                <li className="flex flex-col">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Office Address</span>
                  <span className="text-stone-300 font-sans font-medium text-xs mt-0.5">Dasmarinas Cavite, Cavite, Philippines, 4114</span>
                </li>
                <li className="flex flex-col">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Company Number</span>
                  <a href="tel:09354796321" className="text-stone-300 hover:text-solar-yellow-500 transition-colors font-sans font-medium text-xs mt-0.5">0935 479 6321</a>
                </li>
                <li className="flex flex-col">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Company Email</span>
                  <a href="mailto:c2r2gsm@gmail.com" className="text-stone-300 hover:text-solar-yellow-500 transition-colors font-sans font-medium text-xs mt-0.5">c2r2gsm@gmail.com</a>
                </li>
                <li className="flex flex-col">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">Operating Hours</span>
                  <span className="text-stone-300 font-sans font-medium text-xs mt-0.5">Mon - Sat: 9 AM - 5 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Block */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-stone-500">
            <div>
              &copy; {new Date().getFullYear()} Powershift Solar. All engineering assets and system layouts are proprietary.
            </div>
            <div className="flex gap-4">
              <button onClick={() => { window.location.href = '/admin.html'; }} className="hover:text-solar-yellow-500 transition-colors cursor-pointer uppercase">Admin Portal</button>
              <span className="text-stone-700">|</span>
              <button onClick={() => { setCurrentPage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-solar-yellow-500 transition-colors cursor-pointer uppercase">Privacy Policy</button>
              <span className="text-stone-700">|</span>
              <button onClick={() => { setCurrentPage('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-solar-yellow-500 transition-colors cursor-pointer uppercase">Terms of Use</button>
              <span className="text-stone-700">|</span>
              <button onClick={() => { setCurrentPage('safety'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-solar-yellow-500 transition-colors cursor-pointer uppercase">Safety Standard Compliance</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Widget Overlay */}
      <div className="fixed bottom-6 right-6 z-50 font-sans flex flex-col items-end gap-3 pointer-events-none">
        <AnimatePresence>
          {chatWidgetState === 'chatbot' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 150 }}
              className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-2xl border border-stone-200/80 flex flex-col overflow-hidden z-50 animate-in pointer-events-auto"
            >
              {/* Chat Header: Deep Forest Green (#05300a) */}
              <div className="bg-[#05300a] px-4 py-4 flex items-center justify-between text-white border-b border-[#093613] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#042407] flex items-center justify-center overflow-hidden">
                      <img src="https://img.icons8.com/?size=100&id=IuR8B5VlsFxh&format=png&color=C8AC0C" alt="Powershift AI" className="w-[33px] h-[33px] object-contain" referrerPolicy="no-referrer" />
                    </div>
                    {/* Active Online indicator dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-sm leading-tight text-white uppercase tracking-wider">Powershift AI</h3>
                    <p className="text-[10px] text-[#c8ac0c] font-mono tracking-widest flex items-center gap-1 mt-0.5">
                      ONLINE ASSISTANT
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Return to channels menu */}
                  <button
                    onClick={() => setChatWidgetState('menu')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer"
                    title="Back to Channels"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                  {/* Close completely */}
                  <button
                    onClick={() => setChatWidgetState('closed')}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer"
                    title="Minimize Chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message scrollable area with subtle gray background */}
              <div className="flex-1 overflow-y-auto p-4 bg-stone-50 space-y-4 flex flex-col min-h-0">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                        isUser 
                          ? 'bg-[#05300a] text-white rounded-br-none' 
                          : 'bg-white text-stone-800 border border-stone-200/50 rounded-bl-none'
                      }`}>
                        {renderMessageText(msg.text, isUser)}
                        <span className={`block text-[9px] mt-1.5 font-mono ${
                          isUser ? 'text-white/60 text-right' : 'text-stone-400'
                        }`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Pre-populated standard clickable technical inquiry selection buttons */}
                {chatMessages.length === 1 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-black leading-none mb-1">
                      Frequently Asked
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleSendChatMessage(undefined, "How much can I save with solar?")}
                        className="w-full text-left bg-white hover:bg-stone-100 border border-stone-200 text-xs px-3.5 py-2.5 rounded-xl block font-medium hover:border-[#05300a] transition-all cursor-pointer"
                      >
                        How much can I save with solar?
                      </button>
                      <button
                        onClick={() => handleSendChatMessage(undefined, "Inquire about Net Metering")}
                        className="w-full text-left bg-white hover:bg-stone-100 border border-stone-200 text-xs px-3.5 py-2.5 rounded-xl block font-medium hover:border-[#05300a] transition-all cursor-pointer"
                      >
                        Inquire about Net Metering
                      </button>
                      <button
                        onClick={() => handleSendChatMessage(undefined, "Request an Energy Audit")}
                        className="w-full text-left bg-white hover:bg-stone-100 border border-stone-200 text-xs px-3.5 py-2.5 rounded-xl block font-medium hover:border-[#05300a] transition-all cursor-pointer"
                      >
                        Request an Energy Audit
                      </button>
                      <button
                        onClick={() => handleSendChatMessage(undefined, "View Solar Array Specs")}
                        className="w-full text-left bg-white hover:bg-stone-100 border border-stone-200 text-xs px-3.5 py-2.5 rounded-xl block font-medium hover:border-[#05300a] transition-all cursor-pointer"
                      >
                        View Solar Array Specs
                      </button>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Input Footer: Clean white with Solar Yellow send arrow */}
              <form 
                onSubmit={handleSendChatMessage}
                className="bg-white p-3 border-t border-stone-200/80 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-[#05300a] focus:bg-white transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="w-10 h-10 rounded-xl bg-[#c8ac0c] hover:bg-[#d4a800] disabled:bg-stone-100 disabled:text-stone-300 text-forest-950 flex items-center justify-center shadow-md transition-all active:scale-95 disabled:pointer-events-none shrink-0 cursor-pointer"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4 fill-current text-forest-950" />
                </button>
              </form>
            </motion.div>
          )}

          {chatWidgetState === 'menu' && (
            // Old menu block removed to avoid vertical display
            null
          )}

          {(chatWidgetState === 'viber' || chatWidgetState === 'messenger' || chatWidgetState === 'whatsapp') && (() => {
            const platform = chatWidgetState;
            
            // Define styling and properties dynamically
            let headerBg = 'bg-[#0084FF]';
            let borderBg = 'border-[#0072DB]';
            let title = 'Messenger Support';
            let subtitle = 'MESSENGER CHAT';
            let themeColor = '#0084FF';
            let channelName = 'Messenger';
            
            let icon = (
              <img src="https://img.icons8.com/?size=100&id=4PiUK80MorY7&format=png&color=FFFFFF" alt="Messenger" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
            );

            if (platform === 'viber') {
              headerBg = 'bg-[#7309F3]';
              borderBg = 'border-[#6208de]';
              title = 'Viber Support';
              subtitle = 'VIBER CHAT';
              themeColor = '#7309F3';
              channelName = 'Viber';
              icon = (
                <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/viber-white-icon.png" alt="Viber" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
              );
            } else if (platform === 'whatsapp') {
              headerBg = 'bg-[#25D366]';
              borderBg = 'border-[#20ba5a]';
              title = 'WhatsApp Support';
              subtitle = 'WHATSAPP CHAT';
              themeColor = '#25D366';
              channelName = 'WhatsApp';
              icon = (
                <img src="https://img.icons8.com/?size=100&id=ZeQPTbzIF4jw&format=png&color=FFFFFF" alt="WhatsApp" className="w-5 h-5 object-contain" referrerPolicy="no-referrer" />
              );
            }

            const messageText = `Hello Powershift Solar! I'd like to inquire about your services. Here are my details:
Name: ${routingFormData.name}
Email: ${routingFormData.email}
Phone: ${routingFormData.phone}
Inquiry: ${routingFormData.inquiry}`;

            let redirectUrl = '#';
            if (platform === 'messenger') {
              redirectUrl = `https://m.me/426690707193295?text=${encodeURIComponent(platformChatInput)}`;
            } else if (platform === 'viber') {
              redirectUrl = `viber://chat?number=%2B639354796321&draft=${encodeURIComponent(platformChatInput)}`;
            } else if (platform === 'whatsapp') {
              redirectUrl = `https://wa.me/639354796321?text=${encodeURIComponent(platformChatInput)}`;
            }

            return (
              <motion.div
                key={platform}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-2xl border border-stone-200/80 flex flex-col overflow-hidden z-50 animate-in pointer-events-auto"
              >
                {/* Dynamic Channel Header */}
                <div className={`${headerBg} px-4 py-4 flex items-center justify-between text-white border-b ${borderBg} shrink-0`}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                        {icon}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-sm leading-tight text-white uppercase tracking-wider">{title}</h3>
                      <p className="text-[10px] text-white/90 font-mono tracking-widest flex items-center gap-1 mt-0.5">
                        {subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setChatWidgetState('menu')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer"
                      title="Back to Channels"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setChatWidgetState('closed')}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/85 hover:text-white transition-all cursor-pointer"
                      title="Minimize Chat"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main body of the Chatbox */}
                <div className="flex-1 overflow-y-auto p-4 bg-stone-50 flex flex-col justify-between min-h-0 space-y-4">
                  {/* Chat Message Box mimicking welcome message */}
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="flex justify-start">
                      <div className="max-w-[90%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-sm bg-white text-stone-800 border border-stone-200/50 rounded-bl-none leading-relaxed">
                        <p className="font-medium mb-1 text-stone-900">
                          Welcome to Powershift {channelName}! 👋
                        </p>
                        <p className="text-stone-600 text-xs leading-relaxed">
                          Please let us know your details (such as Name, Email, and Phone number) and your inquiry in your message. Type your message below and press Send to launch our official {channelName} channel!
                        </p>
                        <span className="block text-[9px] mt-1.5 font-mono text-stone-400">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Quick suggestion tags to auto fill */}
                    <div className="space-y-2 pt-2">
                      <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold">Suggested starters:</p>
                      <div className="flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPlatformChatInput("Hi Powershift! My name is [Name], my email is [Email], and my phone is [Phone]. I'd like to get a free solar quote for my home.")}
                          className="text-left bg-white hover:bg-stone-100 border border-stone-200 text-xs px-3 py-2 rounded-xl block font-medium transition-all text-stone-700 cursor-pointer hover:border-stone-400 active:scale-[0.98]"
                        >
                          "Hi Powershift! I'd like to get a free solar quote..."
                        </button>
                        <button
                          type="button"
                          onClick={() => setPlatformChatInput("Hello! My name is [Name] (email: [Email], phone: [Phone]). I am inquiring about solar panel pricing and net metering.")}
                          className="text-left bg-white hover:bg-stone-100 border border-stone-200 text-xs px-3 py-2 rounded-xl block font-medium transition-all text-stone-700 cursor-pointer hover:border-stone-400 active:scale-[0.98]"
                        >
                          "Hello! I am inquiring about solar pricing..."
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submission and Redirect button block */}
                  <div className="pt-2 border-t border-stone-200/60 shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (platformChatInput.trim()) {
                          window.open(redirectUrl, '_blank', 'noopener,noreferrer');
                          setPlatformChatInput('');
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={platformChatInput}
                        onChange={(e) => setPlatformChatInput(e.target.value)}
                        placeholder="Type name, contact, inquiry..."
                        className="flex-1 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:bg-white transition-all font-medium"
                      />
                      <button
                        type="submit"
                        disabled={!platformChatInput.trim()}
                        className="w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-md transition-all active:scale-95 disabled:bg-stone-100 disabled:text-stone-300 disabled:pointer-events-none shrink-0 cursor-pointer"
                        style={{ backgroundColor: platformChatInput.trim() ? themeColor : '#f5f5f4' }}
                        aria-label="Send via Platform"
                      >
                        <Send className="w-4 h-4 fill-current" />
                      </button>
                    </form>
                    <span className="block text-center text-[10px] text-stone-400 mt-2 font-mono">
                      Pressing Send opens your local {channelName} app securely.
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* FAB (Closed state trigger and unread notification badge) */}
        {/* Bottom row containing the rollout menu and the persistent FAB */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Rollout Menu (animating to the left of the FAB) */}
          <AnimatePresence>
            {chatWidgetState === 'menu' && (
              <motion.div
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.8 }}
                transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                className="flex items-center gap-2.5"
              >
                {/* Button 1: WhatsApp Circle Button */}
                <button
                  onClick={() => setChatWidgetState('whatsapp')}
                  className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md transform hover:scale-105 active:scale-95"
                  title="Message on WhatsApp"
                >
                  <img src="https://img.icons8.com/?size=100&id=ZeQPTbzIF4jw&format=png&color=FFFFFF" alt="WhatsApp" className="w-6.5 h-6.5 object-contain" referrerPolicy="no-referrer" />
                </button>

                {/* Button 2: Messenger Circle Button */}
                <button
                  onClick={() => setChatWidgetState('messenger')}
                  className="w-12 h-12 rounded-full bg-[#0084FF] hover:bg-[#0072DB] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md transform hover:scale-105 active:scale-95"
                  title="Message on Messenger"
                >
                  <img src="https://img.icons8.com/?size=100&id=4PiUK80MorY7&format=png&color=FFFFFF" alt="Messenger" className="w-6.5 h-6.5 object-contain" referrerPolicy="no-referrer" />
                </button>

                {/* Button 3: Viber Circle Button */}
                <button
                  onClick={() => setChatWidgetState('viber')}
                  className="w-12 h-12 rounded-full bg-[#7309F3] hover:bg-[#6208de] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md transform hover:scale-105 active:scale-95"
                  title="Message on Viber"
                >
                  <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/viber-white-icon.png" alt="Viber" className="w-6.5 h-6.5 object-contain" referrerPolicy="no-referrer" />
                </button>

                {/* Button 3: AI Chatbot Button */}
                <button
                  onClick={() => setChatWidgetState('chatbot')}
                  className="w-[53px] h-[53px] rounded-full bg-[#05300a] hover:bg-[#063B14] text-white flex items-center justify-center transition-colors cursor-pointer shadow-md transform hover:scale-105 active:scale-95 relative group overflow-hidden"
                  title="Chat with Powershift AI"
                >
                  <img src="https://img.icons8.com/?size=100&id=IuR8B5VlsFxh&format=png&color=C8AC0C" alt="Chatbot" className="w-[34px] h-[34px] object-contain" referrerPolicy="no-referrer" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Persistent FAB Trigger Button */}
          <button
            onClick={() => {
              setShowChatBadge(false);
              if (chatWidgetState === 'closed') {
                setChatWidgetState('menu');
              } else {
                setChatWidgetState('closed');
              }
            }}
            className="w-14 h-14 rounded-full bg-[#063B14] hover:bg-[#05300a] shadow-xl hover:scale-105 active:scale-95 transition-all text-white flex items-center justify-center cursor-pointer relative group shrink-0"
            aria-label="Toggle Chat Channels"
          >
            {/* Outer slow pulse indicator that is forest green */}
            <span className="absolute -inset-1 rounded-full bg-[#063B14]/20 animate-pulse -z-10 group-hover:scale-110 transition-all duration-300" />
            
            {/* The Number Notifier badge - only shown when closed and showChatBadge is true */}
            {chatWidgetState === 'closed' && showChatBadge && (
              <span className="absolute -top-1 -right-1 w-5.5 h-5.5 bg-[#c8ac0c] text-stone-900 font-sans font-black text-[11px] rounded-full flex items-center justify-center border-2 border-white shadow-md leading-none z-20">
                1
              </span>
            )}

            {/* Message outline symbol or close cross depending on state */}
            <AnimatePresence mode="wait">
              {chatWidgetState === 'closed' ? (
                <motion.div
                  key="message-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <MessageSquare className="w-6 h-6 text-white stroke-[2.5]" />
                </motion.div>
              ) : (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6 text-white stroke-[2.5]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Elegant Speech Bubble saying 'Contact Now' on the left - only shown when closed */}
            {chatWidgetState === 'closed' && (
              <div className="absolute right-full mr-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <div className="bg-white text-[#063B14] border border-[#063B14] font-display uppercase font-black tracking-widest text-[10px] px-3.5 py-2 rounded-xl shadow-md whitespace-nowrap relative flex items-center">
                  Contact Now
                  {/* Arrow pointing to the FAB with matching outline */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%-1px)] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-white z-10" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-[#063B14]" />
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
