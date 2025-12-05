// ============ //
// FOOTER
// ============ //
function createFooter(date = new Date().toLocaleDateString()) {
  // Generate the footer HTML content
  const content = `
    <footer class="footer">
      <p>&copy; 2025 Eric B. Zhou | Last Updated on December 5, 2025</p>
    </footer>
  `;

  return content;
}

// ============ //
// NAVIGATION BAR
// ============ //
function createNavigationBar() {
  // Create the navigation bar at top of page
  const currentPath = window.location.pathname;
  const content = `
    <nav class="navigation">
      <ul>
        <li><a href="index.html" class="${currentPath === '/index.html' ? 'active' : ''}">Home</a></li>
        <li><a href="research.html" class="${currentPath === '/research.html' ? 'active' : ''}">Research</a></li>
        <li><a href="teaching.html" class="${currentPath === '/teaching.html' ? 'active' : ''}">Teaching</a></li>
        <li><a href="cv.html" class="${currentPath === '/cv.html' ? 'active' : ''}">CV</a></li>
      </ul>
      <div class="navigation-underline"></div>
    </nav>
  `;

  return content;
}

// ============ //
// MY PROFILE
// ============ //
function createProfile(name, position, employer, email, googleScholar, orcid, linkedIn) {
  // Generate the HTML content
  const content = `
  <div class="profile">
      <center>
        <div class="pic-ctn">
          <img src="headshots/2.png" alt="" class="pic">
          <img src="headshots/1.jpg" alt="" class="pic">
        </div>
        <div class="profile-info">
          <h1>${name}</h1>
          <hr style="border-top: 3px solid red; width: 75%;">
          <h2 style="font-size: 100%;">${position}</h2>
          <h3 style="font-size: 100%;">${employer}</h3>
          <hr style="border-top: 3px solid red; width: 75%;">
      </center>
    <ul class="profile-info">
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"/></svg>
        <a href="mailto:${email}" target="_blank">
          <i class="fas fa-fw fa-envelope" aria-hidden="true"></i>
          Email
        </a>
      </li>
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M390.9 298.5s0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64-.1 82.5-66.9 149.4-149.4 149.4S106.7 445.1 106.7 362.7c0-22.9 5.2-44.6 14.4-64 1.7-3.6 3.6-7.2 5.6-10.7 4.4-7.6 9.4-14.7 15-21.3 27.4-32.6 68.5-53.3 114.4-53.3 33.6 0 64.6 11.1 89.6 29.9 9.1 6.9 17.4 14.7 24.8 23.5 5.6 6.6 10.6 13.8 15 21.3 2 3.4 3.8 7 5.5 10.5l-.1-.1zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4l-94.7-77 256-202.7 256 202.7-94.7 77.1 0-.1z"/></svg>
        <a href="${googleScholar}" target="_blank">
          <i class="fa-brands fa-google" aria-hidden="true"></i>
          Google Scholar
        </a>
      </li>
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M294.7 188.2l-45.9 0 0 153.8 47.5 0c67.6 0 83.1-51.3 83.1-76.9 0-41.6-26.5-76.9-84.7-76.9zM256 8a248 248 0 1 0 0 496 248 248 0 1 0 0-496zM175.2 368.8l-29.8 0 0-207.5 29.8 0 0 207.5zM160.3 98.5a19.6 19.6 0 1 1 0 39.2 19.6 19.6 0 1 1 0-39.2zM300 369l-81 0 0-207.7 80.6 0c76.7 0 110.4 54.8 110.4 103.9 0 53.3-41.7 103.9-110 103.9z"/></svg>
        <a href="${orcid}" target="_blank">
          <i class="fa-brands fa-google" aria-hidden="true"></i>
          ORCID
        </a>
      </li>
      <li>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 448 512"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z"/></svg>
        <a href="${linkedIn}" target="_blank">
          <i class="fa-brands fa-linkedin" aria-hidden="true"></i>
          LinkedIn
        </a>
        
      </li>
    </ul>
  </div>
`;

  return content;
}

// ============ //
// NEWSFEED
// ============ //
function createNewsFeed(news) {
  // Generate HTML content
  const prefix = `
    <h1>NEWS</h1>
      <table class="news-feed">
  `;

  const content = news.map((item) => `
    <tr>
      <td><span class="event-date">${item.date}</span></td>
      <td><span class="event-description">${item.description}${item.link ? `<a href="${item.link}" target="_blank">here</a>` : ""}</span></td>
    </tr>
  `).join("");

  const suffix = `
      </table>
  `;

  // Append prefix, content, and suffix
  return prefix + content + suffix;
}

