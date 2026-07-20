export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  imagePath: string;
}

export interface ProjectShowcase {
  id: string;
  name: string;
  location: string;
  powerCapacity: string;
  segment?: string;
  metrics: {
    label: string;
    value: string;
  };
  imagePath: string;
}

export interface ValuePillar {
  id: number;
  title: string;
  detail: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  rating: number;
  author: string;
  role: string;
  location: string;
  imageUrl?: string;
}
