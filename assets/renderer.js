/**
 * renderer.js — Core rendering engine for Eric B. Zhou's academic website.
 * Reads SITE_CONFIG + JSON data → generates DOM elements using DOM APIs only.
 * NO innerHTML += allowed.
 */

(function() {
  'use strict';

  // ─── Safe DOM Element Factory ───────────────────────────────────
  function createElement(tag, attrs, children) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    children = children || [];
    var key;
    for (key in attrs) {
      if (attrs.hasOwnProperty(key)) {
        if (key === 'className') {
          el.className = attrs[key];
        } else if (key === 'textContent') {
          el.textContent = attrs[key];
        } else if (key === 'innerHTML') {
          el.insertAdjacentHTML('beforeend', attrs[key]);
        } else if (key === 'dataset') {
          var dk;
          for (dk in attrs[key]) {
            if (attrs[key].hasOwnProperty(dk)) {
              el.dataset[dk] = attrs[key][dk];
            }
          }
        } else if (key === 'style' && typeof attrs[key] === 'object') {
          var sk;
          for (sk in attrs[key]) {
            if (attrs[key].hasOwnProperty(sk)) {
              el.style[sk] = attrs[key][sk];
            }
          }
        } else if (key === 'event') {
          var ev;
          for (ev in attrs[key]) {
            if (attrs[key].hasOwnProperty(ev)) {
              el.addEventListener(ev, attrs[key][ev]);
            }
          }
        } else {
          el.setAttribute(key, attrs[key]);
        }
      }
    }
    var i;
    for (i = 0; i < children.length; i++) {
      if (typeof children[i] === 'string') {
        el.appendChild(document.createTextNode(children[i]));
      } else if (children[i] instanceof Node) {
        el.appendChild(children[i]);
      }
    }
    return el;
  }

  // ─── Fetch JSON with error handling ─────────────────────────────
  function fetchJSON(path) {
    return fetch(path)
      .then(function(resp) {
        if (!resp.ok) throw new Error('Failed to fetch ' + path + ': ' + resp.status);
        return resp.json();
      })
      .catch(function(err) {
        console.error('renderer.js fetchJSON error:', err);
        return null;
      });
  }

  // ─── Theme / Dark Mode ──────────────────────────────────────────
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch(e) { /* localStorage may be unavailable */ }
  }

  function initTheme() {
    var saved;
    try {
      saved = localStorage.getItem('theme');
    } catch(e) { saved = null; }
    var theme = saved || 'light';
    applyTheme(theme);
    // Mark as loaded to prevent FOUC
    document.documentElement.classList.add('dark-loaded');
    return theme;
  }

  function createDarkModeToggle() {
    var btn = createElement('button', {
      className: 'theme-toggle',
      'aria-label': 'Toggle dark mode',
      event: {
        'click': function() {
          var isDark = document.documentElement.classList.contains('dark');
          applyTheme(isDark ? 'light' : 'dark');
          // Update toggle symbol to reflect new theme
          btn.textContent = isDark ? '\u263E' : '\u263C'; // moon -> sun
        }
      }
    });
    // Set initial symbol based on current theme
    btn.textContent = document.documentElement.classList.contains('dark') ? '\u263E' : '\u263C';
    return btn;
  }

  // ─── Navigation ─────────────────────────────────────────────────
  function renderNav(navConfig) {
    var nav = createElement('nav', { className: 'nav', 'aria-label': 'Main navigation' });
    var container = createElement('div', { className: 'container nav-container' });

    // Hamburger button (mobile)
    var hamburger = createElement('button', {
      className: 'hamburger menu-toggle',
      'aria-label': 'Toggle navigation menu',
      event: {
        'click': function() {
          var items = container.querySelector('.nav-items');
          if (items) items.classList.toggle('open');
        }
      }
    }, ['\u2630']); // hamburger symbol
    container.appendChild(hamburger);

    // Nav items
    var navItems = createElement('div', { className: 'nav-items' });
    var currentPath = window.location.pathname;
    var i;
    for (i = 0; i < navConfig.items.length; i++) {
      var item = navConfig.items[i];
      var isActive = false;
      if (item.href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
        isActive = true;
      } else if (item.href !== 'index.html' && currentPath.endsWith(item.href)) {
        isActive = true;
      }
      var link = createElement('a', {
        className: 'nav-item' + (isActive ? ' active' : ''),
        href: item.href,
        textContent: item.label
      });
      navItems.appendChild(link);
    }
    container.appendChild(navItems);
    nav.appendChild(container);
    return nav;
  }

  // ─── Profile Header ─────────────────────────────────────────────
  function renderProfile(profileConfig, profileData) {
    var header = createElement('div', { className: 'profile-header' });
    var container = createElement('div', { className: 'container' });

    // Resolve photos array: prefer new format, fall back to old format
    var photos;
    if (profileConfig.photos && Array.isArray(profileConfig.photos) && profileConfig.photos.length > 0) {
      photos = profileConfig.photos;
    } else {
      photos = [];
      if (profileConfig.photoPrimary) photos.push(profileConfig.photoPrimary);
      if (profileConfig.photoSecondary) photos.push(profileConfig.photoSecondary);
    }

    // Photo container — handle 0, 1, or 2+ photos
    if (photos.length > 0) {
      var photoCtn = createElement('div', {
        className: 'profile-photo-ctn' + (photos.length >= 2 ? ' has-secondary' : ' single-photo')
      });

      // Primary photo
      var photo = createElement('img', {
        className: 'profile-photo',
        src: profileConfig.photoPath + photos[0],
        alt: profileData.name + ' photo',
        width: 180,
        height: 180
      });
      photoCtn.appendChild(photo);

      // Secondary photo (for rotation animation, only when 2+ photos)
      if (photos.length >= 2) {
        var photo2 = createElement('img', {
          className: 'profile-photo profile-photo-secondary',
          src: profileConfig.photoPath + photos[1],
          alt: profileData.name + ' photo 2',
          width: 180,
          height: 180
        });
        photoCtn.appendChild(photo2);
      }

      container.appendChild(photoCtn);
    }
    // When photos.length === 0, skip the photo container entirely

    // Info section
    var info = createElement('div', { className: 'profile-info' });

    var nameLink = createElement('a', {
      className: 'profile-name',
      href: 'index.html',
      textContent: profileData.name
    });
    info.appendChild(nameLink);

    // Flexible content: each string in the "content" array renders on its own line
    var contentItems = profileData.content || [];
    var ci;
    for (ci = 0; ci < contentItems.length; ci++) {
      var p = createElement('p', {
        className: 'profile-content-line',
        innerHTML: contentItems[ci]
      });
      info.appendChild(p);
    }

    // ─── Helper: create icon for a contact link ─────────────────────
    function getLinkIcon(key) {
      if (key === 'email') {
        var svgEmail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEmail.setAttribute('class', 'profile-link-icon');
        svgEmail.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgEmail.setAttribute('viewBox', '0 0 24 24');
        svgEmail.setAttribute('width', '16');
        svgEmail.setAttribute('height', '16');
        svgEmail.setAttribute('fill', 'none');
        svgEmail.setAttribute('stroke', 'currentColor');
        svgEmail.setAttribute('stroke-width', '2');
        svgEmail.setAttribute('stroke-linecap', 'round');
        svgEmail.setAttribute('stroke-linejoin', 'round');
        var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', '2'); rect.setAttribute('y', '4');
        rect.setAttribute('width', '20'); rect.setAttribute('height', '16');
        rect.setAttribute('rx', '2');
        svgEmail.appendChild(rect);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M22 4L12 13L2 4');
        svgEmail.appendChild(path);
        return svgEmail;
      }
      if (key === 'linkedin') {
        var svgLinkedin = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgLinkedin.setAttribute('class', 'profile-link-icon');
        svgLinkedin.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgLinkedin.setAttribute('viewBox', '0 0 24 24');
        svgLinkedin.setAttribute('width', '16');
        svgLinkedin.setAttribute('height', '16');
        svgLinkedin.setAttribute('fill', 'currentColor');
        svgLinkedin.setAttribute('stroke', 'none');
        var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z');
        svgLinkedin.appendChild(p1);
        var rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect2.setAttribute('x', '2'); rect2.setAttribute('y', '9');
        rect2.setAttribute('width', '4'); rect2.setAttribute('height', '12');
        svgLinkedin.appendChild(rect2);
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '4'); circle.setAttribute('cy', '4');
        circle.setAttribute('r', '2');
        svgLinkedin.appendChild(circle);
        return svgLinkedin;
      }
      return null;
    }

    // ─── Contact links ──────────────────────────────────────────────
    var linksDiv = createElement('div', { className: 'profile-links' });
    var links = profileData.links || {};
    var linkKeys = ['email', 'google_scholar', 'orcid', 'linkedin'];
    var linkLabels = {
      email: 'Email',
      google_scholar: 'Google Scholar',
      orcid: 'ORCID',
      linkedin: 'LinkedIn'
    };
    var lk;
    for (lk = 0; lk < linkKeys.length; lk++) {
      var key = linkKeys[lk];
      // Email is at top level of profileData, not inside links
      var linkUrl = (key === 'email') ? profileData.email : (links[key] || null);
      if (linkUrl) {
        var linkLabel = linkLabels[key] || key;
        var a = createElement('a', {
          className: 'profile-link',
          href: linkUrl,
          target: '_blank',
          rel: 'noopener',
          title: linkLabel
        });
        // Favicon-style SVG icon for email & LinkedIn
        var icon = getLinkIcon(key);
        if (icon) {
          a.appendChild(icon);
          // Add label as text node
          a.appendChild(document.createTextNode(' ' + linkLabel));
        } else {
          // Academicons for Google Scholar & ORCID (valid classes)
          var academiconClass = '';
          if (key === 'google_scholar') academiconClass = 'ai ai-google-scholar';
          if (key === 'orcid') academiconClass = 'ai ai-orcid';
          var iEl = createElement('i', {
            className: academiconClass
          });
          a.appendChild(iEl);
          a.appendChild(document.createTextNode(' ' + linkLabel));
        }
        linksDiv.appendChild(a);
      }
    }
    info.appendChild(linksDiv);
    container.appendChild(info);
    header.appendChild(container);
    return header;
  }

  // ─── Footer ─────────────────────────────────────────────────────
  function renderFooter(config) {
    var footer = createElement('footer', { className: 'footer' });
    var container = createElement('div', { className: 'container' });
    var year = new Date().getFullYear();
    var text = createElement('p', {
      className: 'footer-text',
      textContent: '\u00A9 ' + year + ' Eric B. Zhou'
    });
    container.appendChild(text);
    footer.appendChild(container);
    return footer;
  }

  // ─── Section Divider ────────────────────────────────────────────
  function renderDivider() {
    return createElement('div', { className: 'section-divider' });
  }

  function renderSectionHeading(text) {
    return createElement('h2', {
      className: 'section-heading',
      textContent: text
    });
  }

  // ─── Collapsible Section (details/summary) ──────────────────────
  function renderCollapsibleSection(headerText, contentEl) {
    var details = createElement('details', { className: 'collapsible-section' });
    var summary = createElement('summary', {
      className: 'collapsible-header',
      textContent: headerText
    });
    details.appendChild(summary);
    if (contentEl) {
      details.appendChild(contentEl);
    }
    return details;
  }

  // ─── Gallery (horizontal auto-scroll) ─────────────────────────
  function renderGallery(images, profileConfig) {
    // Return null for empty image arrays — caller should skip rendering
    if (!images || images.length === 0) return null;

    var gallery = createElement('div', { className: 'gallery' });
    var grid = createElement('div', { className: 'gallery-grid' });
    var i;

    // Build image set (original + duplicate for seamless scroll loop)
    var allImages = images.concat(images);
    for (i = 0; i < allImages.length; i++) {
      var img = createElement('img', {
        className: 'gallery-item',
        src: profileConfig.photoPath + '../imgs/' + allImages[i],
        alt: 'Gallery image ' + (i + 1),
        loading: 'lazy'
        // No click handler — gallery is scroll-only, hover-expand via CSS
      });
      grid.appendChild(img);
    }
    gallery.appendChild(grid);

    // Calculate scroll distance after paint so offsetWidth is accurate.
    // Measure total width of one set (first half of items), add gaps,
    // and set as CSS custom property for the animation keyframes.
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        var halfCount = images.length;
        var totalWidth = 0;
        for (i = 0; i < halfCount; i++) {
          var item = grid.children[i];
          if (item) {
            totalWidth += item.offsetWidth;
          }
        }
        // Add gaps between items (gap = 16px = var(--spacing-md))
        totalWidth += (halfCount - 1) * 16;
        gallery.style.setProperty('--scroll-distance', '-' + totalWidth + 'px');
      });
    });

    return gallery;
  }

  // ─── Newsfeed ───────────────────────────────────────────────────
  function renderNewsfeed(newsData) {
    if (!newsData || newsData.length === 0) return null;
    var section = createElement('div', { className: 'newsfeed' });
    var heading = renderSectionHeading('News');
    section.appendChild(heading);

    // Sort by sort_order descending (newest first)
    var sorted = newsData.slice().sort(function(a, b) {
      return (b.sort_order || 0) - (a.sort_order || 0);
    });

    var i;
    for (i = 0; i < sorted.length; i++) {
      var entry = sorted[i];
      var row = createElement('div', { className: 'newsfeed-row' });
      var dateCell = createElement('div', {
        className: 'newsfeed-date',
        textContent: formatDate(entry.date)
      });
      var descCell = createElement('div', {
        className: 'newsfeed-description',
        innerHTML: entry.description || ''
      });
      row.appendChild(dateCell);
      row.appendChild(descCell);
      section.appendChild(row);
    }
    return section;
  }

  // ─── Helper: Format date ────────────────────────────────────────
  function formatDate(dateStr) {
    if (!dateStr) return '';
    var parts = dateStr.split('-');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (parts.length === 2) {
      var monthIdx = parseInt(parts[1], 10) - 1;
      return months[monthIdx] + ' ' + parts[0];
    }
    return dateStr;
  }

  // ─── Initialize theme on load ───────────────────────────────────
  initTheme();

  // ─── Close mobile nav when a link is clicked ────────────────────
  document.addEventListener('click', function(e) {
    var navItems = document.querySelector('.nav-items');
    if (navItems && navItems.classList.contains('open')) {
      var target = e.target;
      if (target && target.classList && target.classList.contains('nav-item')) {
        navItems.classList.remove('open');
      }
    }
  });

  // ─── Theme toggle: render and append to body ────────────────────
  (function() {
    var toggle = createDarkModeToggle();
    document.body.appendChild(toggle);
  })();

  // ─── Expose functions globally ──────────────────────────────────
  window.renderer = {
    createElement: createElement,
    fetchJSON: fetchJSON,
    applyTheme: applyTheme,
    initTheme: initTheme,
    createDarkModeToggle: createDarkModeToggle,
    renderNav: renderNav,
    renderProfile: renderProfile,
    renderFooter: renderFooter,
    renderDivider: renderDivider,
    renderSectionHeading: renderSectionHeading,
    renderCollapsibleSection: renderCollapsibleSection,
    renderGallery: renderGallery,
    renderNewsfeed: renderNewsfeed
  };

})();
