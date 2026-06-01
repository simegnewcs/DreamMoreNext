import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Knowledge base for DreamMore
const knowledgeBase = {
  courses: [
    { name: "Web Development", duration: "4 months", price: 8000, description: "Full-stack web development with React, Node.js, and databases" },
    { name: "UI/UX Design", duration: "3 months", price: 6000, description: "User interface and experience design fundamentals" },
    { name: "Graphic Design", duration: "3 months", price: 6000, description: "Visual design, branding, and creative tools" },
    { name: "Digital Marketing", duration: "3 months", price: 6000, description: "SEO, social media marketing, and online advertising" },
    { name: "Programming Language C++, Java, Python, JavaScript", duration: "3 months", price: 6000, description: "Fundamentals and advanced programming in C++, Java, Python, and JavaScript" },
  ],
  pricing: {
    standard: 6000,
    webDevelopment: 8000,
    installment: "50% upfront, 50% after 4 weeks"
  },
  contact: {
    email: "support@dreammoredigitals.com",
    phone: "+251 911 234 567",
    website: "https://www.dreammoredigitals.com",
    address: "Addis Ababa, Ethiopia"
  },
  payment: {
    cbe: "1000765205852",
    telebirr: "0993132122",
    methods: ["CBE Bank Transfer", "Telebirr"]
  },
  faq: {
    certificate: "Yes, all courses include industry-recognized certificates upon completion",
    online: "We offer both online and in-person classes",
    refund: "Refunds available within 7 days of enrollment if course hasn't started",
    schedule: "Classes are held on weekdays, 2-3 hours per day",
    requirements: "Basic computer literacy. Laptop required for development courses"
  }
};

// POST /api/chatbot - Process chat message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, userId } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate session ID if not provided
    const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save user message to database
    try {
      await query(
        `INSERT INTO chatbot_conversations (session_id, user_id, message, is_bot, created_at) 
         VALUES (?, ?, ?, false, NOW())`,
        [chatSessionId, userId || null, message.trim()]
      );
    } catch (dbError) {
      // Table might not exist, log but continue
      console.log("Note: chatbot_conversations table may not exist");
    }

    // Generate intelligent response
    const response = generateIntelligentResponse(message.trim(), knowledgeBase);

    // Save bot response to database
    try {
      await query(
        `INSERT INTO chatbot_conversations (session_id, user_id, message, is_bot, created_at) 
         VALUES (?, ?, ?, true, NOW())`,
        [chatSessionId, userId || null, response]
      );
    } catch (dbError) {
      // Continue even if save fails
    }

    return NextResponse.json({
      success: true,
      data: {
        response,
        sessionId: chatSessionId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process message" },
      { status: 500 }
    );
  }
}

// GET /api/chatbot - Get conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    const history = await query(
      `SELECT * FROM chatbot_conversations 
       WHERE session_id = ? 
       ORDER BY created_at ASC 
       LIMIT 50`,
      [sessionId]
    );

    return NextResponse.json({
      success: true,
      data: { history: history || [] }
    });

  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}

