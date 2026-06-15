import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Cache for scraped data (5 minutes TTL)
let cachedData: any = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Define types for better type safety
interface Course {
  name: string;
  price: number;
}

interface ScrapedData {
  source: string;
  lastScraped: string;
  courses: Course[];
  stats: {
    totalCourses: number;
    courseCountText: string;
    studentsCount: string;
    placementRate: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  urls: {
    academy: string;
    agency: string;
    contact: string;
    about: string;
  };
}

interface StaticKnowledgeBase {
  organization: {
    name: string;
    description: string;
    mission: string;
    vision: string;
    location: string;
  };
  agencyServices: string[];
  pricing: {
    standardCourse: number;
    webDevelopment: number;
    currency: string;
    installment: string;
  };
  enrollmentSteps: string[];
  contact: {
    email: string;
    phone: string;
    telegram: string;
    instagram: string;
    website?: string; // Added optional website property
  };
  faq: {
    certificate: string;
    onlineClasses: string;
    beginnerFriendly: string;
    duration: string;
  };
}

// Dynamic scraper function
async function scrapeDreamMoreWebsite(): Promise<ScrapedData | null> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (cachedData && (now - cacheTimestamp) < CACHE_TTL) {
    console.log("Returning cached website data");
    return cachedData;
  }

  try {
    console.log("Scraping live website data...");
    
    // Fetch the main website pages
    const [academyRes, homeRes, agencyRes] = await Promise.all([
      fetch('https://www.dreammoredigitals.com/academy', {
        headers: {
          'User-Agent': 'DreamMore-Chatbot/1.0 (Educational Bot)'
        }
      }),
      fetch('https://www.dreammoredigitals.com', {
        headers: {
          'User-Agent': 'DreamMore-Chatbot/1.0 (Educational Bot)'
        }
      }),
      fetch('https://www.dreammoredigitals.com/agency', {
        headers: {
          'User-Agent': 'DreamMore-Chatbot/1.0 (Educational Bot)'
        }
      })
    ]);

    const academyHtml = await academyRes.text();
    const homeHtml = await homeRes.text();
    const agencyHtml = await agencyRes.text();

    // Extract courses from the Academy page using regex patterns
    const courseMatches = academyHtml.matchAll(/<h3[^>]*>([^<]+)<\/h3>[\s\S]*?ETB\s*([\d,]+)/gi);
    const courses: Course[] = [];
    
    for (const match of courseMatches) {
      courses.push({
        name: match[1].trim(),
        price: parseInt(match[2].replace(/,/g, ''), 10)
      });
    }

    // Extract statistics from the page
    const statsMatch = academyHtml.match(/(\d+)\+?\s*Courses?/i);
    const studentsMatch = academyHtml.match(/(\d+)\+?\s*Students?/i);
    const placementMatch = academyHtml.match(/(\d+)%\s*Job\s*Placement/i);
    
    // Extract contact info from footer
    const phoneMatch = homeHtml.match(/(\+251\s*\d{3}\s*\d{6})/);
    const emailMatch = homeHtml.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    
    const scrapedData: ScrapedData = {
      source: "https://www.dreammoredigitals.com",
      lastScraped: new Date().toISOString(),
      courses: courses,
      stats: {
        totalCourses: courses.length,
        courseCountText: statsMatch ? statsMatch[0] : "16+ Courses",
        studentsCount: studentsMatch ? studentsMatch[0] : "150+ Students",
        placementRate: placementMatch ? placementMatch[0] : "98% Job Placement"
      },
      contact: {
        phone: phoneMatch ? phoneMatch[0] : "+251 993 132 122",
        email: emailMatch ? emailMatch[0] : "support@dreammoredigitals.com"
      },
      urls: {
        academy: "https://www.dreammoredigitals.com/academy",
        agency: "https://www.dreammoredigitals.com/agency",
        contact: "https://www.dreammoredigitals.com/contact",
        about: "https://www.dreammoredigitals.com/about"
      }
    };
    
    // Update cache
    cachedData = scrapedData;
    cacheTimestamp = now;
    
    console.log(`Successfully scraped ${scrapedData.courses.length} courses`);
    return scrapedData;
    
  } catch (error) {
    console.error("Web scraping failed:", error);
    return null;
  }
}