// ============ //
// RESEARCH
// ============ //
function createResearchFeed(papers) {
  const content = papers.map((item, index) => {
    const paperNumber = papers.length - index;

    // Article links
    let articleLinksString = `<p style="margin:0%">`;
    if (item.articleLinks && item.articleLinks.length > 0) {
      articleLinksString += item.articleLinks.map(link =>
        `<a href="${link.href}" target="_blank">[${link.site}]</a>`
      ).join("&emsp;");
    }
    articleLinksString += `</p>`;

    // Media coverage
    let mediaString = "";
    if (item.mediaLinks && item.mediaLinks.length > 0) {
      mediaString += `<p style="margin:0%"><b>Media Coverage:</b> `;
      mediaString += item.mediaLinks.map(link =>
        `<a href="${link.href}" target="_blank">${link.site}</a>`
      ).join(", ");
      mediaString += `</p>`;
    }

    // Awards
    let awardsString = "";
    if (item.awards && item.awards.length > 0) {
      // iterate over awards and create a separate span for each
      awardsString = item.awards.map(award => 
        `<span class="tag" style="
          display:inline-block;
          margin: 1px;
          padding: 2px 2px;
          background-color: rgb(37, 95, 255);
          border-radius: 5px;
          color: rgb(255, 255, 255);
          font-size: 0.9em;
        ">${award}</span>`
      ).join('');
    }

    // Status
    let statusString = `<i>${item.status.stage}`;
    if (item.status.journal) {
      statusString += `, ${item.status.journal}`;
    }
    statusString += `</i>`;

    // Abstract
    let abstractString = "";
    if (item.abstract && item.abstract.length !== 0) {
      abstractString += `<div class="collapse-title blue">[Abstract]</div><div class="content"><p>"${item.abstract}"</p></div>`;
    }

    // Conferences
    let conferenceString = "";
    if (item.conferences && item.conferences.length > 0) {
      conferenceString += `<div class="collapse-title blue">[Conference Presentations]</div><div class="content"><table style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;">`;
      conferenceString += item.conferences.map(conference => `
        <tr>
          <td>${conference.date}</td>
          <td>${conference.name}</td>
          <td>${conference.location}</td>
        </tr>
      `).join("");
      conferenceString += `</table></div>`;
    }

    // Talks
    let talkString = "";
    if (item.talks && item.talks.length > 0) {
      talkString += `<div class="collapse-title blue">[Invited Talks]</div><div class="content"><table>`;
      talkString += item.talks.map(talk => `
        <tr>
          <td>${talk.date}</td>
          <td>${talk.school}</td>
        </tr>
      `).join("");
      talkString += `</table></div>`;
    }

    return `
      <p>
        <div class="research-title">${paperNumber}.&emsp; ${item.title}</div>
        <div class="research-contents">
          ${item.authors}<br>
          ${statusString}
          ${articleLinksString}
          ${mediaString}
          ${awardsString}
          ${abstractString}
          ${conferenceString}
          ${talkString}
        </div>
      </p>
    `;
  }).join("");

  return content;
}

// ============ //
// TEACHING
// ============ //
function createTeachingFeed(experiences) {
  const content = experiences.map((item, index) => {
    const courseNumber = experiences.length - index;

    // Course title
    const header = `<div class="teaching-title">${courseNumber}.&emsp; ${item.course}</div>`;

    // Semesters (list of strings)
    let semesterString = "";
    if (item.semesters && item.semesters.length > 0) {
      semesterString = `<p style="margin:0%"><b>Semester(s) Taught:</b> ${item.semesters.join(", ")}</p>`;
    }

    // Institution
    let institutionString = "";
    if (item.institution) {
      institutionString = `<p style="margin:0%"><b>Institution:</b> ${item.institution}</p>`;
    }

    // Course description
    let descriptionString = "";
    if (item.description && item.description.trim().length > 0) {
      descriptionString = `<p style="margin:0%">${item.description}</p>`;
    }

    // Evaluation
    let evaluationString = "";
    if (item.evaluation) {
      evaluationString = `<p style="margin:0%"><b>Instructor Evaluation:</b> ${item.evaluation}</p>`;
    }

    // Testimonials
    let testimonialString = "";
    if (item.testimonials && item.testimonials.length > 0) {
      testimonialString += `<div class="collapse-title blue">[Student Testimonials]</div><div class="content"><ul>`;
      testimonialString += item.testimonials.map(testimonial =>
        `<div class="teaching-testimonial"><li><p>"${testimonial}"</p></li></div>`
      ).join("");
      testimonialString += `</ul></div>`;
    }

    return `
      <p>
        ${header}
        <div class="teaching-contents">
          ${semesterString}
          ${institutionString}
          ${descriptionString}
          ${evaluationString}
          ${testimonialString}
        </div>
      </p>
    `;
  }).join("");

  return content;
}


// ============ //
// CONFERENCES
// ============ //
function createConferencesFeed(conferences) {
  // Reverse the order of conferences for numbering
  let content = `<h1><div class="collapse-title"><span class="arrow">&#x25B8;</span>CONFERENCE TALKS</h1><ol>`;

  conferences.forEach((item, index) => {
    // Calculate reversed numbering (start from total conferences)
    const conferenceNumber = conferences.length - index;

    content += `
        ${conferenceNumber}.&emsp; ${item.date} - <strong>${item.title}</strong> - <i>${item.event}</i> at ${item.location}
        `;

    if (item.award) {
      content += `<br><span class="tag" style="background-color:#238525; color:#ffffff;">${item.award}</span>`;
    }
    content += "<br>"
  });

  content += "</ol></div>";

  return content;
}