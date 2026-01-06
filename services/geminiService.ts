
import { GoogleGenAI } from "@google/genai";

// Always create a new GoogleGenAI instance right before making an API call to ensure it uses the latest API key.
export const getAIResponse = async (userMessage: string, history: any[]) => {
  // Directly use process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `Bạn là trợ lý ảo thông minh của sàn bất động sản BconsChungCu.com. 
        Nhiệm vụ của bạn là tư vấn cho khách hàng về các dự án chung cư Bcons.
        Hotline hỗ trợ: 0984.293.633.`,
      },
    });
    // Extracting text output from GenerateContentResponse using .text property
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    // Propagate error for proper handling in the component
    throw error;
  }
};

export const generateInteriorIdea = async (prompt: string, aspectRatio: string = "16:9", imageSize: string = "1K") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `Phối cảnh thiết kế nội thất chung cư Bcons theo phong cách: ${prompt}. Đảm bảo hình ảnh sang trọng, hiện đại, ánh sáng tự nhiên.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any
        }
      }
    });

    // Iterate through all parts to find the image part as recommended
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

export const analyzeProjectVideo = async (videoUrl: string, projectName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [{ text: `Phân tích thông tin quan trọng từ video dự án ${projectName} tại link: ${videoUrl}. Hãy tóm tắt 3 điểm mạnh nổi bật nhất của dự án này dựa trên phối cảnh và thông tin chung.` }]
      }
    });
    // Extracting text output from GenerateContentResponse using .text property
    return response.text;
  } catch (error) {
    console.error("Video Analysis Error:", error);
    throw error;
  }
};