// Comprehensive knowledge base (fallback + static data)
const staticKnowledgeBase: StaticKnowledgeBase = {
  organization: {
    name: "DreamMore Digital Ecosystem",
    description: "Ethiopia's premier Digital Innovation Ecosystem with two core divisions: DreamMore Digitals (Agency) and DreamMore Skills Academy (Academy)",
    mission: "To empower Africa through digital innovation by building world-class digital products for businesses and training the next generation of African creators.",
    vision: "To become Africa's leading digital ecosystem where technology, education, and innovation converge.",
    location: "Bahir Dar, Ethiopia (HQ, evaluating expansion to Addis Ababa)"
  },
  
  agencyServices: [
    "Software Development — enterprise web/desktop applications",
    "Mobile App Development — iOS/Android (Flutter, React Native, Swift, Kotlin)",
    "Website Development — landing pages to complex platforms",
    "AI Solutions — intelligent automation, ML models, chatbots",
    "UI/UX Design — user research, wireframes, prototypes",
    "Branding & Identity — logos, style guides, brand strategy",
    "Digital Marketing — SEO, paid ads, social media management",
    "CCTV Intelligence Systems — AI surveillance with facial recognition"
  ],
  
  pricing: {
    standardCourse: 6000,
    webDevelopment: 8000,
    currency: "ETB",
    installment: "Available — contact admissions team"
  },
  
  enrollmentSteps: [
    "1. Visit the course page on our website",
    "2. Fill out the application form",
    "3. Pay the course fee (ETB 6,000 or 8,000 for Web/Mobile)",
    "4. Upload your payment receipt",
    "5. Get LMS access at https://dreammore.et/dashboard"
  ],
  
  contact: {
    email: "support@dreammoredigitals.com",
    phone: "+251 993 132 122",
    telegram: "@dreammoredigitals",
    instagram: "@dreammorecompany",
    website: "https://www.dreammoredigitals.com" // Added missing website property
  },
  
  faq: {
    certificate: "Yes! Every graduate receives an official DreamMore completion certificate.",
    onlineClasses: "Yes! We offer both in-person (Bahir Dar) and online learning via our LMS.",
    beginnerFriendly: "Absolutely! Most courses are designed for complete beginners.",
    duration: "Most courses take 3 months. Web & Mobile Development takes 4 months."
  }
};

