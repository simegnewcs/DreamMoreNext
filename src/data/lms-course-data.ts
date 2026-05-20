// Full Stack Development Course - Complete Mock Data
// 3 Phases | 15 Weeks | 45+ Videos

import { CourseStructure } from '@/types/lms';

export const fullStackCourse: CourseStructure = {
  id: 'fsd-2024',
  slug: 'full-stack-development',
  title: 'Full Stack Web Development',
  description: 'Master modern web development from front-end to back-end. Learn React, Node.js, databases, deployment, and build real-world projects. This comprehensive course takes you from beginner to job-ready developer.',
  shortDescription: 'Become a full-stack developer. Learn React, Node.js, databases & build real projects.',
  image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  instructor: 'Solomon Girma',
  instructorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  totalPhases: 3,
  totalWeeks: 15,
  totalVideos: 47,
  totalDuration: '15 weeks',
  level: 'Beginner',
  price: 8000,
  currency: 'ETB',
  overallProgress: 0,
  isEnrolled: true,
  certificateEnabled: true,
  phases: [
    // ==================== PHASE 1: FOUNDATION (4 Weeks) ====================
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Foundation: HTML, CSS & JavaScript',
      description: 'Build a strong foundation in web technologies. Master the building blocks of the web and create your first interactive websites.',
      durationWeeks: 4,
      learningObjectives: [
        'Master HTML5 semantic structure',
        'Create responsive layouts with CSS3',
        'Understand JavaScript fundamentals',
        'Build interactive web pages',
        'Deploy static websites'
      ],
      isLocked: false,
      isCompleted: false,
      orderIndex: 0,
      progressPercentage: 0,
      weeks: [
        // Week 1: HTML Basics
        {
          id: 'phase-1-week-1',
          weekNumber: 1,
          title: 'HTML Structure & Basic Tags',
          description: 'Learn the foundation of web development with HTML5. Understand document structure, semantic elements, and create your first web page.',
          learningTopics: [
            'HTML5 Document Structure',
            'Semantic HTML Elements',
            'Headings & Paragraphs',
            'Links & Navigation',
            'Images & Multimedia'
          ],
          isLocked: false,
          isCompleted: false,
          orderIndex: 0,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-1-1-1',
              videoNumber: '1.1',
              title: 'Introduction to HTML5',
              description: 'Understanding the structure of web pages and HTML5 basics.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 18,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-1-1-2',
              videoNumber: '1.2',
              title: 'Document Structure & Head Section',
              description: 'Learn about DOCTYPE, head, body, and meta tags.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 22,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-1-1-3',
              videoNumber: '1.3',
              title: 'Semantic Elements & Headings',
              description: 'Using header, nav, main, section, article, and footer tags.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 25,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-1-1-1',
              title: 'HTML5 Cheat Sheet',
              description: 'Complete reference guide for all HTML5 tags and attributes.',
              pdfUrl: '/notes/html5-cheatsheet.pdf',
              fileSizeMb: 2.5,
              isDownloaded: false,
              orderIndex: 0
            },
            {
              id: 'n-1-1-2',
              title: 'Semantic HTML Guide',
              description: 'Best practices for using semantic HTML elements.',
              pdfUrl: '/notes/semantic-html-guide.pdf',
              fileSizeMb: 1.8,
              isDownloaded: false,
              orderIndex: 1
            }
          ],
          assignments: [
            {
              id: 'a-1-1-1',
              title: 'Build Your First Web Page',
              description: 'Create a personal profile page using HTML5 semantic elements.',
              assignmentType: 'assignment',
              deadline: '2024-02-07',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 0
            },
            {
              id: 'a-1-1-2',
              title: 'HTML Structure Quiz',
              description: 'Test your knowledge of HTML5 structure and elements.',
              assignmentType: 'quiz',
              isSubmitted: false,
              maxScore: 50,
              orderIndex: 1
            }
          ]
        },
        // Week 2: HTML Forms & Tables
        {
          id: 'phase-1-week-2',
          weekNumber: 2,
          title: 'Forms, Tables & Media',
          description: 'Create interactive forms, organize data with tables, and embed multimedia content.',
          learningTopics: [
            'Form Elements & Attributes',
            'Input Types & Validation',
            'Table Structure & Styling',
            'Audio & Video Elements',
            'Iframe Integration'
          ],
          isLocked: false,
          isCompleted: false,
          orderIndex: 1,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-1-2-1',
              videoNumber: '1.2.1',
              title: 'Creating Forms & Input Elements',
              description: 'Master form creation with input, select, textarea, and button elements.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 28,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-1-2-2',
              videoNumber: '1.2.2',
              title: 'HTML Tables for Data Display',
              description: 'Creating structured tables with thead, tbody, and advanced attributes.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 20,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            }
          ],
          notes: [
            {
              id: 'n-1-2-1',
              title: 'Forms & Validation Reference',
              description: 'Complete guide to HTML5 form validation attributes.',
              pdfUrl: '/notes/html-forms-reference.pdf',
              fileSizeMb: 3.2,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-1-2-1',
              title: 'Contact Form Project',
              description: 'Build a complete contact form with all input types.',
              assignmentType: 'assignment',
              deadline: '2024-02-14',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 0
            }
          ]
        },
        // Week 3: CSS Basics
        {
          id: 'phase-1-week-3',
          weekNumber: 3,
          title: 'CSS Styling Fundamentals',
          description: 'Learn to style your HTML with CSS. Master selectors, properties, colors, and typography.',
          learningTopics: [
            'CSS Selectors & Specificity',
            'Colors, Backgrounds & Borders',
            'Typography & Fonts',
            'Box Model Deep Dive',
            'CSS Units & Values'
          ],
          isLocked: false,
          isCompleted: false,
          orderIndex: 2,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-1-3-1',
              videoNumber: '1.3.1',
              title: 'CSS Selectors & Specificity',
              description: 'Understanding element, class, ID, and advanced CSS selectors.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 24,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-1-3-2',
              videoNumber: '1.3.2',
              title: 'Colors, Fonts & Typography',
              description: 'Master color systems, font properties, and text styling.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 26,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-1-3-3',
              videoNumber: '1.3.3',
              title: 'CSS Box Model Explained',
              description: 'Deep dive into content, padding, border, and margin.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-1-3-1',
              title: 'CSS Selectors Reference',
              description: 'Complete list of CSS selectors with examples.',
              pdfUrl: '/notes/css-selectors-reference.pdf',
              fileSizeMb: 2.1,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-1-3-1',
              title: 'Style Your Profile Page',
              description: 'Apply CSS styling to your Week 1 profile page.',
              assignmentType: 'assignment',
              deadline: '2024-02-21',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 0
            }
          ]
        },
        // Week 4: CSS Layout
        {
          id: 'phase-1-week-4',
          weekNumber: 4,
          title: 'CSS Layout & Responsive Design',
          description: 'Master modern CSS layout techniques including Flexbox, Grid, and responsive design principles.',
          learningTopics: [
            'Flexbox Layout System',
            'CSS Grid Layout',
            'Media Queries',
            'Responsive Images',
            'Mobile-First Design'
          ],
          isLocked: false,
          isCompleted: false,
          orderIndex: 3,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-1-4-1',
              videoNumber: '1.4.1',
              title: 'Flexbox Complete Guide',
              description: 'Master flex container and flex item properties.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 32,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-1-4-2',
              videoNumber: '1.4.2',
              title: 'CSS Grid Layout System',
              description: 'Creating complex layouts with CSS Grid.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 35,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-1-4-3',
              videoNumber: '1.4.3',
              title: 'Responsive Design & Media Queries',
              description: 'Making websites work on all devices.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 28,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-1-4-1',
              title: 'Flexbox Cheat Sheet',
              description: 'Quick reference for all Flexbox properties.',
              pdfUrl: '/notes/flexbox-cheatsheet.pdf',
              fileSizeMb: 1.5,
              isDownloaded: false,
              orderIndex: 0
            },
            {
              id: 'n-1-4-2',
              title: 'CSS Grid Template Areas',
              description: 'Visual guide to grid-template-areas.',
              pdfUrl: '/notes/css-grid-areas.pdf',
              fileSizeMb: 2.3,
              isDownloaded: false,
              orderIndex: 1
            }
          ],
          assignments: [
            {
              id: 'a-1-4-1',
              title: 'Phase 1 Final Project',
              description: 'Build a responsive landing page using Flexbox and Grid.',
              assignmentType: 'assignment',
              deadline: '2024-02-28',
              isSubmitted: false,
              maxScore: 150,
              orderIndex: 0
            },
            {
              id: 'a-1-4-2',
              title: 'Phase 1 Assessment',
              description: 'Comprehensive quiz covering HTML and CSS.',
              assignmentType: 'quiz',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 1
            }
          ]
        }
      ]
    },

    // ==================== PHASE 2: JAVASCRIPT (6 Weeks) ====================
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'JavaScript Programming Mastery',
      description: 'Go deep into JavaScript programming. Learn variables, functions, objects, DOM manipulation, async programming, and modern ES6+ features.',
      durationWeeks: 6,
      learningObjectives: [
        'Master JavaScript fundamentals',
        'Understand DOM manipulation',
        'Work with APIs and async code',
        'Learn object-oriented programming',
        'Build interactive web applications'
      ],
      isLocked: true,
      isCompleted: false,
      orderIndex: 1,
      progressPercentage: 0,
      weeks: [
        // Week 1: JS Basics
        {
          id: 'phase-2-week-1',
          weekNumber: 1,
          title: 'JavaScript Fundamentals',
          description: 'Start your programming journey with JavaScript basics. Variables, data types, operators, and control flow.',
          learningTopics: [
            'Variables & Data Types',
            'Operators & Expressions',
            'Conditional Statements',
            'Loops & Iteration',
            'Basic Debugging'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 0,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-2-1-1',
              videoNumber: '2.1.1',
              title: 'Introduction to JavaScript',
              description: 'Setting up and your first JavaScript code.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 20,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-2-1-2',
              videoNumber: '2.1.2',
              title: 'Variables, Data Types & Operators',
              description: 'Understanding let, const, and JavaScript types.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 28,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-2-1-3',
              videoNumber: '2.1.3',
              title: 'Control Flow: Conditionals & Loops',
              description: 'If statements, switch, for, while, and iteration.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 32,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-2-1-1',
              title: 'JavaScript Basics Guide',
              description: 'Comprehensive guide to JS fundamentals.',
              pdfUrl: '/notes/js-basics-guide.pdf',
              fileSizeMb: 4.5,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-2-1-1',
              title: 'Number Guessing Game',
              description: 'Build a console-based number guessing game.',
              assignmentType: 'assignment',
              deadline: '2024-03-07',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 0
            }
          ]
        },
        // Week 2: Functions & Scope
        {
          id: 'phase-2-week-2',
          weekNumber: 2,
          title: 'Functions & Scope',
          description: 'Master function declarations, expressions, arrow functions, and understand scope and closures.',
          learningTopics: [
            'Function Declarations & Expressions',
            'Arrow Functions',
            'Parameters & Arguments',
            'Scope & Closures',
            'Higher-Order Functions'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 1,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-2-2-1',
              videoNumber: '2.2.1',
              title: 'Function Basics & Declarations',
              description: 'Creating and calling functions in JavaScript.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 26,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-2-2-2',
              videoNumber: '2.2.2',
              title: 'Scope & Closures Explained',
              description: 'Understanding lexical scope and closure concepts.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            }
          ],
          notes: [
            {
              id: 'n-2-2-1',
              title: 'Functions Deep Dive',
              description: 'Advanced function concepts and patterns.',
              pdfUrl: '/notes/js-functions-deep-dive.pdf',
              fileSizeMb: 3.8,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-2-2-1',
              title: 'Calculator Functions',
              description: 'Build a calculator using different function types.',
              assignmentType: 'assignment',
              deadline: '2024-03-14',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 0
            }
          ]
        },
        // Week 3: Arrays & Objects
        {
          id: 'phase-2-week-3',
          weekNumber: 3,
          title: 'Arrays & Objects',
          description: 'Work with complex data structures. Master array methods, object manipulation, and JSON.',
          learningTopics: [
            'Array Creation & Methods',
            'Map, Filter, Reduce',
            'Object Properties & Methods',
            'Destructuring',
            'Spread & Rest Operators'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 2,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-2-3-1',
              videoNumber: '2.3.1',
              title: 'JavaScript Arrays Deep Dive',
              description: 'All array methods and operations.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 35,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-2-3-2',
              videoNumber: '2.3.2',
              title: 'Objects & Object Methods',
              description: 'Working with objects, prototypes, and methods.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 32,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-2-3-3',
              videoNumber: '2.3.3',
              title: 'Destructuring & Spread Operator',
              description: 'Modern syntax for working with data.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 24,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-2-3-1',
              title: 'Array Methods Cheat Sheet',
              description: 'Quick reference for map, filter, reduce, and more.',
              pdfUrl: '/notes/array-methods-cheatsheet.pdf',
              fileSizeMb: 2.2,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-2-3-1',
              title: 'Todo List Application',
              description: 'Build a functional todo list with arrays and objects.',
              assignmentType: 'assignment',
              deadline: '2024-03-21',
              isSubmitted: false,
              maxScore: 150,
              orderIndex: 0
            }
          ]
        },
        // Week 4: DOM Manipulation
        {
          id: 'phase-2-week-4',
          weekNumber: 4,
          title: 'DOM Manipulation & Events',
          description: 'Make your websites interactive. Learn to select elements, modify content, handle events, and create dynamic experiences.',
          learningTopics: [
            'Selecting DOM Elements',
            'Modifying Content & Styles',
            'Event Listeners',
            'Event Delegation',
            'Form Handling'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 3,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-2-4-1',
              videoNumber: '2.4.1',
              title: 'DOM Selection Methods',
              description: 'querySelector, getElementById, and more.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 22,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-2-4-2',
              videoNumber: '2.4.2',
              title: 'Modifying the DOM',
              description: 'Changing content, styles, and attributes dynamically.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 28,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-2-4-3',
              videoNumber: '2.4.3',
              title: 'Event Handling',
              description: 'Click, submit, keypress, and custom events.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-2-4-1',
              title: 'DOM Manipulation Guide',
              description: 'Complete DOM API reference.',
              pdfUrl: '/notes/dom-manipulation-guide.pdf',
              fileSizeMb: 3.5,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-2-4-1',
              title: 'Interactive Quiz App',
              description: 'Build a quiz with DOM manipulation and event handling.',
              assignmentType: 'assignment',
              deadline: '2024-03-28',
              isSubmitted: false,
              maxScore: 150,
              orderIndex: 0
            }
          ]
        },
        // Week 5: Async JavaScript
        {
          id: 'phase-2-week-5',
          weekNumber: 5,
          title: 'Asynchronous JavaScript',
          description: 'Master async programming with callbacks, promises, async/await, and API integration.',
          learningTopics: [
            'Callbacks & Callback Hell',
            'Promises & .then()',
            'Async/Await Syntax',
            'Fetch API & HTTP Requests',
            'Error Handling'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 4,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-2-5-1',
              videoNumber: '2.5.1',
              title: 'Understanding Asynchronous JS',
              description: 'Event loop, callbacks, and the call stack.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 26,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-2-5-2',
              videoNumber: '2.5.2',
              title: 'Promises & Async/Await',
              description: 'Modern async patterns in JavaScript.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 34,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-2-5-3',
              videoNumber: '2.5.3',
              title: 'Fetch API & Working with APIs',
              description: 'Making HTTP requests and handling responses.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-2-5-1',
              title: 'Async JavaScript Patterns',
              description: 'Best practices for async code.',
              pdfUrl: '/notes/async-js-patterns.pdf',
              fileSizeMb: 2.8,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-2-5-1',
              title: 'Weather App Project',
              description: 'Build a weather app using fetch API.',
              assignmentType: 'assignment',
              deadline: '2024-04-04',
              isSubmitted: false,
              maxScore: 150,
              orderIndex: 0
            }
          ]
        },
        // Week 6: ES6+ & Project
        {
          id: 'phase-2-week-6',
          weekNumber: 6,
          title: 'Modern JavaScript & Phase Project',
          description: 'Learn ES6+ features and build a complete JavaScript project to consolidate your learning.',
          learningTopics: [
            'ES6+ Features Overview',
            'Modules & Imports/Exports',
            'Classes & Inheritance',
            'Error Handling Patterns',
            'Project Architecture'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 5,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-2-6-1',
              videoNumber: '2.6.1',
              title: 'ES6+ Modern Features',
              description: 'Template literals, optional chaining, nullish coalescing.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 28,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-2-6-2',
              videoNumber: '2.6.2',
              title: 'JavaScript Classes & Modules',
              description: 'OOP in JavaScript and module system.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 32,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            }
          ],
          notes: [
            {
              id: 'n-2-6-1',
              title: 'ES6+ Cheat Sheet',
              description: 'Modern JavaScript syntax reference.',
              pdfUrl: '/notes/es6-cheatsheet.pdf',
              fileSizeMb: 2.5,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-2-6-1',
              title: 'E-Commerce Cart System',
              description: 'Build a complete shopping cart with JS.',
              assignmentType: 'assignment',
              deadline: '2024-04-11',
              isSubmitted: false,
              maxScore: 200,
              orderIndex: 0
            },
            {
              id: 'a-2-6-2',
              title: 'Phase 2 Final Assessment',
              description: 'Comprehensive JavaScript assessment.',
              assignmentType: 'quiz',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 1
            }
          ]
        }
      ]
    },

    // ==================== PHASE 3: REACT & BACKEND (5 Weeks) ====================
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'React Framework & Backend Integration',
      description: 'Master React for frontend development and learn Node.js/Express for backend. Build full-stack applications.',
      durationWeeks: 5,
      learningObjectives: [
        'Build SPAs with React',
        'Manage state with hooks',
        'Create REST APIs with Node.js',
        'Connect frontend to backend',
        'Deploy full-stack applications'
      ],
      isLocked: true,
      isCompleted: false,
      orderIndex: 2,
      progressPercentage: 0,
      weeks: [
        // Week 1: React Fundamentals
        {
          id: 'phase-3-week-1',
          weekNumber: 1,
          title: 'React Fundamentals',
          description: 'Introduction to React, components, JSX, and props. Build your first React application.',
          learningTopics: [
            'React & Component Architecture',
            'JSX Syntax',
            'Props & State',
            'Event Handling in React',
            'Conditional Rendering'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 0,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-3-1-1',
              videoNumber: '3.1.1',
              title: 'React Introduction & Setup',
              description: 'Getting started with Create React App and Vite.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 24,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-3-1-2',
              videoNumber: '3.1.2',
              title: 'Components & JSX',
              description: 'Understanding React components and JSX syntax.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-3-1-3',
              videoNumber: '3.1.3',
              title: 'Props & State Basics',
              description: 'Passing data and managing component state.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 32,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-3-1-1',
              title: 'React Quick Start',
              description: 'Essential React concepts for beginners.',
              pdfUrl: '/notes/react-quick-start.pdf',
              fileSizeMb: 3.5,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-3-1-1',
              title: 'Component Library',
              description: 'Build reusable React components.',
              assignmentType: 'assignment',
              deadline: '2024-04-18',
              isSubmitted: false,
              maxScore: 150,
              orderIndex: 0
            }
          ]
        },
        // Week 2: React Hooks
        {
          id: 'phase-3-week-2',
          weekNumber: 2,
          title: 'React Hooks & State Management',
          description: 'Master useState, useEffect, and custom hooks. Learn modern state management patterns.',
          learningTopics: [
            'useState & useEffect Deep Dive',
            'useContext for Global State',
            'Custom Hooks',
            'useReducer for Complex State',
            'Performance Optimization'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 1,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-3-2-1',
              videoNumber: '3.2.1',
              title: 'useState & useEffect Mastery',
              description: 'All about the most important hooks.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 35,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-3-2-2',
              videoNumber: '3.2.2',
              title: 'Custom Hooks & Context',
              description: 'Creating reusable logic and global state.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 32,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            }
          ],
          notes: [
            {
              id: 'n-3-2-1',
              title: 'React Hooks Reference',
              description: 'Complete hooks API reference.',
              pdfUrl: '/notes/react-hooks-reference.pdf',
              fileSizeMb: 4.2,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-3-2-1',
              title: 'Todo App with Hooks',
              description: 'Build a complete todo app using hooks.',
              assignmentType: 'assignment',
              deadline: '2024-04-25',
              isSubmitted: false,
              maxScore: 150,
              orderIndex: 0
            }
          ]
        },
        // Week 3: Node.js Backend
        {
          id: 'phase-3-week-3',
          weekNumber: 3,
          title: 'Node.js & Express Backend',
          description: 'Build server-side applications with Node.js and Express. Create RESTful APIs.',
          learningTopics: [
            'Node.js Fundamentals',
            'Express.js Setup & Routing',
            'Middleware & Error Handling',
            'REST API Design',
            'Database Connection'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 2,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-3-3-1',
              videoNumber: '3.3.1',
              title: 'Node.js & Express Introduction',
              description: 'Setting up your first Node.js server.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 26,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-3-3-2',
              videoNumber: '3.3.2',
              title: 'Building REST APIs',
              description: 'Creating CRUD endpoints with Express.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 34,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            },
            {
              id: 'v-3-3-3',
              videoNumber: '3.3.3',
              title: 'Database Integration with MySQL',
              description: 'Connecting Node.js to MySQL database.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 2
            }
          ],
          notes: [
            {
              id: 'n-3-3-1',
              title: 'Express.js Guide',
              description: 'Complete Express framework reference.',
              pdfUrl: '/notes/express-guide.pdf',
              fileSizeMb: 4.8,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-3-3-1',
              title: 'REST API Project',
              description: 'Build a complete REST API for a blog.',
              assignmentType: 'assignment',
              deadline: '2024-05-02',
              isSubmitted: false,
              maxScore: 200,
              orderIndex: 0
            }
          ]
        },
        // Week 4: Full Stack Integration
        {
          id: 'phase-3-week-4',
          weekNumber: 4,
          title: 'Frontend-Backend Integration',
          description: 'Connect React frontend to Node.js backend. Learn authentication and full-stack patterns.',
          learningTopics: [
            'API Integration Patterns',
            'Authentication (JWT)',
            'Protected Routes',
            'Error Handling',
            'Deployment Basics'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 3,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-3-4-1',
              videoNumber: '3.4.1',
              title: 'Connecting React to Backend',
              description: 'Fetching data from your API in React.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 28,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-3-4-2',
              videoNumber: '3.4.2',
              title: 'Authentication with JWT',
              description: 'Implementing login and protected routes.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 36,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            }
          ],
          notes: [
            {
              id: 'n-3-4-1',
              title: 'Full Stack Architecture',
              description: 'Best practices for full-stack apps.',
              pdfUrl: '/notes/full-stack-architecture.pdf',
              fileSizeMb: 3.5,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-3-4-1',
              title: 'Authentication System',
              description: 'Build login/register with JWT.',
              assignmentType: 'assignment',
              deadline: '2024-05-09',
              isSubmitted: false,
              maxScore: 200,
              orderIndex: 0
            }
          ]
        },
        // Week 5: Final Project
        {
          id: 'phase-3-week-5',
          weekNumber: 5,
          title: 'Final Project & Deployment',
          description: 'Build a complete full-stack application and deploy it to production.',
          learningTopics: [
            'Project Planning & Architecture',
            'Advanced State Management',
            'Testing Basics',
            'Production Deployment',
            'Portfolio Presentation'
          ],
          isLocked: true,
          isCompleted: false,
          orderIndex: 4,
          progressPercentage: 0,
          videos: [
            {
              id: 'v-3-5-1',
              videoNumber: '3.5.1',
              title: 'Project Architecture & Planning',
              description: 'Planning your full-stack application.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 22,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 0
            },
            {
              id: 'v-3-5-2',
              videoNumber: '3.5.2',
              title: 'Deployment to Production',
              description: 'Deploying React and Node.js apps.',
              thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
              videoUrl: 'https://youtu.be/7NaeDBTRY1k?si=7zaymHpIxsWgm7x-',
              durationMinutes: 30,
              isCompleted: false,
              progressSeconds: 0,
              orderIndex: 1
            }
          ],
          notes: [
            {
              id: 'n-3-5-1',
              title: 'Deployment Checklist',
              description: 'Preparing your app for production.',
              pdfUrl: '/notes/deployment-checklist.pdf',
              fileSizeMb: 2.1,
              isDownloaded: false,
              orderIndex: 0
            }
          ],
          assignments: [
            {
              id: 'a-3-5-1',
              title: 'Full-Stack Capstone Project',
              description: 'Build and deploy a complete application.',
              assignmentType: 'assignment',
              deadline: '2024-05-16',
              isSubmitted: false,
              maxScore: 300,
              orderIndex: 0
            },
            {
              id: 'a-3-5-2',
              title: 'Course Final Assessment',
              description: 'Comprehensive full-stack assessment.',
              assignmentType: 'quiz',
              isSubmitted: false,
              maxScore: 100,
              orderIndex: 1
            }
          ]
        }
      ]
    }
  ]
};

// Helper function to get course by slug
export const getCourseBySlug = (slug: string): CourseStructure | undefined => {
  if (slug === fullStackCourse.slug) {
    return fullStackCourse;
  }
  return undefined;
};

// Helper function to get phase by ID
export const getPhaseById = (course: CourseStructure, phaseId: string): typeof course.phases[0] | undefined => {
  return course.phases.find(p => p.id === phaseId);
};

// Helper function to get week by ID
export const getWeekById = (phase: typeof fullStackCourse.phases[0], weekId: string): typeof phase.weeks[0] | undefined => {
  return phase.weeks.find(w => w.id === weekId);
};
