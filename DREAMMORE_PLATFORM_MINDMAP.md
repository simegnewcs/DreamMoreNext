# DreamMore Platform - Complete Mind Map

## 🏗️ **PROJECT OVERVIEW**
**DreamMore Platform** - Africa's premier digital innovation ecosystem combining a digital agency and tech academy.

### **Core Business Model**
- **Digital Agency**: Builds world-class digital products for businesses
- **Tech Academy**: Trains the next generation of African creators
- **Target Market**: Ethiopian and African businesses/students
- **Tech Stack**: Next.js 16, React 19, TypeScript, MySQL, TailwindCSS

---

## 📁 **PROJECT ARCHITECTURE**

### **Root Structure**
```
dreammore-platform/
├── src/                    # Main source code
├── public/                 # Static assets
├── scripts/                # Build/deployment scripts
├── .env.local             # Environment variables
├── package.json           # Dependencies & scripts
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── sql_courses_insert.sql # Database seed data
```

### **Source Code Structure (`src/`)**
```
src/
├── app/                   # Next.js App Router
│   ├── api/              # API routes
│   ├── academy/          # Academy pages
│   ├── admin/            # Admin dashboard
│   ├── agency/           # Agency pages
│   ├── lms/              # Learning Management System
│   ├── instructor/       # Instructor portal
│   └── (auth)/           # Authentication pages
├── components/           # Reusable UI components
│   ├── academy/          # Academy-specific components
│   ├── admin/            # Admin components
│   ├── agency/           # Agency components
│   ├── auth/             # Authentication components
│   ├── home/             # Homepage components
│   ├── layout/           # Layout components
│   ├── lms/              # LMS components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── db.ts            # Database connection
│   ├── auth.ts          # Authentication utilities
│   ├── api.ts           # API helpers
│   └── schema.sql       # Database schema
├── context/             # React contexts
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

---

## 🛠️ **TECHNOLOGY STACK**

### **Frontend**
- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: TailwindCSS v4
- **Components**: Radix UI primitives
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Rich Text**: TinyMCE

### **Backend**
- **Runtime**: Node.js (Next.js API routes)
- **Database**: MySQL with mysql2
- **Authentication**: NextAuth.js v5 (Google OAuth)
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: bcryptjs, JWT tokens

### **Development**
- **Language**: TypeScript 5
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js built-in bundler

---

## 🌐 **APPLICATION FLOW**

### **User Journey Architecture**

#### **1. Public Landing (Homepage)**
```
/ (HomePage)
├── HeroSection           # Split agency/academy hero
├── AgencyPillar          # Agency showcase
├── AcademyPillar         # Academy showcase  
├── WhyUs                # Value proposition
├── TeamPreview          # Team members
└── Testimonials         # Client testimonials
```

#### **2. Agency Services Flow**
```
/agency
├── Service showcase
├── Portfolio projects
├── Client testimonials
└── Contact/Quote request
```

#### **3. Academy Flow**
```
/academy
├── Course catalog
├── Individual course pages
├── Application process
├── Payment integration
└── Student dashboard (LMS)
```

#### **4. User Authentication**
```
/login or /register
├── Google OAuth (NextAuth)
├── Manual registration
├── Role-based routing:
│   ├── student → /lms
│   ├── instructor → /instructor  
│   └── admin → /admin
```

---

## 🗄️ **DATABASE ARCHITECTURE**

### **Core Tables**
```sql
users                 # User accounts & roles
├── id, email, password
├── role (student/admin/instructor)
├── profile data
└── authentication

courses               # Academy courses
├── id, slug, title
├── pricing, duration, level
├── instructor info
└── course metadata

applications          # Student applications
├── user_id, course_id
├── application data
├── payment info
└── approval status

modules              # Course content
├── course_id, title
├── lessons_count
└── order

technologies        # Course tech stack
outcomes           # Learning outcomes  
requirements       # Prerequisites
faqs              # Course FAQs
portfolio         # Agency projects
testimonials      # Client reviews
blogs             # Content marketing
```

### **Database Connection**
- **Pool**: MySQL connection pool (10 connections)
- **Queries**: Custom query wrapper with error handling
- **Transactions**: Support for complex operations
- **Environment**: Configurable via .env.local

---

## 🔐 **AUTHENTICATION & SECURITY**

### **Authentication Flow**
```
NextAuth.js Configuration
├── Google Provider (OAuth)
├── Custom JWT generation
├── Database user sync
└── Role-based sessions

