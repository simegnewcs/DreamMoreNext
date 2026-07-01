"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const BOTPRESS_SHAREABLE_URL =
  "https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/06/22/07/20260622070904-818F8Y5I.json";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center hover:scale-110 transform"
        title="Open AI Assistant"
        aria-label="AI Assistant"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center p-3 sm:p-4 md:p-6">
          {/* Modal Container */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[85vh] sm:h-[90vh] md:h-screen md:max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <h2 className="font-semibold text-gray-800 text-sm sm:text-base">DreamMore AI Assistant</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label="Close"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden bg-white">
              <iframe
                src={BOTPRESS_SHAREABLE_URL}
                title="DreamMore AI Assistant"
                loading="lazy"
                allow="microphone; camera; clipboard-read; clipboard-write"
                className="w-full h-full border-0 bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}