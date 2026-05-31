/**
 * teaching.js — Teaching page renderer.
 * Reads teaching.json + config → populates #app
 */

(function() {
  'use strict';

  var cfg = window.SITE_CONFIG;
  var renderer = window.renderer;

  function init() {
    var app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '';

    // 1. Navigation
    app.appendChild(renderer.renderNav(cfg.nav));

    // 2. Profile
    renderer.fetchJSON('data/profile.json').then(function(profileData) {
      if (!profileData) return;
      app.appendChild(renderer.renderProfile(cfg.profile, profileData));

      // 3. Teaching Philosophy
      var philosophy = cfg.teaching.philosophy || [];
      if (philosophy.length > 0) {
        var philSection = document.createElement('section');
        philSection.className = 'teaching-philosophy';
        philSection.appendChild(renderer.renderSectionHeading('Teaching Philosophy'));
        var p;
        for (p = 0; p < philosophy.length; p++) {
          var pEl = document.createElement('p');
          pEl.innerHTML = philosophy[p];
          philSection.appendChild(pEl);
        }
        app.appendChild(philSection);
      }

      // 4. Teaching Interests
      var interests = cfg.teaching.interests || [];
      if (interests.length > 0) {
        var interestsSection = document.createElement('section');
        interestsSection.className = 'teaching-interests';
        interestsSection.appendChild(renderer.renderSectionHeading('Teaching Interests'));
        var ul = document.createElement('ul');
        var ik;
        for (ik = 0; ik < interests.length; ik++) {
          var li = document.createElement('li');
          li.textContent = interests[ik];
          ul.appendChild(li);
        }
        interestsSection.appendChild(ul);
        app.appendChild(interestsSection);
      }

      // 5. Courses
      renderer.fetchJSON('data/teaching.json').then(function(teachingData) {
        if (teachingData && teachingData.length > 0) {
          var coursesSection = document.createElement('section');
          coursesSection.className = 'courses-section';
          coursesSection.appendChild(renderer.renderSectionHeading('Courses'));
          coursesSection.appendChild(renderCourses(teachingData));
          app.appendChild(coursesSection);
        }

        // 6. Footer
        app.appendChild(renderer.renderFooter(cfg));
      });

    }).catch(function(err) {
      console.error('Teaching page error:', err);
    });
  }

  // ─── Render course cards ────────────────────────────────────────
  function renderCourses(teachingData) {
    var container = document.createElement('div');
    container.className = 'courses-list';
    var i;
    for (i = 0; i < teachingData.length; i++) {
      var entry = teachingData[i];
      var card = document.createElement('div');
      card.className = 'card course-card';

      // Course title (combined code+title from JSON)
      var titleDiv = document.createElement('div');
      titleDiv.className = 'card-title';
      titleDiv.textContent = entry.course || '';
      card.appendChild(titleDiv);

      // Semester + Year
      if (entry.semester || entry.year) {
        var semP = document.createElement('p');
        semP.className = 'card-meta';
        semP.innerHTML = '<b>Semester:</b> ' + (entry.semester || '') + ' ' + (entry.year || '');
        card.appendChild(semP);
      }

      // Role
      if (entry.role) {
        var roleP = document.createElement('p');
        roleP.className = 'card-meta';
        roleP.innerHTML = '<b>Role:</b> ' + entry.role;
        card.appendChild(roleP);
      }

      // Description (if present)
      if (entry.description) {
        var descP = document.createElement('p');
        descP.className = 'card-description';
        descP.innerHTML = entry.description;
        card.appendChild(descP);
      }

      // Evaluation score
      if (entry.rating) {
        var ratingP = document.createElement('p');
        ratingP.className = 'card-rating';
        ratingP.innerHTML = '<b>Student Evaluation:</b> ' + entry.rating;
        card.appendChild(ratingP);
      }

      // Testimonials (collapsible)
      if (entry.testimonials && entry.testimonials.length > 0 && cfg.teaching.showTestimonials) {
        var testSection = renderer.renderCollapsibleSection('Student Testimonials', function() {
          var blockquote = document.createElement('blockquote');
          var ti;
          for (ti = 0; ti < entry.testimonials.length; ti++) {
            var quoteP = document.createElement('p');
            quoteP.innerHTML = entry.testimonials[ti].text;
            blockquote.appendChild(quoteP);
            if (entry.testimonials[ti].student) {
              var citeP = document.createElement('p');
              citeP.className = 'testimonial-cite';
              citeP.textContent = '\u2014 ' + entry.testimonials[ti].student;
              blockquote.appendChild(citeP);
            }
          }
          return blockquote;
        }());
        card.appendChild(testSection);
      }

      container.appendChild(card);
    }
    return container;
  }

  // ─── DOM-ready ──────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
