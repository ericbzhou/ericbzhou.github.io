/**
 * home.js — Home page renderer.
 * Reads profile.json + news.json → populates #app
 */

(function() {
  'use strict';

  var cfg = window.SITE_CONFIG;

  function init() {
    var app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = ''; // clear

    // 1. Navigation
    var nav = window.renderer.renderNav(cfg.nav);
    app.appendChild(nav);

    // 2. Profile section
    window.renderer.fetchJSON('data/profile.json').then(function(profileData) {
      if (!profileData) {
        app.innerHTML += '<p style="color:red">Error: profile data is empty</p>';
        app.appendChild(window.renderer.renderFooter(cfg));
        return;
      }

      try {
        // Render profile header
        var profile = window.renderer.renderProfile(cfg.profile, profileData);
        app.appendChild(profile);

        // 3. Bio section
        if (profileData.bio && profileData.bio.length > 0) {
          var bioSection = document.createElement('section');
          bioSection.className = 'bio-section';
          var bioHeading = window.renderer.renderSectionHeading('About');
          bioSection.appendChild(bioHeading);

          var p;
          for (p = 0; p < profileData.bio.length; p++) {
            var bioP = document.createElement('p');
            bioP.innerHTML = profileData.bio[p];
            bioSection.appendChild(bioP);
          }
          app.appendChild(bioSection);
        }

        // 4. Photo gallery
        if (cfg.profile.showGallery) {
          var gallerySection = document.createElement('section');
          gallerySection.className = 'gallery-section';
          var galleryHeading = window.renderer.renderSectionHeading('Gallery');
          gallerySection.appendChild(galleryHeading);

          var gallery = window.renderer.renderGallery(['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'], cfg.profile);
          gallerySection.appendChild(gallery);
          app.appendChild(gallerySection);
        }

        // 5. Divider before news
        app.appendChild(window.renderer.renderDivider());

      } catch(err) {
        app.innerHTML += '<p style="color:red">Error rendering profile: ' + err + '</p>';
        console.error('home.js render error:', err);
      }

      // 6. Newsfeed (always attempt, even if profile failed)
      window.renderer.fetchJSON('data/news.json').then(function(newsData) {
        try {
          if (newsData && newsData.length > 0) {
            var newsSection = document.createElement('section');
            newsSection.className = 'newsfeed-section';
            var newsfeed = window.renderer.renderNewsfeed(newsData);
            if (newsfeed) {
              newsSection.appendChild(newsfeed);
              app.appendChild(newsSection);
            }
          }
        } catch(err) {
          app.innerHTML += '<p style="color:red">Error rendering newsfeed: ' + err + '</p>';
          console.error('home.js newsfeed error:', err);
        }

        // 7. Footer (always render)
        app.appendChild(window.renderer.renderFooter(cfg));
      }).catch(function(err) {
        console.error('home.js newsfeed fetch error:', err);
        // Still render footer
        app.appendChild(window.renderer.renderFooter(cfg));
      });

    }).catch(function(err) {
      console.error('Home page: failed to load profile data', err);
      app.innerHTML += '<p style="color:red">Error loading profile data: ' + err + '</p>';
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
