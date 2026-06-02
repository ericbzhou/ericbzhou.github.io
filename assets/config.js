/**
 * SITE_CONFIG — Single customization surface for the entire academic website.
 *
 * All colors, fonts, navigation items, page toggles, and feature flags are
 * defined here. Changes to this file propagate to CSS custom properties
 * (via renderer.js) and to every page renderer.
 *
 * Refer to IMPLEMENTATION_PLAN.md §T03 and MASTER_FEATURE_SPEC.md §6.6
 * for the full schema documentation.
 */

window.SITE_CONFIG = {
  // Typography
  fontFamily: '"Segoe UI", sans-serif',

  // Colors (matching cv_style.yaml from §8.8)
  colors: {
    bg: '#ffffff',
    text: '#1a1a1a',
    muted: '#333333',
    heading: '#c81a1a',
    border: '#1a1a1a',
    link: '#003778',
    // Dark mode colors
    bgDark: '#1a1a1a',
    textDark: '#e0e0e0',
    mutedDark: '#b0b0b0',
    headingDark: '#e04040',
    borderDark: '#404040',
    linkDark: '#5b9bd5'
  },

  // Navigation
  nav: {
    items: [
      { label: 'Home', href: 'index.html' },
      { label: 'Research', href: 'research.html' },
      { label: 'Teaching', href: 'teaching.html' },
      { label: 'CV', href: 'cv.html' }
    ],
    sticky: true,
    mobileBreakpoint: 768
  },

  // Profile
  profile: {
    // Support both old single-image format AND new array format
    // Old format (backwards compatible):
    photoPrimary: '2.png',
    photoSecondary: '1.jpg',
    // New array format (preferred):
    photos: ['2.png', '1.jpg'],  // array of photo filenames
    photoPath: 'assets/headshots/',
    // Gallery images - array of filenames (empty = no gallery)
    galleryImages: ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
    // showGallery defaults to true; set to false to hide gallery section
  },

  // Research page
  research: {
    dataFile: 'data/research.json',
    categories: ['publications', 'working_drafts'],
    collapsibleSections: true,
    showFootnotes: true,
    showAbstract: true,
    showMediaLinks: true,
    showPresentations: true
  },

  // Teaching page
  teaching: {
    dataFile: 'data/teaching.json',
    showTestimonials: true,
    philosophy: [
      'Recognizing the transformative impacts and inherent risks of AI, I formulate my teaching philosophy around equipping society to leverage AI responsibly and revealing its potential to augment human capabilities while accounting for its unintended consequences. Many institutions have already incorporated AI in their operations, from internal LLMs to RAG or agentic systems. Thus, there is a pressing need to train future generations of students how to navigate new workplace and societal norms.',
      'I am committed to cultivating critical thinking and adaptability in the generative AI era, preparing students to have the technical skills and ethical awareness to be competitive in today\'s job market. This includes complementing course concepts with tailored tutorials on advanced prompting techniques, understanding hallucinations and privacy concerns, and emphasizing that learning outcomes are driven by self while AI can only serve as a tool to provide efficient, personalized learning experiences.'
    ],
    interests: [
      'AI, Society, and the Human Experience',
      'The Ethics of AI and Technology',
      'Foundations of Generative AI',
      'Applied Deep Learning'
    ]
  },

  // CV page
  cv: {
    cvHtmlPath: 'cv/cv.html',
    showPrintLink: true
  },

  // SEO
  seo: {
    title: 'Eric B. Zhou',
    description: 'PhD Candidate in Information Systems at Boston University Questrom School of Business',
    ogImage: 'assets/headshots/2.png'
  },

  // Analytics (disabled by default, enable when ready)
  analytics: {
    provider: 'plausible',
    enabled: false,
    domain: 'ericbzhou.github.io'
  }
};
