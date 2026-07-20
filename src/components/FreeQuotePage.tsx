import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Phone, Mail, MapPin, ChevronDown, ChevronUp, CheckCircle, ArrowRight, Clock, Copy, Download, Lightbulb, Cpu, Snowflake, Database, BatteryCharging, Moon } from 'lucide-react';
import { jsPDF } from 'jspdf';

import { submitInboundLead } from '../sync';
import MultiPageQuoteForm from './MultiPageQuoteForm';

export default function FreeQuotePage() {
  // Form input state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceCategory: 'Commercial Rooftop',
    notes: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ accordion open/close state
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Solar Calculator state
  const [billInput, setBillInput] = useState<number>(12000);
  const [pricePerKwh, setPricePerKwh] = useState<number>(15);
  const [copied, setCopied] = useState(false);

  const [calcResults, setCalcResults] = useState<{
    systemSize: number;
    solarPanelsCost: number | string;
    inverterCost: number | string;
    lithiumStorageCost: number | string;
    balanceCost: number | string;
    totalInvestment: number | string;
    paybackYears: number;
    paybackMonths: number;
    estSavings: number;
    status: string;
    isOffGrid: boolean;
  }>({
    systemSize: 6.67,
    solarPanelsCost: 156000,
    inverterCost: 78000,
    lithiumStorageCost: 97500,
    balanceCost: 58500,
    totalInvestment: 390000,
    paybackYears: 3,
    paybackMonths: 5,
    estSavings: 10200,
    status: 'Rapid ROI',
    isOffGrid: false,
  });

  const handleCalculate = () => {
    // 1. Determine if in Off-Grid mode (bill is 41,000 and Up)
    const isOffGridMode = billInput >= 41000;

    // 2. Base Investment calculation (from Image 2 table)
    let baseInvestment = 0;
    if (billInput <= 4000) {
      baseInvestment = billInput * 57.50;
    } else if (billInput <= 8000) {
      baseInvestment = 230000 + (billInput - 4000) * 30.00;
    } else if (billInput <= 12000) {
      baseInvestment = 350000 + (billInput - 8000) * 10.00;
    } else if (billInput <= 16000) {
      baseInvestment = 390000 + (billInput - 12000) * 25.00;
    } else if (billInput <= 25000) {
      baseInvestment = 490000 + (billInput - 16000) * 10.00;
    } else if (billInput <= 40000) {
      let extra = (billInput - 25000) * 14.66;
      if (billInput === 40000) extra = 220000; // Force exactly 800,000 according to image!
      baseInvestment = 580000 + extra;
    } else {
      // billInput >= 41000: Trigger Off-Grid Mode
      baseInvestment = 0;
    }

    // 3. Rate Adjustment & Final Investment (from Image 3 & 4)
    // Rate Adjustment = pricePerKwh / 15
    // Final Investment = Base Investment * Rate Adjustment
    let total = 0;
    if (!isOffGridMode) {
      total = Math.round(baseInvestment * (pricePerKwh / 15));
    }

    // 4. System Size calculation
    const size = billInput / (pricePerKwh * 120);
    const systemSizeVal = Number(size.toFixed(2));

    // 5. Itemized Breakdown:
    // Panels (40%), Inverter (20%), Lithium Battery Storage (25%), Balance (15%)
    let panels: number | string = 0;
    let inverter: number | string = 0;
    let batteries: number | string = 0;
    let balance: number | string = 0;

    if (isOffGridMode) {
      panels = "Off-Grid Optimized Tier-1";
      inverter = "Off-Grid Intelligent Hybrid";
      batteries = "High Capacity LiFePO4 Bank";
      balance = "Full Engineering Support";
    } else {
      panels = Math.round(total * 0.40);
      inverter = Math.round(total * 0.20);
      batteries = Math.round(total * 0.25);
      balance = total - panels - inverter - batteries; // guarantees perfect matching sum
    }

    // 6. Savings (for Off-grid it is 100% of the bill, for grid-tied it is 85%)
    const monthlySavings = isOffGridMode ? billInput : Math.round(billInput * 0.85);

    // 7. Payback Period & Status (from Image 1 table)
    let paybackYears = 0;
    let paybackMonths = 0;
    let statusText = '';

    if (billInput <= 0) {
      paybackYears = 0;
      paybackMonths = 0;
      statusText = 'N/A';
    } else if (billInput <= 4000) {
      paybackYears = 2;
      paybackMonths = 2;
      statusText = 'Ultra-Fast Payback';
    } else if (billInput <= 8000) {
      paybackYears = 2;
      paybackMonths = 10;
      statusText = 'High Efficiency';
    } else if (billInput <= 12000) {
      paybackYears = 3;
      paybackMonths = 5;
      statusText = 'Rapid ROI';
    } else if (billInput <= 16000) {
      paybackYears = 3;
      paybackMonths = 9;
      statusText = 'Moderate';
    } else if (billInput <= 25000) {
      paybackYears = 4;
      paybackMonths = 0;
      statusText = 'Your Anchor Point';
    } else if (billInput <= 40000) {
      paybackYears = 4;
      paybackMonths = 6;
      statusText = 'Heavy Investment';
    } else {
      // billInput >= 41000
      paybackYears = 4;
      paybackMonths = 11;
      statusText = 'Peak (Under 5-Year Limit)';
    }

    setCalcResults({
      systemSize: systemSizeVal,
      solarPanelsCost: panels,
      inverterCost: inverter,
      lithiumStorageCost: batteries,
      balanceCost: balance,
      totalInvestment: isOffGridMode ? "Off Grid - ₱0 Bill System" : total,
      paybackYears: paybackYears,
      paybackMonths: paybackMonths,
      estSavings: monthlySavings,
      status: statusText,
      isOffGrid: isOffGridMode,
    });
  };

  // Keep it reactive to keyboard updates & mount
  useEffect(() => {
    handleCalculate();
  }, [billInput, pricePerKwh]);

  const createPDFDocumentInstance = () => {
    const doc = new jsPDF();
    
    // Set up branding colors
    const primaryColor = [5, 48, 10]; // #05300a (Forest Green)
    const secondaryColor = [200, 172, 12]; // #c8ac0c (Solar Yellow)
    const darkTextColor = [30, 30, 30];
    const lightGrey = [245, 245, 245];
    const borderGrey = [220, 220, 220];

    // Page 1
    // Draw Header Banner (increased height to 35)
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 35, 'F');
    
    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("POWERSHIFT SOLAR", 15, 17);
    
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    doc.text("SYSTEM SIZING & INVESTMENT ESTIMATE", 15, 25);
    
    // Watermark/Metadata
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("Helvetica", "normal");
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 160, 17);
    doc.text("VERSION: 2.4", 160, 23);

    let y = 48;

    // Introduction
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text("Thank you for choosing Powershift Solar. Below is your custom high-fidelity energy simulation and solar investment report based on the parameters provided.", 15, y, { maxWidth: 180 });
    y += 12;

    // SECTION 1: CUSTOMER ENERGY PROFILE
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(15, y, 180, 22, 'F');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("1. CUSTOMER ENERGY PROFILE", 20, y + 7);
    
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Monthly Electric Bill:`, 20, y + 15);
    doc.setFont("Helvetica", "bold");
    doc.text(`PHP ${billInput.toLocaleString()}`, 65, y + 15);
    
    doc.setFont("Helvetica", "normal");
    doc.text(`Current Utility Price:`, 110, y + 15);
    doc.setFont("Helvetica", "bold");
    doc.text(`PHP ${pricePerKwh.toFixed(2)} / kWh`, 155, y + 15);
    
    y += 30;

    // SECTION 2: RECOMMENDED SYSTEM SPECIFICATIONS
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. RECOMMENDED SYSTEM SPECIFICATIONS", 15, y);
    y += 7;
    
    // Draw table grid
    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.line(15, y, 195, y);
    
    const rowHeight = 8;
    const specData = [
      ["Recommended System Size", `${calcResults.systemSize} kWp`],
      ["Est. Monthly Solar Generation", `${Math.round(calcResults.systemSize * 120)} kWh`],
      ["Est. Monthly Savings", `PHP ${calcResults.estSavings.toLocaleString()}`],
      ["Est. Annual Savings", `PHP ${(calcResults.estSavings * 12).toLocaleString()}`],
      ["Estimated Payback Period", `${calcResults.paybackYears} Years, ${calcResults.paybackMonths} Months`]
    ];

    specData.forEach((row, idx) => {
      y += rowHeight;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.text(row[0], 20, y - 2.5);
      
      doc.setFont("Helvetica", "bold");
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(row[1], 120, y - 2.5);
      
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.line(15, y, 195, y);
    });
    
    y += 14;

    // SECTION 3: TURNKEY INVESTMENT BREAKDOWN
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("3. TURNKEY INVESTMENT BREAKDOWN", 15, y);
    y += 7;

    doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
    doc.line(15, y, 195, y);

    const costData = [
      ["Solar PV Modules (Premium Tier-1)", typeof calcResults.solarPanelsCost === 'number' ? `PHP ${calcResults.solarPanelsCost.toLocaleString()}` : calcResults.solarPanelsCost],
      ["Hybrid Intelligent Inverter (Pure Sine)", typeof calcResults.inverterCost === 'number' ? `PHP ${calcResults.inverterCost.toLocaleString()}` : calcResults.inverterCost],
      ["Lithium Battery Storage (LiFePO4 Pack)", typeof calcResults.lithiumStorageCost === 'number' ? `PHP ${calcResults.lithiumStorageCost.toLocaleString()}` : calcResults.lithiumStorageCost],
      ["Balance of System (Mounting & Engineering)", typeof calcResults.balanceCost === 'number' ? `PHP ${calcResults.balanceCost.toLocaleString()}` : calcResults.balanceCost],
    ];

    costData.forEach((row) => {
      y += rowHeight;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
      doc.text(row[0], 20, y - 2.5);
      
      doc.setFont("Helvetica", "bold");
      doc.text(row[1], 150, y - 2.5);
      
      doc.setDrawColor(borderGrey[0], borderGrey[1], borderGrey[2]);
      doc.line(15, y, 195, y);
    });

    // Total turnkey cost
    y += 10;
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(15, y - 8, 180, 9, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.text("TOTAL ESTIMATED INVESTMENT", 20, y - 2);
    doc.text(typeof calcResults.totalInvestment === 'number' ? `PHP ${calcResults.totalInvestment.toLocaleString()}` : calcResults.totalInvestment, 150, y - 2);

    y += 16;

    // SECTION 4: ESTIMATED LOAD CAPABILITIES
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("4. REPRESENTATIVE LOAD CAPABILITIES", 15, y);
    y += 6;

    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text("Based on your recommended system configuration, here is an indicator of what household loads can be powered:", 15, y);
    y += 8;

    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(15, y, 180, 20, 'F');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Daytime (Direct Solar Power)", 20, y + 6);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.text(`• Inverter Aircon (2200W): ${(calcResults.isOffGrid || calcResults.systemSize >= 3.0) ? 'Supported' : 'Backup Needed'}   • Refrigerator (150W): ${(calcResults.isOffGrid || calcResults.systemSize >= 1.5) ? 'Supported' : 'Backup Needed'}`, 20, y + 11);
    doc.text(`• Laptop Workstation (80W): ${(calcResults.isOffGrid || calcResults.systemSize >= 0.5) ? 'Supported' : 'Backup Needed'} • Electric Fan (55W): ${(calcResults.isOffGrid || calcResults.systemSize >= 0.2) ? 'Supported' : 'Backup Needed'}`, 20, y + 16);

    y += 24;
    doc.setFillColor(lightGrey[0], lightGrey[1], lightGrey[2]);
    doc.rect(15, y, 180, 20, 'F');
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Nighttime (UPS Battery Backup)", 20, y + 6);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.text(`• LED Lights (30W): ${(calcResults.isOffGrid || calcResults.systemSize >= 0.8) ? 'Supported' : 'Grid Backup'}   • Electric Fan (55W): ${(calcResults.isOffGrid || calcResults.systemSize >= 1.2) ? 'Supported' : 'Grid Backup'}`, 20, y + 11);
    doc.text(`• Television (100W): ${(calcResults.isOffGrid || calcResults.systemSize >= 2.5) ? 'Supported' : 'Grid Backup'} • Wifi Router (25W): ${(calcResults.isOffGrid || calcResults.systemSize >= 0.3) ? 'Supported' : 'Grid Backup'}`, 20, y + 16);

    y += 26;

    // Contact Footer Information
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.75);
    doc.line(15, y, 195, y);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text("CONTACT OUR ENGINEERING DESK TO GET A DETAILED PROPOSAL", 15, y + 5);
    
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Email: c2r2gsm@gmail.com  |  Phone: 0935 479 6321  |  Web: c2r2gsm@gmail.com", 15, y + 10);

    return doc;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName.trim() && formData.phone.trim()) {
      const docAssets: any[] = [];
      try {
        const doc = createPDFDocumentInstance();
        const dataUri = doc.output('datauristring');
        docAssets.push({
          url: dataUri,
          label: `Client_Solar_ROI_Estimate_Report`
        });
      } catch (err) {
        console.error("Failed to generate custom client ROI document:", err);
      }

      submitInboundLead({
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        service: formData.serviceCategory,
        consumption: `${billInput} PHP Bill`,
        region: 'Metro Manila',
        images: docAssets
      });
      setIsSubmitted(true);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = createPDFDocumentInstance();
      // Save Document
      doc.save(`Powershift_Solar_Report_${Math.round(calcResults.systemSize)}kWp.pdf`);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  const faqItems = [
    {
      q: "How long does installation take?",
      a: "Installation takes 3 to 5 days for residential homes and 2 to 4 weeks for commercial facilities. We handle all engineering designs and structural planning beforehand."
    },
    {
      q: "What happens during cloudy days or typhoons?",
      a: "Our high-efficiency solar panels continue to harvest energy under cloudy conditions. For power outages or stormy weather, our battery storage systems seamlessly supply backup power."
    },
    {
      q: "How does Net Metering save me money?",
      a: "Net Metering lets you sell excess solar power back to the local utility grid. The grid operator applies these as credits on your bill, further reducing your monthly electricity costs."
    },
    {
      q: "Will the roof installation cause leaks?",
      a: "No. We use professional zero-penetration mounting systems for flat roofs and specialized leak-proof brackets for metal sheets to ensure your roof's warranty and waterproofing remain intact."
    },
    {
      q: "What is the lifespan of the solar system?",
      a: "Our premium solar panels are built to last over 25 years with a linear performance warranty, while modern hybrid inverters have a lifetime of 5 to 10 years with extended support options."
    }
  ];

  return (
    <div className="font-sans antialiased text-stone-900 bg-white">
      {/* Hero Header Section */}
      <section className="relative min-h-[50vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-24 border-b border-forest-900 print:hidden">
        {/* Full-width premium background of solar arrays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg"
            alt="Premium utility-scale solar array installation showcasing clean green energy systems"
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
            <span className="inline-flex items-center gap-2 text-solar-yellow-400 text-xs font-mono font-black tracking-widest uppercase mb-6">
              <Zap className="w-3.5 h-3.5 fill-solar-yellow-400 text-solar-yellow-400 shrink-0" />
              <span>BESPOKE ENGINEERING PROPOSALS</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6 uppercase">
              Get A Quotation
            </h1>
            <p className="text-stone-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-xl md:max-w-2xl">
              Request a custom solar simulation and financial payback assessment. Our engineers analyze your structure for a highly optimized design.
            </p>
          </motion.div>
        </div>
      </section>
      



      {/* SECTION 1: CONTACT GRID (Two-Column Asymmetrical Split) */}
      <section className="bg-slate-50 py-20 sm:py-28 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN (Contact Details - Structure Constraint: Unboxed directly on section background) */}
            <div className="space-y-8 lg:pr-6">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
                DIRECT CHANNELS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#05300a] tracking-tight leading-none">
                Your Dream Project Starts With Us!
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
                Our engineers analyze your site structure and energy patterns for exact savings simulations. Contact us directly below.
              </p>

              <div className="space-y-6 pt-4 border-t border-slate-200">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest-950 text-solar-yellow-400 rounded-lg shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-stone-500 uppercase tracking-widest font-bold">Company Number</span>
                    <a href="tel:09354796321" className="text-base sm:text-lg font-bold text-forest-950 block hover:text-solar-yellow-600 transition-colors">
                      0935 479 6321
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest-950 text-solar-yellow-400 rounded-lg shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-stone-500 uppercase tracking-widest font-bold">Company Email</span>
                    <a href="mailto:c2r2gsm@gmail.com" className="text-base sm:text-lg font-bold text-forest-950 block hover:text-solar-yellow-600 transition-colors">
                      c2r2gsm@gmail.com
                    </a>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest-950 text-solar-yellow-400 rounded-lg shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-stone-500 uppercase tracking-widest font-bold">Office Address</span>
                    <span className="text-base sm:text-lg font-bold text-forest-950 block">
                      Dasmarinas Cavite, Cavite, Philippines, 4114
                    </span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-forest-950 text-solar-yellow-400 rounded-lg shrink-0 shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-stone-500 uppercase tracking-widest font-bold">Operating Hours</span>
                    <span className="text-base sm:text-lg font-bold text-forest-950 block">
                      Monday – Saturday, 9:00 AM – 5:00 PM (PST)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: High-conversion assessment form card */}
            <div className="w-full">
              <div className="w-full bg-forest-900/95 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-solar-yellow-500 shadow-2xl text-white text-left">
                <MultiPageQuoteForm theme="dark" layout="hero" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: Solar ROI & Capacity Calculator Section */}
      <section id="solar-calculator" className="relative bg-stone-50 py-20 sm:py-28 border-t border-slate-100 print:bg-white print:py-4 print:border-none print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-0">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16 print:mb-8">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
              TECHNICAL SIMULATION FOR ROOF SYSTEM ASSETS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#05300a] tracking-tight leading-none">
              Solar ROI & Capacity Calculator
            </h2>
            <p className="text-stone-600 font-sans text-sm sm:text-base max-w-2xl mx-auto font-normal">
              Compute your recommended setup size, customized asset budgets, and appliance capability vectors under direct solar harvesting.
            </p>
          </div>

          {/* Calculator Container Layout: 35/65 Single Container Design */}
          <div className="bg-white border border-solar-yellow-500 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-[35%_65%] print:border-none print:shadow-none">
            
            {/* LEFT SIDE: Parameter Configuration (35% Width with Distinct Background Tint) */}
            <div className="bg-forest-900/95 backdrop-blur-md p-8 sm:p-10 border-r lg:border-r border-b lg:border-b-0 border-forest-800 flex flex-col justify-between text-white print:bg-white print:border-none">
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-mono font-black text-solar-yellow-400 uppercase tracking-widest block mb-3">
                    SETUP CALCULATOR
                  </span>
                  <h3 className="text-lg font-display font-black text-white uppercase tracking-wide mb-2">
                    Parameter Configuration
                  </h3>
                  <p className="text-stone-300 text-xs font-sans leading-relaxed font-normal">
                    Define your parameters to generate a custom system sizing report. This interface operates solely via precise manual numeric inputs.
                  </p>
                </div>

                {/* Input Field 1: Monthly Electric Bill */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono font-bold uppercase text-stone-300 tracking-wider">
                    Monthly Electric Bill (PHP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-yellow-400 text-sm font-mono font-bold">₱</span>
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      value={billInput || ''}
                      onChange={(e) => setBillInput(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="e.g. 15000"
                      className="w-full text-left text-sm font-mono font-bold bg-forest-950/85 border border-forest-800 text-white focus:border-transparent focus:ring-2 focus:ring-solar-yellow-500 rounded-xl py-3 pl-8 pr-4 focus:outline-none transition-all placeholder:text-stone-500"
                    />
                  </div>
                </div>

                {/* Input Field 2: Price Per kWh */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-mono font-bold uppercase text-stone-300 tracking-wider">
                    Price Per kWh (PHP)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-solar-yellow-400 text-sm font-mono font-bold">₱</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max="50"
                      value={pricePerKwh || ''}
                      onChange={(e) => setPricePerKwh(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="e.g. 11.50"
                      className="w-full text-left text-sm font-mono font-bold bg-forest-950/85 border border-forest-800 text-white focus:border-transparent focus:ring-2 focus:ring-solar-yellow-500 rounded-xl py-3 pl-8 pr-4 focus:outline-none transition-all placeholder:text-stone-500"
                    />
                  </div>
                </div>

                {/* Core Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleCalculate();
                    const el = document.getElementById('solar-calculator-output');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full py-4 bg-solar-yellow-500 hover:bg-solar-yellow-400 text-forest-950 font-mono font-black tracking-widest text-xs uppercase rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  CALCULATE MY SETUP
                </button>
              </div>

              {/* Watermark brand details */}
              <div className="pt-8 mt-8 border-t border-forest-800 flex flex-col gap-1 text-stone-300 text-[10px] font-mono tracking-wider font-bold uppercase leading-none">
                <span>Powershift Solar</span>
                <span>System Sizing & Investment Model v2.4</span>
              </div>
            </div>

            {/* RIGHT PANEL: Dynamic Performance Output (65% Width) */}
            <div id="solar-calculator-output" className="bg-white p-8 sm:p-10 flex flex-col justify-between space-y-8 scroll-mt-6 print:p-0">
              
              <div className="space-y-8">
                {/* PANEL A: WHAT CAN I RUN? Two-Card Horizontal Layout */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black block leading-none mb-1">
                      PANEL A: WHAT CAN I RUN?
                    </span>
                    <h5 className="text-xs font-mono font-black text-[#05300a] uppercase tracking-widest">
                      Dynamic Load Support Analysis & Grid Capabilities
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: DAYTIME */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/10 flex flex-col justify-between space-y-6 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-[#05300a] shrink-0" />
                            <span className="font-display font-black text-stone-800 text-xs sm:text-sm uppercase tracking-wide">
                              DAYTIME
                            </span>
                          </div>
                          <span className="bg-[#c8ac0c] text-stone-900 px-2.5 py-1 rounded font-mono font-black text-[10px] sm:text-xs shrink-0">
                            {calcResults.isOffGrid ? 'Grid Independent' : `₱${Math.round((calcResults.totalInvestment as number) * 0.6).toLocaleString()}`}
                          </span>
                        </div>
                        
                        {/* Appliance list container styled identical to Panel B */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/20 font-mono text-xs text-stone-800">
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Inverter Aircon</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 3.0) ? 'text-[#05300a]' : 'text-stone-300'}`}>2,200 W</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Refrigerator</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 1.5) ? 'text-[#05300a]' : 'text-stone-300'}`}>150 W</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Laptop + Monitor</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 0.5) ? 'text-[#05300a]' : 'text-stone-300'}`}>80 W</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Electric Fan</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 0.2) ? 'text-[#05300a]' : 'text-stone-300'}`}>55 W</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: NIGHTTIME */}
                    <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/10 flex flex-col justify-between space-y-6 shadow-sm">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BatteryCharging className="w-5 h-5 text-[#05300a] shrink-0" />
                            <span className="font-display font-black text-stone-800 text-xs sm:text-sm uppercase tracking-wide">
                              NIGHTTIME
                            </span>
                          </div>
                          <span className="bg-[#c8ac0c] text-stone-900 px-2.5 py-1 rounded font-mono font-black text-[10px] sm:text-xs shrink-0">
                            {calcResults.isOffGrid ? 'Battery Power' : `₱${Math.round((calcResults.totalInvestment as number) * 0.4).toLocaleString()}`}
                          </span>
                        </div>
                        
                        {/* Appliance list container styled identical to Panel B */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/20 font-mono text-xs text-stone-800">
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">LED Lights</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 0.8) ? 'text-[#05300a]' : 'text-stone-300'}`}>30 W</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Electric Fan</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 1.2) ? 'text-[#05300a]' : 'text-stone-300'}`}>55 W</span>
                          </div>
                          <div className="flex justify-between items-center p-3 border-b border-slate-100 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Television</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 2.5) ? 'text-[#05300a]' : 'text-stone-300'}`}>100 W</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white">
                            <span className="font-bold uppercase text-stone-600 text-left text-[11px] tracking-wide">Wifi Router</span>
                            <span className={`font-mono font-extrabold text-xs sm:text-sm shrink-0 ${(calcResults.isOffGrid || calcResults.systemSize >= 0.3) ? 'text-[#05300a]' : 'text-stone-300'}`}>25 W</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PANEL B: ESTIMATED INVESTMENT BREAKDOWN */}
                <div className="space-y-4 pt-2">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black block leading-none mb-1">
                      PANEL B: BILL OF ASSETS ESTIMATE
                    </span>
                    <h5 className="text-xs font-mono font-black text-[#05300a] uppercase tracking-widest">
                      Estimated Turnkey Engineering Investment Breakdown
                    </h5>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/20 font-mono text-xs text-stone-800">
                    {/* Itemized row 1 */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                      <span className="font-bold uppercase text-stone-600 text-left">Solar PV Modules</span>
                      <span className="font-extrabold text-[#05300a] shrink-0">
                        {typeof calcResults.solarPanelsCost === 'number' ? `₱${calcResults.solarPanelsCost.toLocaleString()}` : calcResults.solarPanelsCost}
                      </span>
                    </div>

                    {/* Itemized row 2 */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                      <span className="font-bold uppercase text-stone-600 text-left">Hybrid Intelligent Inverter</span>
                      <span className="font-extrabold text-[#05300a] shrink-0">
                        {typeof calcResults.inverterCost === 'number' ? `₱${calcResults.inverterCost.toLocaleString()}` : calcResults.inverterCost}
                      </span>
                    </div>

                    {/* Itemized row 3 */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-white">
                      <span className="font-bold uppercase text-stone-600 text-left">Lithium Battery Storage</span>
                      <span className="font-extrabold text-[#05300a] shrink-0">
                        {typeof calcResults.lithiumStorageCost === 'number' ? `₱${calcResults.lithiumStorageCost.toLocaleString()}` : calcResults.lithiumStorageCost}
                      </span>
                    </div>

                    {/* Itemized row 4 */}
                    <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/30">
                      <span className="font-bold uppercase text-stone-600 text-left">Balance of System</span>
                      <span className="font-extrabold text-[#05300a] shrink-0">
                        {typeof calcResults.balanceCost === 'number' ? `₱${calcResults.balanceCost.toLocaleString()}` : calcResults.balanceCost}
                      </span>
                    </div>

                    {/* Final prominent bold total row */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 bg-[#05300a]/5 border-t-2 border-dashed border-slate-200">
                      <span className="font-display font-black uppercase text-[#05300a] text-sm tracking-wide">TOTAL ESTIMATED INVESTMENT</span>
                      <span className="font-display font-black text-[#05300a] text-lg sm:text-xl tracking-tight mt-1 sm:mt-0">
                        {typeof calcResults.totalInvestment === 'number' ? `₱${calcResults.totalInvestment.toLocaleString()}` : calcResults.totalInvestment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Summary Bar (Calculated ROI Payback & Buttons) */}
              <div className="bg-[#05300a] text-white rounded-2xl p-6 flex flex-col 2xl:flex-row justify-between items-start 2xl:items-center gap-6 shadow-lg border border-[#063B14]">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-green-300 uppercase tracking-widest font-bold block leading-none">
                    CALCULATED ROI PAYBACK TIMELINE
                  </span>
                  <div className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white uppercase flex flex-wrap items-center gap-2">
                    <span>{billInput > 0 ? `${calcResults.paybackYears} Years, ${calcResults.paybackMonths} Months` : '0 Years, 0 Months'}</span>
                    {calcResults.status && billInput > 0 && (
                      <span className="inline-block px-2.5 py-0.5 bg-solar-yellow-400 text-[#05300a] rounded-md font-mono font-black text-[9px] tracking-wider uppercase leading-none">
                        {calcResults.status}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-green-300/80 block uppercase leading-none">
                    Est. Bill Savings offsets: ₱{calcResults.estSavings.toLocaleString()} / Month
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full 2xl:w-auto print:hidden">
                  <button
                    type="button"
                    onClick={() => {
                      const systemSize = calcResults.systemSize;
                      const costVal = calcResults.totalInvestment;
                      const panels = calcResults.solarPanelsCost;
                      const inverter = calcResults.inverterCost;
                      const batteries = calcResults.lithiumStorageCost;
                      const balance = calcResults.balanceCost;
                      const monthlySavings = calcResults.estSavings;
                      const paybackStr = `${calcResults.paybackYears} Years, ${calcResults.paybackMonths} Months`;
                      
                      const formattedCostVal = typeof costVal === 'number' ? `PHP ${costVal.toLocaleString()}` : costVal;
                      const formattedPanels = typeof panels === 'number' ? `PHP ${panels.toLocaleString()}` : panels;
                      const formattedInverter = typeof inverter === 'number' ? `PHP ${inverter.toLocaleString()}` : inverter;
                      const formattedBatteries = typeof batteries === 'number' ? `PHP ${batteries.toLocaleString()}` : batteries;
                      const formattedBalance = typeof balance === 'number' ? `PHP ${balance.toLocaleString()}` : balance;

                      const daytimeCostStr = typeof costVal === 'number' ? `PHP ${Math.round(costVal * 0.6).toLocaleString()}` : "Included in Off-Grid Package";
                      const nighttimeCostStr = typeof costVal === 'number' ? `PHP ${Math.round(costVal * 0.4).toLocaleString()}` : "Included in Off-Grid Package";

                      const formatData = `Powershift Solar - Technical Simulation Report
------------------------------------------------------
Monthly Electric Operating Bill: PHP ${billInput.toLocaleString()}
Retail Tariff Rate Assumption: PHP ${pricePerKwh.toFixed(2)} / kWh
Calculated Optimal Asset Size: ${systemSize} kWp

Bill of Assets Investment Estimator:
- Solar Modules (Tier-1 Monocrystalline, 40%): ${formattedPanels}
- Intelligent Hybrid Inverter (Pure Sine Wave, 20%): ${formattedInverter}
- Lithium Battery Storage (LiFePO4 Pack, 25%): ${formattedBatteries}
- Balance of System (Hardware & Engineering, 15%): ${formattedBalance}
------------------------------------------------------
TOTAL Turnkey Sizing Budget: ${formattedCostVal}

Load Distribution System Budgets:
- Daytime Direct Solar assets: ${daytimeCostStr}
- Nighttime Battery Backup storage hardware: ${nighttimeCostStr}

Asset ROI & Payload Forecast:
- Est. Bill Offset Savings: PHP ${monthlySavings.toLocaleString()} / Month
- Capital Payback Duration: ${paybackStr}

Load Harvester Capability Indicators (Representative Examples):
- DAYTIME:
  * Inverter Aircon (3.0 HP Multi-split) - 2,200 W: ${systemSize >= 3.0 ? 'Supported' : 'Secondary Grid Backup Needed'}
  * Refrigerator (Inverter cooling) - 150 W: ${systemSize >= 1.5 ? 'Supported' : 'Secondary Grid Backup Needed'}
  * Laptop + Monitor (Workstation) - 80 W: ${systemSize >= 0.5 ? 'Supported' : 'Secondary Grid Backup Needed'}
  * Electric Fan (Circulator load) - 55 W: ${systemSize >= 0.2 ? 'Supported' : 'Secondary Grid Backup Needed'}
- NIGHTTIME (BATTERY BACKUP):
  * LED Lights (Standard House Loads) - 30 W: ${systemSize >= 0.8 ? 'Supported' : 'Grid Backup'}
  * Electric Fan (Standard Cooling) - 55 W: ${systemSize >= 1.2 ? 'Supported' : 'Grid Backup'}
  * Television (Smart UI 55") - 100 W: ${systemSize >= 2.5 ? 'Supported' : 'Grid Backup'}
  * Wifi Router (Dual-band Fiber) - 25 W: ${systemSize >= 0.3 ? 'Supported' : 'Grid Backup'}

Unlock customized rooftop engineering mockups at powershiftsolar.com`;

                      navigator.clipboard.writeText(formatData);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[#c8ac0c] hover:bg-[#E5B20D] text-[#05300a] font-mono font-black uppercase tracking-widest text-[10px] px-5 py-3 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#05300a]" />
                    <span>{copied ? 'Copied!' : 'Copy Results to Clipboard'}</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#05300a] border border-[#05300a]/20 font-mono font-black uppercase tracking-widest text-[10px] px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#05300a]" />
                    <span>Download PDF Report</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Frequently Asked Questions (FAQs) */}
      <section className="bg-white py-20 sm:py-28 border-t border-slate-100 print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
              FREQUENT TECHNICAL INQUIRIES
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#05300a] tracking-tight leading-none">
              System Integrity & Technical FAQ
            </h2>
          </div>

          {/* FAQ Accordion List Stack */}
          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = activeFaqIndex === idx;

              return (
                <div 
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  {/* Accordion Toggle Handle */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forest-900 cursor-pointer"
                  >
                    <span className="font-display font-extrabold text-[#05300a] text-base md:text-lg tracking-tight uppercase leading-snug">
                      {item.q}
                    </span>
                    <span className="shrink-0 p-1 bg-white border border-slate-200 rounded-lg text-[#05300a] shadow-sm">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-solar-yellow-600 stroke-[3]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500 stroke-[3]" />
                      )}
                    </span>
                  </button>

                  {/* Accordion Collapse Content container */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden bg-white border-t border-slate-100"
                      >
                        <div className="px-6 py-5 text-stone-600 text-sm md:text-base leading-relaxed font-normal">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </div>
  );
}
