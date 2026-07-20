import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-stone-50 text-stone-850 min-h-screen pb-20"
      id="privacy-policy-page"
    >
      {/* Hero Header */}
      <section className="relative min-h-[30vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-20 mb-12">
        {/* Full-width premium background of utility-scale solar arrays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg"
            alt="Privacy Policy hero background"
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
              Privacy Policy
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Body - Flat & Open Layout */}
        <div className="space-y-12 font-sans font-light text-stone-700 leading-relaxed text-sm">
          
          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              1. Core Commitment to Information Security
            </h2>
            <p>
              At Powershift Solar, we prioritize the secure handling of your private telemetry and structural energy data. We are dedicated to ensuring that your details—such as rooftop solar blueprints, active electrical loads, grid offset data, and digital consult metadata—are safeguarded using state-of-the-art encryption layers. No telemetry is shared with uncertified or unvetted external utility contractors without direct manual consent from the primary account supervisor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              2. Types of Telemetry & Core Data Collected
            </h2>
            <p>
              When utilizing the Powershift Solar ecosystem, we collect data to provide, audit, and improve solar installations:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Identity Parameters:</strong> Your full name, contact information, billing records, and structural property location parameters.
              </li>
              <li>
                <strong>Solar Telemetry Data:</strong> Real-time PV generation stats, load profiles, inverter battery capacities, and ambient temperature readouts.
              </li>
              <li>
                <strong>Consultation Metadata:</strong> Your inputs to the dynamic ROI calculators, design preferences, and communication records with our engineering staff.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              3. Data Retention, Processing & Storage Limits
            </h2>
            <p>
              We process information in accordance with national Data Privacy legislation. Standard operational telemetry (e.g., historical PV yield data) is archived for up to 10 years to support structural solar asset warranties. Personal identifiers are heavily sandboxed and can be permanently purged upon verified account closure requests, unless required otherwise for building-permit compliance or municipal net-metering legal frameworks.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              4. Encryption Protocols & Security Safeguards
            </h2>
            <p>
              All customer telemetry transit is encrypted under TLS 1.3 protocols, and stationary server databases are fortified with 256-bit AES encryption. Access permissions are closely audited, restricting entry only to certified field specialists and system administrators.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-forest-950">
              5. Regulatory Compliance and Data Portability
            </h2>
            <p>
              Account holders maintain absolute rights to inspect, download, correct, or request the erasure of personal telemetry arrays. Any formal request submitted to our operations desk will be resolved within 14 business days.
            </p>
          </section>

        </div>

        {/* Footer Accent */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-stone-500 font-mono">
            POWERSHIFT SOLAR SYSTEMS CO. // REGULATORY LEGAL DEPT
          </div>
        </div>

      </div>
    </motion.div>
  );
}
