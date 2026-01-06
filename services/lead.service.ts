
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  projectSlug: string;
  projectName?: string;
  source: string; // VD: 'footer', 'project-detail', 'popup'
  message?: string;
}

export async function createLead(data: LeadData) {
  try {
    // 1. Validate cơ bản
    if (!data.phone || !data.name) {
      throw new Error("Vui lòng nhập Tên và Số điện thoại");
    }

    // 2. Chuẩn bị dữ liệu
    const payload = {
      ...data,
      status: 'new', // new | contacting | qualified | closed_won | junk
      createdAt: serverTimestamp(), // Dùng server time của Firebase
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    // 3. Gửi lên Firestore collection "leads"
    const docRef = await addDoc(collection(db, "leads"), payload);

    console.log("Lead created with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding lead: ", error);
    throw error;
  }
}
