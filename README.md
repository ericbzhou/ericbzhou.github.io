# Academic Personal Website Template

A modular, JSON-driven academic personal website built with vanilla HTML, CSS, and JavaScript. Designed for GitHub Pages hosting with zero build step.

**Fork this repo and customize by editing only `assets/config.js` and `data/*.json` files.** Everything else renders automatically.

---

## Quick Start

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Preview Locally

Using Python's built-in HTTP server:

```bash
# Python 3
cd website
python -m http.server 8000

# Or Python 2
python -m SimpleHTTPServer 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

> **Note:** Because the site loads JSON data files via `fetch()`, you **must** use a local server (not opening `index.html` directly). The Python HTTP server above works out of the box.

### 3. Customize

Edit these files to adapt the site:

| File | Purpose |
|------|---------|
| `assets/config.js` | Colors, fonts, navigation items, page toggles, SEO metadata, analytics |
| `data/profile.json` | Name, position, affiliation, social links, photos, bio |
| `data/news.json` | Newsfeed / timeline entries |
| `data/research.json` | Publications, working papers, conference presentations, invited talks |
| `data/research_statement.json` | Research statement paragraphs |
| `data/teaching.json` | Courses, semester, role, evaluation rating |
| `data/awards.json` | Awards and honors |
| `headshots/*.jpg` / `headshots/*.png` | Profile photos (dual-photo rotation) |
| `imgs/*.jpg` | Photo gallery images |
| `assets/styles.css` | Optional deep styling (CSS variables propagate from config.js) |

### 4. Deploy to GitHub Pages

1. Go to **Settings > Pages** in your GitHub repo
2. Set **Source** to `main` branch and `/ (root)`
3. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO`

---

## Site Structure

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Profile, bio, photo gallery (auto-scrolling), newsfeed |
| Research | `research.html` | Research statement, publications, working drafts, awards |
| Teaching | `teaching.html` | Teaching philosophy, interests, courses with evaluation scores |
| CV | `cv.html` | Embedded HTML CV (generated from blueprints), print-to-PDF |

---

## Architecture

```
.
├── index.html              # Home page (minimal shell)
├── research.html           # Research page (minimal shell)
├── teaching.html           # Teaching page (minimal shell)
├── cv.html                 # CV page (minimal shell)
├── robots.txt              # Search engine crawling rules
├── sitemap.xml             # Sitemap for SEO
├── assets/
│   ├── styles.css          # CSS custom properties + responsive rules
│   ├── config.js           # SITE_CONFIG — all customization parameters
│   ├── renderer.js         # Core rendering engine (DOM API only)
│   ├── academicons/        # Academicons font library
│   ├── favicon_io/         # Favicon files
│   ├── headshots/          # Profile photos (dual-photo rotation)
│   ├── imgs/               # Gallery images
│   ├── cv/                 # CV generator + templates
│   │   ├── generate_cv.py  # Python script: blueprints + YAML → cv.html
│   │   ├── cv_style.yaml   # CV visual configuration (fonts, colors, spacing)
│   │   ├── cv_template.html # Jinja2 template for CV rendering
│   │   ├── cv.html         # Generated CV output
│   │   └── blueprints/     # One JSON file per CV section
│   └── pages/
│       ├── home.js         # Home page renderer
│       ├── research.js     # Research page renderer
│       ├── teaching.js     # Teaching page renderer
│       └── cv.js           # CV page renderer (iframe embed + print button)
└── data/
    ├── profile.json        # Name, position, affiliation, links, bio
    ├── news.json           # Newsfeed entries (auto-sorted newest-first)
    ├── research.json       # Publications + working drafts (with presentations)
    ├── research_statement.json # Research statement paragraphs
    ├── teaching.json       # Courses with semester, role, evaluation
    └── awards.json         # Awards with month/year
```

### How It Works

1. Each HTML page is a **minimal shell** — no inline data or content-generating scripts
2. `config.js` defines global parameters (colors, fonts, nav items, toggles, analytics)
3. `renderer.js` fetches JSON data files and generates DOM elements (DOM API only, no `innerHTML` for user content)
4. `pages/*.js` contains page-specific renderers
5. Data flows: **JSON file → renderer.js + config.js → DOM elements**

### Key Features

| Feature | Description |
|---------|-------------|
| **JSON-driven content** | All page content lives in `data/*.json` — no inline data in HTML |
| **Dark mode** | User-toggle with localStorage persistence; smooth transitions |
| **Dual-photo rotation** | Two profile photos crossfade on a 10-second loop |
| **Auto-scrolling gallery** | Horizontal gallery with infinite scroll animation (pauses on hover) |
| **Collapsible sections** | Native `<details>`/`<summary>` accordions for abstracts, presentations, testimonials |
| **Author tagging** | `[FA]` first author, `[CF]` co-first, `[A]` alphabetical → renders as symbol superscripts |
| **Presentation notes** | `[1]` accepted but did not attend, `[2]` invited speaker |
| **Schema.org structured data** | JSON-LD Person schema on every page for search engines |
| **SEO** | Open Graph meta tags, canonical URLs, robots.txt, sitemap.xml |
| **Responsive design** | 4 breakpoints (1200px, 992px, 768px, 480px) with hamburger nav on mobile |
| **Touch-friendly** | 44x44px minimum tap targets on all interactive elements |
| **Print styles** | Clean print output for CV (hide nav/footer) |
| **Analytics ready** | Plausible integration toggle (disabled by default) |

---

## Customization Surface

To adapt this template, you only need to edit:

1. **`assets/config.js`** — colors, fonts, navigation, page toggles, SEO, analytics
2. **`data/*.json`** — all page content (profile, news, research, teaching, awards)
3. **`headshots/` and `imgs/`** — your photos
4. **`assets/styles.css`** — optional deep styling (CSS variables propagate from config.js)
5. **`assets/cv/blueprints/*.json`** — CV data (for the CV page)
6. **`assets/cv/cv_style.yaml`** — CV visual configuration

Everything else (rendering logic, responsive behavior, collapsible sections, dark mode) is shared and automatic.

---

## Configurable Parameters

### `assets/config.js`

```javascript
window.SITE_CONFIG = {
  // Typography
  fontFamily: '"Segoe UI", sans-serif',

  // Colors (matching cv_style.yaml)
  colors: {
    bg: '#ffffff',
    text: '#1a1a1a',
    muted: '#333333',
    heading: '#c81a1a',       // section headings, accent
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
    photoPrimary: '2.png',
    photoSecondary: '1.jpg',
    photoPath: 'assets/headshots/',
    showGallery: true
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
    // Teaching philosophy (inline in config for now)
    philosophy: ['Paragraph 1...', 'Paragraph 2...'],
    interests: ['AI & Society', 'Ethics of AI']
  },

  // CV page
  cv: {
    cvHtmlPath: 'cv/cv.html',
    showPrintLink: true
  },

  // SEO
  seo: {
    title: 'Your Name',
    description: 'Your research description here.',
    ogImage: 'assets/headshots/1.jpg'
  },

  // Analytics (disabled by default)
  analytics: {
    provider: 'plausible',
    enabled: false,
    domain: 'yourdomain.com'
  }
};
```

### CSS Custom Properties

All colors and sizing use CSS variables on `:root` in `styles.css`. Changing the palette means editing one block:

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-muted: #333333;
  --color-heading: #c81a1a;
  --color-border: #1a1a1a;
  --color-link: #003778;
  --font-primary: "Segoe UI", sans-serif;
  --font-size-header: 1.5rem;
  --font-size-body: 1rem;
  --max-width: 960px;
  --photo-size: 180px;
  --border-radius: 6px;
}
```

---

## Data Models

### Profile (`data/profile.json`)

```json
{
  "name": "Your Name",
  "content": [
    "PhD, Your Field",
    "Your University"
  ],
  "email": "you@university.edu",
  "links": {
    "google_scholar": "https://scholar.google.com/...",
    "orcid": "https://orcid.org/...",
    "linkedin": "https://linkedin.com/in/..."
  },
  "bio": [
    "First paragraph of your bio with [b]bold[/b] and [i]italic[/i] support.",
    "Second paragraph."
  ],
  "photoPrimary": "1.jpg",
  "photoSecondary": "2.png"
}
```

### News Item (`data/news.json`)

```json
{
  "date": "2025-09-01",
  "description": "Your news with [b]bold[/b], [i]italic[/i], and <a>links</a> support",
  "sort_order": 1
}
```

Entries are auto-sorted newest-first by `sort_order`.

### Publication / Working Draft (`data/research.json`)

```json
{
  "category": "publications",
  "title": "Paper Title",
  "authors": "[FA]Your Name, Coauthor, Advisor",
  "status": "Published in [i]Journal Name[/i] (Month Year)",
  "notes": "[b]Workshop award note[/b]",
  "sort_order": 1,
  "invited_talks": [
    { "month": "Nov.", "year": "2025", "venue": "University Name" }
  ],
  "conference_workshop_presentations": [
    { "month": "Mar.", "year": "2025", "conference": "Conference Name", "location": "City, Country", "notes": "[2]" }
  ]
}
```

Categories: `publications`, `working_drafts`, `works_in_progress`, `presentation_only`

### Course (`data/teaching.json`)

```json
{
  "semester": "Spring",
  "year": "2025",
  "course": "CS101: Introduction to CS",
  "role": "Lead Instructor",
  "rating": "4.5/5 (40 out of 45 respondents)",
  "notes": ""
}
```

### Awards (`data/awards.json`)

```json
{
  "month": "Dec.",
  "year": "2025",
  "title": "Award Name"
}
```

---

## CV Generation

The CV page embeds a generated HTML CV via iframe, with a print-to-PDF button.

### Setup

```bash
# Install dependencies
pip install jinja2 pyyaml

# Generate cv.html from blueprints
cd assets/cv
python generate_cv.py
```

The script reads all JSON files from `blueprints/` + `cv_style.yaml`, renders them via Jinja2, and writes `cv.html`. It also auto-opens the result in your browser.

### CV Blueprint Files

Located in `assets/cv/blueprints/`:

| File | Content |
|------|---------|
| `personal.json` | Name, contact info, notes |
| `education.json` | Degrees, institutions, advisor |
| `research.json` | Publications, working drafts (same format as web `data/research.json`) |
| `awards.json` | Awards and honors |
| `teaching_experience.json` | Teaching roles |
| `industry_experience.json` | Professional experience |
| `professional_service.json` | Editor/reviewer roles |
| `skills.json` | Technical skills |
| `references.json` | Reference contacts |
| `research_interests.json` | Research focus areas |
| `coursework.json` | Relevant coursework |

### Author Tagging

Use special tags in author lists to render superscript annotations:

- `[FA]` — First author (renders as `*`)
- `[CF]` — Co-first author (renders as `†`)
- `[A]` — Authors listed in alphabetical order (renders as `‡`)

### CV Styling

Edit `assets/cv/cv_style.yaml` to change:

- Page format (letter, A4) and margins
- Font family and sizes
- Colors (RGB values)
- Section heading styles
- Research entry indentation

### CV Download

Open the CV page in your browser and click **"Print CV as PDF"** (or press Ctrl+P / Cmd+P). No separate PDF file is needed.

---

## Responsive Design

The site adapts to all screen sizes with these breakpoints:

| Breakpoint | Layout |
|------------|--------|
| `>= 1200px` | Desktop wide |
| `992–1199px` | Desktop narrow |
| `768–991px` | Tablet |
| `480–767px` | Mobile |
| `< 480px` | Small mobile |

Mobile-specific behavior:
- Navigation collapses to hamburger menu (44x44px touch target)
- Profile section stacks vertically (photo above info)
- Tables become scrollable containers
- Gallery adapts to smaller tile sizes
- Collapsible sections work with touch (no hover-only interactions)

---

## External Dependencies

All loaded via CDN — no local installs required:

- **Icons:** Academicons (for Google Scholar, ORCID)
- **Favicon:** `assets/favicon_io/favicon.ico`

---

## Known Limitations & Future Enhancements

| Feature | Status |
|---------|--------|
| Site-wide search | Planned |
| Blog / updates page | Planned |
| Lightbox for photo gallery | Planned |
| Automated accessibility audit | Planned |
| Automated responsive testing | Planned |

---

## License

This project is open source. Adjust the license file to match your preferences.

---

## Credits

Built as a template based on an academic personal website overhaul project. Designed for easy forking and customization by researchers, academics, and students.
