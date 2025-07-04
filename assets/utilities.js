// ============ //
// FOOTER
// ============ //
function createFooter(date = new Date().toLocaleDateString()) {
  // Generate the footer HTML content
  const content = `
    <footer class="footer">
      <p>&copy; 2025 Eric B. Zhou | Last Updated on July 4, 2025</p>
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
function createProfile(name, position, employer, email, googleScholar, linkedIn) {
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
          <h4>${position}</h4>
          <p>${employer}</p>
          <hr style="border-top: 3px solid red; width: 75%;">
      </center>
    <ul class="profile-info">
      <li>
        <a href="mailto:${email}" target="_blank">
          <i class="fas fa-fw fa-envelope" aria-hidden="true"></i>
          Email
        </a>
      </li>
      <li>
        <a href="${googleScholar}" target="_blank">
          <i class="fa-brands fa-google" aria-hidden="true"></i>
          Google Scholar
        </a>
      </li>
      <li>
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
      statusString += ` at ${item.status.journal}`;
    }
    statusString += `</i>`;

    // Abstract
    let abstractString = "";
    if (item.abstract && item.abstract.length !== 0) {
      abstractString += `<div class="collapse-title blue">[Abstract]</div><div class="content">"${item.abstract}"</div>`;
    }

    // Conferences
    let conferenceString = "";
    if (item.conferences && item.conferences.length > 0) {
      conferenceString += `<div class="collapse-title blue">[Conference Presentations]</div><div class="content"><table>`;
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
        `<div class="teaching-testimonial"><li>"${testimonial}"</li></div>`
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