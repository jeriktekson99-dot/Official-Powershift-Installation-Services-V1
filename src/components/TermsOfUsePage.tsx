import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Scale, ShieldAlert, CheckCircle, FileText } from 'lucide-react';

interface TermsOfUsePageProps {
  onBack: () => void;
}

export default function TermsOfUsePage({ onBack }: TermsOfUsePageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-stone-50 text-stone-850 min-h-screen pb-20"
      id="terms-of-use-page"
    >
      {/* Hero Header */}
      <section className="relative min-h-[30vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-20 mb-12">
        {/* Full-width premium background of utility-scale solar arrays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg"
            alt="Terms of Use hero background"
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
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
              Terms of Use
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Body - Flat & Open Layout */}
        <div className="space-y-12 font-sans font-light text-stone-700 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              1. Acceptance of Operational Guidelines
            </h2>
            <p>
              By accessing the digital services, dynamic solar estimation systems, and portfolio portals operated by Powershift Solar ("Powershift", "we", "us"), you agree to abide fully by these formal Terms of Use and all applicable safety standards, municipal building permits, and national regulations. If you do not accept these contractual mandates, please cease all usage of our digital software platforms and dynamic services immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              2. Permitted Use & Intellectual Assets
            </h2>
            <p>
              All assets, including solar system blueprints, layout mockups, engineering diagrams, product data sheet specifications, structural calculators, logos, and custom responsive interfaces displayed on this system are the property of Powershift Solar or its respective licensing partners. You are granted a limited, non-exclusive, non-transferable license to access these assets for your own residential or commercial solar design evaluations. You are strictly prohibited from copying, reverse-engineering, scraping, or utilizing these custom layouts for competitive commercial ventures.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              3. Digital Quotation & Calculator Integrity
            </h2>
            <p>
              All estimations, ROI formulas, panel counts, and financial payback calculations provided by the Powershift Solar calculators are engineering models designed to serve as guidance. Actual solar yields depend on localized micro-climate parameters, shading factors, structural roof orientation, and local utility tariff adjustments. A certified Powershift Solar structural engineering audit must be completed on-site before any binding system output guarantees are issued.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              4. Third-Party Integrations & External Portals
            </h2>
            <p>
              Our platforms may feature references or interface elements that connect to municipal net-metering networks or international component manufacturer portals (such as DAH Solar, Deye, or Pylontech). These integrations are provided purely for utility convenience, and we assume no liability for the continuous uptime, exactness, or privacy practices of these third-party operators.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              5. Limitation of System Liability
            </h2>
            <p>
              Powershift Solar shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our digital tools, including but not limited to financial losses from utility billing offsets, server downtime during grid updates, or erroneous user inputs inside the solar ROI form.
            </p>
          </section>

        </div>

        {/* Footer Accent */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-500 font-mono">
            POWERSHIFT SOLAR SYSTEMS CO. // EXECUTIVE LEGAL COUNSEL
          </div>
        </div>

      </div>
    </motion.div>
  );
}