Manual Login System
├── Email/password validation
├── bcrypt password hashing
├── JWT token generation
└── Secure cookie handling
```

### **Security Features**
- **Password Hashing**: bcryptjs
- **JWT Tokens**: Custom implementation
- **Session Management**: NextAuth + custom tokens
- **API Protection**: Role-based middleware
- **Environment Variables**: Sensitive config protection

---

## 🎨 **UI/UX DESIGN SYSTEM**

### **Design Tokens**
```css
/* Brand Colors */
--primary-orange: #f47822
--dark-bg: #0a0a0f
--light-bg: #f8f9fa
--text-primary: #ffffff
--text-secondary: #15142a

/* Typography */
--font-geist-sans: Primary font
--font-geist-mono: Code font

/* Spacing & Layout */
--container-max: 7xl
--section-padding: Responsive
```

### **Component Architecture**
```
Layout Components
├── ConditionalLayout    # Route-based layout
├── Navbar              # Main navigation
├── Footer              # Site footer
└── ChatbotWidget       # AI assistant

UI Components
├── Radix UI primitives
├── Custom styled components
├── Animation wrappers
└── Responsive utilities
```

### **Animation System**
- **Framer Motion**: Page transitions, micro-interactions
- **GSAP**: Complex animations, scroll effects
- **CSS Transitions**: Simple hover states
- **Performance**: Optimized for 60fps

---

## 📱 **PAGE ROUTES & FUNCTIONALITY**

### **Public Routes**
```
/                      # Homepage
/about                 # About page
/agency                # Agency services
/academy               # Academy courses
/team                  # Team information
/blog                  # Blog/articles
/contact               # Contact form
/login                 # User login
/register              # User registration
/apply                 # Course application
```

### **Protected Routes**
```
/lms/*                 # Student dashboard
├── /lms/dashboard     # Student home
├── /lms/courses       # Course list
├── /lms/course/[id]   # Course content
└── /lms/profile       # Student profile

/instructor/*          # Instructor portal
├── /instructor/dashboard
├── /instructor/courses
└── /instructor/students

/admin/*               # Admin dashboard
├── /admin/dashboard
├── /admin/courses     # Course management
├── /admin/applications # Application review
├── /admin/users       # User management
└── /admin/content     # Content management
```

---

## 🔌 **API ARCHITECTURE**

### **API Routes Structure**
```
/api/
├── auth/              # Authentication
│   ├── login         # User login
│   ├── register      # User registration
│   └── logout        # Session cleanup
├── courses/           # Course management
│   ├── GET /courses  # List courses
│   ├── POST /courses # Create course (admin)
│   └── GET /courses/[id] # Course details
├── applications/      # Student applications
├── admin/            # Admin operations
├── instructor/       # Instructor functions
├── lms/              # Learning management
├── upload/           # File uploads (Cloudinary)
├── portfolio/        # Agency projects
├── testimonials/     # Client reviews
└── chatbot/          # AI assistant
```

### **API Features**
- **RESTful design**: Standard HTTP methods
- **Error handling**: Consistent error responses
- **Validation**: Input validation with Zod
- **Authentication**: JWT token verification
- **CORS**: Proper cross-origin handling
- **File Upload**: Cloudinary integration

---

## 💾 **STATE MANAGEMENT**

### **Client State**
```typescript
// React Context
ThemeContext          # Dark/light mode
AuthContext          # User session (NextAuth)

// Component State
useState             # Local component state
useReducer           # Complex state logic
useEffect            # Side effects & data fetching

// Custom Hooks
useTheme()           # Theme management
useAuth()            # Authentication state
```

### **Server State**
- **Database**: MySQL as single source of truth
- **Caching**: Next.js built-in caching
- **Session**: JWT tokens + NextAuth sessions
- **File Storage**: Cloudinary CDN

---

## 🚀 **DEPLOYMENT & INFRASTRUCTURE**

### **Development Environment**
```bash
npm run dev           # Development server (localhost:3000)
npm run build         # Production build
npm run start         # Production server
npm run lint          # Code linting
```

### **Production Considerations**
- **Environment Variables**: Secure configuration
- **Database**: MySQL server connection
- **File Upload**: Cloudinary account
- **Email**: SMTP configuration (Nodemailer)
- **OAuth**: Google Console setup

### **Performance Optimizations**
- **Images**: Next.js Image optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: API response caching
- **Bundle Analysis**: Optimized dependencies

---

## 🔄 **KEY WORKFLOWS**

### **Student Enrollment Flow**
```
1. Browse Courses (/academy)
2. View Course Details
3. Submit Application (/apply)
4. Payment Processing
5. Application Review (Admin)
6. Account Activation
7. LMS Access (/lms)
```

### **Agency Project Flow**
```
1. Service Inquiry (/agency)
2. Project Consultation
3. Proposal & Quote
4. Contract Signing
5. Development Process
6. Project Delivery
7. Portfolio Showcase
```

### **Content Management Flow**
```
1. Admin Login (/admin)
2. Course Creation/Editing
3. Student Application Review
4. Content Publishing
5. User Management
6. Analytics & Reporting
```

---

## 🎯 **BUSINESS LOGIC**

### **Pricing Model**
- **Courses**: Fixed pricing in ETB (2500-4500 ETB)
- **Payment Methods**: Bank transfer, mobile money
- **Application Processing**: Manual review by admin
- **Certificates**: Issued upon course completion

### **User Roles & Permissions**
```
Student:
- View courses, apply, pay
- Access LMS after approval
- Track progress, certificates

Instructor:
- Manage assigned courses
- View student progress
- Upload course content

Admin:
- Full system access
- Course management
- User management
- Content approval
- Analytics access
```

---

## 🔧 **MAINTENANCE & SCALABILITY**

### **Code Organization**
- **Component Modularity**: Reusable UI components
- **Type Safety**: Full TypeScript coverage
- **Error Boundaries**: Graceful error handling
- **Logging**: Console error tracking

### **Database Management**
- **Schema Versioning**: SQL migration files
- **Backup Strategy**: Regular database backups
- **Performance**: Indexed queries, connection pooling

### **Future Scalability**
- **Microservices**: API can be extracted
- **CDN**: Static asset optimization
- **Load Balancing**: Horizontal scaling ready
- **Caching Layer**: Redis integration possible

---

## 📊 **ANALYTICS & MONITORING**

### **User Tracking**
- **Application Submissions**: Course interest metrics
- **User Registrations**: Growth tracking
- **Course Completion**: Success rates
- **Payment Processing**: Revenue tracking

### **System Monitoring**
- **Error Logging**: Console error capture
- **Performance**: Page load times
- **Database Health**: Connection monitoring
- **API Response Times**: Performance metrics

---

## 🌟 **UNIQUE FEATURES**

### **Dual Business Model**
- **Agency + Academy**: Synergistic business units
- **Real Projects**: Students work on actual client projects
- **Career Pipeline**: Academy graduates join agency

### **Localized for Africa**
- **Currency**: Ethiopian Birr (ETB)
- **Languages**: English/Amharic support
- **Payment Methods**: Local payment integration
- **Cultural Context**: African market focus

### **Modern Tech Stack**
- **Next.js 16**: Latest features, App Router
- **React 19**: Cutting-edge React features
- **TypeScript**: Full type safety
- **TailwindCSS v4**: Modern styling

---

## 📝 **DEVELOPMENT GUIDELINES**

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Component Structure**: Consistent patterns
- **File Naming**: Descriptive, camelCase

### **Git Workflow**
- **Branch Strategy**: Feature branches
- **Commit Messages**: Conventional commits
- **Code Reviews**: Required for merges
- **Testing**: Manual testing workflow

### **Deployment Process**
```bash
1. Code Review & Testing
2. Build Production Bundle
3. Database Migration (if needed)
4. Environment Setup
5. Deploy to Production
6. Post-deployment Testing
```

---

## 🔮 **FUTURE ROADMAP**

### **Phase 1 Enhancements**
- **Mobile App**: React Native companion
- **Video Streaming**: Course video platform
- **Live Classes**: Real-time sessions
- **Payment Gateway**: Integrated payment processing

### **Phase 2 Expansion**
- **Multi-language**: Full Amharic support
- **Advanced LMS**: Progress tracking, quizzes
- **CRM Integration**: Client management
- **Analytics Dashboard**: Business intelligence

### **Phase 3 Scaling**
- **Multi-country**: Pan-African expansion
- **Partner Programs**: Educational partnerships
- **Enterprise Solutions**: B2B training programs
- **AI Integration**: Personalized learning paths

---

## 🎯 **SUCCESS METRICS**

### **Business KPIs**
- **Student Enrollment**: Monthly new students
- **Course Completion**: Success rates
- **Agency Revenue**: Project-based income
- **Customer Satisfaction**: Testimonials & reviews

### **Technical KPIs**
- **Page Load Speed**: < 3 seconds
- **Uptime**: 99.9% availability
- **Error Rate**: < 1% API failures
- **User Engagement**: Time on platform

---

*This mind map represents the complete architecture and functioning of the DreamMore Platform as of the current codebase. The platform demonstrates modern web development practices with a focus on the African digital education and services market.*