// Intelligent response generator
function generateIntelligentResponse(message: string, kb: typeof knowledgeBase): string {
  const lowerMsg = message.toLowerCase();
  
  // Course-related queries
  if (lowerMsg.includes('course') || lowerMsg.includes('offer') || lowerMsg.includes('program')) {
    if (lowerMsg.includes('web') || lowerMsg.includes('development') || lowerMsg.includes('programming')) {
      const course = kb.courses.find(c => c.name.toLowerCase().includes('web'));
      return `<div style="margin-bottom: 8px;">🌐 <b>Web Development Course</b></div><div style="line-height: 1.6;"><div>Duration: ${course?.duration}</div><div>Price: ETB ${course?.price?.toLocaleString()}</div><div style="margin-top: 6px; opacity: 0.9;">${course?.description}</div></div><div style="margin-top: 12px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">Apply now</a></div>`;
    }
    
    if (lowerMsg.includes('all') || lowerMsg.includes('list') || lowerMsg.includes('what')) {
      const list = kb.courses.map(c => `<div style="margin: 6px 0; line-height: 1.5;"><span style="color: #f47822;">•</span> <b>${c.name}</b> — ${c.duration} — ETB ${c.price.toLocaleString()}</div>`).join('');
      return `<div style="margin-bottom: 8px;">📚 <b>Our Courses:</b></div>${list}<div style="margin-top: 12px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">View all courses</a></div>`;
    }
    
    return `We offer various courses including Web Development, UI/UX Design, Graphic Design, Digital Marketing, and Programming. Which one interests you?`;
  }

  // Price-related queries
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee') || lowerMsg.includes('how much')) {
    return `<div style="margin-bottom: 8px;">💰 <b>Pricing:</b></div><div style="line-height: 1.8;"><div><span style="color: #f47822;">•</span> Most courses: ETB ${kb.pricing.standard.toLocaleString()}</div><div><span style="color: #f47822;">•</span> Web Development: ETB ${kb.pricing.webDevelopment.toLocaleString()}</div><div><span style="color: #f47822;">•</span> Installment: ${kb.pricing.installment}</div></div><div style="margin-top: 10px; opacity: 0.9;">Payment methods: CBE Bank, Telebirr</div>`;
  }

  // Duration queries
  if (lowerMsg.includes('duration') || lowerMsg.includes('long') || lowerMsg.includes('time') || lowerMsg.includes('month')) {
    return `<div style="margin-bottom: 8px;">⏱️ <b>Course Durations:</b></div><div style="line-height: 1.8;"><div><span style="color: #f47822;">•</span> Most courses: 3 months</div><div><span style="color: #f47822;">•</span> Web Development: 4 months</div><div><span style="color: #f47822;">•</span> Classes: Weekdays, 2-3 hours/day</div></div>`;
  }

  // Application/Enrollment queries
  if (lowerMsg.includes('apply') || lowerMsg.includes('enroll') || lowerMsg.includes('register') || lowerMsg.includes('join')) {
    return `<div style="margin-bottom: 8px;">📝 <b>How to Apply:</b></div><div style="line-height: 1.8;"><div><b>1.</b> Visit <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">our academy page</a></div><div><b>2.</b> Select your course</div><div><b>3.</b> Click "Apply Now"</div><div><b>4.</b> Fill the form and submit payment</div></div><div style="margin-top: 12px;">Need help? Call us at <a href="tel:${kb.contact.phone}" style="color: #f47822; text-decoration: underline;">${kb.contact.phone}</a></div>`;
  }

  // Certificate queries
  if (lowerMsg.includes('certificate') || lowerMsg.includes('certified') || lowerMsg.includes('diploma')) {
    return kb.faq.certificate + "! 🎓";
  }

  // Payment queries
  if (lowerMsg.includes('payment') || lowerMsg.includes('pay') || lowerMsg.includes('bank') || lowerMsg.includes('telebirr')) {
    return `💳 **Payment Options:**
• **CBE Bank:** ${kb.payment.cbe}
• **Telebirr:** ${kb.payment.telebirr}
• Installment plan available

After payment, upload your receipt on the application page.`;
  }

  // Contact queries
  if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone') || lowerMsg.includes('call') || lowerMsg.includes('reach')) {
    return `📞 **Contact Us:**
• Email: ${kb.contact.email}
• Phone: ${kb.contact.phone}
• Website: ${kb.contact.website}
• Hours: Mon-Fri, 9AM-6PM`;
  }

  // Location queries
  if (lowerMsg.includes('location') || lowerMsg.includes('address') || lowerMsg.includes('where') || lowerMsg.includes('place')) {
    return `📍 **Location:** ${kb.contact.address}\n\nWe also offer online classes for remote students!`;
  }

  // Greeting
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey') || lowerMsg === 'h') {
    return `👋 Hello! Welcome to DreamMore Academy!

I can help you with:
• Course information
• Pricing & payment
• Application process
• Certificates
• Contact details

What would you like to know?`;
  }

  // Thanks
  if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
    return `You're welcome! 😊 Feel free to ask if you have any other questions. Good luck with your learning journey!`;
  }

  // Bye
  if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
    return `Goodbye! 👋 Have a great day! Don't forget to check out our courses at https://www.dreammoredigitals.com/academy`;
  }

  // Default intelligent response
  return `I'm here to help with questions about DreamMore Academy! 

You can ask me about:
• 📚 Available courses
• 💰 Pricing and payment options
• 📝 How to apply
• 🎓 Certificates
• 📞 Contact information

What would you like to know?`;
}
