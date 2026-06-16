/**
 * Response Formatter for DreamMore Chatbot
 * Handles formatting of bot responses with rich text, emojis, links, and structured data
 */

export interface FormattedResponse {
  html: string;
  plainText: string;
  hasLinks: boolean;
  hasEmojis: boolean;
  wordCount: number;
  suggestedActions?: string[];
}

// Emoji mapping for common keywords
const emojiMap: Record<string, string> = {
  course: "📚",
  courses: "📚",
  academy: "🎓",
  student: "👨‍🎓",
  students: "👩‍🎓",
  price: "💰",
  pricing: "💰",
  cost: "💵",
  payment: "💳",
  pay: "💳",
  contact: "📞",
  phone: "📱",
  email: "📧",
  location: "📍",
  address: "🏢",
  website: "🌐",
  certificate: "📜",
  certified: "🎖️",
  apply: "📝",
  enrollment: "✍️",
  register: "📋",
  agency: "🚀",
  service: "⚙️",
  services: "⚙️",
  development: "💻",
  software: "🖥️",
  mobile: "📱",
  app: "📲",
  ai: "🤖",
  marketing: "📈",
  seo: "🔍",
  social: "📱",
  success: "🏆",
  result: "📊",
  team: "👥",
  help: "🆘",
  support: "🎧",
  time: "⏰",
  day: "📅",
  week: "📆",
  month: "🗓️",
  year: "📅",
  question: "❓",
  answer: "✅",
  info: "ℹ️",
  note: "📌",
  important: "⚠️",
  new: "🆕",
  update: "🔄",
  welcome: "👋",
  hello: "👋",
  hi: "👋",
  bye: "👋",
  thank: "🙏",
  congrats: "🎉",
  good: "👍",
  great: "🌟",
  perfect: "✨"
};

// URL patterns for auto-linking
const urlPattern = /(https?:\/\/[^\s]+)/g;

// Phone number pattern (Ethiopian and international)
const phonePattern = /(\+251|0)[0-9]{9}/g;

// Email pattern
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Bold pattern for markdown-like syntax
const boldPattern = /\*\*(.*?)\*\*/g;

// Italic pattern
const italicPattern = /\*(.*?)\*/g;

// List item pattern
const listItemPattern = /^[•\-]\s+(.*)$/gm;

// Heading pattern
const headingPattern = /^###?\s+(.*)$/gm;

/**
 * Main formatter function
 */
export function formatResponse(text: string): FormattedResponse {
  let formattedHtml = text;
  let hasLinks = false;
  let hasEmojis = false;
  
  // Add emojis based on keywords (if not already present)
  formattedHtml = addEmojisToText(formattedHtml);
  hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(formattedHtml);
  
  // Format headings (### Heading)
  formattedHtml = formattedHtml.replace(headingPattern, (match, content) => {
    return `<h3 class="text-base font-bold mt-2 mb-1 dark:text-white" style="color: #f47822;">${content}</h3>`;
  });
  
  // Format bold text
  formattedHtml = formattedHtml.replace(boldPattern, '<strong class="font-semibold dark:text-white">$1</strong>');
  
  // Format italic text
  formattedHtml = formattedHtml.replace(italicPattern, '<em class="italic dark:text-gray-300">$1</em>');
  
  // Format bullet lists
  formattedHtml = formattedHtml.replace(listItemPattern, (match, content) => {
    return `<div class="flex items-start gap-2 my-1"><span class="text-[#f47822]">•</span><span class="dark:text-gray-200">${content}</span></div>`;
  });
  
  // Format URLs as links
  formattedHtml = formattedHtml.replace(urlPattern, (url) => {
    hasLinks = true;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#f47822] hover:underline">${url}</a>`;
  });
  
  // Format phone numbers
  formattedHtml = formattedHtml.replace(phonePattern, (phone) => {
    hasLinks = true;
    const cleanPhone = phone.replace(/\s/g, '');
    return `<a href="tel:${cleanPhone}" class="text-[#f47822] hover:underline">${phone}</a>`;
  });
  
  // Format emails
  formattedHtml = formattedHtml.replace(emailPattern, (email) => {
    hasLinks = true;
    return `<a href="https://mail.google.com/mail/?view=cm&fs=1&to=${email}" target="_blank" rel="noopener noreferrer" class="text-[#f47822] hover:underline">${email}</a>`;
  });
  
  // Format line breaks
  formattedHtml = formattedHtml.replace(/\n/g, '<br/>');
  
  // Wrap in container with dark mode support
  formattedHtml = `<div class="space-y-1 dark:text-gray-200">${formattedHtml}</div>`;
  
  // Generate plain text version (strip HTML)
  const plainText = stripHtml(formattedHtml);
  
  // Extract suggested actions from the response
  const suggestedActions = extractSuggestedActions(text);
  
  return {
    html: formattedHtml,
    plainText,
    hasLinks,
    hasEmojis,
    wordCount: plainText.split(/\s+/).length,
    suggestedActions
  };
}

