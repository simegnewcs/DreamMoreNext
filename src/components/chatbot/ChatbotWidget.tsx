"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickQuestions = [
  "What courses do you offer?",
  "How do I enroll?",
  "What are the prices?",
  "Do you offer certificates?",
  "Payment options?",
  "Is DreamMore different from other agencies?",
];

export default function ChatbotWidget() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi! I'm Dreamy, your DreamMore AI assistant!\n\nI can help you with:\n• 📚 Course information & enrollment\n• 💰 Pricing & payment options\n• � Agency services & portfolio\n• �🎓 Certificates & student support\n• 📞 Contact & support\n\nWhat would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Initialize session ID on mount
  useEffect(() => {
    const stored = localStorage.getItem('chatbot_session_id');
    if (stored) {
      setSessionId(stored);
    } else {
      const newSession = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_session_id', newSession);
      setSessionId(newSession);
    }
  }, []);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId,
          userId: user?.id || null
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.data.sessionId && data.data.sessionId !== sessionId) {
          setSessionId(data.data.sessionId);
          localStorage.setItem('chatbot_session_id', data.data.sessionId);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: data.data.response,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "That's an exceptionally precise and important question! While my knowledge base covers a wide range of topics, I want to make sure you receive a completely definitive answer for this one. Please share your question directly with our team — they will follow up with full accuracy and speed.\n\n📧 Email: support@dreammoredigitals.com\n📞 Phone/WhatsApp: +251 993 132 122\n📱 Telegram: @dreammoredigitals\n\nWe will respond within hours!",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #f47822 0%, #e06b18 100%)",
              boxShadow: "0 8px 32px rgba(244, 120, 34, 0.4)",
            }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: isDark ? "#13122a" : "#ffffff",
              border: "1px solid rgba(244, 120, 34, 0.2)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, #f47822 0%, #e06b18 100%)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Dreamy AI Assistant</p>
                  <p className="text-white/70 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Online • Powered by DreamMore
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="h-96 overflow-y-auto p-4 space-y-3"
              style={{
                background: isDark ? "#13122a" : "#f8f9fa",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.isUser ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.isUser
                        ? "bg-[#f47822]/20"
                        : isDark
                        ? "bg-white/10"
                        : "bg-gray-200"
                    }`}
                  >
                    {msg.isUser ? (
                      <User className="w-4 h-4 text-[#f47822]" />
                    ) : (
                      <Bot className={`w-4 h-4 ${isDark ? "text-white" : "text-gray-600"}`} />
                    )}
                  </div>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                      msg.isUser
                        ? "bg-[#f47822] text-white rounded-br-md"
                        : isDark
                        ? "bg-white/10 text-white rounded-bl-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                  />
                </div>
              ))}
              {(isTyping || isLoading) && (
                <div className="flex gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? "bg-white/10" : "bg-gray-200"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className={`w-4 h-4 animate-spin ${isDark ? "text-white" : "text-gray-600"}`} />
                    ) : (
                      <Bot className={`w-4 h-4 ${isDark ? "text-white" : "text-gray-600"}`} />
                    )}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-2xl rounded-bl-md ${
                      isDark ? "bg-white/10" : "bg-white shadow-sm"
                    }`}
                  >
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: "#f47822" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: "#f47822", animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: "#f47822", animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div
              className={`px-3 py-2 border-t ${
                isDark ? "border-white/10 bg-[#0f0e1f]" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isDark
                        ? "bg-white/10 text-white/70 hover:bg-[#f47822]/20 hover:text-[#f47822]"
                        : "bg-gray-100 text-gray-600 hover:bg-[#f47822]/10 hover:text-[#f47822]"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div
              className={`p-3 border-t ${
                isDark ? "border-white/10 bg-[#0f0e1f]" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your question..."
                  className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-colors ${
                    isDark
                      ? "bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15"
                      : "bg-gray-100 text-gray-900 placeholder:text-gray-400 focus:bg-gray-200"
                  }`}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: inputValue.trim() ? "#f47822" : isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb",
                  }}
                >
                  <Send
                    className={`w-4 h-4 ${inputValue.trim() ? "text-white" : isDark ? "text-white/40" : "text-gray-400"}`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}