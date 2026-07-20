import React from 'react';
import { motion } from 'motion/react';
import SpecialOffersGallery from './SpecialOffersGallery';
import {
  Home,
  Building2,
  Factory,
  BatteryCharging,
  Compass,
  ArrowRightLeft,
  Network,
  Wrench,
  FileBarChart2,
  CheckCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

interface ServicesPageProps {
  onStartConsultation: () => void;
  onSelectService: (id: number) => void;
  onExploreServices?: () => void;
}

export default function ServicesPage({ onStartConsultation, onSelectService, onExploreServices }: ServicesPageProps) {
  // Service item structures with high-fidelity, professional titles & descriptions for each checklist item (exactly 3 points each)
  const servicesList = [
    {
      id: 1,
      icon: <Home className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Residential Solar Engineering',
      badges: ['Tier-1 Home Spec', 'Smart-Integrated'],
      image: 'https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/715710298_122204691866538051_1254492833041665807_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHwaFCWupCdXZdCoN8DdcAOhKu4GTAopGqEq7gZMCikamtZD9pihIyz5u1-vTJMEsXFNyhqaASdYSBaDR1bPr75&_nc_ohc=gwE_5JVCKa4Q7kNvwGHOD1E&_nc_oc=AdoNeIkSfSDh4Jx47BdpDjzFpb4lFre7rz_5zzy6lHQHImP_CUK30aua988bf21ZbL4&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=jxnLKYc5h39jjaxNLGo10A&_nc_ss=7b2a8&oh=00_AQBMDFnti4eRBczAnJOnZ7wmjNTFbwKY5JIL9FfjfitDOQ&oe=6A62C08C',
      description: 'Our advanced residential systems provide a complete, **zero-down rooftop solar blueprint** custom engineered to power your high-capacity smart homes. Each installation integrates premium Tier-1 photovoltaic panels with smart battery backups to protect against sudden blackouts while delivering maximum utility tariff offset credits from day one.',
      checklist: [
        { title: 'Structural Integrity Audits' },
        { title: 'Solar Exposure Simulations' },
        { title: 'Typhoon-Rated Racking' },
        { title: 'Smart Home Battery Link' },
        { title: 'Rapid Shutdown Protection' },
        { title: 'Live Net Metering Setup' }
      ]
    },
    {
      id: 2,
      icon: <Building2 className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Commercial Rooftop Microgrids',
      badges: ['ROI Optimized', 'Enterprise Grade'],
      image: 'https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/727277137_122206181006538051_4645898725046553359_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1155&ctp=s2048x1155&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGpd8S-Lxjw_yTQgkbNZOs7Ax1_mohjr58DHX-aiGOvn7dKyPvMRJbFUXnUjDldbZ5MvHOc1FxuBOy9zG7j9cz3&_nc_ohc=FQbeOb5vhe4Q7kNvwGua_lc&_nc_oc=AdoAAB7Fo50FSR82wqG_moJ7CNGNUl2KsOorxDa62f_TJmEZxxq3WESMMoR9nHXQPVI&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=7aKwoICHzqp2QyqG4Ij22g&_nc_ss=7b2a8&oh=00_AQCooUg_CrvqsBUucO-Ha-U4jH-9tLI7XLp2jR23YDze2Q&oe=6A62CDA5',
      description: 'We engineer enterprise-grade commercial solar microgrids designed to **drastically lower operational overhead** and hedge against rising local municipal electricity rates. Our heavy-duty rooftop arrays protect physical building assets, lower carbon intensity metrics, and secure predictable fixed-rate energy pricing for decades.',
      checklist: [
        { title: 'Enterprise-Grade Inverters' },
        { title: 'Leak-Proof Seam Clamps' },
        { title: 'Detailed Depreciation Profiles' },
        { title: 'Real-Time SCADA Panel' },
        { title: 'Peak Load Shaving Setup' },
        { title: 'Zero-Down Capital Access' }
      ]
    },
    {
      id: 3,
      icon: <Factory className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Industrial Scale Arrays',
      badges: ['High Capacity', 'Mega-Watt Custom'],
      image: 'https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/729855439_122206540016538051_2794935983518101920_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGHx-veDSmtdaqArfiQumXvJxBwUUU5yC0nEHBRRTnILbL125vGLzwvaCjPoiuM7W6FH9Rjz0KLb3PWAadsOb8V&_nc_ohc=tnZrdJBwyOAQ7kNvwH4Fw4R&_nc_oc=AdoZl5AEQGcNiQjmhJsZkUJgKZPowK195uCE-rvfy_PYpOJwPmGIAlkE2esyOYp3pyw&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=iwhFNwCz5K3ML4RK-lZoSg&_nc_ss=7b2a8&oh=00_AQC_jH0NqGE1zfMOEHhFzXTZH6Q4A0_4Sa6lRDit-cz5kg&oe=6A62E7A3',
      description: 'Custom designed multi-megawatt systems planned for high-demand **factories, cold storage facilities, and logistics warehouses**. These rugged solar developments are built with extreme structural resilience to withstand severe typhoons, while delivering continuous high-voltage power synchronization for heavy machinery.',
      checklist: [
        { title: 'Reinforced Ground framing' },
        { title: 'High-Voltage Utility Sync' },
        { title: 'Active Step-Up Transformers' },
        { title: 'Heavy Piling Support' },
        { title: 'Substation-Grade Safety' },
        { title: 'Remote Telemetry Array' }
      ]
    },
    {
      id: 4,
      icon: <BatteryCharging className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Hybrid Battery Storage / BESS',
      badges: ['Zero-Latency', 'Next-Gen Lithium'],
      image: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/468322501_122122525610538051_6693382275845939564_n.jpg?stp=dst-jpg_tt6&cstp=mx1123x1424&ctp=s1123x1424&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFzGQ_UPh_MEiOnkWqasZ57mkZBeckdhICaRkF5yR2EgFHJztvfBF5GaHkfsahfC5W8iEwoaBITErJ1ySo3Wo7i&_nc_ohc=tSoULfHEXbQQ7kNvwFUHeOA&_nc_oc=AdpfvJJ61nmiEkhVeuIdZ0USuq98l8ulb17G_PzIxkJwpSaP2KU_rt9zMO63JOITIMw&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=vp2yU29Ycu5kPiBrPID05w&_nc_ss=7b2a8&oh=00_AQDQO8xMnsv0sm0um8r3r7HWpDj_o-XdrqKG9-acVlupKQ&oe=6A62F4A0',
      description: 'Our next-generation commercial and industrial battery energy storage systems (BESS) integrate seamlessly with solar generation to provide **zero-latency power transitions** during sudden grid failures. Built with highly durable lithium iron phosphate chemistry to safely manage peak demand and reduce expensive utility tariffs.',
      checklist: [
        { title: 'LiFePO4 Chemistry Units' },
        { title: 'Dynamic Power Managers' },
        { title: 'Peak-Load Arbitrage Sizing' },
        { title: 'Zero-Latency Transfer Switch' },
        { title: 'Fire Suppression Enclosures' },
        { title: 'Multi-Inverter Coordination' }
      ]
    },
    {
      id: 5,
      icon: <Compass className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Pure Off-Grid Power Systems',
      badges: ['100% Autonomous', 'Remote Integrity'],
      image: 'https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/700507012_122202406874538051_7224836095432632895_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x921&ctp=s2048x921&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE1p0WRLSqDWvpLEwcPzGp2PmCJf9Bctio-YIl_0Fy2Ksw2yKDDwXljHUFkHm5MTKeF7l3U71cHwnCDbho5RN_e&_nc_ohc=aNepyb7oP7YQ7kNvwGyK3Ui&_nc_oc=Adp-ADM3MpPrzliShYyr9ejewZqDMQ1OIa34RbFJYdphtDxZq2G6khtRRUFBIGy_bCg&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=SYtcFvUcSuvrj3DM4MNA3w&_nc_ss=7b2a8&oh=00_AQAnh_mHh9nb4yCqxs2aqki2PkykkQRSWw6NOq-S2-pG0g&oe=6A62E668',
      description: 'Fully autonomous microgrid architectures built for absolute energy independence in **remote agricultural sites, island properties, and luxury retreats**. These self-sustaining power loops combine oversized solar arrays with robust battery reservoirs and intelligent backup generators to ensure uninterrupted, heavy-duty electrical output.',
      checklist: [
        { title: 'Fully Isolated Inverter Banks' },
        { title: 'Combustion Auto-Start Links' },
        { title: 'Over-Sized Autonomy Reservoirs' },
        { title: 'Pure Sine-Wave Output' },
        { title: 'Fuel-Generator Automation' },
        { title: 'Heavy-Duty Weatherproofing' }
      ]
    },
    {
      id: 6,
      icon: <ArrowRightLeft className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Smart Net Metering Integration',
      badges: ['Credit Earning', 'Bi-Directional Sync'],
      image: 'https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/730332956_122206540040538051_6562656275002038057_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEoS1EUMaZy5YurZA5SqUqJtrX_G8tzkvW2tf8by3OS9S7HQAv4_uIex-SyDcc2tfKCgyOgSA1tOCWxdSWSLRrt&_nc_ohc=_JsopU5Q0JMQ7kNvwFBD1Ym&_nc_oc=AdpYIkbkhPn8wnsG9Wx5Sx2er5dyjCgzsEzbVdHKEKBzGI8md8XnIZJCvuZFQv_ukF0&_nc_zt=23&_nc_ht=scontent.fmnl4-1.fna&_nc_gid=1JbzlaS9wd6R4pIXYX3rgQ&_nc_ss=7b2a8&oh=00_AQArLgTyYgaX_hW4oerVWajK7Rp-8pho55_Ivbi_MkBpqg&oe=6A62C6C5',
      description: 'Maximize the financial return of your daylight generation with certified, **bi-directional utility net metering connections**. Our team handles all regulatory paperwork, physical installations, and safety inspections to let your facility seamlessly export surplus clean power back to the public grid in exchange for high-value credits.',
      checklist: [
        { title: 'Dual-Register Utility Meters' },
        { title: 'Full Distribution Filing Management' },
        { title: 'Automatic Phase Sync Relays' },
        { title: 'Utility Permit Clearance' },
        { title: 'Rapid Offset Calculations' },
        { title: 'Dual-Core Controller Unit' }
      ]
    },
    {
      id: 7,
      icon: <Network className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Solar Microgrid Design',
      badges: ['Decentralized Grid', 'Master Plan Ready'],
      image: 'https://scontent.fmnl4-4.fna.fbcdn.net/v/t39.30808-6/739083131_122207756672538051_5506086085101285395_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1155&ctp=s2048x1155&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHRPgoCPn4zBQNmI9LTP_e6Xxz0zk8xGwZfHPTOTzEbBjjB7c8IJ9FuvoEQnF7zhXQREPD_0XlCvGCabG1Fw2KA&_nc_ohc=mXwlr1HCRIEQ7kNvwFm59H3&_nc_oc=AdoE78YcFM4xB7HOCHi8vupmhnc0KuZTjU9XvWadE1g6q34VPDfa5MMQHbnXoNuwQ-U&_nc_zt=23&_nc_ht=scontent.fmnl4-4.fna&_nc_gid=eMywR_-u8qez9f1RUTgRGg&_nc_ss=7b2a8&oh=00_AQB2AYc6PG6g_kFZbRQoV-iXm7pEMlKIuKDX5-73f4iQ7w&oe=6A62D7A5',
      description: 'Decentralized power distribution systems engineered to serve **master-planned communities, industrial parks, and multi-tenant commercial facilities**. We install intelligent central generation hubs that balance electrical loads fairly among users, track live consumption data, and optimize shared solar power assets.',
      checklist: [
        { title: 'Community Distribution Layouts' },
        { title: 'Adaptive Multi-User Sharing' },
        { title: 'High-Speed Fiber Connections' },
        { title: 'Local Grid Management' },
        { title: 'Smart Current Breakers' },
        { title: 'Dynamic Tenant Billing' }
      ]
    },
    {
      id: 8,
      icon: <Wrench className="w-6 h-6 text-solar-yellow-500" />,
      title: 'System Optimization & Panel Wash',
      badges: ['Active Diagnostics', 'Yield Restoring'],
      image: 'https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/719427386_122204620304538051_1723852294236080978_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFP9Yt0SPWiIsEoNr1SNgzDv41ZzcGeY7m_jVnNwZ5jubhQfq3nPRyAt_Ie0EqZYTbtMLxlADkuZrT3xOKXb2TU&_nc_ohc=5qYIW1SuWnAQ7kNvwEBam3G&_nc_oc=Adr1UMjHHprO0ZO9PM_Hb4GQyzjNf9KpDzgoAnnyUuKoyRtQTjmkZE6xpWe851d3e98&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=V-IEscgHwqFZwmR8W19e1A&_nc_ss=7b2a8&oh=00_AQDVrrRfe9uOnxaF4xhVVqB17tt3bCqhKBmW3GKBs9GICQ&oe=6A62D490',
      description: 'An active preventative maintenance protocol featuring professional, non-abrasive panel cleanings, **aerial infrared thermal imaging scans**, and rigorous mechanical bolt re-torque services. Engineered to eliminate micro-crack hot spots, ensure high-efficiency system performance, and restore maximum photon absorption year-round.',
      checklist: [
        { title: 'Pure-Water Pressure Washing' },
        { title: 'Thermal Hot-Spot Mapping' },
        { title: 'Structural Bolt Re-Torque' },
        { title: 'Electrical Lead Testing' },
        { title: 'Bypass Diode Diagnosis' },
        { title: 'Detailed Health Reports' }
      ]
    },
    {
      id: 9,
      icon: <FileBarChart2 className="w-6 h-6 text-solar-yellow-500" />,
      title: 'Technical Feasibility & Energy Audits',
      badges: ['ROI Modeling', 'Precision Mapping'],
      image: 'https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/747881792_122208827000538051_9075788173897217588_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG7Mee_14owjVh3fM9VQkHK_Q81HahC6M79DzUdqELozifJLMWk70v_jKQqs_7zes7zS3n6qoQEdKokcQXQzA_s&_nc_ohc=HvdBuEEq7LIQ7kNvwFu8D2z&_nc_oc=AdoEVtxhDZF0HbfBidx2NiD9SnRIVJnwPh1YXzcuYKYXxPOMu91balC4vmLrkpsNhKQ&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=NCahkEtb7bg7Q6KpmqYxyw&_nc_ss=7b2a8&oh=00_AQDZFvGrKvArdEgES1j_SJxmW8Dil-TsSuonBTYUjgcZ3w&oe=6A62E329',
      description: 'Deep analytical data mapping conducted prior to deployment, including **high-fidelity LiDAR terrain scans and granular 15-minute load analysis**. We build exhaustive 3D shading simulations, static structural load models, and clear multi-decade financial projection curves to guarantee your exact investment ROI before construction begins.',
      checklist: [
        { title: 'LiDAR Terrain Inspections' },
        { title: '15-Minute Load Tracking' },
        { title: 'Roof Deck Loading Modeling' },
        { title: '3D Shadow Modeling' },
        { title: 'Multi-Decade ROI Curves' },
        { title: 'Utility Rate Benchmarking' }
      ]
    },
  ];

  // Utility to replace markdown bold double asterisks safely
  const formatDescription = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => 
      index % 2 === 1 ? <strong key={index} className="font-extrabold text-forest-950">{part}</strong> : part
    );
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-white">
      
      {/* 1. HERO / HEADER SECTION */}
      <section className="relative min-h-[50vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
            alt="Sleek architectural home featuring integrated premium solar panels"
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
              <span>POWER ARCHITECTURE</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6 uppercase">
              OUR SERVICES
            </h1>
            <p className="text-stone-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-xl md:max-w-3xl">
              High-efficiency, custom-tailored solar infrastructure designed to maximize your ROI and lock in long-term capital preservation and energy security.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES ALTERNATING DIRECTORY (ENGINEERING STANDARDS ARCHITECTURE) */}
      <section className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-28 lg:space-y-40">
            {servicesList.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
                >
                  {/* Visual Image Block (with Offset Shadow and alternating layouts) */}
                  <div className={`lg:col-span-6 relative group h-[400px] sm:h-[480px] ${
                    isEven ? 'lg:order-first' : 'lg:order-last'
                  }`}>
                    {/* Offset shadow background block matching the color aesthetic */}
                    <div className={`absolute inset-0 border rounded-3xl transition-transform duration-300 ${
                      isEven 
                        ? '-translate-x-3.5 translate-y-3.5 md:-translate-x-4 md:translate-y-4 group-hover:-translate-x-2.5 group-hover:translate-y-2.5 bg-forest-950 border-forest-950' 
                        : 'translate-x-3.5 translate-y-3.5 md:translate-x-4 md:translate-y-4 group-hover:translate-x-2.5 group-hover:translate-y-2.5 bg-solar-yellow-500 border-solar-yellow-500'
                    }`} />
                    
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.6 }}
                      className={`w-full h-full relative overflow-hidden rounded-3xl border-2 shadow-2xl ${
                        isEven ? 'border-forest-950' : 'border-solar-yellow-500'
                      }`}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent pointer-events-none" />
                      
                      {/* Floating icon overlay on image */}
                      <div className="absolute top-6 left-6 w-14 h-14 bg-forest-950 flex items-center justify-center rounded-xl shadow-lg border border-forest-800 z-10">
                        {service.icon}
                      </div>
                    </motion.div>
                  </div>

                  {/* Text Content & Checklist Block (matching severe weather list formatting) */}
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6 }}
                    className={`lg:col-span-6 space-y-6 ${
                      isEven ? 'lg:order-last' : 'lg:order-first'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-solar-yellow-600 font-mono text-xs font-black tracking-widest uppercase">
                      <Zap className="w-3.5 h-3.5 fill-solar-yellow-600" />
                      <span>ENGINEERING SPEC: MODULE 0{index + 1}</span>
                    </div>
                    
                    <h2 className="font-display text-3xl sm:text-[40px] font-black text-forest-950 tracking-tight leading-tight uppercase">
                      {service.title}
                    </h2>

                    <p className="text-stone-700 font-sans text-sm sm:text-base leading-relaxed font-light max-w-xl">
                      {formatDescription(service.description)}
                    </p>

                    {/* Precise checklist arranged in a 2x3 grid, with no descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4">
                      {service.checklist.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-solar-yellow-500" />
                          </div>
                          <span className="font-sans font-bold text-sm sm:text-base text-forest-950 leading-tight">
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
          <SpecialOffersGallery noSectionWrapper={true} />

        </div>
      </section>

      {/* 3. PAGE CLOSING CTA / FOOTER CONTACT ROUTING */}
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
