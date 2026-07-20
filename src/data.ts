import { ServiceItem, ProjectShowcase, ValuePillar, TestimonialItem } from './types';

export const servicesData: ServiceItem[] = [
  {
    id: 'residential',
    title: 'Residential Solar Engineering',
    description: 'Our advanced residential systems provide a complete, zero-down rooftop solar blueprint custom engineered to power high-capacity smart homes, integrating premium Tier-1 panels with smart battery backups.',
    badge: 'Home Systems',
    imagePath: 'https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/715710298_122204691866538051_1254492833041665807_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=104&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHwaFCWupCdXZdCoN8DdcAOhKu4GTAopGqEq7gZMCikamtZD9pihIyz5u1-vTJMEsXFNyhqaASdYSBaDR1bPr75&_nc_ohc=gwE_5JVCKa4Q7kNvwGHOD1E&_nc_oc=AdoNeIkSfSDh4Jx47BdpDjzFpb4lFre7rz_5zzy6lHQHImP_CUK30aua988bf21ZbL4&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=jxnLKYc5h39jjaxNLGo10A&_nc_ss=7b2a8&oh=00_AQBMDFnti4eRBczAnJOnZ7wmjNTFbwKY5JIL9FfjfitDOQ&oe=6A62C08C'
  },
  {
    id: 'commercial',
    title: 'Commercial Rooftop Microgrids',
    description: 'Enterprise-grade commercial solar microgrids engineered to drastically lower operational overhead, protect assets, and hedge your enterprise against volatile wholesale municipal utility tariffs.',
    badge: 'Enterprise Grade',
    imagePath: 'https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/727277137_122206181006538051_4645898725046553359_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1155&ctp=s2048x1155&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGpd8S-Lxjw_yTQgkbNZOs7Ax1_mohjr58DHX-aiGOvn7dKyPvMRJbFUXnUjDldbZ5MvHOc1FxuBOy9zG7j9cz3&_nc_ohc=FQbeOb5vhe4Q7kNvwGua_lc&_nc_oc=AdoAAB7Fo50FSR82wqG_moJ7CNGNUl2KsOorxDa62f_TJmEZxxq3WESMMoR9nHXQPVI&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=7aKwoICHzqp2QyqG4Ij22g&_nc_ss=7b2a8&oh=00_AQCooUg_CrvqsBUucO-Ha-U4jH-9tLI7XLp2jR23YDze2Q&oe=6A62CDA5'
  },
  {
    id: 'industrial-arrays',
    title: 'Industrial Scale Arrays',
    description: 'Custom designed multi-megawatt systems planned for high-demand factories, cold storage facilities, and logistics warehouses with extreme structural resilience and high-voltage synchronization.',
    badge: 'Mega-Watt Custom',
    imagePath: 'https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/729855439_122206540016538051_2794935983518101920_n.jpg?stp=dst-jpg_tt6&cstp=mx960x720&ctp=s960x720&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGHx-veDSmtdaqArfiQumXvJxBwUUU5yC0nEHBRRTnILbL125vGLzwvaCjPoiuM7W6FH9Rjz0KLb3PWAadsOb8V&_nc_ohc=tnZrdJBwyOAQ7kNvwH4Fw4R&_nc_oc=AdoZl5AEQGcNiQjmhJsZkUJgKZPowK195uCE-rvfy_PYpOJwPmGIAlkE2esyOYp3pyw&_nc_zt=23&_nc_ht=scontent.fmnl4-5.fna&_nc_gid=iwhFNwCz5K3ML4RK-lZoSg&_nc_ss=7b2a8&oh=00_AQC_jH0NqGE1zfMOEHhFzXTZH6Q4A0_4Sa6lRDit-cz5kg&oe=6A62E7A3'
  },
  {
    id: 'hybrid-bess',
    title: 'Hybrid Battery Storage / BESS',
    description: 'Next-generation industrial battery energy storage systems (BESS) providing zero-latency power transitions during grid failures, utilizing lithium iron phosphate chemistry to manage peak demand.',
    badge: 'Energy Security',
    imagePath: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/468322501_122122525610538051_6693382275845939564_n.jpg?stp=dst-jpg_tt6&cstp=mx1123x1424&ctp=s1123x1424&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFzGQ_UPh_MEiOnkWqasZ57mkZBeckdhICaRkF5yR2EgFHJztvfBF5GaHkfsahfC5W8iEwoaBITErJ1ySo3Wo7i&_nc_ohc=tSoULfHEXbQQ7kNvwFUHeOA&_nc_oc=AdpfvJJ61nmiEkhVeuIdZ0USuq98l8ulb17G_PzIxkJwpSaP2KU_rt9zMO63JOITIMw&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=vp2yU29Ycu5kPiBrPID05w&_nc_ss=7b2a8&oh=00_AQDQO8xMnsv0sm0um8r3r7HWpDj_o-XdrqKG9-acVlupKQ&oe=6A62F4A0'
  },
  {
    id: 'maintenance',
    title: 'Solar System Maintenance & Repair',
    description: 'Full-spectrum panel health optimization, routine safety diagnostics, thermal scanner inspections, block cleaning, and rapid micro-inverter component swaps to preserve maximum performance.',
    badge: 'Lifecycle Support',
    imagePath: 'https://scontent.fmnl4-8.fna.fbcdn.net/v/t39.30808-6/719427386_122204620304538051_1723852294236080978_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=110&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFP9Yt0SPWiIsEoNr1SNgzDv41ZzcGeY7m_jVnNwZ5jubhQfq3nPRyAt_Ie0EqZYTbtMLxlADkuZrT3xOKXb2TU&_nc_ohc=5qYIW1SuWnAQ7kNvwEBam3G&_nc_oc=Adr1UMjHHprO0ZO9PM_Hb4GQyzjNf9KpDzgoAnnyUuKoyRtQTjmkZE6xpWe851d3e98&_nc_zt=23&_nc_ht=scontent.fmnl4-8.fna&_nc_gid=V-IEscgHwqFZwmR8W19e1A&_nc_ss=7b2a8&oh=00_AQDVrrRfe9uOnxaF4xhVVqB17tt3bCqhKBmW3GKBs9GICQ&oe=6A62D490'
  },
  {
    id: 'consultation',
    title: 'Technical Consultation & Site Assessment',
    description: 'In-depth drone aerial measurements, shading geometry calculations, load testing analysis, and a transparent multi-year financial ROI yield blueprint before you commit.',
    badge: 'Zero-Risk Analysis',
    imagePath: 'https://scontent.fmnl4-2.fna.fbcdn.net/v/t39.30808-6/747881792_122208827000538051_9075788173897217588_n.jpg?stp=dst-jpg_tt6&cstp=mx720x960&ctp=s720x960&_nc_cat=108&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG7Mee_14owjVh3fM9VQkHK_Q81HahC6M79DzUdqELozifJLMWk70v_jKQqs_7zes7zS3n6qoQEdKokcQXQzA_s&_nc_ohc=HvdBuEEq7LIQ7kNvwFu8D2z&_nc_oc=AdoE78YcFM4xB7HOCHi8vupmhnc0KuZTjU9XvWadE1g6q34VPDfa5MMQHbnXoNuwQ-U&_nc_zt=23&_nc_ht=scontent.fmnl4-2.fna&_nc_gid=NCahkEtb7bg7Q6KpmqYxyw&_nc_ss=7b2a8&oh=00_AQDZFvGrKvArdEgES1j_SJxmW8Dil-TsSuonBTYUjgcZ3w&oe=6A62E329'
  }
];

