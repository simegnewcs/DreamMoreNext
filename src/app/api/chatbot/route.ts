import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// ============================================
// COMPLETE Q&A DATABASE FROM TRAINING PDF
// ALL 56+ QUESTIONS AND ANSWERS
// ============================================

interface QAPair {
  id: string;
  keywords: string[];
  answer: string;
}

const qaDatabase: QAPair[] = [
  // SECTION 1: ORGANIZATION IDENTITY & OVERVIEW (Q1-Q8)
  {
    id: "Q1",
    keywords: ["what is dreammore", "tell me about dreammore", "what does dreammore do", "what company is this", "who is dreammore"],
    answer: `<div style="margin-bottom: 10px;">🏢 <b>DreamMore Digital Ecosystem</b></div>
<div style="line-height: 1.6;">DreamMore is Ethiopia's premier Digital Innovation Ecosystem — a dual-powered organization built around two core divisions that work as one: DreamMore Digitals (the Agency) and DreamMore Skills Academy (the Academy).</div>
<div style="margin-top: 8px;">The Agency builds world-class software, mobile apps, websites, AI platforms, brand identities, and digital marketing systems for businesses. The Academy trains the next generation of African digital professionals across 16+ in-demand tech skills.</div>
<div style="margin-top: 8px;">DreamMore was founded by a collaborative group of dynamic young professionals dedicated to education, digital marketing, and technology services.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/about" target="_blank" style="color: #f47822; text-decoration: underline;">Learn more about us</a></div>`
  },
  {
    id: "Q2",
    keywords: ["where is dreammore located", "where are you based", "dreammore office location", "is dreammore in addis ababa", "what city"],
    answer: `<div style="margin-bottom: 10px;">📍 <b>DreamMore Location</b></div>
<div>DreamMore is headquartered in <b>Bahir Dar, Ethiopia</b> and is evaluating opportunities for future expansion into additional locations, including Addis Ababa.</div>
<div style="margin-top: 8px;">While physically based in Ethiopia, DreamMore serves clients across Africa and internationally, operating with full capacity for remote project collaboration across all time zones.</div>
<div style="margin-top: 8px;">Our teams use modern enterprise tools including Slack, Figma, Jira, and Teams to coordinate distributed projects seamlessly.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/contact" target="_blank" style="color: #f47822; text-decoration: underline;">Get directions & contact</a></div>`
  },
  {
    id: "Q3",
    keywords: ["what is dreammore mission", "what is your mission", "dreammore goal", "what does dreammore stand for", "purpose"],
    answer: `<div style="margin-bottom: 10px;">🎯 <b>DreamMore's Mission</b></div>
<div>DreamMore's mission is to <b>empower Africa through digital innovation</b> by building world-class digital products for businesses and training the next generation of African creators.</div>
<div style="margin-top: 8px;">In practical terms, this means delivering outstanding technology services tailored to each client's unique needs while simultaneously building the talent pipeline that will sustain Africa's digital economy.</div>
<div style="margin-top: 8px;">The company is an indigenous Ethiopian organization that views technology education and commercial digital excellence as inseparable — which is why the Agency and Academy operate as one ecosystem.</div>`
  },
  {
    id: "Q4",
    keywords: ["what is dreammore vision", "vision", "where do you see dreammore", "long-term plan"],
    answer: `<div style="margin-bottom: 10px;">👁️ <b>DreamMore's Vision</b></div>
<div>DreamMore's vision is to become <b>Africa's leading digital ecosystem</b> — a hub where technology, education, and innovation converge to produce globally competitive digital professionals and products.</div>
<div style="margin-top: 8px;">The company aims to position Ethiopia and Africa as not just consumers of digital technology but as creators and exporters of world-class digital solutions.</div>
<div style="margin-top: 8px;">This vision is supported by the <b>Ecosystem Advantage</b>: Agency real-world projects continuously refresh Academy curriculum, and top Academy graduates feed back into Agency talent — creating a self-reinforcing loop of innovation.</div>`
  },
  {
    id: "Q5",
    keywords: ["core values", "values", "what values does dreammore believe in", "culture", "principles"],
    answer: `<div style="margin-bottom: 10px;">💎 <b>DreamMore's Core Values</b></div>
<div><b>• Excellence</b> — delivering the highest quality in every project and course</div>
<div><b>• Integrity</b> — being transparent and trustworthy in all relationships</div>
<div><b>• Community</b> — empowering the local Ethiopian and broader African community</div>
<div><b>• Relentless Innovation</b> — continuously adopting cutting-edge methods</div>
<div style="margin-top: 8px;">These values are reflected in measurable outcomes: a 4.9-star client rating, 98% student success rate, and 3x average ROI uplift for agency clients.</div>`
  },
  {
    id: "Q6",
    keywords: ["how long has dreammore been operating", "when was dreammore founded", "how old", "dreammore history"],
    answer: `<div style="margin-bottom: 10px;">📅 <b>DreamMore's History</b></div>
<div>DreamMore has over <b>5 years of operational excellence</b> in Ethiopia's digital industry, growing from a youth-led startup to a recognized dual-ecosystem company.</div>
<div style="margin-top: 8px;"><b>Key achievements:</b></div>
<div>• 30+ major digital projects delivered</div>
<div>• 150+ professionals trained</div>
<div>• ETB 2.4 Million+ in agency revenue</div>
<div style="margin-top: 8px;">🏆 Recognized at the international <b>Founders Live Africa Regional Finals</b></div>`
  },
  {
    id: "Q7",
    keywords: ["international clients", "can i hire dreammore from outside ethiopia", "african countries", "outside ethiopia"],
    answer: `<div style="margin-bottom: 10px;">🌍 <b>International Clients Welcome!</b></div>
<div>While DreamMore is rooted in Ethiopia, the Agency works with clients across Africa and internationally.</div>
<div style="margin-top: 8px;">For international clients, DreamMore offers remote asynchronous collaboration using Slack, Jira, Figma, and Teams for seamless time-zone synchronization.</div>
<div style="margin-top: 8px;">The Academy serves students from across Ethiopia and Africa, with curriculum built to global industry standards.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/contact" target="_blank" style="color: #f47822; text-decoration: underline;">Contact us for international projects</a></div>`
  },
  {
    id: "Q8",
    keywords: ["ecosystem advantage", "what is the dreammore digital ecosystem", "why both agency and academy"],
    answer: `<div style="margin-bottom: 10px;">🔄 <b>The DreamMore Digital Ecosystem</b></div>
<div>The integrated model where the Agency and Academy reinforce each other continuously — creating advantages that neither a standalone agency nor a standalone school could achieve.</div>
<div style="margin-top: 8px;"><b>How it works:</b></div>
<div>• Agency projects become Academy curriculum — students learn what's actually used in industry today</div>
<div>• Top Academy graduates join Agency teams — clients get pre-vetted, job-ready talent</div>
<div style="margin-top: 8px;">This is the <b>Ecosystem Advantage</b> — one organization, two power centers, each making the other stronger.</div>`
  },

  // SECTION 2: AGENCY SERVICES (Q9-Q19)
  {
    id: "Q9",
    keywords: ["what services does the dreammore agency offer", "list of dreammore services", "what can dreammore build", "agency offerings"],
    answer: `<div style="margin-bottom: 10px;">🚀 <b>DreamMore Agency Services (8 Core Lines)</b></div>
<div><span style="color: #f47822;">▹</span> <b>Software Development</b> — enterprise web/desktop applications</div>
<div><span style="color: #f47822;">▹</span> <b>Mobile App Development</b> — iOS/Android apps</div>
<div><span style="color: #f47822;">▹</span> <b>Website Development</b> — landing pages to complex platforms</div>
<div><span style="color: #f47822;">▹</span> <b>AI Solutions</b> — intelligent automation and ML systems</div>
<div><span style="color: #f47822;">▹</span> <b>UI/UX Design</b> — user research, wireframes, prototypes</div>
<div><span style="color: #f47822;">▹</span> <b>Branding & Identity</b> — logos, style guides, brand strategy</div>
<div><span style="color: #f47822;">▹</span> <b>Digital Marketing</b> — SEO, paid ads, social media management</div>
<div><span style="color: #f47822;">▹</span> <b>CCTV Intelligence Systems</b> — AI-powered surveillance</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Explore agency services</a></div>`
  },
  {
    id: "Q10",
    keywords: ["software development service", "what does software development include", "custom software ethiopia", "what programming"],
    answer: `<div style="margin-bottom: 10px;">💻 <b>DreamMore's Software Development Service</b></div>
<div>Full-stack engineering from concept to deployment — including scalable enterprise systems, secure API integrations, and conversion-optimized interfaces.</div>
<div style="margin-top: 8px;"><b>Primary technologies:</b></div>
<div>• Front-end: React.js and Next.js</div>
<div>• Back-end: Node.js and Python (Django)</div>
<div>• Databases: PostgreSQL and MongoDB</div>
<div style="margin-top: 8px;">Clients receive complete production-ready codebases, documentation, and post-launch maintenance support.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Start your software project</a></div>`
  },
  {
    id: "Q11",
    keywords: ["mobile apps", "build mobile apps", "android app", "ios app", "flutter", "react native"],
    answer: `<div style="margin-bottom: 10px;">📱 <b>Mobile App Development</b></div>
<div>DreamMore builds native and cross-platform mobile apps for Android and iOS using Flutter, React Native, Swift, and Kotlin.</div>
<div style="margin-top: 8px;"><b>Capabilities include:</b></div>
<div>• Real-time synchronization</div>
<div>• Offline functionality</div>
<div>• Secure payment integrations</div>
<div>• Push notifications</div>
<div>• Biometric authentication</div>
<div style="margin-top: 8px;"><b>Notable projects:</b> EthioHealth Platform, AgroConnect App</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Build your app</a></div>`
  },
  {
    id: "Q12",
    keywords: ["website development", "build a website", "website design ethiopia", "corporate website", "e-commerce"],
    answer: `<div style="margin-bottom: 10px;">🌐 <b>Website Development</b></div>
<div>DreamMore builds modern, fast, and scalable websites — from landing pages to complex e-commerce platforms and full web applications.</div>
<div style="margin-top: 8px;"><b>Features included:</b></div>
<div>• Performance optimization</div>
<div>• Mobile responsiveness</div>
<div>• SEO-ready architecture</div>
<div>• Security best practices</div>
<div style="margin-top: 8px;">Tech stack: Next.js, React.js, Node.js with post-launch maintenance and scaling support.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Get a website quote</a></div>`
  },
  {
    id: "Q13",
    keywords: ["ai solutions", "artificial intelligence", "does dreammore do ai", "machine learning", "smart systems"],
    answer: `<div style="margin-bottom: 10px;">🤖 <b>AI Solutions</b></div>
<div>DreamMore designs and deploys intelligent automation tools, machine learning models, and AI-powered systems.</div>
<div style="margin-top: 8px;"><b>Current capabilities:</b></div>
<div>• SafeCity AI — real-time spatial safety mapping</div>
<div>• Intelligent CCTV with facial recognition</div>
<div>• Conversational AI chatbots</div>
<div>• Data analytics dashboards</div>
<div style="margin-top: 8px;">Built with Python-based ML frameworks, integrated with web/mobile stacks.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Explore AI solutions</a></div>`
  },
  {
    id: "Q14",
    keywords: ["branding", "identity", "logo design", "corporate branding", "visual identity", "brand book"],
    answer: `<div style="margin-bottom: 10px;">🎨 <b>Branding & Identity Service</b></div>
<div>Complete visual and strategic brand systems — not just a logo. Full brand identity kit includes:</div>
<div>• Logo design and vector assets</div>
<div>• Color system guidelines</div>
<div>• Typography rules</div>
<div>• Brand voice guidelines</div>
<div>• Business card and letterhead templates</div>
<div>• Social media profile kit</div>
<div>• Complete brand book</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Build your brand identity</a></div>`
  },
  {
    id: "Q15",
    keywords: ["digital marketing", "seo", "social media management", "google ads", "content marketing"],
    answer: `<div style="margin-bottom: 10px;">📈 <b>Digital Marketing Service</b></div>
<div>Data-driven digital marketing covering the full growth stack:</div>
<div>• SEO — keyword research, on-page optimization, technical auditing</div>
<div>• Google Ads — paid search campaigns</div>
<div>• Social media management — Telegram, TikTok, Facebook, Instagram, LinkedIn</div>
<div>• Content strategy and creation</div>
<div>• Analytics and reporting</div>
<div style="margin-top: 8px;"><b>Track record:</b> 3x average ROI uplift for clients</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Start your marketing campaign</a></div>`
  },
  {
    id: "Q16",
    keywords: ["cctv", "intelligence systems", "surveillance", "facial recognition", "security monitoring"],
    answer: `<div style="margin-bottom: 10px;">🔒 <b>CCTV Intelligence Systems</b></div>
<div>AI-powered surveillance infrastructure beyond traditional camera installation:</div>
<div>• Real-time facial recognition</div>
<div>• Anomaly detection</div>
<div>• Behavioral analysis</div>
<div>• Automated alerting</div>
<div style="margin-top: 8px;">Designed for businesses, hospitals, campuses, and public infrastructure.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822; text-decoration: underline;">Secure your premises</a></div>`
  },
  {
    id: "Q17",
    keywords: ["project process", "development process", "how does dreammore manage projects", "timeline"],
    answer: `<div style="margin-bottom: 10px;">📋 <b>DreamMore's 6-Phase Delivery Process</b></div>
<div><b>1. Discovery</b> — Understanding goals and requirements</div>
<div><b>2. Strategy & Scoping</b> — Roadmap and timeline with cost transparency</div>
<div><b>3. Design</b> — Wireframes and prototypes approved before development</div>
<div><b>4. Development</b> — Iterative builds with regular demos</div>
<div><b>5. Testing & QA</b> — Performance, security, cross-device testing</div>
<div><b>6. Launch & Support</b> — Deployment and post-launch maintenance</div>
<div style="margin-top: 8px;">Project management via Slack, Jira, Figma with full client access to progress tracking.</div>`
  },
  {
    id: "Q18",
    keywords: ["how much does it cost", "pricing", "agency fees", "cost of building an app", "price list"],
    answer: `<div style="margin-bottom: 10px;">💰 <b>Pricing Information</b></div>
<div>DreamMore's pricing is <b>scope-dependent and transparent</b> — no hidden fees.</div>
<div style="margin-top: 8px;"><b>General orientation:</b></div>
<div>• Simple websites and landing pages: most accessible entry point</div>
<div>• Mobile apps and enterprise software: larger investment</div>
<div>• Digital marketing services: monthly retainer packages available</div>
<div style="margin-top: 8px;">Start with a <b>free discovery consultation</b> for a detailed proposal.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/contact" target="_blank" style="color: #f47822; text-decoration: underline;">Request a quote</a></div>`
  },
  {
    id: "Q19",
    keywords: ["full digital setup", "complete digital solution", "end to end", "startup digital setup", "new business"],
    answer: `<div style="margin-bottom: 10px;">✨ <b>Full Digital Setup for New Businesses</b></div>
<div>Yes! DreamMore is a <b>single-partner solution</b> for your entire digital foundation — brand identity, website, mobile app, social media presence, and ongoing marketing all under one roof.</div>
<div style="margin-top: 8px;"><b>Advantages:</b></div>
<div>• Brand consistency guaranteed</div>
<div>• No communication overhead between agencies</div>
<div>• Lower cost than hiring multiple vendors</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/contact" target="_blank" style="color: #f47822; text-decoration: underline;">Contact us for end-to-end transformation</a></div>`
  },

  // SECTION 3: ACADEMY COURSES & ENROLLMENT (Q20-Q34)
  {
    id: "Q20",
    keywords: ["what is dreammore skills academy", "tell me about the academy", "training center", "dreammore courses ethiopia"],
    answer: `<div style="margin-bottom: 10px;">🎓 <b>DreamMore Skills Academy</b></div>
<div>The education arm of the DreamMore Digital Ecosystem — a professional training institute teaching <b>16+ in-demand digital skills</b> through real-world, hands-on projects led by active industry practitioners.</div>
<div style="margin-top: 8px;"><b>Academy achievements:</b></div>
<div>• 150+ professionals trained</div>
<div>• 98% job placement rate</div>
<div>• 2,000+ students in the community</div>
<div>• 100% certification rate</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">Explore the Academy</a></div>`
  },
  {
    id: "Q21",
    keywords: ["what courses does the academy offer", "list of dreammore courses", "what can i learn", "what skills"],
    answer: `<div style="margin-bottom: 10px;">📚 <b>DreamMore Academy Courses (16+ Tracks)</b></div>
<div><b>🎨 Creative Track (Beginner-Friendly):</b></div>
<div>• Graphics Designing (Photoshop, Illustrator, InDesign)</div>
<div>• Professional Video Editing (Premiere Pro, CapCut)</div>
<div>• Digital Marketing & SEO</div>
<div>• Cinematography & Content Creation</div>
<div style="margin-top: 8px;"><b>⚡ Advanced Technology Track:</b></div>
<div>• Full Stack Web Development</div>
<div>• UI/UX Design (Figma)</div>
<div>• AI for Business</div>
<div>• Cybersecurity</div>
<div>• Programming (Python, JavaScript, Java, C++)</div>
<div>• And many more...</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">View all courses & enroll</a></div>`
  },
  {
    id: "Q22",
    keywords: ["graphics designing course", "what will i learn in graphics", "photoshop course", "illustrator training"],
    answer: `<div style="margin-bottom: 10px;">🎨 <b>Graphics Designing Course — ETB 6,000</b></div>
<div><b>In Photoshop, you'll learn:</b></div>
<div>• Social media post design</div>
<div>• Print designs (flyers, posters, brochures)</div>
<div>• Photo editing, color correction, background removal</div>
<div style="margin-top: 8px;"><b>In Illustrator, you'll learn:</b></div>
<div>• Logo design and brand identity</div>
<div>• Professional illustrations</div>
<div>• Scalable graphics for print and digital</div>
<div style="margin-top: 8px;">🎯 Perfect for beginners! Upon completion, you'll have a portfolio of real client-grade projects.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy/graphics-designing" target="_blank" style="color: #f47822; text-decoration: underline;">Enroll in Graphics Design</a></div>`
  },
  {
    id: "Q23",
    keywords: ["video editing course", "premiere pro training", "capcut course", "film editing"],
    answer: `<div style="margin-bottom: 10px;">🎬 <b>Professional Video Editing Course — ETB 6,000</b></div>
<div>Master Adobe Premiere Pro and CapCut for professional video production.</div>
<div style="margin-top: 8px;"><b>Core skills:</b></div>
<div>• Cinematic timeline cutting</div>
<div>• Advanced audio mixing and sound design</div>
<div>• Motion tracking and visual effects</div>
<div>• Lumetri color grading</div>
<div>• Multi-camera editing</div>
<div style="margin-top: 8px;">Learn to optimize for TikTok, YouTube Shorts, and Instagram Reels.</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy/video-editing" target="_blank" style="color: #f47822; text-decoration: underline;">Enroll in Video Editing</a></div>`
  },
  {
    id: "Q24",
    keywords: ["digital marketing course", "seo training", "google ads course", "social media marketing"],
    answer: `<div style="margin-bottom: 10px;">📈 <b>Digital Marketing & SEO Course — ETB 6,000</b></div>
<div><b>SEO modules:</b> Technical SEO, keyword research, on-page optimization, schema markup, local SEO</div>
<div style="margin-top: 8px;"><b>Marketing modules:</b> Google Ads, content strategy, conversion tracking, analytics, email marketing</div>
<div style="margin-top: 8px;">Learn localized Ethiopian marketplace strategies for Telegram, TikTok, Facebook, and Instagram.</div>
<div style="margin-top: 8px;">Includes live project work on real business campaigns!</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy/digital-marketing" target="_blank" style="color: #f47822; text-decoration: underline;">Enroll in Digital Marketing</a></div>`
  },
  {
    id: "Q25",
    keywords: ["cinematography course", "content creation", "camera operation", "video production"],
    answer: `<div style="margin-bottom: 10px;">🎥 <b>Cinematography & Content Creation — ETB 6,000</b></div>
<div><b>What you'll learn:</b></div>
<div>• Manual camera operation (aperture, shutter speed, ISO)</div>
<div>• Lens selection and focal depth</div>
<div>• Three-point lighting techniques</div>
<div>• Professional framing and composition</div>
<div>• On-field audio recording</div>
<div style="margin-top: 8px;">Pairs perfectly with Video Editing course — handle the entire content production pipeline!</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy/cinematography" target="_blank" style="color: #f47822; text-decoration: underline;">Enroll in Cinematography</a></div>`
  },
  {
    id: "Q26",
    keywords: ["full stack development", "web development training", "react course", "coding bootcamp"],
    answer: `<div style="margin-bottom: 10px;">💻 <b>Full Stack Development — ETB 8,000 (4 months)</b></div>
<div><b>Front-end:</b> HTML5, CSS3, JavaScript, React.js</div>
<div><b>Back-end:</b> Node.js, RESTful APIs</div>
<div><b>Databases:</b> PostgreSQL, MongoDB</div>
<div><b>Also:</b> Authentication, cloud deployment, Git version control</div>
<div style="margin-top: 8px;">Build real, deployable applications — not just exercises. Graduate with a portfolio of functioning apps!</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy/courses" target="_blank" style="color: #f47822; text-decoration: underline;">Enroll in Full Stack Development</a></div>`
  },
  {
    id: "Q27",
    keywords: ["course fee", "how much is the course", "academy fees", "registration fee", "how do i pay", "etb 6000"],
    answer: `<div style="margin-bottom: 10px;">💰 <b>Course Fee & Payment</b></div>
<div>Standard tuition: <b>ETB 6,000 per course</b> (Web & Mobile Dev: ETB 8,000)</div>
<div style="margin-top: 8px;"><b>Payment methods:</b></div>
<div>• CBE Bank Transfer — Account: 1000765205852</div>
<div>• Telebirr — Number: 0993132122</div>
<div style="margin-top: 8px;"><b>Installment plans available</b> — contact admissions team</div>
<div style="margin-top: 8px;">After payment, upload your receipt to activate LMS access at dreammore.et/dashboard</div>
<div style="margin-top: 10px;">📞 For payment help: +251 993 132 122</div>`
  },
  {
    id: "Q28",
    keywords: ["how to enroll", "registration steps", "how to sign up", "enrollment steps", "how to join"],
    answer: `<div style="margin-bottom: 10px;">📝 <b>5-Step Enrollment Process</b></div>
<div><b>Step 1:</b> Visit the application form for your chosen course</div>
<div><b>Step 2:</b> Pay ETB 6,000 (or 8,000) via CBE or Telebirr</div>
<div><b>Step 3:</b> Upload your payment receipt/screenshot</div>
<div><b>Step 4:</b> Admin verifies your payment</div>
<div><b>Step 5:</b> Get LMS access at dreammore.et/dashboard</div>
<div style="margin-top: 8px;">The entire process can be completed in one session!</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822; text-decoration: underline;">Start your application now</a></div>`
  },
  {
    id: "Q29",
    keywords: ["i paid but cant access", "receipt uploaded but no access", "account not activated", "verification time", "lms access problem"],
    answer: `<div style="margin-bottom: 10px;">⏱️ <b>Payment Verification Status</b></div>
<div>Your receipt is in the manual verification queue — this ensures platform security.</div>
<div style="margin-top: 8px;">The review is typically completed very quickly. Once confirmed, your student profile will be marked as <b>Approved</b> and full access unlocked.</div>
<div style="margin-top: 8px;"><b>Need priority activation?</b> Contact admissions:</div>
<div>📞 Call: +251 993 132 122</div>
<div>📱 Telegram: @dreammoredigitals</div>
<div>📧 Email: support@dreammoredigitals.com</div>
<div style="margin-top: 8px;">⚠️ Ensure your receipt shows the full amount and date clearly.</div>`
  },
  {
    id: "Q30",
    keywords: ["where is the student dashboard", "where do i watch my lessons", "student portal", "lms dashboard"],
    answer: `<div style="margin-bottom: 10px;">🎓 <b>Student Learning Dashboard</b></div>
<div>Your DreamMore LMS dashboard is at: <a href="https://dreammore.et/dashboard" target="_blank" style="color: #f47822;">dreammore.et/dashboard</a></div>
<div style="margin-top: 8px;"><b>Inside you'll find:</b></div>
<div>• Course video lessons by module</div>
<div>• Downloadable project files</div>
<div>• Assignment submission portals</div>
<div>• Student community forum</div>
<div>• Progress tracking and certificate status</div>
<div style="margin-top: 8px;">Forgot credentials? Contact support@dreammoredigitals.com</div>`
  },
  {
    id: "Q31",
    keywords: ["do graduates receive certificates", "dreammore certification", "is the certificate recognized", "certificate"],
    answer: `<div style="margin-bottom: 10px;">🎓 <b>Certification Information</b></div>
<div>Yes! Every student who successfully completes a DreamMore Academy course receives an official DreamMore completion certificate — a recognized credential in Ethiopia's digital industry.</div>
<div style="margin-top: 8px;">Certificates are digital and can be shared on LinkedIn, included in CVs, and presented to employers.</div>
<div style="margin-top: 8px;">Beyond the certificate, graduates leave with a <b>portfolio of real projects</b> — often more valuable than the credential itself!</div>
<div style="margin-top: 8px;">🏆 Top graduates are considered for recruitment into DreamMore Agency project teams.</div>`
  },
  {
    id: "Q32",
    keywords: ["who are the instructors", "who teaches", "dreammore instructors background", "trainer qualifications"],
    answer: `<div style="margin-bottom: 10px;">👨‍🏫 <b>Academy Instructors</b></div>
<div>All DreamMore Academy instructors are <b>active practitioners</b> — the same senior developers, designers, and marketers who build real products for DreamMore Agency clients every day.</div>
<div style="margin-top: 8px;"><b>This means:</b></div>
<div>• No academics teaching outdated material</div>
<div>• Curriculum updated as new tools emerge</div>
<div>• Students learn what's actually used in industry</div>
<div style="margin-top: 8px;">Academy coordinator and co-founder Abay Kasa oversees all curriculum quality.</div>`
  },
  {
    id: "Q33",
    keywords: ["can a complete beginner join", "do i need experience", "suitable for beginners", "no coding experience"],
    answer: `<div style="margin-bottom: 10px;">🌟 <b>Beginner-Friendly Academy</b></div>
<div>Absolutely! Most courses — particularly the Creative tracks (Graphics, Video Editing, Cinematography, Digital Marketing) — are designed for <b>complete beginners with zero prior experience</b>.</div>
<div style="margin-top: 8px;">The Academy's philosophy: anyone with commitment and access to the right guidance can build professional digital skills. No formal educational background required.</div>
<div style="margin-top: 8px;">For Advanced Tech tracks (Full Stack, AI, Cybersecurity), foundational knowledge is helpful but early modules build that foundation.</div>
<div style="margin-top: 8px;">📞 Not sure where to start? Call +251 993 132 122 — they'll guide you!</div>`
  },
  {
    id: "Q34",
    keywords: ["are courses offered online or in person", "online learning", "remote learning", "in-person training", "study from home"],
    answer: `<div style="margin-bottom: 10px;">💻 <b>Online & In-Person Learning Options</b></div>
<div>DreamMore Academy offers both:</div>
<div>• <b>In-person training</b> at our Bahir Dar location</div>
<div>• <b>Online learning</b> via LMS at <a href="https://dreammore.et/dashboard" target="_blank" style="color: #f47822;">dreammore.et/dashboard</a></div>
<div style="margin-top: 8px;">In-person provides hands-on equipment access (cameras, studios, workstations).</div>
<div>Online gives flexibility to study anywhere with video lessons and instructor support.</div>`
  },

  // SECTION 4: CASE STUDIES & METRICS (Q35-Q39)
  {
    id: "Q35",
    keywords: ["what results has dreammore delivered", "track record", "proof of results", "client success stories", "performance"],
    answer: `<div style="margin-bottom: 10px;">📊 <b>DreamMore's Verified Performance Metrics</b></div>
<div>💰 ETB 2.4 Million+ revenue generated</div>
<div>🚀 30+ major digital systems deployed</div>
<div>🤝 50+ corporate and SME clients served</div>
<div>⭐ 4.9/5 stars (98% client satisfaction)</div>
<div>💹 3x average ROI uplift for agency clients</div>
<div>🎓 150+ professionals trained</div>
<div>🏆 98% job placement rate</div>
<div style="margin-top: 8px;">These are not claims — they reflect real transactions and client feedback across 5+ years.</div>`
  },
  {
    id: "Q36",
    keywords: ["afilas general hospital", "hospital case study", "healthcare client", "medical digital marketing"],
    answer: `<div style="margin-bottom: 10px;">🏥 <b>Case Study: Afilas General Hospital</b></div>
<div><b>The Problem:</b> Low public digital awareness and trust gap — patients weren't finding them online.</div>
<div style="margin-top: 8px;"><b>The Solution:</b> 6-month digital marketing and educational video production strategy with localized SEO.</div>
<div style="margin-top: 8px;"><b>The Result:</b> Significant increase in patient intake, strong clinical market authority, and measurable community trust.</div>
<div style="margin-top: 8px;">Demonstrates DreamMore's ability to drive real business outcomes, not just build websites.</div>`
  },
  {
    id: "Q37",
    keywords: ["baltina", "baltina premium production hub", "food producer marketing", "product marketing"],
    answer: `<div style="margin-bottom: 10px;">🌾 <b>Case Study: Baltina Premium Production Hub</b></div>
<div><b>The Problem:</b> Limited to traditional local distribution, couldn't capture bulk orders from outside their area.</div>
<div style="margin-top: 8px;"><b>The Solution:</b> Cinematic social media marketing showcasing premium processing, heritage, and remote ordering.</div>
<div style="margin-top: 8px;"><b>The Result:</b> Massive surge in high-volume bulk orders, connecting regional producer to metropolitan buyer base.</div>`
  },
  {
    id: "Q38",
    keywords: ["lathe workshop", "ato zenebe", "industrial marketing", "b2b digital marketing", "manufacturing"],
    answer: `<div style="margin-bottom: 10px;">🔧 <b>Case Study: Ato Zenebe's Lathe Workshop</b></div>
<div><b>The Problem:</b> Severe digital invisibility — missing high-value corporate contracts.</div>
<div style="margin-top: 8px;"><b>The Solution:</b> Technical video portfolios and local map optimization for industrial B2B audience.</div>
<div style="margin-top: 8px;"><b>The Result:</b> Steady pipeline of high-value corporate clients — transformed word-of-mouth to digital lead generation.</div>`
  },
  {
    id: "Q39",
    keywords: ["live projects", "portfolio", "what apps has dreammore built", "real projects", "flagship products"],
    answer: `<div style="margin-bottom: 10px;">🚀 <b>DreamMore's Flagship Software Projects</b></div>
<div>🏥 <b>EthioHealth Platform (100% complete)</b> — Clinical workflow management for healthcare</div>
<div>🚨 <b>SafeCity AI (85% complete)</b> — Real-time spatial safety mapping with AI</div>
<div>🌾 <b>AgroConnect App (68% complete)</b> — Agricultural supply chain bridge</div>
<div style="margin-top: 8px;">These are production systems used by real organizations — not demos!</div>
<div>Plus 30+ projects for clients including Hella Coffee, BankDash, Addis Brand Co., and Urban Bites.</div>`
  },

  // SECTION 5: LEADERSHIP (Q40-Q42)
  {
    id: "Q40",
    keywords: ["who founded dreammore", "dreammore founders", "who is the ceo", "leadership team"],
    answer: `<div style="margin-bottom: 10px;">👥 <b>DreamMore's Founding Leadership Team</b></div>
<div>👨‍💼 <b>Abebe Eyayu</b> — CEO & Co-founder (Founders Live Africa winner)</div>
<div>📚 <b>Abay Kasa</b> — Academics Coordinator & Co-founder</div>
<div>📈 <b>Betelhem Zaradawit</b> — Digital Marketing Lead & Co-founder</div>
<div>🎬 <b>Abel Tilahun</b> — Production Director</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/team" target="_blank" style="color: #f47822; text-decoration: underline;">Meet the full team</a></div>`
  },
  {
    id: "Q41",
    keywords: ["who is abebe eyayu", "tell me about the ceo", "dreammore ceo background"],
    answer: `<div style="margin-bottom: 10px;">👨‍💼 <b>Abebe Eyayu — CEO & Co-founder of DreamMore</b></div>
<div>Abebe is the strategic architect of DreamMore's growth — directing global partnerships, investment relationships, and cross-border expansion.</div>
<div style="margin-top: 8px;">He gained international recognition at the <b>Founders Live Africa Regional Finals</b>, pitching DreamMore's unique digital ecosystem model to global venture networks.</div>
<div style="margin-top: 8px;">Under his leadership, DreamMore has grown from a youth startup to an organization with 50+ clients, ETB 2.4M+ revenue, and 150+ trained professionals.</div>`
  },
  {
    id: "Q42",
    keywords: ["can i join the dreammore team", "jobs at dreammore", "career opportunities", "how to work at dreammore"],
    answer: `<div style="margin-bottom: 10px;">💼 <b>Join the DreamMore Team</b></div>
<div>Yes! Two pathways:</div>
<div>1️⃣ Direct application for open professional roles</div>
<div>2️⃣ Academy Graduate Pathway — top performers join Agency teams</div>
<div style="margin-top: 8px;">DreamMore values initiative, practical skill, and mission alignment over formal credentials.</div>
<div style="margin-top: 8px;">Send your profile/portfolio to: support@dreammoredigitals.com or Telegram @dreammoredigitals</div>
<div style="margin-top: 10px;">👉 <a href="https://www.dreammoredigitals.com/careers" target="_blank" style="color: #f47822; text-decoration: underline;">View open positions</a></div>`
  },

  // SECTION 6: CONTACT & SUPPORT (Q43-Q45)
  {
    id: "Q43",
    keywords: ["how can i contact dreammore", "dreammore contact information", "phone number", "email address", "how to reach"],
    answer: `<div style="margin-bottom: 10px;">📞 <b>Contact DreamMore — All Channels</b></div>
<div>📧 Email: <a href="mailto:support@dreammoredigitals.com" style="color: #f47822;">support@dreammoredigitals.com</a></div>
<div>📞 Phone/WhatsApp: <a href="tel:+251993132122" style="color: #f47822;">+251 993 132 122</a></div>
<div>📱 Telegram: @dreammoredigitals</div>
<div>📷 Instagram: @dreammorecompany</div>
<div>💼 LinkedIn: linkedin.com/company/dreammore21</div>
<div>🎵 TikTok: @dreammorecompany</div>
<div style="margin-top: 8px;">👉 <a href="https://www.dreammoredigitals.com/contact" target="_blank" style="color: #f47822; text-decoration: underline;">Contact form & office location</a></div>`
  },
  {
    id: "Q44",
    keywords: ["what is dreammore response time", "how fast does dreammore respond", "when will i get a reply", "response time"],
    answer: `<div style="margin-bottom: 10px;">⏱️ <b>DreamMore Response Times</b></div>
<div>📧 Email & Form: Within 24 hours on business days</div>
<div>📞 Urgent (Call/Telegram): Within minutes during business hours</div>
<div style="margin-top: 8px;"><b>For Academy Students:</b> Need dashboard access urgently? Call +251 993 132 122 for priority activation</div>
<div><b>For Enterprise Clients:</b> Same-day consultations available</div>
<div style="margin-top: 8px;">⏰ Business Hours: Monday-Friday, 9:00 AM - 6:00 PM (East Africa Time)</div>`
  },
  {
    id: "Q45",
    keywords: ["question not answered", "my question isn't here", "specific question", "talk to a human", "custom inquiry"],
    answer: `<div style="margin-bottom: 10px;">❓ <b>Need a Specific Answer?</b></div>
<div>That's an excellent question! While my knowledge base covers most topics, some questions require a definitive answer from our team directly.</div>
<div style="margin-top: 10px; padding: 10px; background: rgba(244, 120, 34, 0.1); border-radius: 8px;">
<div>📧 Email: <a href="mailto:support@dreammoredigitals.com" style="color: #f47822;">support@dreammoredigitals.com</a></div>
<div>📞 Phone/WhatsApp: <a href="tel:+251993132122" style="color: #f47822;">+251 993 132 122</a></div>
<div>📱 Telegram: @dreammoredigitals</div>
</div>
<div style="margin-top: 8px;">⏱️ We'll respond within hours with a precise, accurate answer!</div>`
  },

  // SECTION 7: EDGE CASES & COMPARISONS (Q46-Q53)
  {
    id: "Q46",
    keywords: ["how is dreammore different", "why choose dreammore", "dreammore vs other agencies", "competitive advantage"],
    answer: `<div style="margin-bottom: 10px;">⚡ <b>What Makes DreamMore Different?</b></div>
<div><b>1. Ecosystem Model:</b> Only Ethiopian agency with a professional training academy feeding into agency talent</div>
<div><b>2. Service Breadth:</b> 8+ services under one roof — no need for multiple vendors</div>
<div><b>3. Proven Track Record:</b> 4.9 stars, 3x ROI, 50+ clients</div>
<div><b>4. International Recognition:</b> Founders Live Africa finalist</div>
<div style="margin-top: 8px;">DreamMore delivers institutional quality, not freelancer quality — with accountability structures that protect your investment.</div>`
  },
  {
    id: "Q47",
    keywords: ["is dreammore expensive", "dreammore vs freelancers", "cost comparison", "cheaper freelancer"],
    answer: `<div style="margin-bottom: 10px;">💰 <b>DreamMore vs Freelancers — Value Comparison</b></div>
<div><b>Freelancer:</b> Individual skills</div>
<div><b>DreamMore:</b> Cross-functional team + structured process + post-launch support + accountability</div>
<div style="margin-top: 8px;"><b>Freelancer is better for:</b> Small, well-defined tasks (single logo, one landing page)</div>
<div><b>DreamMore delivers better ROI for:</b> Multi-system projects, brand consistency, business-critical functionality — evidenced by 3x average ROI uplift</div>
<div>Flexible engagement: project-based, retainer, or phased delivery.</div>`
  },
  {
    id: "Q48",
    keywords: ["can dreammore work with international clients", "remote work outside ethiopia", "cross-border", "clients abroad"],
    answer: `<div style="margin-bottom: 10px;">🌍 <b>International Remote Collaboration</b></div>
<div>Yes, fully. DreamMore is equipped for international remote collaboration with workflows for async communication, distributed team management, and time-zone bridging via Slack, Jira, Figma, and Teams.</div>
<div style="margin-top: 8px;">International clients receive the same project management quality as local clients — with deep understanding of both African market dynamics and global standards.</div>
<div style="margin-top: 8px;">📧 Contact: support@dreammoredigitals.com | 💬 WhatsApp: +251 993 132 122</div>`
  },
  {
    id: "Q49",
    keywords: ["not satisfied", "unhappy with result", "quality guarantee", "refund policy", "what if project fails"],
    answer: `<div style="margin-bottom: 10px;">✅ <b>Quality Assurance & Client Protection</b></div>
<div>DreamMore's process prevents dissatisfaction through client approval checkpoints: design sign-off, iterative demos, and rigorous QA before launch.</div>
<div style="margin-top: 8px;">The 4.9-star rating from 50+ clients proves this process works.</div>
<div style="margin-top: 8px;">In the rare case that deliverables don't meet specifications, DreamMore engages directly to resolve the gap — commitment doesn't end at delivery.</div>
<div style="margin-top: 8px;">For concerns: support@dreammoredigitals.com or +251 993 132 122</div>`
  },
  {
    id: "Q50",
    keywords: ["installment payment", "payment plan", "pay monthly", "affordable payment", "part payment"],
    answer: `<div style="margin-bottom: 10px;">💳 <b>Installment Payment Plans</b></div>
<div>Yes! While standard fee is ETB 6,000 (or 8,000), DreamMore offers <b>pre-arranged installment payment plans</b>.</div>
<div style="margin-top: 8px;"><b>To set up installments, contact admissions:</b></div>
<div>📞 +251 993 132 122</div>
<div>📱 Telegram: @dreammoredigitals</div>
<div>📧 support@dreammoredigitals.com</div>
<div style="margin-top: 8px;">The coordinator will confirm your schedule. Then follow the standard 5-step enrollment process.</div>`
  },
  {
    id: "Q51",
    keywords: ["corporate training", "group enrollment", "company training", "train my team", "organizations"],
    answer: `<div style="margin-bottom: 10px;">🏢 <b>Corporate & Group Training Packages</b></div>
<div>Yes! DreamMore offers group packages for organizations wanting to upskill employees, NGO staff, government offices, or school cohorts.</div>
<div style="margin-top: 8px;"><b>Benefits:</b> Dedicated scheduling, custom content alignment, group rate pricing</div>
<div style="margin-top: 8px;">Corporate training is one of DreamMore's growth areas — organizations return for successive cohorts.</div>
<div style="margin-top: 8px;">📧 support@dreammoredigitals.com | 📞 +251 993 132 122</div>`
  },
  {
    id: "Q52",
    keywords: ["social media platforms", "dreammore social media", "telegram", "instagram", "tiktok", "linkedin"],
    answer: `<div style="margin-bottom: 10px;">📱 <b>DreamMore Social Media Presence</b></div>
<div>📢 Telegram: @dreammoredigitals (primary support channel)</div>
<div>📷 Instagram: @dreammorecompany (portfolio showcases)</div>
<div>🎵 TikTok: @dreammorecompany (educational content)</div>
<div>💼 LinkedIn: linkedin.com/company/dreammore21 (B2B content)</div>
<div>🌐 Website: <a href="https://www.dreammoredigitals.com" target="_blank" style="color: #f47822;">dreammoredigitals.com</a> (newsletter signup)</div>`
  },
  {
    id: "Q53",
    keywords: ["amharic language support", "amharic", "አማርኛ"],
    answer: `<div style="margin-bottom: 10px;">🇪🇹 <b>Amharic Language Support</b></div>
<div>አዎ! DreamMore በአማርኛ ድጋፍ ይሰጣል!</div>
<div style="margin-top: 8px;">Yes! DreamMore provides support in Amharic language for:</div>
<div>• Course inquiries and enrollment</div>
<div>• Technical support</div>
<div>• Project discussions</div>
<div>• Payment verification</div>
<div style="margin-top: 8px;">ማንኛውም ጥያቄ ካለዎት በአማርኛ ለመገናኘት ይደውሉልን: <b>+251 993 132 122</b></div>`
  },

  // SECTION 8: QUICK REFERENCE (Q54-Q56)
  {
    id: "Q54",
    keywords: ["official dreammore website links", "all dreammore links", "website urls", "sitemap", "important pages"],
    answer: `<div style="margin-bottom: 10px;">🔗 <b>Official DreamMore Website Links</b></div>
<div>🏠 Home: <a href="https://www.dreammoredigitals.com" target="_blank" style="color: #f47822;">dreammoredigitals.com</a></div>
<div>🚀 Agency: <a href="https://www.dreammoredigitals.com/agency" target="_blank" style="color: #f47822;">/agency</a></div>
<div>🎓 Academy: <a href="https://www.dreammoredigitals.com/academy" target="_blank" style="color: #f47822;">/academy</a></div>
<div>📖 About: <a href="https://www.dreammoredigitals.com/about" target="_blank" style="color: #f47822;">/about</a></div>
<div>👥 Team: <a href="https://www.dreammoredigitals.com/team" target="_blank" style="color: #f47822;">/team</a></div>
<div>📞 Contact: <a href="https://www.dreammoredigitals.com/contact" target="_blank" style="color: #f47822;">/contact</a></div>
<div>💼 Careers: <a href="https://www.dreammoredigitals.com/careers" target="_blank" style="color: #f47822;">/careers</a></div>
<div>📚 Student Dashboard: <a href="https://dreammore.et/dashboard" target="_blank" style="color: #f47822;">dreammore.et/dashboard</a></div>`
  },
  {
    id: "Q55",
    keywords: ["all contact details", "dreammore phone number", "dreammore email", "all contact channels"],
    answer: `<div style="margin-bottom: 10px;">📋 <b>Complete DreamMore Contact Details</b></div>
<div>📧 Email: <a href="mailto:support@dreammoredigitals.com" style="color: #f47822;">support@dreammoredigitals.com</a></div>
<div>📞 Phone/WhatsApp: <a href="tel:+251993132122" style="color: #f47822;">+251 993 132 122</a></div>
<div>📱 Telegram: @dreammoredigitals</div>
<div>📷 Instagram: @dreammorecompany</div>
<div>🎵 TikTok: @dreammorecompany</div>
<div>💼 LinkedIn: linkedin.com/company/dreammore21</div>
<div>📍 Office: Bahir Dar, Ethiopia (HQ)</div>
<div>🌐 Website: <a href="https://www.dreammoredigitals.com" target="_blank" style="color: #f47822;">dreammoredigitals.com</a></div>`
  },
  {
    id: "Q56",
    keywords: ["key performance numbers", "dreammore statistics", "metrics", "performance data", "how many clients"],
    answer: `<div style="margin-bottom: 10px;">📊 <b>DreamMore Key Performance Numbers</b></div>
<div>⏱️ 5+ Years of operational excellence</div>
<div>💰 ETB 2.4 Million+ revenue generated</div>
<div>🚀 30+ major digital systems deployed</div>
<div>🤝 50+ corporate and SME clients served</div>
<div>⭐ 4.9/5 stars (98% client satisfaction)</div>
<div>💹 3x average ROI uplift for agency clients</div>
<div>🎓 150+ professionals trained</div>
<div>👥 2,000+ students in community</div>
<div>🏆 98% job placement rate</div>
<div>📚 16+ active courses</div>
<div>✅ 100% certification rate</div>`
  }
];