// POST /api/chatbot - Process chat message with live data
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

    const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save user message to database
    try {
      await query(
        `INSERT INTO chatbot_conversations (session_id, user_id, message, is_bot, created_at) 
         VALUES (?, ?, ?, false, NOW())`,
        [chatSessionId, userId || null, message.trim()]
      );
    } catch (dbError) {
      console.log("Note: chatbot_conversations table may not exist");
    }

    // Get live website data
    const liveData = await scrapeDreamMoreWebsite();
    
    // Generate response using live data if available
    const response = await generateDynamicResponse(message.trim(), liveData);

    // Save bot response
    try {
      await query(
        `INSERT INTO chatbot_conversations (session_id, user_id, message, is_bot, created_at) 
         VALUES (?, ?, ?, true, NOW())`,
        [chatSessionId, userId || null, response]
      );
    } catch (dbError) {
      // Continue
    }

    return NextResponse.json({
      success: true,
      data: {
        response,
        sessionId: chatSessionId,
        timestamp: new Date().toISOString(),
        source: liveData ? "live" : "static"
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

// Generate dynamic response using live website data
async function generateDynamicResponse(message: string, liveData: ScrapedData | null): Promise<string> {
  const lowerMsg = message.toLowerCase();
  const dataSource = liveData || staticKnowledgeBase;
  
  // ===== COURSES (using live data) =====
  if (lowerMsg.includes('course') || lowerMsg.includes('what do you offer') || lowerMsg.includes('what can i learn')) {
    if (liveData && liveData.courses && liveData.courses.length > 0) {
      const courseList = liveData.courses.slice(0, 10).map((course: Course) => 
        `<div><span style="color: #f47822;">•</span> <b>${course.name}</b> — ETB ${course.price.toLocaleString()}</div>`
      ).join('');
      
      const remainingCount = liveData.courses.length - 10;
      const moreText = remainingCount > 0 ? `<div><span style="color: #f47822;">•</span> +${remainingCount} more courses available</div>` : '';
      
      return `<div style="margin-bottom: 10px;">📚 <b>DreamMore Academy offers ${liveData.courses.length}+ practical courses:</b></div>
${courseList}
${moreText}
<div style="margin-top: 12px; padding: 10px; background: rgba(244, 120, 34, 0.1); border-radius: 8px;">
🎯 <b>Course duration:</b> Most courses take 3 months (Web & Mobile Dev: 4 months)<br/>
💰 <b>Standard price:</b> ETB 6,000 (Web & Mobile Dev: ETB 8,000)<br/>
✅ <b>Includes:</b> Certificate, real projects, and job placement support
</div>
<div style="margin-top: 12px;">👉 <a href="${liveData?.urls?.academy || staticKnowledgeBase.contact.website}/academy" target="_blank" style="color: #f47822; text-decoration: underline;">View all courses & enroll on our website</a></div>`;
    }
    
    // Fallback to static course list
    return `<div style="margin-bottom: 10px;">📚 <b>DreamMore Academy Courses:</b></div>
<div><span style="color: #f47822;">•</span> Graphics Designing — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> Video Editing — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> Digital Marketing & SEO — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> Cinematography — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> Web & Mobile App Development — ETB 8,000</div>
<div><span style="color: #f47822;">•</span> Programming (C++, Python, JavaScript) — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> AI for Business — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> Cybersecurity — ETB 6,000</div>
<div><span style="color: #f47822;">•</span> And many more...</div>
<div style="margin-top: 12px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">See full list on our website</a></div>`;
  }

  // ===== ENROLLMENT / HOW TO APPLY =====
  if (lowerMsg.includes('enroll') || lowerMsg.includes('apply') || lowerMsg.includes('register') || 
      lowerMsg.includes('how to join') || lowerMsg.includes('sign up')) {
    return `<div style="margin-bottom: 10px;">📝 <b>How to Enroll at DreamMore Academy:</b></div>
<div style="line-height: 1.8;">
<div><b>Step 1:</b> Visit <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822;">our Academy page</a></div>
<div><b>Step 2:</b> Browse courses and click "Apply Now" on your chosen course</div>
<div><b>Step 3:</b> Fill out the application form with your details</div>
<div><b>Step 4:</b> Pay the course fee (ETB 6,000 or ETB 8,000 for Web/Mobile)</div>
<div><b>Step 5:</b> Upload your payment receipt</div>
<div><b>Step 6:</b> Get LMS access at <a href="https://dreammore.et/dashboard" target="_blank" style="color: #f47822;">dreammore.et/dashboard</a></div>
</div>
<div style="margin-top: 12px; padding: 10px; background: rgba(244, 120, 34, 0.1); border-radius: 8px;">
💡 <b>Quick Tip:</b> Need help? Call <a href="tel:${staticKnowledgeBase.contact.phone}" style="color: #f47822;">${staticKnowledgeBase.contact.phone}</a> or message on Telegram @dreammoredigitals
</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">Start Your Application Now</a></div>`;
  }

  // ===== PRICING =====
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee') || lowerMsg.includes('how much')) {
    return `<div style="margin-bottom: 10px;">💰 <b>DreamMore Academy Pricing:</b></div>
<div style="line-height: 1.8;">
<div><span style="color: #f47822;">•</span> <b>Standard courses:</b> ETB 6,000</div>
<div><span style="color: #f47822;">•</span> <b>Web & Mobile App Development:</b> ETB 8,000 (4 months)</div>
<div><span style="color: #f47822;">•</span> <b>Installment plans:</b> Available — contact admissions team</div>
</div>
<div style="margin-top: 10px;"><b>What's included:</b></div>
<div>✓ Complete video lessons and materials</div>
<div>✓ Hands-on projects and assignments</div>
<div>✓ Instructor support and community access</div>
<div>✓ Official DreamMore certificate upon completion</div>
<div>✓ Job placement assistance</div>
<div style="margin-top: 10px;">💳 <b>Payment methods:</b> CBE Bank Transfer, Telebirr</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">Apply now — limited spots available</a></div>`;
  }

  // ===== CERTIFICATES =====
  if (lowerMsg.includes('certificate') || lowerMsg.includes('certification') || lowerMsg.includes('diploma')) {
    return `<div style="margin-bottom: 10px;">🎓 <b>Certification at DreamMore Academy</b></div>
<div style="line-height: 1.6;">${staticKnowledgeBase.faq.certificate}</div>
<div style="margin-top: 10px;"><b>What you get:</b></div>
<div>• Industry-recognized completion certificate</div>
<div>• Portfolio of real projects</div>
<div>• LinkedIn-ready credential</div>
<div>• Access to DreamMore alumni network</div>
<div style="margin-top: 10px;">📊 <b>Our track record:</b> 98% job placement rate for graduates</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">Start your certification journey</a></div>`;
  }

  // ===== PAYMENT METHODS =====
  if (lowerMsg.includes('payment') || lowerMsg.includes('pay') || lowerMsg.includes('telebirr') || lowerMsg.includes('cbe')) {
    return `<div style="margin-bottom: 10px;">💳 <b>Payment Methods Accepted:</b></div>
<div><span style="color: #f47822;">🏦</span> <b>CBE Bank Transfer</b><br/>
Account: 1000765205852</div>
<div style="margin-top: 8px;"><span style="color: #f47822;">📱</span> <b>Telebirr</b><br/>
Number: 0993132122</div>
<div style="margin-top: 10px;"><span style="color: #f47822;">💰</span> <b>Installment Plans Available</b><br/>
Contact admissions to arrange: ${staticKnowledgeBase.contact.phone}</div>
<div style="margin-top: 10px; padding: 8px; background: rgba(244, 120, 34, 0.1); border-radius: 6px;">
⚠️ <b>Important:</b> After payment, upload your receipt to activate LMS access
</div>`;
  }

  // ===== INSTALLMENT PLANS =====
  if (lowerMsg.includes('installment') || (lowerMsg.includes('pay') && lowerMsg.includes('monthly'))) {
    return `<div style="margin-bottom: 10px;">📅 <b>Installment Payment Plans</b></div>
<div style="line-height: 1.6;">Yes! DreamMore offers flexible installment payment arrangements for students who cannot pay the full ETB 6,000 (or ETB 8,000) upfront.</div>
<div style="margin-top: 10px;"><b>How to set up installments:</b></div>
<div>1. Contact admissions team before enrollment</div>
<div>2. Discuss your preferred payment schedule</div>
<div>3. Agree on installment milestones</div>
<div>4. Pay first installment to begin the course</div>
<div>5. Complete remaining payments during the course</div>
<div style="margin-top: 10px; padding: 8px; background: rgba(244, 120, 34, 0.1); border-radius: 6px;">
📞 Call ${staticKnowledgeBase.contact.phone} or Telegram @dreammoredigitals to arrange your payment plan
</div>`;
  }

  // ===== ORGANIZATION INFO =====
  if (lowerMsg.includes('dreammore') && (lowerMsg.includes('what is') || lowerMsg.includes('tell me about'))) {
    return `<div style="margin-bottom: 10px;">🏢 <b>${staticKnowledgeBase.organization.name}</b></div>
<div>${staticKnowledgeBase.organization.description}</div>
<div style="margin-top: 10px;">📍 ${staticKnowledgeBase.organization.location}</div>
<div style="margin-top: 8px;">🎯 <b>Mission:</b> ${staticKnowledgeBase.organization.mission}</div>
<div style="margin-top: 8px;">👁️ <b>Vision:</b> ${staticKnowledgeBase.organization.vision}</div>
<div style="margin-top: 10px;">👉 <a href="${liveData?.urls?.about || 'https://www.dreammoredigitals.com/about'}" target="_blank" style="color: #f47822; text-decoration: underline;">Learn more on our website</a></div>`;
  }

  // ===== AGENCY SERVICES =====
  if (lowerMsg.includes('agency') || (lowerMsg.includes('service') && lowerMsg.includes('offer'))) {
    const servicesList = staticKnowledgeBase.agencyServices.map((service: string) => 
      `<div><span style="color: #f47822;">▹</span> ${service}</div>`
    ).join('');
    
    return `<div style="margin-bottom: 10px;">🚀 <b>DreamMore Agency Services:</b></div>
${servicesList}
<div style="margin-top: 10px;">📊 <b>Track record:</b> 50+ clients | 30+ projects | 4.9/5 stars</div>
<div style="margin-top: 10px;">👉 <a href="${liveData?.urls?.agency || 'https://www.dreammoredigitals.com/agency'}" target="_blank" style="color: #f47822; text-decoration: underline;">Start your project</a></div>`;
  }

  // ===== CONTACT =====
  if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('phone') || lowerMsg.includes('reach')) {
    return `<div style="margin-bottom: 10px;">📞 <b>Contact DreamMore:</b></div>
<div><span style="color: #f47822;">📧</span> Email: <a href="mailto:${staticKnowledgeBase.contact.email}" style="color: #f47822;">${staticKnowledgeBase.contact.email}</a></div>
<div><span style="color: #f47822;">📱</span> Phone/WhatsApp: <a href="tel:${staticKnowledgeBase.contact.phone}" style="color: #f47822;">${staticKnowledgeBase.contact.phone}</a></div>
<div><span style="color: #f47822;">📢</span> Telegram: ${staticKnowledgeBase.contact.telegram}</div>
<div><span style="color: #f47822;">📷</span> Instagram: ${staticKnowledgeBase.contact.instagram}</div>
<div style="margin-top: 10px;">🌐 <b>Website:</b> <a href="${staticKnowledgeBase.contact.website}" target="_blank" style="color: #f47822;">${staticKnowledgeBase.contact.website}</a></div>
<div style="margin-top: 10px;">👉 <a href="${liveData?.urls?.contact || 'https://www.dreammoredigitals.com/contact'}" target="_blank" style="color: #f47822; text-decoration: underline;">Contact form & office location</a></div>`;
  }

  // ===== GREETING =====
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return `<div style="margin-bottom: 10px;">👋 Hello! I'm Dreamy, your DreamMore AI assistant!</div>
<div style="line-height: 1.6;">I'm connected to our live website at <a href="${staticKnowledgeBase.contact.website}" target="_blank" style="color: #f47822;">dreammoredigitals.com</a> and can help you with:</div>
<div>• 📚 <b>Course information</b> — see all ${liveData?.courses?.length || '16+'} courses</div>
<div>• 📝 <b>How to enroll</b> — step-by-step guide</div>
<div>• 💰 <b>Pricing & payments</b> — fees, installments, methods</div>
<div>• 🎓 <b>Certificates & job placement</b> — 98% success rate</div>
<div>• 🏢 <b>Agency services</b> — software, AI, marketing</div>
<div>• 📞 <b>Contact & support</b> — get human help</div>
<div style="margin-top: 10px;">What would you like to know today?</div>`;
  }

  // ===== FALLBACK =====
  return `<div style="margin-bottom: 10px;">❓ I want to make sure you get the most accurate information from our website.</div>
<div style="line-height: 1.6;">Please visit our official website or contact our team directly for specific questions:</div>
<div style="margin-top: 10px; padding: 10px; background: rgba(244, 120, 34, 0.1); border-radius: 8px;">
<div>🌐 <b>Website:</b> <a href="${staticKnowledgeBase.contact.website}" target="_blank" style="color: #f47822;">${staticKnowledgeBase.contact.website}</a></div>
<div>📧 <b>Email:</b> <a href="mailto:${staticKnowledgeBase.contact.email}" style="color: #f47822;">${staticKnowledgeBase.contact.email}</a></div>
<div>📞 <b>Call/WhatsApp:</b> <a href="tel:${staticKnowledgeBase.contact.phone}" style="color: #f47822;">${staticKnowledgeBase.contact.phone}</a></div>
<div>📱 <b>Telegram:</b> ${staticKnowledgeBase.contact.telegram}</div>
</div>
<div style="margin-top: 8px;">⏱️ Our team typically responds within hours during business days.</div>`;
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