/**
 * Add emojis to text based on keywords
 */
function addEmojisToText(text: string): string {
  let result = text;
  const lowerText = text.toLowerCase();
  
  // Check if emojis already exist
  if (/[\u{1F300}-\u{1F9FF}]/u.test(text)) {
    return text;
  }
  
  // Add emojis at the beginning of relevant sections
  for (const [keyword, emoji] of Object.entries(emojiMap)) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    if (regex.test(lowerText) && !result.includes(emoji)) {
      // Add emoji after section headers or at sentence starts
      result = result.replace(new RegExp(`(^|\\n)(\\s*)(?=${keyword})`, 'gi'), `$1$2${emoji} `);
    }
  }
  
  return result;
}

/**
 * Strip HTML tags from formatted text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

/**
 * Extract suggested follow-up actions from response
 */
function extractSuggestedActions(text: string): string[] {
  const actions: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Determine action types based on content
  if (lowerText.includes('course') || lowerText.includes('academy')) {
    actions.push('View all courses');
    actions.push('Check pricing');
    actions.push('How to enroll');
  }
  
  if (lowerText.includes('agency') || lowerText.includes('service')) {
    actions.push('Request a quote');
    actions.push('View portfolio');
    actions.push('Schedule consultation');
  }
  
  if (lowerText.includes('payment') || lowerText.includes('pay')) {
    actions.push('Payment methods');
    actions.push('Installment options');
    actions.push('Contact billing');
  }
  
  if (lowerText.includes('contact') || lowerText.includes('support')) {
    actions.push('Call us');
    actions.push('Send email');
    actions.push('Telegram support');
  }
  
  if (lowerText.includes('certificate')) {
    actions.push('Certificate sample');
    actions.push('Job placement');
  }
  
  return [...new Set(actions)]; // Remove duplicates
}

/**
 * Format pricing information as a card (Dark mode compatible)
 */
export function formatPricingCard(
  title: string,
  price: number,
  features: string[],
  ctaText: string = "Enroll Now",
  ctaLink: string = ""
): string {
  const featuresHtml = features.map(f => `<div class="flex items-center gap-2 my-1"><span class="text-green-500 dark:text-green-400">✓</span><span class="dark:text-gray-200">${f}</span></div>`).join('');
  
  return `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <h4 class="font-bold text-lg mb-2" style="color: #f47822;">${title}</h4>
      <div class="text-2xl font-bold mb-3 dark:text-white">ETB ${price.toLocaleString()}</div>
      <div class="space-y-2 mb-4">${featuresHtml}</div>
      ${ctaLink ? `<a href="${ctaLink}" target="_blank" class="inline-block w-full text-center px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90" style="background: #f47822;">${ctaText}</a>` : `<button class="w-full px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90" style="background: #f47822;">${ctaText}</button>`}
    </div>
  `;
}

/**
 * Format contact information as a card (Dark mode compatible)
 */
