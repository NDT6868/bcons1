
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit, 
  doc, 
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { Project } from '@/types/project';
import { PROJECTS as STATIC_PROJECTS } from '@/data/projects';

const COLLECTION_NAME = 'projects';

// --- READ ---

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, COLLECTION_NAME);
    // Sắp xếp theo ngày tạo (nếu có) hoặc mặc định
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
    return STATIC_PROJECTS;
  }
};

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
    return STATIC_PROJECTS.find(p => p.slug === slug);
  } catch (error) {
    console.error(`Error fetching project slug ${slug}:`, error);
    return STATIC_PROJECTS.find(p => p.slug === slug);
  }
};

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

// --- WRITE (ADMIN ONLY) ---

export const createProject = async (projectData: Omit<Project, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const updateProjectInDb = async (id: string, projectData: Partial<Project>) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // Loại bỏ id khỏi data update để tránh dư thừa
    const { id: _, ...dataToUpdate } = projectData as any;
    
    await updateDoc(docRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProjectInDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
