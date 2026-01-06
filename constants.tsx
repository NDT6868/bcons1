
import { Project } from './types';

export const BCONS_PROJECTS: Project[] = [
  {
    id: 'bcons-center-city',
    name: 'Bcons Center City',
    location: 'Mặt tiền Thống Nhất, P. Đông Hòa, TP. Dĩ An, Bình Dương',
    price: 'Chỉ từ 1.8 tỷ/căn',
    priceNumeric: 1.8,
    status: 'Đang mở bán',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Bcons Center City là phân khu biểu tượng tọa lạc tại vị trí "trái tim" của đại đô thị Bcons City. Với quy mô 2 block cao 29 tầng, dự án không chỉ mang đến không gian sống hiện đại mà còn sở hữu hệ thống tiện ích đẳng cấp nhất khu vực như trung tâm thương mại 3 tầng, hồ bơi vô cực tầng cao và hệ thống trường học liên cấp quốc tế Bcons School ngay trong nội khu.',
    amenities: [
      'TTTM 3 tầng quy mô lớn',
      'Hồ bơi vô cực Skyview',
      'Hệ thống trường học Bcons School',
      'Công viên nội khu 3.000m2',
      'Phòng Gym & Yoga chuẩn 5 sao'
    ],
    externalAmenities: [
      'Làng Đại học Quốc gia TP.HCM',
      'Bến xe Miền Đông mới',
      'Trạm Metro số 1',
      'Bệnh viện Ung Bướu 2',
      'Gigamall Phạm Văn Đồng'
    ],
    area: '2.4 Hecta',
    blocks: '02 Block (Tháp Center)',
    floors: '29 tầng nổi - 2 tầng hầm',
    units: '800 căn hộ cao cấp',
    handover: 'Dự kiến Quý II/2026',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231!2d106.772!3d10.870!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276398c25731%3A0x6b6a67f6311910d9!2zQ2h1bmcgY8awIEJjb25zIENpdHk!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s',
    floorPlans: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80'
    ],
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', // Phối cảnh tháp Center
      'https://images.unsplash.com/photo-1567684014761-b6187a92172d?auto=format&fit=crop&w=1200&q=80', // Hồ bơi vô cực
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', // Nội thất sang trọng
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'  // Phòng khách hiện đại
    ],
    progress: 'Đang thi công phần móng cọc và hầm, tiến độ đảm bảo đúng cam kết của Tập đoàn Bcons.',
    legal: {
      constructionPermit: 'GPXD số 12/GPXD-SXD cấp ngày 15/01/2024',
      handoverDecision: 'Đang cập nhật',
      pinkBook: 'Sở hữu lâu dài (Sổ hồng riêng)'
    }
  },
  {
    id: 'bcons-avenue',
    name: 'Bcons Avenue',
    location: 'Xa Lộ Hà Nội, P. Bình Thắng, Dĩ An, Bình Dương',
    price: 'Từ 35 triệu/m2',
    priceNumeric: 1.75,
    status: 'Đang mở bán',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Bcons Avenue sở hữu vị trí đắc địa ngay mặt tiền Xa Lộ Hà Nội, cửa ngõ phía Đông TP.HCM. Dự án là lựa chọn tối ưu cho cư dân làm việc tại Khu Công Nghệ Cao và Quận 9. Với thiết kế 1 block cao 35 tầng, dự án cung ứng hơn 500 căn hộ chất lượng cao.',
    amenities: ['Hồ bơi tràn bờ', 'Công viên xanh', 'Phòng Gym & Yoga', 'Nhà trẻ nội khu'],
    externalAmenities: ['Ga Metro số 1', 'Làng Đại học Quốc gia', 'Bến xe Miền Đông mới', 'Bệnh viện Ung Bướu 2'],
    area: '1.2 ha',
    blocks: '01 Block',
    floors: '35 tầng',
    units: '539 căn',
    handover: 'Quý IV/2026',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4206639906!2d106.785085315334!3d10.852939060699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276398c25731%3A0x6b6a67f6311910d9!2sXa%20l%E1%BB%99%20H%C3%A0%20N%E1%BB%99i%2C%20Hồ%20Chí%20Minh!5e0!3m2!1svi!2s!4v1647424682391!5m2!1svi!2s',
    floorPlans: ['https://picsum.photos/seed/ave1/800/600', 'https://picsum.photos/seed/ave2/800/600'],
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    progress: 'Đang thi công phần hầm móng đại trà.',
    legal: {
      constructionPermit: 'Đã có GPXD phần móng',
      pinkBook: 'Người Việt Nam: Lâu dài - Người nước ngoài: 50 năm'
    }
  },
  {
    id: 'bcons-city',
    name: 'Bcons City',
    location: 'Đường Thống Nhất, P. Đông Hòa, Dĩ An, Bình Dương',
    price: 'Từ 34 triệu/m2',
    priceNumeric: 1.7,
    status: 'Đang mở bán',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Bcons City là khu phức hợp quy mô lớn nhất của Bcons Group tính đến thời điểm hiện tại. Tọa lạc trên trục đường Thống Nhất rộng 32m, dự án bao gồm 7 block căn hộ, trung tâm thương mại 3 tầng, khách sạn 4 sao và hệ thống giáo dục liên cấp Bcons School.',
    amenities: ['TTTM Bcons Mall', 'Hệ thống Bcons School', 'Hồ bơi vô cực', 'Công viên 3ha'],
    externalAmenities: ['Gigamall Thủ Đức', 'Chợ Thủ Đức', 'Ga Sóng Thần', 'Làng Đại học'],
    area: '4.4 ha',
    blocks: '07 Block',
    floors: '27-29 tầng',
    units: '3.700 căn',
    handover: 'Quý III/2025',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231!2d106.772!3d10.870!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUyJzEyLjAiTiAxMDbCsDQ2JzIwLjciRQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s',
    floorPlans: ['https://picsum.photos/seed/city1/800/600'],
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    progress: 'Block Green Topaz đã cất nóc, đang thi công Block Bcons City và Ricca.',
    legal: {
      constructionPermit: 'Đã hoàn thiện pháp lý xây dựng',
      handoverDecision: 'Dự kiến Quý III/2025',
      pinkBook: 'Sổ hồng riêng từng căn'
    }
  },
  {
    id: 'bcons-polaris',
    name: 'Bcons Polaris',
    location: 'Lê Trọng Tấn, P. An Bình, Dĩ An, Bình Dương',
    price: 'Từ 1.6 tỷ/căn',
    priceNumeric: 1.6,
    status: 'Sắp ra mắt',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Dự án Bcons Polaris (Bcons Lê Trọng Tấn) tọa lạc ngay vị trí vàng sát vách Linh Trung, Thủ Đức. Với mức giá dễ tiếp cận, Polaris hướng tới đối tượng khách hàng trẻ đang tìm kiếm căn hộ đầu tiên.',
    amenities: ['Hồ bơi tràn bờ', 'Sky Garden', 'Khu sinh hoạt cộng đồng', 'Sân chơi trẻ em'],
    externalAmenities: ['Đường Phạm Văn Đồng', 'Chợ Thủ Đức', 'Bệnh viện Thủ Đức', 'Giga Mall'],
    area: '3,820 m2',
    blocks: '01 Block',
    floors: '26 tầng',
    units: '522 căn',
    handover: 'Quý I/2026',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4!2d106.75!3d10.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDUyJzEyLjAiTiAxMDbCsDQ2JzIwLjciRQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s',
    floorPlans: ['https://picsum.photos/seed/pol1/800/600'],
    gallery: [],
    progress: 'Đang chuẩn bị khởi công hầm móng.',
    legal: {
      constructionPermit: 'Quyết định 1/500',
      pinkBook: 'Đang cập nhật'
    }
  }
];

export const NAV_LINKS = [
  { label: 'Trang chủ', href: '#top' },
  { label: 'Dự án Bcons', href: '#projects' },
  { label: 'Tại sao chọn Bcons', href: '#features' },
  { label: 'Tiến độ', href: '#progress' },
  { label: 'Liên hệ', href: '#contact' },
];
