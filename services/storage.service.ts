
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Upload một file ảnh lên Firebase Storage và trả về URL
 * @param file File ảnh từ input
 * @param folder Thư mục lưu trữ (mặc định: 'projects')
 */
export const uploadImage = async (file: File, folder: string = "projects"): Promise<string> => {
  try {
    // Tạo tên file unique bằng timestamp
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Không thể upload ảnh. Vui lòng thử lại.");
  }
};