export function formatContactCard(
  phone: string,
  email: string,
  telegram?: string,
  instagram?: string
): string {
  return `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <span class="text-xl">📞</span>
          <a href="tel:${phone}" class="text-[#f47822] hover:underline">${phone}</a>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xl">📧</span>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${email}" target="_blank" rel="noopener noreferrer" class="text-[#f47822] hover:underline">${email}</a>
        </div>
        ${telegram ? `<div class="flex items-center gap-3"><span class="text-xl">💬</span><span class="dark:text-gray-200">Telegram: <strong class="dark:text-white">${telegram}</strong></span></div>` : ''}
        ${instagram ? `<div class="flex items-center gap-3"><span class="text-xl">📷</span><span class="dark:text-gray-200">Instagram: <strong class="dark:text-white">${instagram}</strong></span></div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Format course list as a table (Dark mode compatible)
 */
export function formatCourseList(courses: Array<{name: string; duration: string; price: number}>): string {
  const rows = courses.map(course => `
    <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
      <div class="flex-1">
        <div class="font-semibold dark:text-white">${course.name}</div>
        <div class="text-xs opacity-70 dark:text-gray-400">${course.duration}</div>
      </div>
      <div class="font-bold" style="color: #f47822;">ETB ${course.price.toLocaleString()}</div>
    </div>
  `).join('');
  
  return `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 shadow-md border border-gray-200 dark:border-gray-700 transition-colors">
      <h4 class="font-bold mb-3 dark:text-white" style="color: #f47822;">📚 Available Courses</h4>
      ${rows}
    </div>
  `;
}

/**
 * Format a testimonial or case study (Dark mode compatible)
 */
export function formatTestimonial(quote: string, author: string, role: string, rating?: number): string {
  const stars = rating ? '⭐'.repeat(rating) : '';
  
  return `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 shadow-md border-l-4 transition-colors" style="border-left-color: #f47822;">
      <div class="italic text-sm mb-2 dark:text-gray-300">"${quote}"</div>
      <div class="font-semibold dark:text-white">${author}</div>
      <div class="text-xs opacity-70 dark:text-gray-400">${role}</div>
      ${stars ? `<div class="text-xs mt-1">${stars}</div>` : ''}
    </div>
  `;
}

/**
 * Format a progress indicator (Dark mode compatible)
 */
export function formatProgressIndicator(percentage: number, label: string): string {
  const safePercentage = Math.min(100, Math.max(0, percentage));
  
  return `
    <div class="my-2">
      <div class="flex justify-between text-sm mb-1 dark:text-gray-300">
        <span>${label}</span>
        <span>${safePercentage}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div class="h-2 rounded-full transition-all" style="width: ${safePercentage}%; background: linear-gradient(90deg, #f47822, #e06b18);"></div>
      </div>
    </div>
  `;
}

/**
 * Format step-by-step instructions (Dark mode compatible)
 */
export function formatSteps(steps: string[]): string {
  const stepsHtml = steps.map((step, index) => `
    <div class="flex gap-3 my-2">
      <div class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style="background: #f47822;">${index + 1}</div>
      <div class="dark:text-gray-200">${step}</div>
    </div>
  `).join('');
  
  return `<div class="my-2">${stepsHtml}</div>`;
}

/**
 * Format a warning or important notice (Dark mode compatible)
 */
export function formatWarning(message: string, type: "info" | "warning" | "error" = "info"): string {
  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    error: "❌"
  };
  
  const colors = {
    info: "#3b82f6",
    warning: "#f59e0b",
    error: "#ef4444"
  };
  
  const bgColors = {
    info: "bg-blue-50 dark:bg-blue-950/30",
    warning: "bg-amber-50 dark:bg-amber-950/30",
    error: "bg-red-50 dark:bg-red-950/30"
  };
  
  return `
    <div class="${bgColors[type]} rounded-lg p-3 my-2 transition-colors" style="border-left: 3px solid ${colors[type]};">
      <div class="flex items-start gap-2">
        <span>${icons[type]}</span>
        <span class="text-sm dark:text-gray-200">${message}</span>
      </div>
    </div>
  `;
}

/**
 * Truncate text to a specific length
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Convert plain text to formatted HTML with proper paragraphs
 */
export function textToHtml(text: string): string {
  // Split into paragraphs (double line breaks)
  const paragraphs = text.split(/\n\s*\n/);
  
  const formattedParagraphs = paragraphs.map(para => {
    if (para.trim().length === 0) return '';
    return `<p class="mb-2 dark:text-gray-200">${para.replace(/\n/g, '<br/>')}</p>`;
  });
  
  return formattedParagraphs.join('');
}

// Export default formatter object
export const responseFormatter = {
  format: formatResponse,
  pricingCard: formatPricingCard,
  contactCard: formatContactCard,
  courseList: formatCourseList,
  testimonial: formatTestimonial,
  progressIndicator: formatProgressIndicator,
  steps: formatSteps,
  warning: formatWarning,
  truncate: truncateText,
  textToHtml
};