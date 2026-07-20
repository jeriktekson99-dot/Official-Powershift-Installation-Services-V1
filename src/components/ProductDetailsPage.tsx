import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SpecialOffersGallery from './SpecialOffersGallery';
import MultiPageQuoteForm from './MultiPageQuoteForm';
import { useSyncDb, idToNumber, submitInboundLead, useSyncCategories, getImageUrl } from '../sync';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Wrench,
  HelpCircle,
  Inbox,
  Info,
  CheckCircle,
  Star,
  MessageCircle,
  Phone,
  Send,
  MessageSquare,
  Folder
} from 'lucide-react';


interface ProductDetailsPageProps {
  productId: number;
  onBack: () => void;
  onSelectProduct: (id: number) => void;
  onStartConsultation: () => void;
  onExploreServices?: () => void;
  onSelectCategory?: (category: string) => void;
}

interface ProductDetailsData {
  id: number;
  name: string;
  category: string;
  systemIdentifier: string;
  classification: string;
  imageUrl: string;
  thumbnails: string[];
  specs: string[];
  architectureText: string;
  reliabilityText: string;
  dispatchDescription?: string;
  description?: string;
}

export default function ProductDetailsPage({ 
  productId, 
  onBack, 
  onSelectProduct, 
  onStartConsultation,
  onExploreServices,
  onSelectCategory
}: ProductDetailsPageProps) {
  
  // 14 detailed products data matching category & item definitions exactly
  const staticProducts: Record<number, ProductDetailsData> = {
    1: {
      id: 1,
      name: "Powershift Ultra 550W Monocrystalline PV Module",
      category: "DAH Solar",
      systemIdentifier: "Next-Gen Tier-1 Generation Hardware",
      classification: "Tier-1 High-Efficiency Class",
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Module Efficiency: 21.3% Max Yield",
        "Cell Type: Premium Mono PERC 11-Busbar",
        "Max Frontside Load Capacity: 5400-Pa",
        "Power Output Tolerance: 0 ~ +5W Strict Guarantee"
      ],
      architectureText: "The Powershift Ultra 550W series incorporates high-purity silicon wafers constructed with state-of-the-art Monocrystalline PERC cell chemistry. Engineered with an advanced eleven-busbar layout, it minimizes thermal resistance and maximizes electron traversal speeds. The frontside is clad in high-transmission, low-iron tempered glass treated with an anti-reflective hydrophobic coating, ensuring exceptional yield during marginal, low-light ambient conditions.",
      reliabilityText: "Built to withstand severe localized climate anomalies, this solar array carries wind-load certification up to 5400 Pascal force models and heavy snow resistances. Integrated bypass diodes counteract thermal hot-spotting from local shading events, while a zero-maintenance anodized aluminum frame structure guarantees perfect non-corrosive performance over standard thirty-year commercial arrays."
    },
    2: {
      id: 2,
      name: "10kW Three-Phase Hybrid Inverter",
      category: "Deye",
      systemIdentifier: "Smart Grid-Tied System Control",
      classification: "Smart Grid-Tied Unit",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Max Efficiency Ratio: 98.2% CEC Certified",
        "Dual Tracking Channels: Integrated Dual MPPT",
        "Weatherproof Shielding: NEMA 4X / IP66",
        "Nominal AC Output power: 10,000 Watts"
      ],
      architectureText: "Designed for high-performance residential and enterprise layouts, this three-phase system utilizes high-speed silicon carbide MOSFET switching algorithms. Its dual independent MPPT channels track peak voltages with 99.9% real-time tracking efficiency, feeding steady current into the facility while maintaining phase consistency. High-precision telemetry enables clean, low-disturbance wave transformation.",
      reliabilityText: "The rugged chassis features a high-grade anodized structural heat sink with a quiet, smart convective thermal cooling loop. It operates flawlessly in extreme environments from -25°C to +60°C. Fully integrated AC/DC surge protection suppressors are standard, meaning external lightning or local voltage spikes are completely absorbed without system degrading."
    },
    3: {
      id: 3,
      name: "48V 100Ah LiFePO4 Battery Bank",
      category: "Pylontech",
      systemIdentifier: "Long-Life Lithium Storage Storage",
      classification: "Deep Cycle Storage Pod",
      imageUrl: "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Continuous Energy Capacity: 4.8kWh Unit",
        "Lifecycle Performance: 6,000+ Cycles @ 80% DoD",
        "Communications Protocol: CAN/RS485 Bus Sync",
        "Peak Discharge Rate: 100A Continual"
      ],
      architectureText: "Crafted around stable, premium Lithium Iron Phosphate (LiFePO4) prismatic cells, our battery bank features zero-gas chemical configurations. An integrated Smart battery management system (BMS) manages cell-balancing, voltage levels, temperatures, and state-of-charge data actively. Up to 15 modular battery vaults can be parallel-stacked to build robust institutional backup arrays.",
      reliabilityText: "LiFePO4 chemistry completely excludes risk of thermal runaway fires common to cobalt-derived lithium cells. Encased in a heavy-gauge, anti-impact cold rolled steel containment cabinet, it carries full seismic and UL-1973 certifications. Thermal padding isolates internal cells from external heat gradients, locking in efficient operations."
    },
    4: {
      id: 4,
      name: "Bifacial Double-Glass Solar Panel",
      category: "Astronergy",
      systemIdentifier: "Double Sided Photovoltaic Generation",
      classification: "Maximum Albedo Yield Class",
      imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Extra Rear Side Gain: +10% to +30% Yield",
        "Glass Architecture: Dual Tempered 2.0mm Glass",
        "Product Warranty Period: 30-Year Performance Pledge",
        "Zero PID Threat: Frameless Double-Glass Design"
      ],
      architectureText: "By exploiting ambient reflection coefficients (albedo) from roofs or surrounding gravel grounds, this bifacial panel absorbs photons from both surfaces. Utilizing high-efficiency N-type TOPCon monocrystalline cells sandwiched between two layers of 2.0mm tempered glass, it provides high energy density with minimal long-term performance degradation.",
      reliabilityText: "The elimination of a standard polymer backsheet drastically improves fire classifications (Class-A Rating) and makes the panel immune to moisture ingress, salt-spray erosion, and PID (Potential Induced Degradation). Designed to handle heavy snow loads up to 5400 Pa and high wind stresses with perfect optical clarity."
    },
    5: {
      id: 5,
      name: "High-Capacity MPPT Charge Controller",
      category: "SRNE",
      systemIdentifier: "Ultra-Fast Energy Route Tracking",
      classification: "Precision Voltage Tracking Hub",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Voltage Tracking Accuracy: 99.8% Precision",
        "Max Battery Charger Output: 80 Amperes continuous",
        "Nominal PV System Input: Up to 150V DC",
        "Power Conversion Ratio: 98% Peak Efficiency"
      ],
      architectureText: "Featuring state-of-the-art Maximum Power Point Tracking logic, this component checks and regulates panel production up to 100 times per second. This maintains peak battery charging streams during rapid solar cloud transitions. Its multi-stage charging design accommodates Lead-Acid, Gel, AGM, and custom LiFePO4 batteries perfectly.",
      reliabilityText: "The heavy-cast aluminum heat sink ensures passive convection cooling, eliminating noisy fan mechanical points which tend to fail over time. Full protections guard against short circuits, overloads, battery reverse polarity, and reverse-current leaks from battery to array during cloud coverage or dark hours."
    },
    6: {
      id: 6,
      name: "Zero-Penetration Aluminum Mounting Rails",
      category: "Accessories",
      systemIdentifier: "Ballasted Structural Roof Framing",
      classification: "Wind-Load Certified Framing",
      imageUrl: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Core Composition: High-Strength Al6005-T5",
        "Wind Stress Rating: Up to 250 kph",
        "Clamping Mechanism: High-Tension Mid & End Clamps",
        "Joint Connector Type: Interlocking Extrusions"
      ],
      architectureText: "Extruded from high-grade structural aluminum, these durable profile rails support roof structures without any water penetrations. Using localized ballast weights and non-reactive EPDM membrane protectors, panels stay secured through deadload design. Universal sliding channels adapt to diverse panel array thicknesses easily.",
      reliabilityText: "Fully certified for typhoon-strength winds of up to 250 km/h and intense thermal expansions. Marine-grade stainless steel A2 fasteners avoid galvano-chemical deterioration between aluminum rails and steel structural members, providing lifetime structural integrity without structural degradation."
    },
    7: {
      id: 7,
      name: "50kW Industrial Central Inverter",
      category: "Solis",
      systemIdentifier: "Grid Connection Industrial Converters",
      classification: "Utility Scale Capacity Unit",
      imageUrl: "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Continuous Active Power: 50,000 Watts AC",
        "Operating DC Range: 1000V - 1500V DC input",
        "Total Harmonic Distortion: < 2% at rated output",
        "System Cooling: Intellectual Forced-convective Fans"
      ],
      architectureText: "A beast constructed for large factory roof arrays! This industrial inverter transforms thousands of high-voltage DC volts into pure grid-synchronous three-phase AC wave. Powered by dual internal processing circuits, it tracks the grid cycle with microsecond feedback speeds and manages reactive power dispatch on demand.",
      reliabilityText: "Encased in an outdoor-ready outdoor steel safe holding dual-layer insulated firebreaks. Smart fans automatically blow high-velocity cooling air along the rear isolated heatsink channel during peak ambient temperatures, preventing system throttling and protecting internal electronics from environmental moisture."
    },
    8: {
      id: 8,
      name: "Smart Solar Net-Metering Gateway",
      category: "Accessories",
      systemIdentifier: "Facility Export Dynamic Tracking Meter",
      classification: "Real-Time Export Monitor",
      imageUrl: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Data Feed Cycle: Real-Time 1s Resolution",
        "Radio Modules: 4G LTE-M / Wi-Fi / Ethernet",
        "Accuracy Specification: Class 0.5 Revenue Grade",
        "Mounting Configuration: Standard DIN-Rail Assembly"
      ],
      architectureText: "Featuring real-time, high-speed split-core current CT transformers, this smart gateway records energy imports, exports, and self-consumption curves with extreme precision. It uploads system telemetry directly to our secure cloud workspace, delivering smart alert indicators and generating custom monthly yield forecasts automatically.",
      reliabilityText: "The computing core runs non-volatile flash backup. If standard network connections drop, it stores up to 60 days of telemetry and uploads them as soon as Wi-Fi or cellular links recover. Its modular DIN design snap-fits inside standard service load centers neatly."
    },
    9: {
      id: 9,
      name: "Rapid DC Disconnect Safety Switch",
      category: "Accessories",
      systemIdentifier: "Emergency High Voltage Isolation Unit",
      classification: "Emergency Shutoff Isolation",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Electrical Interruption: 1000V DC @ 32 Amps",
        "Reaction Arc Dampening: < 3 Milliseconds",
        "Outer Enclosure Standard: IP67 Weatherproof Rated",
        "Mechanical Safety lock: Integrated Lockout-Tagout"
      ],
      architectureText: "This critical safety switch isolates high-voltage rooftop DC solar strings instantly from the downstream inverters. Incorporating spring-actuated snap mechanisms and localized arc extinguish chambers, it stops dangerous high-voltage electrical arcs in under 3 milliseconds.",
      reliabilityText: "Packed inside an impact-resistant, weatherproof polymer housing rated for IP67. The visible safety yellow/red handle supports direct physical lockout (LOTO) key configurations, ensuring maximum security for building maintenance and firefighting crews."
    },
    10: {
      id: 10,
      name: "Solar Array Thermal Surge Protector",
      category: "Accessories",
      systemIdentifier: "Atmospheric Discharge Suppression Node",
      classification: "Lightning Attenuation Node",
      imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Surge Current Rating: Imax 40kA DC Surge",
        "Response Velocity: < 25 Nanoseconds",
        "Protection Level Up: 4.0 kV Core Clamp",
        "Modules: Dual Pluggable Cartridges"
      ],
      architectureText: "Designed to run inline with high-voltage DC string buses, this DIN-rail surge protective device protects delicate inverter circuitry from atmospheric lightning strikes. Dual high-capacity Metal Oxide Varistor (MOV) cores route excessive energy spikes safely down to the ground plate instantly.",
      reliabilityText: "Uses quick-release, pluggable cartridges with local color-coded mechanically linked failure indicators. If the protector stops a high-voltage strike and wears down, a bright red window flags the module for simple replacement without rerouting wires."
    },
    11: {
      id: 11,
      name: "Flexible Marine-Grade Solar Panel",
      category: "Astronergy",
      systemIdentifier: "Mobile Conformable Photovoltaic Line",
      classification: "Weatherproof Off-Grid Line",
      imageUrl: "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Maximum Deflection Profile: Up to 30° Curve Curve",
        "Weatherproof Composite: Heavy ETFE Polymer Coating",
        "Total Net Weight: 2.1 kilograms",
        "Output Connection: Integrated Junction Box IP68"
      ],
      architectureText: "A specialist layout for yachts, boats, and curved vehicle rooftops! Built around ultra-thin monocrystalline cells sealed inside a weather-hardened ETFE polymer skin, it achieves high light capture efficiencies while conforming effortlessly to curved surfaces.",
      reliabilityText: "ETFE polymer stands up to intense salt-water corrosive factors and high UV rays. Non-slip material lets operators step directly over its surface on marine decks. Fastens securely with heavy zip ties or adhesive sealants."
    },
    12: {
      id: 12,
      name: "15kWh All-In-One Home Energy Storage",
      category: "Menred ESS",
      systemIdentifier: "Unified Grid Backup Module",
      classification: "Wall-Mounted BESS Station",
      imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Useable Capacity: 15.0 kWh storage",
        "Continuous Power Output: 5.0kW Active Supply",
        "Integration Style: Combined Inverter / Battery Unit",
        "Cell chemistry: Deep cycle LiFePO4 cells"
      ],
      architectureText: "A sleek, gorgeous all-in-one residential storage unit! This consolidated machine packs lithium energy modules and a smart hybrid control unit into a single wall mount. Dynamic software prioritizes daytime solar tracking, offsets utility pricing peaks, and triggers backup power instantly during blackouts.",
      reliabilityText: "Features liquid-filled thermal balancing to manage cell longevity, and carries strict UL-9540 fire safety standard certifications. The sleek aluminum casing mount fits flush against interior walls or garaged assemblies perfectly."
    },
    13: {
      id: 13,
      name: "Heavy-Duty Ballasted Roof Mount Mounts",
      category: "Accessories",
      systemIdentifier: "Flat Roof Gravel Ballasted Frame",
      classification: "Concrete Roof Optimized Racks",
      imageUrl: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Base Material: Heavy Glass-Filled Poly Composition",
        "Anchoring Mechanism: Weighted Gravity Ballasts",
        "Inclination Profile: 10-degree optimized tilt angle",
        "Structural certifications: ASCE 7-16 Structural Code"
      ],
      architectureText: "Specifically configured for concrete rooftops on commercial buildings! Heavy-duty glass-reinforced poly modular mounting pans snap-lock without drilling anchor holes through roof waterproofing layers. Ballast block containers are built into the frame to hold heavy pavers securely.",
      reliabilityText: "The unique aerodynamic design utilizes native downforce currents to stay anchored during intense storms. Solid non-metallic compounds guarantee zero rust, UV damage degradation, or electrochemical weathering over active service decades."
    },
    14: {
      id: 14,
      name: "UV-Resistant Solar PV Cabling",
      category: "Accessories",
      systemIdentifier: "High-voltage DC Conduction lines",
      classification: "Industrial Grade Shielded Wire",
      imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      thumbnails: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=200&q=80",
        "https://images.unsplash.com/photo-1542332213-9b5a5a3a3c5a?auto=format&fit=crop&w=200&q=80"
      ],
      specs: [
        "Working Rating: 1500V DC Continual",
        "Insulation Type: Cross-linked Polyurethane (XLPE)",
        "Composition: Class 5 Tinned Copper Wire",
        "Outer Protection: Rodent Resistant Outer shield"
      ],
      architectureText: "Engineered specifically to handle the high ultraviolet radiation, heat cycles, and mechanical stresses of outdoor solar installations. This multi-strand cabling minimizes resistive losses while carrying heavy high-voltage DC currents through outer arrays safely.",
      reliabilityText: "Certified to withstand continuous exposure to intense UV, moisture, and temperatures from -40°C to +90°C. An integrated anti-termite and rodent chemical additive is blended into the outer jacket to stop chewing and prevent short circuits.",
    }
  };

  const { db } = useSyncDb();

  // Overwrite with real-time reactive synchronized state
  const allProducts = useMemo<Record<number, ProductDetailsData>>(() => {
    const map: Record<number, ProductDetailsData> = {};
    (db.products || []).forEach(p => {
      const numericId = idToNumber(p.id);
      
      // Inherit beautiful pre-authored high-fidelity descriptions and spec lines if matching
      const staticMatch = staticProducts[numericId] || Object.values(staticProducts).find(
        sp => sp.name.toLowerCase() === p.name.toLowerCase() || sp.name.includes(p.name) || p.name.includes(sp.name)
      );

      let specs: string[] = ["Availability: " + p.status, "Location: " + p.location, "In Stock: " + p.stock];
      let architectureText = staticMatch ? staticMatch.architectureText : "";
      let reliabilityText = staticMatch ? staticMatch.reliabilityText : "";

      if (p.description) {
        try {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = p.description;
          
          const lis = tempDiv.getElementsByTagName('li');
          if (lis.length > 0) {
            specs = Array.from(lis).map(li => li.textContent || '');
          } else if (staticMatch && staticMatch.specs) {
            specs = staticMatch.specs;
          }

          const paragraphs = tempDiv.getElementsByTagName('p');
          if (paragraphs.length > 0) {
            architectureText = paragraphs[0]?.textContent || architectureText;
            reliabilityText = paragraphs[1]?.textContent || paragraphs[0]?.textContent || reliabilityText;
          } else if (tempDiv.textContent && tempDiv.textContent.trim().length > 0) {
            architectureText = tempDiv.textContent || architectureText;
          }
        } catch (e) {
          console.error("Error parsing product details description HTML:", e);
        }
      } else if (staticMatch && staticMatch.specs) {
        specs = staticMatch.specs;
      }

      if (!architectureText) {
        architectureText = `${p.name} is a high-performance system engineered for maximum output. Designed to deliver continuous energy output under harsh tropical conditions.`;
      }
      if (!reliabilityText) {
        reliabilityText = "Manufactured with premium components. Features a durable construction, certified wind and load resistance, and backed by comprehensive warranties.";
      }

      const getCategoryDefaultImages = (categoryName: string) => {
        const cat = (categoryName || "").toLowerCase();
        if (cat.includes("panel") || cat.includes("pv") || cat.includes("dah solar") || cat.includes("astronergy")) {
          return [
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542336391-ec293bc5f98c?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80"
          ];
        } else if (cat.includes("inverter") || cat.includes("controller") || cat.includes("smart") || cat.includes("gateway") || cat.includes("deye") || cat.includes("solis") || cat.includes("srne")) {
          return [
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=800&q=80"
          ];
        } else if (cat.includes("battery") || cat.includes("lithium") || cat.includes("storage") || cat.includes("pylontech") || cat.includes("menred")) {
          return [
            "https://images.unsplash.com/photo-1548613053-220bfb8830de?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1548613053-22008fb56e7e?auto=format&fit=crop&w=800&q=80"
          ];
        } else {
          return [
            "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542336391-ec293bc5f98c?auto=format&fit=crop&w=800&q=80"
          ];
        }
      };

      let baseImages = (p.images && p.images.length > 0) ? p.images : (staticMatch && staticMatch.thumbnails ? staticMatch.thumbnails : []);
      const defaultPool = getCategoryDefaultImages(p.category);
      if (baseImages.length < 6) {
        const extra = defaultPool.filter(img => !baseImages.includes(img));
        baseImages = [...baseImages, ...extra].slice(0, 6);
      }

      map[numericId] = {
        id: numericId,
        name: p.name,
        category: p.category,
        systemIdentifier: p.id + " / " + p.location,
        classification: p.status === "IN STOCK" ? "Available Tier-1" : p.status,
        imageUrl: getImageUrl(baseImages[0]),
        thumbnails: baseImages.map(getImageUrl),
        specs: specs,
        architectureText: architectureText,
        reliabilityText: reliabilityText,
        dispatchDescription: p.dispatch_description,
        description: p.description
      };
    });
    return map;
  }, [db.products]);

  // Find active product
  const activeProduct = allProducts[productId] || allProducts[1] || (Object.values(allProducts) as ProductDetailsData[])[0];

  // Track recently viewed products in localStorage
  React.useEffect(() => {
    if (activeProduct && activeProduct.id) {
      try {
        const stored = localStorage.getItem('powershift_recently_viewed_products');
        let ids: number[] = stored ? JSON.parse(stored) : [];
        ids = [activeProduct.id, ...ids.filter(x => x !== activeProduct.id)].slice(0, 5);
        localStorage.setItem('powershift_recently_viewed_products', JSON.stringify(ids));
      } catch (err) {
        console.error(err);
      }
    }
  }, [activeProduct]);

  // Gallery Thumbnail state
  const [activeThumbIndex, setActiveThumbIndex] = useState<number>(0);

  // Ref for thumbnails container scroll
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

  // Dynamic Spec form state
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    facebookUrl: '',
    message: ''
  });

  // Tabbed Navigation state
  const [activeFormTab, setActiveFormTab] = useState<'order' | 'reviews'>('order');

  // Review System states
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewRatingHover, setReviewRatingHover] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerEmail, setReviewerEmail] = useState<string>('');
  const [saveReviewerDetails, setSaveReviewerDetails] = useState<boolean>(true);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  const [productReviews, setProductReviews] = useState<any[]>([]);

  // Load saved credentials for review author if present
  React.useEffect(() => {
    const savedName = localStorage.getItem('p_reviewer_name') || '';
    const savedEmail = localStorage.getItem('p_reviewer_email') || '';
    if (savedName) setReviewerName(savedName);
    if (savedEmail) setReviewerEmail(savedEmail);
  }, []);

  // Sync reviews when product details change
  React.useEffect(() => {
    const defaultReviews: Record<number, any[]> = {
      1: [
        { id: 101, name: "Ramon S. - Calamba Group", email: "ramon.s@calambagroup.ph", rating: 5, text: "Outstanding conversion efficiency! We deployed this on our Calabarzon commercial roof, and our peak afternoon baseline is consistently 5-8% higher than projected.", date: "May 12, 2026" },
        { id: 102, name: "Engr. Clara de Leon", email: "c.deleon@powersolutions.com", rating: 5, text: "Solid microcrystalline build. Core frame with deep channels for dynamic wind ballasts. The terminal connections are perfectly sealed.", date: "April 28, 2026" }
      ],
      2: [
        { id: 201, name: "Dominic Pascual", email: "dom@pascualresidence.io", rating: 5, text: "The dual MPPT voltage tracking is super snappy. The hybrid handover takes less than 10ms during storm power trips.", date: "June 02, 2026" }
      ],
      3: [
        { id: 301, name: "Bayan M. (Facilities)", email: "b.macaraig@bayan-ind.com", rating: 5, text: "We parallel-stacked 6 of these storage pods for our server backups. Zero voltage float anomalies after 3 months. Thermal protection is excellent.", date: "May 19, 2026" }
      ]
    };

    const stored = localStorage.getItem('p_reviews_' + activeProduct.id);
    if (stored) {
      try {
        setProductReviews(JSON.parse(stored));
      } catch (e) {
        setProductReviews(defaultReviews[activeProduct.id] || [
          { id: 999, name: "Engr. Julian de Castro", rating: 5, text: "Verified tier-1 hardware compatibility. Flawless structural and insulation tests.", date: "January 14, 2026" }
        ]);
      }
    } else {
      setProductReviews(defaultReviews[activeProduct.id] || [
        { id: 999, name: "Engr. Julian de Castro", rating: 5, text: "Verified tier-1 hardware compatibility. Flawless structural and insulation tests.", date: "January 14, 2026" }
      ]);
    }
  }, [activeProduct.id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0) {
      return;
    }
    const newReview = {
      id: Date.now(),
      name: reviewerName || 'Anonymous User',
      email: reviewerEmail,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    const updatedReviews = [newReview, ...productReviews];
    setProductReviews(updatedReviews);
    localStorage.setItem('p_reviews_' + activeProduct.id, JSON.stringify(updatedReviews));
    
    if (saveReviewerDetails) {
      localStorage.setItem('p_reviewer_name', reviewerName);
      localStorage.setItem('p_reviewer_email', reviewerEmail);
    } else {
      localStorage.removeItem('p_reviewer_name');
      localStorage.removeItem('p_reviewer_email');
    }
    
    setReviewText('');
    setReviewRating(0);
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
  };

  const { categories: syncCategoriesData } = useSyncCategories();
  const categoriesList = useMemo(() => {
    return (syncCategoriesData?.products || [])
      .filter(c => c && c.active)
      .map(c => c.name);
  }, [syncCategoriesData?.products]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  React.useEffect(() => {
    setSelectedCategories([activeProduct.category]);
  }, [activeProduct.category]);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const getCategoryCount = (catName: string) => {
    return (db.products || []).filter(p => p.category === catName).length;
  };

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    onBack();
  };

  // Top Rated Tier-1 Gear Widget data (5 items with images on right)
  const topRatedGear = [
    { id: 4, name: "Bifacial Double-Glass Solar Panel", category: "Solar Panels", rating: "5.0 / 5.0", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=100&q=80" },
    { id: 5, name: "High-Capacity MPPT Charge Controller", category: "Charge Controllers", rating: "4.9 / 5.0", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=100&q=80" },
    { id: 12, name: "15kWh All-In-One Home Energy Storage", category: "Battery Storage", rating: "4.9 / 5.0", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=100&q=80" },
    { id: 8, name: "Smart Solar Net-Metering Gateway", category: "Gateways", rating: "4.8 / 5.0", img: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=100&q=80" },
    { id: 6, name: "Zero-Penetration Aluminum Mounting Rails", category: "Mounting Racks", rating: "5.0 / 5.0", img: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=100&q=80" }
  ];

  // 3 related products for horizontal Carousel grid below (strictly matching active product category, no backfilling, only database products)
  const relatedCarouselItems = useMemo(() => {
    const dbProductIds = new Set((db.products || []).map(p => idToNumber(p.id)));
    const allList = (Object.values(allProducts) as ProductDetailsData[]).filter(
      p => p.id !== activeProduct.id && dbProductIds.has(p.id)
    );
    const list = allList.filter(p => p.category === activeProduct.category);
    return list.slice(0, 3);
  }, [allProducts, activeProduct.id, activeProduct.category, db.products]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phoneNumber) return;
    
    // Call unified storage link
    submitInboundLead({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phoneNumber.trim(),
      service: `PRODUCT INQUIRY: ${activeProduct.name}`,
      consumption: formData.message.trim() || 'No additional message',
      region: 'Inquiry Portal'
    });

    setFormSubmitted(true);
  };

  // Switch product detail view and scroll top
  const handleItemSelect = (id: number) => {
    onSelectProduct(id);
    setActiveThumbIndex(0);
    setFormSubmitted(false);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-stone-50 min-h-screen">
      
      {/* 1. TITLE SECTION (Font size 40px, no hero image background) */}
      <div className="bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
          <span className="inline-flex items-center gap-2 text-forest-750 text-xs font-mono font-black tracking-widest uppercase mb-4 select-none">
            <Zap className="w-3.5 h-3.5 fill-forest-750 text-forest-750 shrink-0" />
            <span>{activeProduct.category.toUpperCase()}</span>
          </span>
          <h1 className="font-display text-[40px] font-black text-forest-950 tracking-tight leading-tight uppercase">
            {activeProduct.name}
          </h1>
        </div>
      </div>

      {/* 3. MAIN CONTENT LAYOUT (Flat page with sidebars, no general container overlays) */}
      <section className="py-12 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Image Showcase at top, followed by Product Specs & Descriptions flat page layout */}
            <div className="lg:col-span-8 space-y-8 text-left">
              
              {/* Image Showcase */}
              <div className="space-y-4">
                {/* Large Display Image */}
                <div 
                  className="relative w-full max-w-[940px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm aspect-[940/788]"
                  style={{ aspectRatio: "940 / 788" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeThumbIndex}
                      src={activeProduct.thumbnails[activeThumbIndex]}
                      alt="Product detailed configuration view"
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

                {/* Thumbnail Slider Sequence (Exactly 4 visible, slideable to the right if more) */}
                <div className="relative group/thumbs">
                  <div 
                    ref={thumbScrollRef}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {activeProduct.thumbnails.map((thumbUrl, tIdx) => {
                      return (
                        <button
                          key={tIdx}
                          onClick={() => setActiveThumbIndex(tIdx)}
                          className={`relative rounded-lg overflow-hidden aspect-[4/3] border transition-all cursor-pointer shadow-xs shrink-0 snap-start ${
                            activeProduct.thumbnails.length <= 4 
                              ? 'w-[calc((100%-12px*3)/4)]' 
                              : 'w-[calc((100%-12px*3)/4)] min-w-[110px] sm:min-w-[140px]'
                          } ${
                            activeThumbIndex === tIdx
                              ? 'border-solar-yellow-500 ring-2 ring-solar-yellow-500/15 scale-[1.01]'
                              : 'border-stone-200 opacity-75 hover:opacity-100 hover:scale-[1.01]'
                          }`}
                        >
                          <img
                            src={thumbUrl}
                            alt={`Product thumbnail view ${tIdx + 1}`}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-forest-950/5" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Left & Right scroll indicators (Only show if thumbnails > 4) */}
                  {activeProduct.thumbnails.length > 4 && (
                    <>
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
                    </>
                  )}
                </div>
              </div>

              {/* Contact via Channels (Above Global Dispatch & Specification Profile) */}
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





              {/* Product Details Section */}
              <div className="space-y-4 pt-0">
                <div className="border-b border-stone-200 pb-4">
                  <h2 className="font-display font-black text-[28px] text-stone-900 tracking-tight leading-tight">
                    Product Details
                  </h2>
                </div>
                {activeProduct.description ? (
                  <div 
                    className="rich-text-preview text-stone-600 text-[14px] leading-relaxed break-all break-words font-display text-left overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: activeProduct.description }}
                  />
                ) : (
                  <div className="text-stone-600 text-[14px] space-y-4 leading-relaxed break-all break-words font-display text-left">
                    {activeProduct.architectureText && (
                      <p>
                        {activeProduct.architectureText}
                      </p>
                    )}
                    {activeProduct.reliabilityText && (
                      <p>
                        {activeProduct.reliabilityText}
                      </p>
                    )}
                  </div>
                )}
              </div>



            </div>

            {/* RIGHT COLUMN (30% Width - Sidebar) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Widget 3 (Product Categories Checklist) - Functional filter toggle navigation */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm text-left">
                
                {/* Info Card Header */}
                <div className="border-b border-stone-200 pb-3 mb-5">
                  <h3 className="text-sm sm:text-base font-sans font-bold text-[#05300a] tracking-wider uppercase leading-tight">
                    Product Categories
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest mt-1 leading-normal">
                    HARDWARE SECTOR FILTERS
                  </p>
                </div>

                <div className="space-y-3">
                  {categoriesList.map((cat, idx) => {
                    const count = getCategoryCount(cat);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full flex items-center gap-3 py-2 border-b border-stone-100 last:border-b-0 text-left cursor-pointer group/cat select-none transition-all"
                      >
                        <Folder className="w-4 h-4 text-stone-400 group-hover/cat:text-forest-750 shrink-0 transition-colors" />
                        <div className="min-w-0 flex-1">
                          <span className="font-sans font-medium text-sm text-stone-800 group-hover/cat:text-forest-950 group-hover/cat:font-bold leading-tight block truncate transition-all">
                            {cat} <span className="text-stone-400 font-normal font-sans ml-1">({count})</span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
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

      {/* 3. RELATED HARDWARE CAROUSEL (Layout: 3-Column Horizontal Row) */}
      <section className="py-12 sm:py-16 bg-stone-100/50 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="text-left">
              <h2 className="font-display font-black text-2xl text-forest-950">
                Related Products
              </h2>
            </div>
            {/* Sleek minimalist left/right arrow icons */}
            {relatedCarouselItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    handleItemSelect(relatedCarouselItems[0].id);
                  }}
                  className="w-10 h-10 rounded-full border border-stone-300 hover:border-forest-950 text-stone-600 hover:text-forest-950 flex items-center justify-center bg-white transition-all cursor-pointer"
                  title="View previous related asset"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    handleItemSelect(relatedCarouselItems[relatedCarouselItems.length - 1].id);
                  }}
                  className="w-10 h-10 rounded-full border border-stone-300 hover:border-forest-950 text-stone-600 hover:text-forest-950 flex items-center justify-center bg-white transition-all cursor-pointer"
                  title="View next related asset"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {relatedCarouselItems.length === 0 ? (
            <div className="py-12 text-center max-w-md mx-auto">
              <Inbox className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="font-display font-black text-xl text-stone-400 mb-2">No related hardware components</h3>
              <p className="text-stone-400 text-sm font-light max-w-sm mx-auto">
                No other products found in the "{activeProduct.category}" category. Please explore our other categories using the filters in the catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCarouselItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none text-left"
                >
                  {/* Container design: Image */}
                  <div 
                    onClick={() => handleItemSelect(item.id)}
                    className="relative aspect-[4/3.3] bg-stone-100 overflow-hidden border-b border-stone-100 cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Content block section: Title Only */}
                  <div className="p-5 text-left flex-grow flex flex-col justify-between">
                    <h3 
                      onClick={() => handleItemSelect(item.id)}
                      className="font-display font-black text-sm sm:text-base text-forest-950 leading-snug hover:text-solar-yellow-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {item.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
      <SpecialOffersGallery />

      {/* 4. PAGE CLOSING CTA / FOOTER CONTACT ROUTING */}
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
