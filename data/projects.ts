
export interface Project {
  id: string;
  slug: string; // Added slug for clean URLs
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

export const PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'bcons-center-city',
    name: 'Bcons Center City',
    location: 'Mặt tiền Thống Nhất, P. Đông Hòa, TP. Dĩ An, Bình Dương',
    price: 'Chỉ từ 1.8 tỷ/căn',
    priceNumeric: 1.8,
    status: 'Đang mở bán',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Bcons Center City là phân khu biểu tượng tọa lạc tại vị trí "trái tim" của đại đô thị Bcons City. Với quy mô 2 block cao 29 tầng, dự án không chỉ mang đến không gian sống hiện đại mà còn sở hữu hệ thống tiện ích đẳng cấp nhất khu vực.',
    amenities: ['TTTM 3 tầng', 'Hồ bơi vô cực', 'Trường Bcons School', 'Công viên 3000m2'],
    externalAmenities: ['Làng Đại học', 'Bến xe Miền Đông mới', 'Metro số 1'],
    area: '2.4 Hecta',
    blocks: '02 Block',
    floors: '29 tầng',
    units: '800 căn',
    handover: 'Quý II/2026',
    mapUrl: 'https://www.google.com/maps/embed?pb=...',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    floorPlans: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80'],
    gallery: [
       'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
       'https://images.unsplash.com/photo-1567684014761-b6187a92172d?auto=format&fit=crop&w=1200&q=80'
    ],
    progress: 'Đang thi công phần móng cọc.',
    legal: { constructionPermit: 'Đã có', pinkBook: 'Sở hữu lâu dài' }
  },
  {
    id: '2',
    slug: 'bcons-city',
    name: 'Bcons City',
    location: 'Đường Thống Nhất, P. Đông Hòa, Dĩ An, Bình Dương',
    price: 'Từ 34 triệu/m2',
    priceNumeric: 1.7,
    status: 'Đang mở bán',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Khu phức hợp quy mô lớn nhất Bcons Group với 7 block, trung tâm thương mại và trường học.',
    amenities: ['Bcons Mall', 'Trường học', 'Hồ bơi'],
    externalAmenities: ['Gigamall', 'Làng Đại học'],
    area: '4.4 ha',
    blocks: '07 Block',
    floors: '29 tầng',
    units: '3.700 căn',
    handover: 'Quý III/2025',
    mapUrl: 'https://www.google.com/maps/embed?pb=...',
    floorPlans: [],
    gallery: [],
    progress: 'Green Topaz đã cất nóc.',
    legal: { pinkBook: 'Sở hữu lâu dài' }
  }
];

export const getProjectBySlug = async (slug: string) => {
  // In a real app, this could fetch from Firebase
  return PROJECTS.find(p => p.slug === slug);
};
