
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { getProjectBySlug, getProjects } from '@/services/project.service';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectOverview from '@/components/project/ProjectOverview';
import ProjectAmenities from '@/components/project/ProjectAmenities';
import ProjectLocation from '@/components/project/ProjectLocation';
import LeadForm from '@/components/lead/LeadForm';
import Link from 'next/link';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// 1. SSG: Tạo static pages cho các dự án để load siêu nhanh (Google Crawl thích điều này)
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// 2. Dynamic Metadata chuẩn SEO
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: 'Dự án không tồn tại | Bcons Chung Cư' };
  }

  // Tận dụng ảnh từ database hoặc ảnh fallback
  const previousImages = (await parent).openGraph?.images || [];
  const projectImage = project.image || 'https://bconschungcu.com/og-default.jpg';
  
  const pageTitle = `${project.name} - Bảng Giá CĐT & Ưu Đãi Mới Nhất 2025`;
  const pageDesc = `Thông tin chính thức ${project.name} tại ${project.location}. Giá bán ${project.price}. Quy mô ${project.area}, ${project.units} căn hộ. Nhận bảng giá gốc và chiết khấu ngay.`;
  const pageUrl = `https://bconschungcu.com/du-an/${project.slug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl, // Quan trọng để tránh duplicate content
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: pageUrl,
      siteName: 'Bcons Chung Cư - Hệ thống Phân phối Chính Hãng',
      images: [
        {
          url: projectImage,
          width: 1200,
          height: 630,
          alt: `Phối cảnh dự án ${project.name}`,
        },
        ...previousImages,
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      images: [projectImage],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await Promise.resolve(params);
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // 3. Structured Data: RealEstateListing (Quan trọng cho Rich Snippets)
  // Chuyển đổi giá từ tỷ (1.8) sang VND (1800000000)
  const priceValue = project.priceNumeric ? project.priceNumeric * 1000000000 : 0;
  
  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": project.name,
    "image": [project.image, ...(project.gallery || [])],
    "description": project.description,
    "url": `https://bconschungcu.com/du-an/${project.slug}`,
    "datePosted": "2024-01-01", // Có thể lấy từ field createdAt nếu có
    "address": {
      "@type": "PostalAddress",
      "streetAddress": project.location,
      "addressLocality": "Dĩ An", // Cần logic parse từ location string nếu muốn chính xác hơn
      "addressRegion": "Bình Dương",
      "addressCountry": "VN"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": priceValue,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": priceValue,
        "priceCurrency": "VND",
        "unitCode": "ANN" // Annual? Hoặc để trống nếu là giá bán đứt
      },
      "availability": project.status === 'Đã bàn giao' ? "https://schema.org/Sold" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Bcons Chung Cư",
        "url": "https://bconschungcu.com"
      }
    }
  };

  // 4. Structured Data: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Trang chủ",
        "item": "https://bconschungcu.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Dự án Bcons",
        "item": "https://bconschungcu.com/du-an"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.name,
        "item": `https://bconschungcu.com/du-an/${project.slug}`
      }
    ]
  };

  return (
    <article className="min-h-screen bg-white">
      {/* Inject JSON-LD Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ProjectHero project={project} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Semantic Breadcrumb UI */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center text-sm text-slate-500 font-medium">
            <li>
              <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
            </li>
            <li className="mx-2 text-slate-300">/</li>
            <li>
              <Link href="/du-an" className="hover:text-emerald-600 transition-colors">Dự án</Link>
            </li>
            <li className="mx-2 text-slate-300">/</li>
            <li className="text-emerald-600 font-bold" aria-current="page">
              {project.name}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <ProjectOverview project={project} />
            <ProjectAmenities project={project} />
            <ProjectLocation project={project} />
          </div>

          {/* Sidebar Column (Lead Form) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white text-center">
                  <p className="text-xs opacity-80 uppercase tracking-[2px] font-bold mb-1">Đăng ký tham quan</p>
                  <h3 className="text-xl font-black">{project.name}</h3>
                </div>
                <LeadForm 
                  projectSlug={project.slug} 
                  projectName={project.name}
                  className="!shadow-none !border-0 !rounded-t-none" 
                />
              </div>
              
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hotline PKD Chủ Đầu Tư</p>
                <a href="tel:0984293633" className="text-2xl font-black text-emerald-600 block mt-1 hover:scale-105 transition-transform">
                  0984.293.633
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
