"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const quickQuestions = [
  "What courses do you offer?",
  "How do I apply?",
  "What are the prices?",
  "Do you offer certificates?",
];

export default function ChatbotWidget() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi! I'm DreamMore Bot. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateResponse(text.trim());
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("course") || lowerText.includes("offer")) {
      return "We offer courses in Web Development, UI/UX Design, Graphic Design, Digital Marketing, and more. Visit https://www.dreammoredigitals.com/academy to see all courses!";
    }
    if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("fee")) {
      return "Our courses are priced at ETB 6,000 for most programs. Web Development courses are ETB 8,000. Payment plans available!";
    }
    if (lowerText.includes("apply") || lowerText.includes("enroll") || lowerText.includes("register")) {
      return "You can apply by visiting the course page and clicking 'Apply Now'. Fill out the application form and submit your payment.";
    }
    if (lowerText.includes("certificate") || lowerText.includes("certified")) {
      return "Yes! All our courses come with industry-recognized certificates upon completion.";
    }
    if (lowerText.includes("contact") || lowerText.includes("email") || lowerText.includes("phone")) {
      return "You can reach us at support@dreammore.com or call +251 911 234 567. We're available Mon-Fri, 9AM-6PM.";
    }
    if (lowerText.includes("duration") || lowerText.includes("long")) {
      return "Most courses are 3 months long. Web Development is 4 months. All include hands-on projects!";
    }
    if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
      return "Hello! 👋 How can I help you today? Feel free to ask about our courses, pricing, or application process.";
    }

    return "I'm here to help with questions about our courses, pricing, application process, and more. What would you like to know?";
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
                  <p className="text-white font-semibold text-sm">DreamMore Bot</p>
                  <p className="text-white/70 text-xs">Online</p>
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
              className="h-80 overflow-y-auto p-4 space-y-3"
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
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.isUser
                        ? "bg-[#f47822] text-white rounded-br-md"
                        : isDark
                        ? "bg-white/10 text-white rounded-bl-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? "bg-white/10" : "bg-gray-200"
                    }`}
                  >
                    <Bot className={`w-4 h-4 ${isDark ? "text-white" : "text-gray-600"}`} />
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
                  placeholder="Type a message..."
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
