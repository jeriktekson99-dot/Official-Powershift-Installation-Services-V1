import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSyncSpecialOffers } from '../sync';

interface SpecialOffersGalleryProps {
  noSectionWrapper?: boolean;
}

export default function SpecialOffersGallery({ noSectionWrapper = false }: SpecialOffersGalleryProps) {
  const { offers } = useSyncSpecialOffers();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (offers.length <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    }, 5000); // Automoves every 5 seconds
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [offers]);

  useEffect(() => {
    if (offers.length > 0 && currentIndex >= offers.length) {
      setCurrentIndex(0);
    }
  }, [offers, currentIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (offers.length <= 1) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + offers.length) % offers.length);
    startAutoPlay(); // Reset timer on manual action
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (offers.length <= 1) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
    startAutoPlay(); // Reset timer on manual action
  };

  const handleDotClick = (index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (index === currentIndex || offers.length <= 1) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    startAutoPlay(); // Reset timer on manual action
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    })
  };

  if (offers.length === 0) {
    return null;
  }

  const sliderContent = (
    <div 
      className="relative w-full aspect-[1640/924] rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-stone-200 group select-none"
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
      id="special-offers-carousel-container"
    >
      {/* Slider Image Layout */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={currentIndex}
            src={offers[currentIndex]?.image}
            alt={`Campaign Banner ${offers[currentIndex]?.id}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
      </div>

      {/* Subdued shadow vignette to guarantee clean control contrast */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />

      {/* Left Arrow Button */}
      {offers.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/90 backdrop-blur-md text-white hover:text-forest-950 border border-white/30 transition-all duration-300 opacity-80 md:opacity-0 md:group-hover:opacity-100 shadow-lg cursor-pointer"
          aria-label="Previous Offer Slide"
          id="carousel-btn-prev"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Right Arrow Button */}
      {offers.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/90 backdrop-blur-md text-white hover:text-forest-950 border border-white/30 transition-all duration-300 opacity-80 md:opacity-0 md:group-hover:opacity-100 shadow-lg cursor-pointer"
          aria-label="Next Offer Slide"
          id="carousel-btn-next"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Indicators / Small Circles inside the container */}
      {offers.length > 1 && (
        <div 
          className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10"
          id="carousel-indicators-container"
        >
          {offers.map((offer, idx) => (
            <button
              key={offer.id || idx}
              onClick={(e) => handleDotClick(idx, e)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 border border-white/20 cursor-pointer ${
                idx === currentIndex 
                  ? "bg-solar-yellow-400 scale-110 shadow-md" 
                  : "bg-white/40 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              id={`carousel-dot-${idx}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (noSectionWrapper) {
    return (
      <div className="mt-16 sm:mt-20 max-w-7xl mx-auto w-full" id="special-offers-gallery-embedded">
        {sliderContent}
      </div>
    );
  }

  return (
    <section id="special-offers-gallery" className="py-12 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {sliderContent}
      </div>
    </section>
  );
}
