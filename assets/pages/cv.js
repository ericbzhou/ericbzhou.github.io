/**
 * cv.js — CV page renderer.
 * Renders the profile header banner + embedded CV iframe.
 */

(function() {
  'use strict';

  var cfg = window.SITE_CONFIG;

  function init() {
    var app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '';

    // 1. Navigation
    var nav = window.renderer.renderNav(cfg.nav);
    app.appendChild(nav);

    // 2. Profile header (same as home page)
    window.renderer.fetchJSON('data/profile.json').then(function(profileData) {
      if (!profileData) {
        console.error('CV page: failed to load profile data');
        app.appendChild(window.renderer.renderFooter(cfg));
        return;
      }

      // Render profile header banner
      var profile = window.renderer.renderProfile(cfg.profile, profileData);
      app.appendChild(profile);

      // 3. CV content (iframe)
      var cvSection = document.createElement('section');
      cvSection.className = 'cv-section';

      var cvHeading = window.renderer.renderSectionHeading('Curriculum Vitae');
      cvSection.appendChild(cvHeading);

      // Embed the generated CV HTML
      var cvContainer = document.createElement('div');
      cvContainer.style.marginTop = 'var(--spacing-lg)';
      cvContainer.style.marginBottom = 'var(--spacing-lg)';

      var iframe = document.createElement('iframe');
      iframe.src = 'assets/cv/cv.html';
      iframe.title = 'Curriculum Vitae';
      iframe.style.width = '100%';
      iframe.style.minHeight = '80vh';
      iframe.style.border = 'none';
      iframe.style.borderRadius = 'var(--border-radius)';
      iframe.style.boxShadow = 'var(--shadow-card)';

      cvContainer.appendChild(iframe);
      cvSection.appendChild(cvContainer);

      app.appendChild(cvSection);
      app.appendChild(window.renderer.renderFooter(cfg));

    }).catch(function(err) {
      console.error('CV page: failed to load profile data', err);
      app.innerHTML = '<p style="color:red">Error loading profile data: ' + err + '</p>';
      app.appendChild(window.renderer.renderFooter(cfg));
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
