import React from 'react';
import { motion } from 'motion/react';
import SpecialOffersGallery from './SpecialOffersGallery';
import {
  Home,
  Briefcase,
  Zap,
  Compass,
  Battery,
  ArrowLeftRight,
  Leaf,
  CheckCircle,
  Shield,
  Activity,
  HardHat,
  ArrowRight,
  Building2,
  Factory,
  BatteryCharging,
  Network,
  Wrench,
  FileBarChart2,
  ChevronRight,
  Target,
  Eye
} from 'lucide-react';


interface AboutPageProps {
  onStartConsultation: () => void;
  onExploreServices?: () => void;
}

export default function AboutPage({ onStartConsultation, onExploreServices }: AboutPageProps) {
  // 3. WHAT WE BUILD SECTION DATA (Listing services from services page)
  const infrastructureCards = [
    {
      id: 1,
      icon: <Home className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Residential Solar Engineering',
      image: 'https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/715710298_122204691866538051_1254492833041665807_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHwaFCWupCdXZdCoN8DdcAOhKu4GTAopGqEq7gZMCikamtZD9pihIyz5u1-vTJMEsXFNyhqaASdYSBaDR1bPr75&_nc_ohc=gwE_5JVCKa4Q7kNvwGHOD1E&_nc_oc=AdoNeIkSfSDh4Jx47BdpDjzFpb4lFre7rz_5zzy6lHQHImP_CUK30aua988bf21ZbL4&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=jxnLKYc5h39jjaxNLGo10A&_nc_ss=7b2a8&oh=00_AQBMDFnti4eRBczAnJOnZ7wmjNTFbwKY5JIL9FfjfitDOQ&oe=6A62C08C',
      description: 'Customized rooftop configurations optimized for modern high-demand smart homes. Engineered to deliver immediate utility tariff offsets and secure independent back-up capacity.',
    },
    {
      id: 2,
      icon: <Building2 className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Commercial Rooftop Microgrids',
      image: 'https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/727277137_122206181006538051_4645898725046553359_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1155&ctp=s2048x1155&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGpd8S-Lxjw_yTQgkbNZOs7Ax1_mohjr58DHX-aiGOvn7dKyPvMRJbFUXnUjDldbZ5MvHOc1FxuBOy9zG7j9cz3&_nc_ohc=FQbeOb5vhe4Q7kNvwGua_lc&_nc_oc=AdoAAB7Fo50FSR82wqG_moJ7CNGNUl2KsOorxDa62f_TJmEZxxq3WESMMoR9nHXQPVI&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=7aKwoICHzqp2QyqG4Ij22g&_nc_ss=7b2a8&oh=00_AQCooUg_CrvqsBUucO-Ha-U4jH-9tLI7XLp2jR23YDze2Q&oe=6A62CDA5',
      description: 'High-yield commercial systems engineered strictly to reduce operational overhead, shield core corporate physical assets, and lock in long-term fixed power pricing predictability.',
    },
    {
      id: 3,
      icon: <Factory className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Industrial Scale Arrays',
      image: 'https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/729855439_122206540016538051_2794935983518101920_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGHx-veDSmtdaqArfiQumXvJxBwUUU5yC0nEHBRRTnILbL125vGLzwvaCjPoiuM7W6FH9Rjz0KLb3PWAadsOb8V&_nc_ohc=tnZrdJBwyOAQ7kNvwH4Fw4R&_nc_oc=AdoZl5AEQGcNiQjmhJsZkUJgKZPowK195uCE-rvfy_PYpOJwPmGIAlkE2esyOYp3pyw&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=iwhFNwCz5K3ML4RK-lZoSg&_nc_ss=7b2a8&oh=00_AQC_jH0NqGE1zfMOEHhFzXTZH6Q4A0_4Sa6lRDit-cz5kg&oe=6A62E7A3',
      description: 'Heavy-duty grid-tied developments custom planned for factories, warehouses, cold storage infrastructure, and processing plants. Configured for peak performance and extreme durability.',
    },
    {
      id: 4,
      icon: <BatteryCharging className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Hybrid Battery Storage / BESS',
      image: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/468322501_122122525610538051_6693382275845939564_n.jpg?stp=dst-jpg_tt6&cstp=mx1123x1424&ctp=s1123x1424&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFzGQ_UPh_MEiOnkWqasZ57mkZBeckdhICaRkF5yR2EgFHJztvfBF5GaHkfsahfC5W8iEwoaBITErJ1ySo3Wo7i&_nc_ohc=tSoULfHEXbQQ7kNvwFUHeOA&_nc_oc=AdpfvJJ61nmiEkhVeuIdZ0USuq98l8ulb17G_PzIxkJwpSaP2KU_rt9zMO63JOITIMw&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=vp2yU29Ycu5kPiBrPID05w&_nc_ss=7b2a8&oh=00_AQDQO8xMnsv0sm0um8r3r7HWpDj_o-XdrqKG9-acVlupKQ&oe=6A62F4A0',
      description: 'Advanced intelligent reserve lithium chemical storage solutions. Guaranteed to deliver immediate seamless power transitions during complete municipal grid failures, protecting sensitive electrical loads.',
    },
    {
      id: 5,
      icon: <Compass className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Pure Off-Grid Power Systems',
      image: 'https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/700507012_122202406874538051_7224836095432632895_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x921&ctp=s2048x921&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE1p0WRLSqDWvpLEwcPzGp2PmCJf9Bctio-YIl_0Fy2Ksw2yKDDwXljHUFkHm5MTKeF7l3U71cHwnCDbho5RN_e&_nc_ohc=aNepyb7oP7YQ7kNvwGyK3Ui&_nc_oc=Adp-ADM3MpPrzliShYyr9ejewZqDMQ1OIa34RbFJYdphtDxZq2G6khtRRUFBIGy_bCg&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=SYtcFvUcSuvrj3DM4MNA3w&_nc_ss=7b2a8&oh=00_AQAnh_mHh9nb4yCqxs2aqki2PkykkQRSWw6NOq-S2-pG0g&oe=6A62E668',
      description: 'Completely independent high-integrity microgrid generation and standalone active battery storage arrays. Tailored to sustain remote properties with no grid connectivity.',
    },
    {
      id: 6,
      icon: <ArrowLeftRight className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Smart Net Metering Integration',
      image: 'https://scontent.fmnl4-1.fna.fbcdn.net/v/t39.30808-6/730332956_122206540040538051_6562656275002038057_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=101&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEoS1EUMaZy5YurZA5SqUqJtrX_G8tzkvW2tf8by3OS9S7HQAv4_uIex-SyDcc2tfKCgyOgSA1tOCWxdSWSLRrt&_nc_ohc=_JsopU5Q0JMQ7kNvwFBD1Ym&_nc_oc=AdpYIkbkhPn8wnsG9Wx5Sx2er5dyjCgzsEzbVdHKEKBzGI8md8XnIZJCvuZFQv_ukF0&_nc_zt=23&_nc_ht=scontent.fmnl4-1.fna&_nc_gid=1JbzlaS9wd6R4pIXYX3rgQ&_nc_ss=7b2a8&oh=00_AQArLgTyYgaX_hW4oerVWajK7Rp-8pho55_Ivbi_MkBpqg&oe=6A62C6C5',
      description: 'Double-secured municipal grid interconnections. Enables facilities to seamlessly export excess daylight solar generation back to utility providers in exchange for high-value offset credits.',
    },
    {
      id: 7,
      icon: <Network className="w-8 h-8 text-solar-yellow-500" />,
      title: 'Solar Microgrid Design',
      image: 'https://scontent.fmnl4-4.fna.fbcdn.net/v/t39.30808-6/739083131_122207756672538051_5506086085101285395_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1155&ctp=s2048x1155&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHRPgoCPn4zBQNmI9LTP_e6Xxz0zk8xGwZfHPTOTzEbBjjB7c8IJ9FuvoEQnF7zhXQREPD_0XlCvGCabG1Fw2KA&_nc_ohc=mXwlr1HCRIEQ7kNvwFm59H3&_nc_oc=AdoE78YcFM4xB7HOCHi8vupmhnc0KuZTjU9XvWadE1g6q34VPDfa5MMQHbnXoNuwQ-U&_nc_zt=23&_nc_ht=scontent.fmnl4-4.fna&_nc_gid=eMywR_-u8qez9f1RUTgRGg&_nc_ss=7b2a8&oh=00_AQB2AYc6PG6g_kFZbRQoV-iXm7pEMlKIuKDX5-73f4iQ7w&oe=6A62D7A5',
      description: 'Localized energy distribution systems engineered for master-planned community developments, industrial compounds, and localized housing associations to share cleanly harvested solar power.',
    },
    {
      id: 8,
      icon: <Wrench className="w-8 h-8 text-solar-yellow-500" />,
      title: 'System Optimization & Panel Wash',
      image: 'https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/719427386_122204620304538051_1723852294236080978_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFP9Yt0SPWiIsEoNr1SNgzDv41ZzcGeY7m_jVnNwZ5jubhQfq3nPRyAt_Ie0EqZYTbtMLxlADkuZrT3xOKXb2TU&_nc_ohc=5qYIW1SuWnAQ7kNvwEBam3G&_nc_oc=Adr1UMjHHprO0ZO9PM_Hb4GQyzjNf9KpDzgoAnnyUuKoyRtQTjmkZE6xpWe851d3e98&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=V-IEscgHwqFZwmR8W19e1A&_nc_ss=7b2a8&oh=00_AQDVrrRfe9uOnxaF4xhVVqB17tt3bCqhKBmW3GKBs9GICQ&oe=6A62D490',
      description: 'Precision lifecycle service. Comprises automated non-abrasive cleaning, thermal infrared cell scans, array output diagnostics, and physical electrical connection checkups.',
    },
  ];

  // 4. BUILD BY IMPACT SECTION DATA
  const impactMetrics = [
    { number: '100%', label: 'Energy Independence Delivered' },
    { number: '15MW+', label: 'Total Installed Solar Capacity' },
    { number: '500+', label: 'Solar Projects Completed' },
    { number: 'P50M+', label: 'Total Client Electricity Bill Savings' },
    { number: '45k+ Tons', label: 'Annual Carbon Footprint CO2 Offset' },
    { number: '24/7', label: 'Uninterrupted Monitoring' },
  ];



  return (
    <div className="font-sans antialiased text-stone-900 bg-white">
      
      {/* 1. HERO HEADER (Seamless Transition) */}
      <section className="relative min-h-[50vh] flex items-center bg-forest-950 overflow-hidden py-16 sm:py-24">
        {/* Full-width premium background of utility-scale solar arrays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://solenergy.com.ph/wp-content/uploads/2021/09/DJI_0751-1-1024x768.jpg"
            alt="Utility-scale solar array installation by Powershift Solar"
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
              <span>WHO WE ARE</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none mb-6 uppercase">
              About Our Firm
            </h1>
            <p className="text-stone-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-xl md:max-w-2xl">
              Our history, quality policy, and dedicated team of architectural, finishing, structural, electrical, and plumbing specialists.
            </p>
          </motion.div>
        </div>
      </section>


      {/* 2a. HOW WE BUILD SECTION (Layout: Alternating Row – Image Left, Text Right to match The Energy Vulnerability) */}
      <section className="py-24 lg:py-32 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Image Left Column */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center">
              <div className="relative group w-full">
                {/* Offset shadow background block (Green) */}
                <div className="absolute inset-0 bg-forest-950 border border-forest-950 rounded-2xl -translate-x-3.5 translate-y-3.5 transition-transform group-hover:-translate-x-2.5 group-hover:translate-y-2.5 duration-300" />
                <div className="relative overflow-hidden rounded-2xl h-64 sm:h-80 lg:h-[420px] bg-stone-100 border-2 border-forest-950 shadow-xl flex">
                  <img
                    src="https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/700078827_122202584282538051_421817359018536184_n.jpg?stp=dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHVJ-v0qgkvfyPuZJbh0xsFlL2XfzAL_gCUvZd_MAv-AOqLeeTDULl65urLaTAekdZ_dtFyciIERjTAwHQsmLsJ&_nc_ohc=bpZnA6Iu0yMQ7kNvwGSKXnV&_nc_oc=AdrSm5ngwy5byd2hoGNC-kdzRWVv6L0f2o-5sX74kaI9WZjdZIGEWeleFJCWot1F3XU&_nc_zt=23&_nc_ht=scontent.fmnl4-6.fna&_nc_gid=a7udeEM1ncjb4eELTrlYpA&_nc_ss=7b2a8&oh=00_AQDYxQVxWmoo6_GDBxIwJQSNYRaMXqm4nVjLjN-58MRF9Q&oe=6A62BF89"
                    alt="Rigorous high efficiency poultry ranch solar hardware deployment by Powershift engineers"
                    className="w-full h-full object-cover transform transition duration-700 hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Text Right Column */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center lg:pl-6">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
                BACKGROUND & HISTORY
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5.5xl font-black text-forest-900 leading-tight mb-4">
                Deep Solar Roots.<br />
                <span className="text-forest-700 font-light">Built on Innovation.</span>
              </h2>
              
              <div className="text-stone-700 font-light leading-relaxed text-base sm:text-lg">
                <p>
                  Established in 2015, Powershift Solar began with a singular focus on bringing high-integrity, sustainable solar power systems to residential and commercial communities. From our humble beginnings as a local engineering group, we evolved into a tier-1 solar developer trusted region-wide. Today, we continue to push the boundaries of clean energy technology to power a brighter, more sustainable tomorrow.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2b. DUPLICATE SECTION (Layout: Alternating Row – Text Left, Image Right to match The Powershift Path) */}
      <section className="py-24 lg:py-32 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Text Left Column */}
            <div className="lg:col-span-6 flex flex-col justify-center lg:pr-6">
              <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-solar-yellow-600 font-bold mb-4 block">
                ENGINEERING STANDARDS
              </span>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-5.5xl font-black text-forest-900 leading-tight mb-4">
                Optimized for Grid.<br />
                <span className="text-forest-700 font-light">Secured for Decades.</span>
              </h2>
              
              <div className="text-stone-700 font-light leading-relaxed text-base sm:text-lg">
                <p>
                  We integrate severe-weather durability and high-performance inverters to safeguard your capital investment. Each deployment is certified for immediate grid participation and long-term compliance. By combining advanced engineering with rigorous quality standards, we ensure your commercial solar infrastructure delivers predictable asset yields and unmatched operational resilience for decades to come.
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
                    src="https://scontent.fmnl4-4.fna.fbcdn.net/v/t39.30808-6/720553147_122205064106538051_8556642652617524279_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFneh0sK5IiH-PhQ25eiDPABrNYOZTMuZ4Gs1g5lMy5nrbB5t7DjNAbuSctg4sGh9PBJr_IcmIO5MMC4ltXy4Zi&_nc_ohc=3nfLyi75RHMQ7kNvwEYvKAH&_nc_oc=AdrDAHf3A0ncEVK_gVvadynUm__75sCU_NoRLa_h2F2NoTj3QGdeU07kfNJIDGCdB5c&_nc_zt=23&_nc_ht=scontent.fmnl4-4.fna&_nc_gid=F9FbqGkNCZBDCvdDp12qUA&_nc_ss=7b2a8&oh=00_AQBll676-qz105vTXvpfBK1SlrpP14ClUMFnOurv5hFUCA&oe=6A62D260"
                    alt="Rigorous high efficiency commercial solar system installation"
                    className="w-full h-full object-cover transform transition duration-700 hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 3. WHAT WE BUILD SECTION (Layout: 4x2 High-Contrast Grid Cards) */}
      <section className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-16 lg:mb-20 w-full">
            <span className="text-solar-yellow-600 font-mono text-xs font-black tracking-widest uppercase block mb-4">
              INFRASTRUCTURE SOLUTIONS
            </span>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7 text-left">
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 tracking-tight leading-tight">
                  Deploying Clean Energy <span className="inline-block">Infrastructure</span>
                </h2>
              </div>
              <div className="md:col-span-5 text-left md:text-right md:pt-2">
                <p className="text-stone-600 font-sans text-base sm:text-lg leading-relaxed">
                  From residential smart microgrids to massive multi-megawatt industrial solar systems, we design and build complete turn-key physical assets.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {infrastructureCards.map((card, idx) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between overflow-hidden bg-forest-50 border border-stone-200 hover:border-forest-700 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                id={`about-service-card-${card.id}`}
              >
                <div>
                  {/* Service Card Image Header */}
                  <div className="relative h-44 sm:h-48 w-full bg-stone-100 rounded-t-2xl">
                    {/* Image Mask Wrapper */}
                    <div className="w-full h-full overflow-hidden rounded-t-2xl relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Floating Icon Container */}
                    <div className="absolute -bottom-7 left-6 w-14 h-14 bg-forest-950 flex items-center justify-center rounded-xl shadow-lg border-2 border-forest-50 group-hover:bg-forest-800 transition-colors z-10">
                      {card.icon}
                    </div>
                  </div>

                  {/* Title with safe padding to clear floating icon */}
                  <div className="px-6 pt-12 pb-4">
                    <h3 className="font-display text-lg font-bold text-forest-950 group-hover:text-forest-800 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {card.title}
                    </h3>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-stone-200/60 mt-auto">
                  <button
                    onClick={onExploreServices || onStartConsultation}
                    className="inline-flex items-center gap-1.5 text-xs font-display font-medium text-forest-900 hover:text-solar-yellow-600 transition-colors text-left"
                  >
                    <span>Inquire About Service</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* 4. BUILD BY IMPACT SECTION (Layout: High-Impact 3x2 Performance Grid) */}
      <section className="py-24 lg:py-32 bg-forest-950 text-white relative overflow-hidden">
        {/* Subtle low-opacity background image overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1920&q=80")' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 h-[100px] flex flex-col justify-center">
            <span className="text-solar-yellow-500 font-mono text-xs font-black tracking-widest uppercase block mb-3">
              QUANTIFYING THE SHIFT
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none mb-6">
              Engineering Clean Energy Capital
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 sm:gap-x-16 sm:gap-y-16">
            {impactMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`flex flex-col items-center text-center justify-between ${
                  index === 0 ? 'h-[100px]' : 'h-[120px]'
                }`}
              >
                <div className="font-display text-5xl lg:text-6xl font-black text-solar-yellow-500 tracking-tight mb-2">
                  {metric.number}
                </div>
                <div className="w-full flex flex-col items-center">
                  <p className="text-white font-sans font-bold text-sm sm:text-base">
                    {metric.label}
                  </p>
                  <p className="text-stone-400 text-xs mt-1.5 font-mono">
                    VERIFIED PROJECT DATA • 2026
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* 5. MISSION AND VISION SECTION (Layout: Split 50/50 Dual Wide Cards) */}
      <section className="py-20 lg:py-28 bg-stone-100 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Card 1: Our Mission */}
            <div className="relative group">
              {/* Offset shadow background block (Yellow) */}
              <div className="absolute inset-0 bg-solar-yellow-500 border border-solar-yellow-500 rounded-3xl -translate-x-3 translate-y-3 md:-translate-x-3.5 md:translate-y-3.5 transition-transform group-hover:-translate-x-2 group-hover:translate-y-2 duration-300" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full h-full relative bg-forest-900 text-white rounded-3xl p-8 sm:p-12 border-2 border-solar-yellow-500 shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-solar-yellow-500 rounded-full blur-3xl opacity-10" />
                <div>
                  <div className="flex items-center gap-2 mb-6 text-solar-yellow-500 font-mono text-xs font-black tracking-widest uppercase">
                    <Target className="w-4 h-4" />
                    <span>OUR MISSION</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-6">
                    To Accelerate Complete <span className="text-solar-yellow-500">Energy Sovereignty</span>
                  </h3>
                  <p className="text-stone-200 text-base sm:text-lg leading-relaxed font-light mb-2">
                    We exist to eliminate grid volatility and overhead reliance for local businesses, agricultural sites, and premium residences. By combining high-integrity engineering design with uncompromised Tier-1 hardware, we deploy assets that protect both operational margins and regional ecosystems for generations.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 2: Our Vision */}
            <div className="relative group">
              {/* Offset shadow background block (Forest Green) */}
              <div className="absolute inset-0 bg-forest-900 border border-forest-900 rounded-3xl -translate-x-3 translate-y-3 md:-translate-x-3.5 md:translate-y-3.5 transition-transform group-hover:-translate-x-2 group-hover:translate-y-2 duration-300" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="w-full h-full relative bg-white text-stone-900 rounded-3xl p-8 sm:p-12 border-2 border-forest-900 shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-forest-900 rounded-full blur-3xl opacity-5" />
                <div>
                  <div className="flex items-center gap-2 mb-6 text-forest-700 font-mono text-xs font-black tracking-widest uppercase">
                    <Eye className="w-4 h-4" />
                    <span>OUR VISION</span>
                  </div>
                  <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight leading-tight text-forest-950 mb-6">
                    Setting the Absolute <span className="text-forest-700">Gold Standard</span> of Solar
                  </h3>
                  <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light mb-2">
                    Our target is to establish Powershift as the benchmark for solar integration safety, industrial hardware reliability, and fully transparent ROI audits. We are engineering a future where solar energy is not a temporary subsidy but a primary, rock-solid physical pillar of power infrastructure.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>


      {/* 6. OUR CORE VALUES SECTION (Layout: Asymmetrical Layout – Left Image/Focus Block, Right Value Pillars) */}
      <section className="py-20 lg:py-28 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Left Image / Focus Block */}
            <div className="lg:col-span-5 relative group min-h-[300px] lg:min-h-full">
              {/* Offset shadow background block (Yellow) */}
              <div className="absolute inset-0 bg-solar-yellow-500 border border-solar-yellow-500 rounded-3xl -translate-x-3 translate-y-3 md:-translate-x-3.5 md:translate-y-3.5 transition-transform group-hover:-translate-x-2 group-hover:translate-y-2 duration-300" />
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl border-2 border-solar-yellow-500"
              >
                <img
                  src="https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/720761770_122204938886538051_4133070001842119513_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx1536x2048&ctp=s1536x2048&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGLSgVYmoe622WwHxBdHgM_cBffbXldtt5wF99teV223o9XWYLQTOdm60-37Aoc8CNnCVs3qwfkC7AaRP3CUCkt&_nc_ohc=CCI6e6PZ74gQ7kNvwGukTi5&_nc_oc=AdrypqOhnHE5OpC-Bf7Rcmvkyb-kfK2YozYQZ68InZaKhstbeq7OQ7kpB4WIsJ1oo38&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=jxnLKYc5h39jjaxNLGo10A&_nc_ss=7b2a8&oh=00_AQDsIz0Mw157Bqvnh-4VDCJmM3aYcyhI4xy53xhP0DytAw&oe=6A62D681"
                  alt="High-grade utility scale solar installation by Powershift representing absolute structural precision"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-forest-950/20 to-transparent" />
              </motion.div>
            </div>

            {/* Right Value Pillars Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col justify-center space-y-8"
            >
              <div>
                <span className="text-solar-yellow-600 font-mono text-xs font-black tracking-widest uppercase block mb-3">
                  OUR CONSTITUTION
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-forest-950 tracking-tight leading-none mb-6">
                  The Principles of Power
                </h2>
                <p className="text-stone-600 text-sm sm:text-base font-light">
                  Our field operations, design protocols, and material standards are anchored on three simple, non-negotiable vectors:
                </p>
              </div>

              {/* Restructured Column Stack: Matching Uncompromised Integrity layout while keeping icons near titles */}
              <div className="space-y-6">
                <div className="group flex gap-6 sm:gap-8 bg-stone-50/60 hover:bg-forest-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/75 transition-all duration-300 flex items-center hover:shadow-md">
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-forest-900 tracking-tighter leading-none select-none">
                      01
                    </span>
                    <span className="text-stone-300/80 font-light text-2xl sm:text-4.5xl select-none leading-none">/</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Shield className="w-5 h-5 text-forest-900 shrink-0 group-hover:text-solar-yellow-500 transition-colors" />
                      <h4 className="font-display text-lg sm:text-xl font-extrabold text-forest-950 leading-tight group-hover:text-forest-800 transition-colors">
                        Technical Integrity
                      </h4>
                    </div>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                      Every wiring diagram, pitch offset, structural mount, and load calculation is reviewed and signed off by certified power systems engineers. Uncompromised performance accuracy.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-6 sm:gap-8 bg-stone-50/60 hover:bg-forest-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/75 transition-all duration-300 flex items-center hover:shadow-md">
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-forest-900 tracking-tighter leading-none select-none">
                      02
                    </span>
                    <span className="text-stone-300/80 font-light text-2xl sm:text-4.5xl select-none leading-none">/</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <HardHat className="w-5 h-5 text-forest-900 shrink-0 group-hover:text-solar-yellow-500 transition-colors" />
                      <h4 className="font-display text-lg sm:text-xl font-extrabold text-forest-950 leading-tight group-hover:text-forest-800 transition-colors">
                        Absolute Safety
                      </h4>
                    </div>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                      We govern our sites with high safety factors. Our electrical conduit protection, ground bonding, dynamic wind ballast, and grid isolation switches are engineered to pose zero operational risk.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-6 sm:gap-8 bg-stone-50/60 hover:bg-forest-50/50 p-6 sm:p-8 rounded-2xl border border-stone-200/75 transition-all duration-300 flex items-center hover:shadow-md">
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-forest-900 tracking-tighter leading-none select-none">
                      03
                    </span>
                    <span className="text-stone-300/80 font-light text-2xl sm:text-4.5xl select-none leading-none">/</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Activity className="w-5 h-5 text-forest-900 shrink-0 group-hover:text-solar-yellow-500 transition-colors" />
                      <h4 className="font-display text-lg sm:text-xl font-extrabold text-forest-950 leading-tight group-hover:text-forest-800 transition-colors">
                        Future-Proof Innovation
                      </h4>
                    </div>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                      We bypass legacy industry margins, directly deploying premium Tier-1 smart arrays, bypass diode panels, and next-generation battery integrations that are ready for future digital home sync upgrades.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* SPECIAL OFFERS IMAGE DISPLAY GALLERY */}
          <SpecialOffersGallery noSectionWrapper={true} />

        </div>
      </section>

      {/* 8. CTA SECTION (Layout: Full-Width High-Contrast Contact Banner) */}
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
