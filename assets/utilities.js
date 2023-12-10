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
function createProfile(image, name, position, employer, email, googleScholar, linkedIn) {
  // Generate the HTML content
  const content = `
    <div class="profile">
        <center>
          <img src="${image}" alt="Profile Picture" class="profile-picture">
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
// FOOTER
// ============ //
function createFooter(date) {
  // Generate the footer HTML content
  const content = `
    <footer class="footer">
      <p>&copy; 2023 Eric Zhou | Last Updated on ${date}</p>
    </footer>
  `;

  return content;
}

// ============ //
// RESEARCH
// ============ //
function createResearchFeed(papers) {
  const content = papers.map((item) => {
    // Create the link string
    let linkString = "";
    if (item.links.length > 0) {
      linkString += "&emsp;|&emsp; "
      for (const link of item.links) {
        linkString += `<a href="${link.href}" target="_blank">[${link.site}]</a>`;
      }
    }

      // Update status string with journal if present
      let statusString = `<i>${item.status.stage}`;
      if (item.status.journal) {
        statusString += ` at ${item.status.journal}</i>`;
      }
      else {
        statusString += `</i>`;
      }

      // Update abstract if available
      let abstractString = "";
      if (item.abstract.length == 0) {
        abstractString += `Coming soon...`;
      }
      else {
        abstractString += `<div class="collapse-title blue">[Abstract]</div><div class="content"><p>"`;
        abstractString += item.abstract;
        abstractString += `"</p></div>`;
      }

      // // Update presentations if available
      let conferenceString = "";
      if (item.conferences.length > 0) {
        conferenceString += `<div class="collapse-title blue">[Presentations]</div><div class="content"><table>`;
        conferenceString += item.conferences.map((conference) => `
          <tr>
            <td>${conference.date}</td>
            <td>${conference.name}</td>
            <td>${conference.location}</td>
          </tr>
        `).join("");
        conferenceString += `</table></div>`;
      }
      
  return `
  <p>
    <div class="research-title">${item.title}</div>
    <div class="research-contents">
      ${item.authors}
      <br>
      ${statusString}${linkString}   
      <br>
        ${abstractString}
        ${conferenceString}
    </div>
  </p>
`;
}).join("");

  return content;
}

// ============ //
// TALKS
// ============ //
function createTalksFeed(talks) {
  let content = `<ol>`;

  talks.forEach((item) => {
    content += `
      <li>
        ${item.date} - <i>${item.event}</i> at ${item.location} - <strong>${item.title}</strong>
      </li>
    `;
    if (item.award) {
      content += `<span class="tag" style="background-color:#238525; color:#ffffff;">${item.award}</span>`;
    }
  });

  return content += `</ol>`;
}