export const valuePillarsData: ValuePillar[] = [
  {
    id: 1,
    title: 'Tier-1 Solar Technology',
    detail: 'We deploy exclusively ultra-efficiency mono-crystalline photovoltaic panels paired with industrial-grade micro-inverters. Tested for extreme tropical, maritime, and seismic resilience.'
  },
  {
    id: 2,
    title: 'Certified Master Installers',
    detail: 'Every field technician holds certified professional safety and roofing credentials. We execute clean, worry-free mounting with weather-sealed structural guarantees.'
  },
  {
    id: 3,
    title: 'Guaranteed ROI Tracking',
    detail: 'Monitor live conversion metrics, grid exports, and real-time dollar-savings on our custom mobile dashboard. Transparent diagnostics that prove your investment pays back immediately.'
  }
];

export const projectShowcasesData: ProjectShowcase[] = [
  {
    id: 'proj-1',
    name: '50kW Commercial Warehouse Array',
    location: 'Industrial District North',
    powerCapacity: '50kW Array System',
    segment: 'Commercial & Industrial',
    metrics: { label: 'Average Annual Savings', value: '₱380,000 / Year Saved' },
    imagePath: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-2',
    name: '10kW Modern Eco-Home System',
    location: 'Highland Ridge Estates',
    powerCapacity: '10kW Hybrid System',
    segment: 'Residential Solar',
    metrics: { label: 'Grid Dependency Drop', value: '94% Power Independence' },
    imagePath: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-3',
    name: '120kW Regional Logistics Grid',
    location: 'Global Distribution Hub',
    powerCapacity: '120kW Industrial Array',
    segment: 'Commercial & Industrial',
    metrics: { label: 'Monthly Offset', value: '14.5 Tons CO2 Offset' },
    imagePath: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'proj-4',
    name: '25kW Off-Grid Poultry Ranch Array',
    location: 'Central Plains Farmstead',
    powerCapacity: '25kW Off-Grid Storage',
    segment: 'Commercial & Industrial',
    metrics: { label: 'Uptime Integrity', value: '100% Critical Power Uptime' },
    imagePath: 'https://www.dfopoultry.com/wp-content/uploads/20230425075057.jpg'
  },
  {
    id: 'proj-5',
    name: '12kW Suburban Off-Grid Hybrid Array',
    location: 'Palm Breeze Residences',
    powerCapacity: '12kW Hybrid Storage',
    segment: 'Residential Solar',
    metrics: { label: 'Operational Cost Avoided', value: '78% Off Peak Power Saved' },
    imagePath: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80'
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'test-1',
    quote: 'We were skeptical about solar yielding actual savings in high-temp months. Powershift proved us wrong: Our household energy bills dropped by 64% from month one! The certified crew was exceptionally fast, neat, and highly professional.',
    rating: 5,
    author: 'Julian De Castro',
    role: 'Homeowner',
    location: 'Imus, Cavite',
    imageUrl: 'https://lh3.googleusercontent.com/d/1CUv3Fdy8AfGY4gtES5lW18l3uh_B9CAl'
  },
  {
    id: 'test-2',
    quote: 'The net metering installation was completely smooth. We went from paying skyrocketed monthly bills to receiving energy credits from our provider. Deciding to go off-grid during power cuts with their battery reserve was the best decision.',
    rating: 5,
    author: 'Victoria Morente',
    role: 'Homeowner & Environmentalist',
    location: 'Dasmarinas, Cavite',
    imageUrl: 'https://lh3.googleusercontent.com/d/1SJjjETlB-dHhaRwrKdm42WEE7eeygry9'
  },
  {
    id: 'test-3',
    quote: 'Powershift Solar provided absolute clarity during the technical site audit. Their detailed engineering blueprints and honest ROI projection made execution straightforward. Our residential array now offsets 100% of our midday household loads.',
    rating: 5,
    author: 'Marcus Vance',
    role: 'Homeowner',
    location: 'Bacoor, Cavite',
    imageUrl: 'https://lh3.googleusercontent.com/d/1yiqYbpJ2Z9F9TdHFhyHnq4FJUlZelsq_'
  }
];