// ============================================
// API ROUTE HANDLERS
// ============================================

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

    const chatSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save user message to database (if table exists)
    try {
      await query(
        `INSERT INTO chatbot_conversations (session_id, user_id, message, is_bot, created_at) 
         VALUES (?, ?, ?, false, NOW())`,
        [chatSessionId, userId || null, message.trim()]
      );
    } catch (dbError) {
      console.log("Note: chatbot_conversations table may not exist");
    }

    // Generate intelligent response
    const response = generateIntelligentResponse(message.trim());

    // Save bot response
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

// ============================================
// INTELLIGENT RESPONSE GENERATOR
// ============================================

function generateIntelligentResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  // Try to find exact keyword match
  for (const qa of qaDatabase) {
    for (const keyword of qa.keywords) {
      if (lowerMsg.includes(keyword)) {
        return qa.answer;
      }
    }
  }
  
  // Check for question patterns with partial matching
  if (lowerMsg.includes('?') && (lowerMsg.includes('what') || lowerMsg.includes('how') || lowerMsg.includes('why'))) {
    for (const qa of qaDatabase) {
      for (const keyword of qa.keywords) {
        const keywordParts = keyword.split(' ');
        const matchCount = keywordParts.filter(part => lowerMsg.includes(part)).length;
        if (matchCount >= 2) {
          return qa.answer;
        }
      }
    }
  }
  
  // Check for course-specific queries
  if (lowerMsg.includes('course') && (lowerMsg.includes('offer') || lowerMsg.includes('have') || lowerMsg.includes('teach'))) {
    const courseQA = qaDatabase.find(q => q.id === "Q21");
    if (courseQA) return courseQA.answer;
  }
  
  // Check for price queries
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
    const priceQA = qaDatabase.find(q => q.id === "Q27");
    if (priceQA) return priceQA.answer;
  }
  
  // Check for enrollment queries
  if (lowerMsg.includes('enroll') || lowerMsg.includes('apply') || lowerMsg.includes('register')) {
    const enrollQA = qaDatabase.find(q => q.id === "Q28");
    if (enrollQA) return enrollQA.answer;
  }
  
  // Standard fallback
  return `<div style="margin-bottom: 10px;">❓ <b>That's an exceptionally precise and important question!</b></div>
<div style="line-height: 1.6;">While DreamMore's knowledge base covers a wide range of topics, I want to make sure you receive a completely definitive answer for this one.</div>
<div style="margin-top: 10px; padding: 10px; background: rgba(244, 120, 34, 0.1); border-radius: 8px;">
<div>📧 Email: <a href="mailto:support@dreammoredigitals.com" style="color: #f47822;">support@dreammoredigitals.com</a></div>
<div>📞 Phone/WhatsApp: <a href="tel:+251993132122" style="color: #f47822;">+251 993 132 122</a></div>
<div>📱 Telegram: @dreammoredigitals</div>
</div>
<div style="margin-top: 8px;">⏱️ We will verify and respond within hours!</div>`;
}