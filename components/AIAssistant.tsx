
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse, generateInteriorIdea } from '../services/geminiService';
import { Message } from '../types';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'interior'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Chào bạn! Tôi là trợ lý ảo của BconsChungCu. Bạn cần tìm hiểu về dự án Bcons nào?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Image generation states - restricted to supported values for gemini-3-pro-image-preview
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [interiorPrompt, setInteriorPrompt] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await getAIResponse(input, history);
      setMessages(prev => [...prev, { role: 'model', text: responseText || '', timestamp: new Date() }]);
    } catch (e: any) {
      // Handle potential API key errors by prompting re-selection
      // Assume aistudio is globally available and use type casting to avoid declaration conflicts
      if (e?.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setMessages(prev => [...prev, { role: 'model', text: "Xin lỗi, tôi gặp một chút trục trặc. Liên hệ hotline 0984.293.633 để được hỗ trợ nhé!", timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  const handleGenerateInterior = async () => {
    if (!interiorPrompt.trim() || isLoading) return;

    // Check for API key for Pro features
    // Assume aistudio is globally available and use type casting to avoid declaration conflicts
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // Trigger dialog and assume success as per race condition guidelines
      await (window as any).aistudio.openSelectKey();
    }

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: `Thiết kế nội thất: ${interiorPrompt}`, timestamp: new Date() }]);
    
    try {
      const imageUrl = await generateInteriorIdea(interiorPrompt, aspectRatio, imageSize);
      if (imageUrl) {
        setMessages(prev => [...prev, { role: 'model', text: 'Đây là ý tưởng thiết kế nội thất cho căn hộ của bạn:', image: imageUrl, timestamp: new Date() }]);
      }
    } catch (e: any) {
      // If the request fails due to missing entity, reset key selection state
      if (e?.message?.includes("Requested entity was not found")) {
        await (window as any).aistudio.openSelectKey();
      }
      setMessages(prev => [...prev, { role: 'model', text: 'Gặp lỗi khi tạo ảnh. Vui lòng kiểm tra API Key.', timestamp: new Date() }]);
    }
    setIsLoading(false);
    setInteriorPrompt('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="bg-white rounded-3xl shadow-2xl w-[350px] md:w-[450px] h-[650px] flex flex-col overflow-hidden border border-emerald-100 transition-all duration-300 animate-scaleIn">
          <div className="bg-emerald-900 p-5 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-xl">🏠</div>
              <div>
                <span className="font-bold block">Bcons Pro AI</span>
                <span className="text-[10px] text-emerald-300 uppercase tracking-widest">Trợ lý cao cấp</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex bg-slate-50 p-1 mx-4 mt-4 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'chat' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              HỎI ĐÁP
            </button>
            <button 
              onClick={() => setActiveTab('interior')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'interior' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              THIẾT KẾ AI
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-50 text-slate-800 shadow-sm rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                  {msg.image && (
                    <div className="mt-3 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                      <img src={msg.image} alt="AI Generated" className="w-full h-auto cursor-zoom-in" onClick={() => window.open(msg.image)} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 p-4 rounded-2xl shadow-sm animate-pulse flex space-x-2">
                  <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-slate-50">
            {activeTab === 'chat' ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi về dự án, pháp lý, giá..."
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-100"
                >
                  <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    value={aspectRatio} 
                    onChange={e => setAspectRatio(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none"
                  >
                    {/* Filtered aspect ratios to only include those supported by gemini-3-pro-image-preview */}
                    {['1:1', '3:4', '4:3', '9:16', '16:9'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select 
                    value={imageSize} 
                    onChange={e => setImageSize(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-[10px] font-bold outline-none"
                  >
                    {['1K', '2K', '4K'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={interiorPrompt}
                    onChange={(e) => setInteriorPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateInterior()}
                    placeholder="Mô tả phong cách: Hiện đại, tối giản..."
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleGenerateInterior}
                    disabled={isLoading}
                    className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-100"
                  >
                    🎨
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 text-white p-5 rounded-3xl shadow-2xl hover:scale-110 transition-all flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
          <span className="font-bold tracking-wider">HỎI AI</span>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
