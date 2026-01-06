
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  doc, 
  getDoc,
  orderBy
} from 'firebase/firestore';
import { Project } from '@/types/project';
import { PROJECTS as STATIC_PROJECTS } from '@/data/projects';

const COLLECTION_NAME = 'projects';

// Hàm lấy tất cả dự án (Dùng cho trang chủ & generateStaticParams)
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    // Sắp xếp dự án mới nhất lên đầu (giả sử có trường createdAt hoặc dựa vào tên)
    // Lưu ý: Cần tạo Index trong Firestore nếu dùng orderBy phức tạp
    const q = query(projectsRef); 
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("Firestore projects empty, using static fallback.");
      return STATIC_PROJECTS;
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error("Error fetching projects from Firebase:", error);
    return STATIC_PROJECTS; // Fallback an toàn để web không sập
  }
};

// Hàm lấy chi tiết dự án theo Slug
export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const q = query(projectsRef, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      return {
        id: docData.id,
        ...docData.data()
      } as Project;
    }
    
    // Fallback: Tìm trong static data nếu không thấy trong DB
    return STATIC_PROJECTS.find(p => p.slug === slug);
  } catch (error) {
    console.error(`Error fetching project slug ${slug}:`, error);
    return STATIC_PROJECTS.find(p => p.slug === slug);
  }
};

// Hàm lấy dự án nổi bật (Đang mở bán)
export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    const q = query(
      projectsRef, 
      where("status", "==", "Đang mở bán"),
      limit(6)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return STATIC_PROJECTS.filter(p => p.status === 'Đang mở bán').slice(0, 3);
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Project[];
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return STATIC_PROJECTS.filter(p => p.status === 'Đang mở bán').slice(0, 3);
  }
};
