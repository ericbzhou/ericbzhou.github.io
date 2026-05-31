/**
 * research.js — Research page renderer.
 * Reads research.json + awards.json → populates #app
 */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG;
  var renderer = window.renderer;
  /* ─── Text/author flag formatters ──────────────────────────────── */
  function formatText(raw) {
    if (!raw) return "";
    return raw
      .replace(/\[b\](.*?)\[\/b\]/gi, "<b>$1</b>")
      .replace(/\[i\](.*?)\[\/i\]/gi, "<i>$1</i>");
  }
  /* Author flag symbols: FA=† (first author), CF=‡ (co-first author), A=§ (alphabetical order) */
  var authorFlagSymbols = {
    "[FA]": '<span class="author-sup" title="First author">†</span>',
    "[CF]": '<span class="author-sup" title="Co-first author">‡</span>',
    "[A]": '<span class="author-sup" title="Alphabetical order">§</span>',
  };
  function formatAuthors(raw) {
    if (!raw) return "";
    return raw
      .replace(/\[FA\]/g, authorFlagSymbols["[FA]"])
      .replace(/\[CF\]/g, authorFlagSymbols["[CF]"])
      .replace(/\[A\]/g, authorFlagSymbols["[A]"]);
  }
  /* Presentation note symbols: [1]=¶ (accepted but did not attend), [2]=‖ (invited speaker) */
  var presentationNoteSymbols = {
    "[1]":
      '<span class="author-sup" title="Accepted but did not attend">¶</span>',
    "[2]": '<span class="author-sup" title="Invited speaker">‖</span>',
  };
  function formatPresentationNotes(raw) {
    if (!raw) return "";
    return raw
      .replace(/\[1\]/g, presentationNoteSymbols["[1]"])
      .replace(/\[2\]/g, presentationNoteSymbols["[2]"]);
  }

  function init() {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML = "";
    app.appendChild(renderer.renderNav(cfg.nav));
    renderer
      .fetchJSON("data/profile.json")
      .then(function (pd) {
        if (!pd) return;
        app.appendChild(renderer.renderProfile(cfg.profile, pd));
        // Fetch and render research statement (always before research section)
        renderer.fetchJSON("data/research_statement.json").then(function (rs) {
          if (rs && rs.length > 0) {
            var stmtSec = document.createElement("section");
            stmtSec.className = "research-statement";
            stmtSec.appendChild(
              renderer.renderSectionHeading("Research Statement"),
            );
            var p;
            for (p = 0; p < rs.length; p++) {
              var pe = document.createElement("p");
              pe.innerHTML = rs[p];
              stmtSec.appendChild(pe);
            }
            app.appendChild(stmtSec);
          }
          // Now fetch and render publications, drafts, presentations, etc.
          renderer.fetchJSON("data/research.json").then(function (rd) {
          if (!rd) return;
          var pubs = [],
            wds = [],
            wip = [],
            pres = [],
            i;
          for (i = 0; i < rd.length; i++) {
            var item = rd[i];
            if (item.category === "publications") pubs.push(item);
            else if (item.category === "working_drafts") wds.push(item);
            else if (item.category === "works_in_progress") wip.push(item);
            else if (item.category === "presentation_only") pres.push(item);
          }
          pubs.sort(function (a, b) {
            return (b.sort_order || 0) - (a.sort_order || 0);
          });
          wds.sort(function (a, b) {
            return (b.sort_order || 0) - (a.sort_order || 0);
          });
          wip.sort(function (a, b) {
            return (b.sort_order || 0) - (a.sort_order || 0);
          });
          pres.sort(function (a, b) {
            return (b.sort_order || 0) - (a.sort_order || 0);
          });
          if (pubs.length > 0) {
            var ps;
            if (cfg.research.collapsibleSections) {
              ps = renderer.renderCollapsibleSection(
                "Publications",
                renderPublications(pubs),
              );
            } else {
              ps = document.createElement("section");
              ps.className = "publications-section";
              ps.appendChild(renderer.renderSectionHeading("Publications"));
              ps.appendChild(renderPublications(pubs));
            }
            app.appendChild(ps);
          }
          if (wds.length > 0) {
            var ws;
            if (cfg.research.collapsibleSections) {
              ws = renderer.renderCollapsibleSection(
                "Working Drafts",
                renderWorkingDrafts(wds),
              );
            } else {
              ws = document.createElement("section");
              ws.className = "working-drafts-section";
              ws.appendChild(renderer.renderSectionHeading("Working Drafts"));
              ws.appendChild(renderWorkingDrafts(wds));
            }
            app.appendChild(ws);
          }
          if (wip.length > 0) {
            var wips;
            if (cfg.research.collapsibleSections) {
              wips = renderer.renderCollapsibleSection(
                "Works in Progress",
                renderWorkingDrafts(wip),
              );
            } else {
              wips = document.createElement("section");
              wips.className = "works-in-progress-section";
              wips.appendChild(
                renderer.renderSectionHeading("Works in Progress"),
              );
              wips.appendChild(renderWorkingDrafts(wip));
            }
            app.appendChild(wips);
          }
          if (pres.length > 0) {
            var pss;
            if (cfg.research.collapsibleSections) {
              pss = renderer.renderCollapsibleSection(
                "Presentations",
                renderPresentationOnly(pres),
              );
            } else {
              pss = document.createElement("section");
              pss.className = "presentation-only-section";
              pss.appendChild(
                renderer.renderSectionHeading("Presentations"),
              );
              pss.appendChild(renderPresentationOnly(pres));
            }
            app.appendChild(pss);
          }
          if (cfg.research.showFootnotes) {
            var fn = document.createElement("div");
            fn.className = "footnotes";
            fn.innerHTML =
              "<sup>†</sup> First author" +
              " | <sup>‡</sup> Co-first author" +
              " | <sup>§</sup> Alphabetical order" +
              " | <sup>¶</sup> Accepted but did not attend" +
              " | <sup>‖</sup> Invited speaker";
            app.appendChild(fn);
          }
          renderer.fetchJSON("data/awards.json").then(function (ad) {
            if (ad && ad.length > 0) {
              var as = document.createElement("section");
              as.className = "awards-section";
              as.appendChild(renderer.renderSectionHeading("Awards & Honors"));
              as.appendChild(renderAwards(ad));
              app.appendChild(as);
            }
            app.appendChild(renderer.renderFooter(cfg));
          });
        });
        });
      })
      .catch(function (err) {
        console.error("Research page error:", err);
      });
  }
  function renderPublications(publications) {
    var container = document.createElement("div");
    container.className = "publications-list";
    var num = 1,
      i,
      pub,
      card,
      titleDiv,
      authorsP,
      statusP,
      linksDiv,
      lk,
      link,
      a,
      awardsDiv,
      aw,
      awardTag,
      abstractSection;
    for (i = 0; i < publications.length; i++) {
      pub = publications[i];
      card = document.createElement("div");
      card.className = "card publication-card";
      titleDiv = document.createElement("div");
      titleDiv.className = "card-title";
      titleDiv.innerHTML =
        '<span class="pub-number">[' + num + "]</span> " + pub.title;
      card.appendChild(titleDiv);
      if (pub.authors) {
        authorsP = document.createElement("p");
        authorsP.className = "card-authors";
        authorsP.innerHTML = formatAuthors(pub.authors);
        card.appendChild(authorsP);
      }
      if (pub.status) {
        statusP = document.createElement("p");
        statusP.className = "card-status";
        statusP.innerHTML = "<b>Status:</b> " + formatText(pub.status);
        card.appendChild(statusP);
      }
      if (pub.links && pub.links.length > 0) {
        linksDiv = document.createElement("div");
        linksDiv.className = "card-links";
        for (lk = 0; lk < pub.links.length; lk++) {
          link = pub.links[lk];
          a = document.createElement("a");
          a.className = "card-link";
          a.href = link.url;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = link.label || link.type;
          linksDiv.appendChild(a);
        }
        card.appendChild(linksDiv);
      }
      if (pub.awards && pub.awards.length > 0) {
        awardsDiv = document.createElement("div");
        awardsDiv.className = "card-awards";
        for (aw = 0; aw < pub.awards.length; aw++) {
          awardTag = document.createElement("span");
          awardTag.className = "tag award";
          awardTag.textContent = pub.awards[aw];
          awardsDiv.appendChild(awardTag);
        }
        card.appendChild(awardsDiv);
      }
      if (pub.abstract && cfg.research.showAbstract) {
        abstractSection = renderer.renderCollapsibleSection(
          "Abstract",
          (function () {
            var ap = document.createElement("p");
            ap.innerHTML = formatText(pub.abstract);
            return ap;
          })(),
        );
        card.appendChild(abstractSection);
      }
      if (
        pub.conference_workshop_presentations &&
        pub.conference_workshop_presentations.length > 0 &&
        cfg.research.showPresentations
      ) {
        card.appendChild(
          renderer.renderCollapsibleSection(
            "Presentations",
            renderPresentationTable(pub.conference_workshop_presentations),
          ),
        );
      }
      if (
        pub.invited_talks &&
        pub.invited_talks.length > 0 &&
        cfg.research.showPresentations
      ) {
        card.appendChild(
          renderer.renderCollapsibleSection(
            "Invited Talks",
            renderTalkTable(pub.invited_talks),
          ),
        );
      }
      container.appendChild(card);
      num++;
    }
    return container;
  }
  function renderWorkingDrafts(drafts) {
    var container = document.createElement("div");
    container.className = "drafts-list";
    var num = 1,
      i,
      draft,
      card,
      titleDiv,
      authorsP,
      statusP,
      notesP,
      confSection,
      talksSection;
    for (i = 0; i < drafts.length; i++) {
      draft = drafts[i];
      card = document.createElement("div");
      card.className = "card draft-card";
      titleDiv = document.createElement("div");
      titleDiv.className = "card-title";
      titleDiv.innerHTML =
        '<span class="pub-number">[' + num + "]</span> " + draft.title;
      card.appendChild(titleDiv);
      if (draft.authors) {
        authorsP = document.createElement("p");
        authorsP.className = "card-authors";
        authorsP.innerHTML = formatAuthors(draft.authors);
        card.appendChild(authorsP);
      }
      if (draft.status) {
        statusP = document.createElement("p");
        statusP.className = "card-status";
        statusP.innerHTML = "<b>Status:</b> " + formatText(draft.status);
        card.appendChild(statusP);
      }
      if (draft.notes) {
        notesP = document.createElement("p");
        notesP.className = "card-notes";
        notesP.innerHTML = formatText(draft.notes);
        card.appendChild(notesP);
      }
      if (
        draft.conference_workshop_presentations &&
        draft.conference_workshop_presentations.length > 0 &&
        cfg.research.showPresentations
      ) {
        card.appendChild(
          renderer.renderCollapsibleSection(
            "Presentations",
            renderPresentationTable(draft.conference_workshop_presentations),
          ),
        );
      }
      if (
        draft.invited_talks &&
        draft.invited_talks.length > 0 &&
        cfg.research.showPresentations
      ) {
        card.appendChild(
          renderer.renderCollapsibleSection(
            "Invited Talks",
            renderTalkTable(draft.invited_talks),
          ),
        );
      }
      container.appendChild(card);
      num++;
    }
    return container;
  }
  function renderAwards(awards) {
    var container = document.createElement("div");
    container.className = "awards-list";
    var i, award, awardDiv, dateSpan, awardTag, descriptionP;
    for (i = 0; i < awards.length; i++) {
      award = awards[i];
      awardDiv = document.createElement("div");
      awardDiv.className = "award-item";
      dateSpan = document.createElement("span");
      dateSpan.className = "award-date";
      dateSpan.textContent = formatDate(award.month + " " + award.year);
      awardDiv.appendChild(dateSpan);
      awardTag = document.createElement("span");
      awardTag.className = "tag award";
      awardTag.textContent = award.title || award.name || award.award;
      awardDiv.appendChild(awardTag);
      descriptionP = document.createElement("p");
      descriptionP.className = "award-description";
      descriptionP.innerHTML =
        award.description || award.institution || award.organization || "";
      awardDiv.appendChild(descriptionP);
      container.appendChild(awardDiv);
    }
    return container;
  }
  function renderPresentationOnly(items) {
    var container = document.createElement("div");
    container.className = "drafts-list";
    var num = 1,
      i,
      item,
      card,
      titleDiv,
      authorsP,
      confSection;
    for (i = 0; i < items.length; i++) {
      item = items[i];
      card = document.createElement("div");
      card.className = "card draft-card";
      titleDiv = document.createElement("div");
      titleDiv.className = "card-title";
      titleDiv.innerHTML =
        '<span class="pub-number">[' + num + "]</span> " + item.title;
      card.appendChild(titleDiv);
      if (item.authors) {
        authorsP = document.createElement("p");
        authorsP.className = "card-authors";
        authorsP.innerHTML = formatAuthors(item.authors);
        card.appendChild(authorsP);
      }
      if (
        item.conference_workshop_presentations &&
        item.conference_workshop_presentations.length > 0 &&
        cfg.research.showPresentations
      ) {
        confSection = renderer.renderCollapsibleSection(
          "Presentations",
          renderPresentationTable(item.conference_workshop_presentations),
        );
        card.appendChild(confSection);
      }
      container.appendChild(card);
      num++;
    }
    return container;
  }
  function renderPresentationTable(items) {
    var table = document.createElement("div");
    table.className = "presentation-table";
    var i, item, row, topRow, dateSpan, venueSpan, locSpan, notesLine;
    for (i = 0; i < items.length; i++) {
      item = items[i];
      row = document.createElement("div");
      row.className = "presentation-row";
      // Top row: MM-YYYY | venue | location
      topRow = document.createElement("div");
      topRow.className = "presentation-top";
      if (item.month || item.year) {
        dateSpan = document.createElement("span");
        dateSpan.className = "presentation-date";
        dateSpan.textContent = (item.month || "") + " " + (item.year || "");
        topRow.appendChild(dateSpan);
      }
      venueSpan = document.createElement("span");
      venueSpan.className = "presentation-venue";
      venueSpan.innerHTML = formatText(
        item.event || item.conference || item.venue || "",
      );
      topRow.appendChild(venueSpan);
      if (item.location) {
        locSpan = document.createElement("span");
        locSpan.className = "presentation-location";
        locSpan.textContent = item.location;
        topRow.appendChild(locSpan);
      }
      row.appendChild(topRow);
      // Bottom row (if notes exist): notes/flag symbols
      if (item.notes) {
        notesLine = document.createElement("div");
        notesLine.className = "presentation-notes";
        notesLine.innerHTML = formatPresentationNotes(formatText(item.notes));
        row.appendChild(notesLine);
      }
      table.appendChild(row);
    }
    return table;
  }
  function renderTalkTable(items) {
    var table = document.createElement("div");
    table.className = "talk-table";
    var i, item, row, dateSpan, venueSpan;
    for (i = 0; i < items.length; i++) {
      item = items[i];
      row = document.createElement("div");
      row.className = "talk-row";
      // Top line: MM-YYYY | venue
      if (item.month || item.year) {
        dateSpan = document.createElement("span");
        dateSpan.className = "talk-date";
        dateSpan.textContent = (item.month || "") + " " + (item.year || "");
        row.appendChild(dateSpan);
      }
      if (item.venue) {
        venueSpan = document.createElement("span");
        venueSpan.className = "talk-venue";
        venueSpan.innerHTML = formatText(item.venue);
        row.appendChild(venueSpan);
      }
      table.appendChild(row);
    }
    return table;
  }
  function formatDate(dateStr) {
    if (!dateStr) return "";
    var parts = dateStr.split(" ");
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    if (parts.length === 2) {
      var mIdx = months.indexOf(parts[0]);
      if (mIdx !== -1) return parts[0] + " " + parts[1];
    }
    var dp = dateStr.split("-");
    if (dp.length === 2) {
      var m = parseInt(dp[1], 10) - 1;
      return months[m] + " " + dp[0];
    }
    return dateStr;
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
