import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Award, HardHat, ShieldCheck, Flame, Zap } from 'lucide-react';

interface SafetyStandardPageProps {
  onBack: () => void;
}

export default function SafetyStandardPage({ onBack }: SafetyStandardPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-stone-50 text-stone-850 min-h-screen pb-20"
      id="safety-standard-page"
    >
      {/* Hero Header */}
      <section className="relative min-h-[30vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-20 mb-12">
        {/* Full-width premium background of utility-scale solar arrays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg"
            alt="Safety Standards hero background"
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
              Safety Standard Compliance
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Body - Flat & Open Layout */}
        <div className="space-y-12 font-sans font-light text-stone-700 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              1. Dual-Stage Overcurrent Protection & Fast Isolation
            </h2>
            <p>
              Every hybrid inverter, battery storage pod, and rooftop PV array installed by Powershift Solar is certified under PEC (Philippine Electrical Code) guidelines. We deploy dual-stage, fast-acting DC isolation switches alongside inline overcurrent fuses on every physical string. This safeguards delicate circuitry from sudden thermal overload during intense grid surges or localized utility grid feedback loops.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              2. Automatic Emergency Rapid Shutdown Technology
            </h2>
            <p>
              In strict accordance with international safety standards, our rooftop structures integrate rapid shutdown receivers (NEC 2020 Sec. 690.12 compliant). In the event of building emergencies or fire department actions, a physical emergency shutoff switch located near the primary billing meter allows system voltage to drop to safe levels in under 30 seconds, protecting utility personnel and first responders.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              3. High Wind-Load Structural Engineering Certified (up to 250 kph)
            </h2>
            <p>
              Due to localized typhoon vulnerabilities across Luzon, Visayas, and Mindanao, Powershift Solar utilizes exclusively non-penetration self-ballasted framing layouts or multi-anchor stainless steel mounting brackets. Every framing plan is reviewed and signed off by a licensed structural engineer, certifying the physical layout is resilient against sustained tropical wind fields of up to 250 kilometers per hour.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              4. Ground-Fault Isolation & Surge Mitigation
            </h2>
            <p>
              All mechanical framing brackets are grounded using solid copper busbars connected directly to dual primary earth ground plates. Our systems feature built-in metal-oxide varistors (MOVs) to route excessive atmospheric lightning spikes away from the inverter buses directly into the ground base.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              5. Active Battery Storage Safe Containment (BESS)
            </h2>
            <p>
              Our chemistry pod selections focus purely on Lithium Iron Phosphate (LiFePO4) cell technology—the absolute global standard for thermal stability. Built-in Battery Management Systems (BMS) monitor individual cell voltage and thermal stats 24/7, providing automatic cell-balancing and dual thermal protection zones to completely mitigate any hazard of thermal runaway.
            </p>
          </section>

        </div>

        {/* Footer Accent */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-500 font-mono">
            POWERSHIFT SOLAR SYSTEMS CO. // CHIEF SAFETY OFFICER DESK
          </div>
        </div>

      </div>
    </motion.div>
  );
}
