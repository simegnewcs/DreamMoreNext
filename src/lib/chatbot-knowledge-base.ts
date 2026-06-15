// Complete knowledge base from the training document
export interface QAPair {
  id: string;
  question: string;
  variants: string[];
  answer: string;
  category: string;
  priority: number; // 1-10, higher = more specific
  requiresEscalation?: boolean;
  links?: string[];
}

export const knowledgeBase: QAPair[] = [
  // ORGANIZATION IDENTITY (Section 1)
  {
    id: "q1",
    question: "What is DreamMore?",
    variants: [
      "tell me about dreammore",
      "what does dreammore do",
      "what company is this",
      "what is dreammoredigitals.com",
      "who is dreammore",
      "tell me about the company",
      "dreammore overview"
    ],
    category: "organization",
    priority: 10,
    answer: `**DreamMore** is Ethiopia's premier Digital Innovation Ecosystem - a dual-powered organization built around two core divisions that work as one:

**🏢 DreamMore Digitals (The Agency)** - Builds world-class software, mobile apps, websites, AI platforms, brand identities, and digital marketing systems for businesses.

**🎓 DreamMore Skills Academy (The Academy)** - Trains the next generation of African digital professionals across 16+ in-demand tech skills.

DreamMore was founded by a collaborative group of dynamic young professionals dedicated to education, digital marketing, and technology services, with an unwavering commitment to quality and client-centered service.

The company operates under the philosophy that Africa's digital future must be built from within by African creators, trained by African practitioners, using global standards.

👉 [Learn more about us](https://www.dreammoredigitals.com/about)`
  },
  {
    id: "q2",
    question: "Where is DreamMore located?",
    variants: [
      "where are you based",
      "dreammore office location",
      "address",
      "is dreammore in addis ababa",
      "what city is dreammore in",
      "bahir dar office"
    ],
    category: "organization",
    priority: 8,
    answer: `📍 DreamMore is headquartered in **Bahir Dar, Ethiopia** and is evaluating opportunities for future expansion into additional locations, including Addis Ababa.

While physically based in Ethiopia, DreamMore serves clients across Africa and internationally, operating with full capacity for remote project collaboration across all time zones.

Our teams use modern enterprise tools including Slack, Figma, Jira, and Teams to coordinate distributed projects seamlessly for both local and global clients.

👉 [View contact details](https://www.dreammoredigitals.com/contact)`
  },
  {
    id: "q3",
    question: "What is DreamMore's mission?",
    variants: [
      "what is your mission",
      "what is dreammore's goal",
      "what does dreammore stand for",
      "dreammore purpose",
      "why does dreammore exist"
    ],
    category: "organization",
    priority: 7,
    answer: `🎯 **DreamMore's Mission:** To empower Africa through digital innovation by building world-class digital products for businesses and training the next generation of African creators.

In practical terms, this means delivering outstanding technology services tailored to each client's unique needs while simultaneously building the talent pipeline that will sustain Africa's digital economy for decades.

DreamMore is an indigenous Ethiopian organization that views technology education and commercial digital excellence as inseparable - which is why the Agency and Academy operate as one ecosystem rather than two separate businesses.`
  },
  {
    id: "q4",
    question: "What is DreamMore's vision?",
    variants: [
      "dreammore vision",
      "where do you see dreammore in the future",
      "long term plan",
      "dreammore future"
    ],
    category: "organization",
    priority: 7,
    answer: `👁️ **DreamMore's Vision:** To become Africa's leading digital ecosystem - a hub where technology, education, and innovation converge to produce globally competitive digital professionals and products.

The company aims to position Ethiopia and Africa as not just consumers of digital technology but as creators and exporters of world-class digital solutions.

This vision is supported by the **Ecosystem Advantage**: Agency real-world projects continuously refresh Academy curriculum, and top Academy graduates feed back into Agency talent - creating a self-reinforcing loop of innovation.`
  },
  {
    id: "q5",
    question: "What are DreamMore's core values?",
    variants: [
      "dreammore values",
      "what values does dreammore believe in",
      "dreammore culture",
      "what principles guide dreammore",
      "company values"
    ],
    category: "organization",
    priority: 6,
    answer: `✨ **DreamMore's Four Foundational Values:**

1. **Excellence** - Delivering the highest quality in every project and course
2. **Integrity** - Being transparent and trustworthy in all client and student relationships
3. **Community** - Empowering the local Ethiopian and broader African community with tools for success
4. **Relentless Innovation** - Continuously adopting cutting-edge methods and technologies

These values are reflected in measurable outcomes: 
• ⭐ 4.9-star client satisfaction rating
• 📈 98% student success rate
• 🚀 3x average ROI uplift for agency clients`
  },

  // ACADEMY COURSES (Section 3 - Critical)
  {
    id: "q20",
    question: "What is the DreamMore Skills Academy?",
    variants: [
      "tell me about the academy",
      "what is dreammore academy",
      "skills academy",
      "dreammore training center",
      "education at dreammore"
    ],
    category: "academy",
    priority: 9,
    answer: `🎓 **The DreamMore Skills Academy** is the education arm of the DreamMore Digital Ecosystem - a professional training institute that teaches **16+ in-demand digital skills** through real-world, hands-on projects led by active industry practitioners.

**Key Stats:**
• 📚 150+ professionals trained
• 🎯 98% job placement/success rate
• 👥 2,000+ students in the community
• 🏆 One of Ethiopia's most impactful digital training institutions

Unlike traditional computer training centers that teach theory from textbooks, the Academy curriculum is built directly from the workflows and technology stacks used daily by DreamMore's Agency team for real client projects.

Every graduate receives a certified credential, and top performers gain access to real Agency projects and potential employment within DreamMore itself.

👉 [Explore courses](https://www.dreammoredigitals.com/academy)`
  },
  {
    id: "q21",
    question: "What courses does the Academy offer?",
    variants: [
      "list of courses",
      "what can i learn",
      "course catalog",
      "all courses",
      "subjects taught",
      "what skills can i learn"
    ],
    category: "academy",
    priority: 10,
    answer: `📚 **DreamMore Academy offers 16+ courses across creative, technical, and business disciplines:**

**🎨 Creative Tracks (Beginner-friendly):**
• Graphics Designing (Adobe Photoshop, Illustrator, InDesign)
• Professional Video Editing (Adobe Premiere Pro, CapCut)
• Digital Marketing & SEO
• Cinematography & Content Creation

**💻 Advanced Technology Tracks:**
• Full Stack Web Development (React, Node.js, databases)
• UI/UX Design (Figma)
• AI Engineering
• Cybersecurity

**📖 Individual Programming Languages:**
• Python, JavaScript, Java, C++

**Course Fees:** ETB 6,000 per course (installment plans available)

👉 [View all courses](https://www.dreammoredigitals.com/academy)

Which course interests you most? I can provide detailed information about any of them!`
  },
  {
    id: "q22",
    question: "What will I learn in the Graphics Designing course?",
    variants: [
      "graphics design course details",
      "photoshop course",
      "illustrator training",
      "what is taught in graphic design",
      "graphics design curriculum"
    ],
    category: "academy",
    priority: 8,
    answer: `🎨 **Graphics Designing Course - What You'll Learn:**

**Adobe Photoshop:**
• Designing eye-catching social media posts and digital content
• Creating high-quality print designs (flyers, posters, brochures)
• Photo editing, color correction, background removal
• Professional visual composition techniques

**Adobe Illustrator:**
• Logo design and complete brand identity development
• Creating professional illustrations and vector-based graphics
• Designing scalable graphics for print and digital platforms

**Perfect for:** Beginners wanting to enter graphic design professionally, content creators, marketers, business owners, and anyone building a professional portfolio.

**Outcome:** You'll leave with a portfolio of real client-grade projects - not just exercises - that you can present to employers or use to start freelance work.

👉 [Enroll in Graphics Design](https://www.dreammoredigitals.com/academy/graphics-designing)`
  },
  {
    id: "q27",
    question: "What is the course fee and how do I pay?",
    variants: [
      "how much is the course",
      "academy fees",
      "course registration fee",
      "cost of courses",
      "etb 6000 payment",
      "course payment method"
    ],
    category: "academy",
    priority: 10,
    answer: `💰 **Course Fees & Payment:**

**Standard Tuition:** ETB 6,000 per course

**Installment Plans Available!** Contact admissions team to discuss a payment plan that works for you.

**How to Pay:**
1. Make payment via bank deposit or mobile banking to DreamMore's account
2. Upload a clear photo/screenshot of your deposit slip or transaction receipt to the course payment confirmation page
3. Admin team verifies the payment (short manual review)
4. Once verified, your LMS dashboard access is granted immediately

**Payment Channels:**
• CBE Bank Transfer
• Telebirr

**Need help with payment or installments?**
📞 Call: +251 993 132 122
💬 Telegram: @dreammoredigitals
📧 Email: support@dreammoredigitals.com

👉 [Start enrollment process](https://dreammore.et/dashboard)`
  },
  {
    id: "q28",
    question: "What are the exact steps to enroll?",
    variants: [
      "how to register",
      "enrollment process",
      "how to sign up",
      "registration steps",
      "join dreammore academy"
    ],
    category: "academy",
    priority: 10,
    answer: `📝 **5-Step Enrollment Process:**

**Step 1:** Navigate to the application form for your chosen course and fill in your student profile and contact details

**Step 2:** Pay the ETB 6,000 course tuition fee (or your agreed installment amount) via bank or mobile banking

**Step 3:** Go to the course-specific payment receipt upload page and submit a clear image of your deposit slip or transaction receipt

**Step 4:** The DreamMore admin team manually reviews your receipt against official banking logs

**Step 5:** Upon verification, your account is approved and LMS dashboard credentials are activated - giving you full access to course videos, downloadable assets, project folders, and teacher support

**⏱️ Timeline:** The entire process from application to access can be completed in one session!

**Your Learning Portal:** https://dreammore.et/dashboard

👉 [Start your enrollment now](https://dreammore.et/dashboard)`
  },

  // AGENCY SERVICES (Section 2)
  {
    id: "q9",
    question: "What services does the DreamMore Agency offer?",
    variants: [
      "what can dreammore build for me",
      "list of services",
      "agency offerings",
      "what does the agency do",
      "dreammore services"
    ],
    category: "agency",
    priority: 10,
    answer: `🚀 **DreamMore Agency offers 8 core service lines:**

1. **Software Development** - Custom enterprise-grade web and desktop applications
2. **Mobile App Development** - iOS and Android apps (Flutter, React Native)
3. **Website Development** - Landing pages to complex web platforms
4. **AI Solutions** - Intelligent automation and ML-powered systems
5. **UI/UX Design** - User research, wireframes, and prototypes
6. **Branding & Identity** - Logos, style guides, and brand strategy
7. **Digital Marketing** - SEO, paid ads, and social media management
8. **CCTV Intelligence Systems** - AI-powered surveillance with facial recognition

**Key Stats:**
• ⭐ 4.9/5 client satisfaction rating
• 📈 3x average ROI uplift for clients
• 🏢 50+ clients served
• 💰 ETB 2.4M+ revenue generated

All services available as standalone engagements or as part of a comprehensive digital transformation package.

👉 [Explore agency services](https://www.dreammoredigitals.com/agency)`
  },
  {
    id: "q18",
    question: "How much does it cost to hire DreamMore Agency?",
    variants: [
      "agency pricing",
      "how much for a website",
      "cost of app development",
      "dreammore fees",
      "price list"
    ],
    category: "agency",
    priority: 9,
    answer: `💰 **DreamMore Agency Pricing:**

DreamMore's pricing is **scope-dependent and transparent** - there are no hidden fees. Cost is determined by:
• Service type
• Project complexity
• Technology stack
• Timeline requirements

**General Orientation:**
• Simple websites and landing pages → Most accessible entry point
• Mobile apps and enterprise software → Larger investment proportional to complexity
• Ongoing digital marketing → Monthly retainer packages

**⚠️ No generic quotes.** DreamMore starts with a **free discovery consultation** where the team maps your exact requirements and provides a detailed proposal.

**To get a precise quote:**
📞 Call: +251 993 132 122
📧 Email: support@dreammoredigitals.com
💬 WhatsApp: +251 993 132 122
🌐 [Contact form](https://www.dreammoredigitals.com/contact)

*International clients may also connect via WhatsApp at the same number.*`
  },

  // CONTACT & SUPPORT (Section 6)
  {
    id: "q43",
    question: "How can I contact DreamMore?",
    variants: [
      "contact information",
      "phone number",
      "email address",
      "how to reach dreammore",
      "dreammore support"
    ],
    category: "contact",
    priority: 10,
    answer: `📞 **Contact DreamMore:**

**Primary Channels:**
• 📧 **Email:** support@dreammoredigitals.com (formal inquiries, project briefs)
• 📱 **Phone/WhatsApp:** +251 993 132 122 (fastest response)
• 💬 **Telegram:** @dreammoredigitals (quick questions, enrollment support)
• 📷 **Instagram:** @dreammorecompany
• 💼 **LinkedIn:** linkedin.com/company/dreammore21
• 🎵 **TikTok:** @dreammorecompany

**⏱️ Response Times:**
• Email: Within 24 hours on business days
• Phone/Telegram: Within minutes during business hours
• Urgent matters (dashboard access, project issues): Call or Telegram for priority

**📍 Office:** Bahir Dar, Ethiopia (HQ)

👉 [Contact form](https://www.dreammoredigitals.com/contact)

*For the fastest support regarding course access or payment issues, call or message on Telegram immediately!*`
  },
  {
    id: "q29",
    question: "I paid but can't access my courses",
    variants: [
      "paid but no access",
      "receipt uploaded but no access",
      "account not activated",
      "verification taking too long",
      "lms access problem"
    ],
    category: "support",
    priority: 10,
    answer: `🔐 **Don't worry! This is normal.**

The admin team performs **manual verification** of every receipt against official banking logs to ensure platform security. This review is typically completed very quickly.

**What's happening:**
Once your receipt is confirmed, your student profile will be marked as **Approved** and full access to your videos, assets, and assignments will be unlocked immediately.

**Need priority fast-track activation?** Contact admissions coordinator directly:
• 📞 Call: +251 993 132 122
• 💬 Telegram: @dreammoredigitals
• 📧 Email: support@dreammoredigitals.com

The team can unlock your dashboard immediately upon manual confirmation.

**Quick checklist:**
✓ Is your receipt image clear?
✓ Does it show the full transaction amount and date?
✓ Does the amount match ETB 6,000 (or your agreed installment)?

Once verified, access your dashboard at: https://dreammore.et/dashboard`
  },

  // EDGE CASES & OBJECTIONS (Section 7)
  {
    id: "q46",
    question: "How is DreamMore different from other digital agencies?",
    variants: [
      "why choose dreammore",
      "dreammore vs others",
      "competitive advantage",
      "what makes dreammore special",
      "best agency in ethiopia"
    ],
    category: "comparison",
    priority: 8,
    answer: `🏆 **Why DreamMore Stands Out:**

**1. The Ecosystem Model** (Unique in Ethiopia)
No other agency simultaneously operates a professional training academy that feeds directly into its agency talent pool. Clients always work with professionals trained on current tools; students always learn skills immediately applicable in the job market.

**2. Unusually Wide Service Breadth**
Covers software dev, mobile apps, AI systems, branding, video production, CCTV intelligence, and digital marketing under one roof. Most agencies specialize in 2-3 areas.

**3. Verified Track Record**
• ⭐ 4.9-star rating from 50+ clients
• 📈 3x average ROI uplift
• 🏢 30+ deployed projects
• 💰 ETB 2.4M+ revenue

**4. International Recognition**
Founders Live Africa Regional Finalist - independent validation of DreamMore's business innovation.

**5. Global Standards**
World-class execution, not a locally adapted compromise. Clients get the same quality as international agencies with local market understanding.`
  },
  {
    id: "q50",
    question: "Can I pay in installments?",
    variants: [
      "payment plan",
      "pay monthly",
      "installment options",
      "part payment",
      "affordable payment"
    ],
    category: "academy",
    priority: 9,
    answer: `✅ **Yes! Installment plans are available.**

DreamMore recognizes that the ETB 6,000 course fee can be a significant investment for some students and accommodates **pre-arranged installment payment plans**.

**How to set up installments:**
Contact the admissions team **before or at enrollment**:
• 📞 Call/WhatsApp: +251 993 132 122
• 💬 Telegram: @dreammoredigitals
• 📧 Email: support@dreammoredigitals.com

**Process:**
1. Admissions coordinator confirms installment schedule and payment milestones
2. Standard 5-step enrollment workflow follows
3. Pay first installment, upload receipt
4. Receive verification and LMS access

**Note:** Installment terms vary and are agreed on a case-by-case basis.

👉 Contact the team now to discuss your payment plan!`
  },

  // QUICK REFERENCE (Section 8)
  {
    id: "q54",
    question: "What are all the official DreamMore website links?",
    variants: [
      "all links",
      "website urls",
      "important pages",
      "dreammore sitemap"
    ],
    category: "reference",
    priority: 5,
    answer: `🔗 **Official DreamMore Website Links:**

**Main Portal:**
• Home: https://www.dreammoredigitals.com/

**Agency:**
• Services: https://www.dreammoredigitals.com/agency

**Academy:**
• Overview: https://www.dreammoredigitals.com/academy
• Graphics Design: https://www.dreammoredigitals.com/academy/graphics-designing
• Video Editing: https://www.dreammoredigitals.com/academy/video-editing
• Digital Marketing: https://www.dreammoredigitals.com/academy/digital-marketing
• Cinematography: https://www.dreammoredigitals.com/academy/cinematography
• All Courses: https://www.dreammoredigitals.com/academy/courses

**Company:**
• About: https://www.dreammoredigitals.com/about
• Team: https://www.dreammoredigitals.com/team
• Contact: https://www.dreammoredigitals.com/contact
• Careers: https://www.dreammoredigitals.com/careers
• Blog: https://www.dreammoredigitals.com/blog

**Student Portal:**
• LMS Dashboard: https://dreammore.et/dashboard`
  }
];

// Amharic language support
export const amharicResponses = {
  greeting: "👋 ሰላም! እንኳን ወደ DreamMore አካዳሚ በደህና መጡ! እንዴት ልረዳዎት እችላለሁ?",
  fallback: "ይቅርታ፣ ያንን ጥያቄ በትክክል አልገባኝም። እባክዎ በሚከተሉት አድራሻዎች በቀጥታ ያነጋግሩን፡ 📞 +251 993 132 122 | 📧 support@dreammoredigitals.com"
};