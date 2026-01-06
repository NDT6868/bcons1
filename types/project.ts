
export interface Project {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  priceNumeric: number;
  status: 'Đang mở bán' | 'Sắp ra mắt' | 'Đã bàn giao';
  image: string;
  description: string;
  amenities: string[];
  externalAmenities: string[];
  area: string;
  blocks: string;
  floors: string;
  units: string;
  handover: string;
  mapUrl: string;
  videoUrl?: string;
  floorPlans: string[];
  gallery: string[];
  progress: string;
  legal?: {
    constructionPermit?: string;
    handoverDecision?: string;
    pinkBook?: string;
  };
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  projectId?: string;
  projectName?: string;
  message?: string;
  status: string;
  date: string;
  createdAt?: any;
}

export type ProjectStatus = Project['status'];
