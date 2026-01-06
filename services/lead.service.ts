
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface LeadData {
  name: string;
  phone: string;
  email?: string;
  projectSlug: string;
  projectName?: string;
  source: string; // VD: 'footer', 'project-detail', 'popup'
  note?: string;
}

export async function createLead(data: LeadData) {
  try {
    // Basic validation
    if (!data.phone || !data.name) {
      throw new Error("Missing required fields");
    }

    const docRef = await addDoc(collection(db, "leads"), {
      ...data,
      status: 'Mới', // Mới | Đang tư vấn | Đã chốt | Hủy
      createdAt: serverTimestamp(), // Sử dụng giờ server của Google để chính xác
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : '',
    });

    console.log("Lead created with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding lead: ", error);
    // Có thể tích hợp gửi error log về Telegram/Slack tại đây
    throw error;
  }
}
