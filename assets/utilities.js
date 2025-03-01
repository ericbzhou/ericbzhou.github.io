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
// FOOTER
// ============ //
function createFooter(date = new Date().toLocaleDateString()) {
  // Generate the footer HTML content
  const content = `
    <footer class="footer">
      <p>&copy; 2024 Eric B. Zhou | Last Updated on March 1, 2025</p>
    </footer>
  `;

  return content;
}

// ============ //
// RESEARCH
// ============ //
function createResearchFeed(papers) {
  const content = papers.map((item, index) => {
    // Calculate reversed numbering (start from total papers)
    const paperNumber = papers.length - index;
    // Create the link string
    let linkString = `<p style="margin:0%">`;
    if (item.links.length > 0) {
      for (const link of item.links) {
        linkString += `<a href="${link.href}" target="_blank">[${link.site}]</a>`;
        linkString += "&emsp;";
      }
    }
    linkString += `</p>`;

      // Update status string with journal if present
      let statusString = `<i>${item.status.stage}`;
      if (item.status.journal) {
        statusString += ` at ${item.status.journal}`;
      }
      statusString += `</i>`;

      // Update abstract if available
      let abstractString = "";
      if (item.abstract.length != 0) {
      //   abstractString += `Coming soon...`;
      // }
      // else {
        abstractString += `<div class="collapse-title blue">[Abstract]</div><div class="content">"`;
        abstractString += item.abstract;
        abstractString += `"</div>`;
      }

      // // Update presentations if available
      let conferenceString = "";
      if (item.conferences.length > 0) {
        conferenceString += `<div class="collapse-title blue">[Conference Presentations]</div><div class="content"><table>`;
        conferenceString += item.conferences.map((conference) => `
          <tr>
            <td>${conference.date}</td>
            <td>${conference.name}</td>
            <td>${conference.location}</td>
          </tr>
        `).join("");
        conferenceString += `</table></div>`;
      }

      // // Update invited talks if available
      let talkString = "";
      if (item.talks.length > 0) {
        talkString += `<div class="collapse-title blue">[Invited Talks]</div><div class="content"><table>`;
        talkString += item.talks.map((talk) => `
          <tr>
            <td>${talk.date}</td>
            <td>${talk.school}</td>
          </tr>
        `).join("");
        // talkString += `</table><i>* presented by coauthor</i></div>`;
      }
  return `
  <p>
    <div class="research-title">${paperNumber}.&emsp; ${item.title}</div>
    <div class="research-contents">
      ${item.authors}
      <br>
      ${statusString}${linkString}   
      ${abstractString} ${conferenceString} ${talkString}
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

// ============ //
// IMAGE GALLERY
// ============ //
// function createGallery(images) {
//   const ul = document.createElement('ul');
//   ul.classList.add('results'); // Add the "results" class to the <ul>

//   images.forEach(imageSrc => {
//     const li = document.createElement('li');
//     li.classList.add('result');

//     const a = document.createElement('a');
//     a.href = '#';

//     const img = document.createElement('img');
//     img.src = imageSrc;
//     img.width = 500;
//     img.height = 500;
//     img.alt = '';

//     a.appendChild(img);
//     li.appendChild(a);
//     ul.appendChild(li);
//   });

//   return ul;
// }

