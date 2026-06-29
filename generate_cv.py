#!/usr/bin/env python3
"""
generate_cv.py — Generate an HTML CV from blueprints/*.json + cv_style.yaml.

Usage:
    python generate_cv.py

Reads:  blueprints/*.json  (one JSON file per CV section)
        cv_style.yaml        (same directory)
Writes: cv.html              (same directory, opens in browser)
"""

import json
import re
import sys
import webbrowser
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader

# ---------------------------------------------------------------------------
# Resolve paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
BLUEPRINTS_DIR = SCRIPT_DIR / "data"
OUTPUT_PATH = SCRIPT_DIR / "assets/cv/cv.html"
STYLE_PATH = SCRIPT_DIR / "assets/cv/cv_style.yaml"
TEMPLATE_PATH = SCRIPT_DIR / "assets/cv/cv_template.html"

USER_NAME_PLACEHOLDER = "Eric B. Zhou"

# ---------------------------------------------------------------------------
# Loaders
# ---------------------------------------------------------------------------


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_yaml(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_blueprints() -> dict:
    """Load all JSON files from the blueprints/ directory and merge into one dict."""
    merged = {}
    for fp in sorted(BLUEPRINTS_DIR.glob("*.json")):
        key = fp.stem
        merged[key] = load_json(fp)
    return merged


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def extract_year(value: str) -> int | None:
    m = re.search(r"\b(19|20)\d{2}\b", value)
    return int(m.group()) if m else None


def section_exists(data: dict, key: str) -> bool:
    v = data.get(key)
    if isinstance(v, list):
        if not v:
            return False
        return any(_has_content(item) for item in v)
    if isinstance(v, dict):
        if not v:
            return False
        return any(_has_content(val) for val in v.values())
    return v not in (None, "", [])


def _has_content(item) -> bool:
    """Check if an item has at least one non-empty, non-whitespace value."""
    if isinstance(item, dict):
        return any(v and str(v).strip() for v in item.values())
    if isinstance(item, list):
        return any(v and str(v).strip() for v in item)
    return bool(item and str(item).strip())


def escape(text: str) -> str:
    """Escape HTML special characters."""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def format_text(text: str) -> str:
    """Escape HTML and apply formatting flags: [i], [b], [u].

    Flags can be combined in any order. Examples:
        [i]italic[/i]      -> <i>italic</i>
        [b]bold[/b]        -> <b>bold</b>
        [i][b]both[/b][/i] -> <i><b>both</b></i>
        [u][i][b]all[/b][/i][/u] -> <u><i><b>all</b></i></u>
    """
    raw = escape(text)
    # Apply [i] italic
    raw = re.sub(r"\[i\](.*?)\[/i\]", r"<i>\1</i>", raw)
    # Apply [b] bold
    raw = re.sub(r"\[b\](.*?)\[/b\]", r"<b>\1</b>", raw)
    # Apply [u] underline
    raw = re.sub(r"\[u\](.*?)\[/u\]", r"<u>\1</u>", raw)
    return raw


def format_presentation_notes(text: str, note_map: dict) -> str:
    """Escape HTML and convert [N] tags to superscript symbols.

    Tags like [1], [2] are replaced with superscript symbols (¹, ², etc.).
    Any unmatched tags fall back to <sup>[N]</sup>.
    """
    raw = escape(text)
    # Map numbers to superscript Unicode characters
    superscripts = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹",
    }

    def replace_num(m):
        num = m.group(1)
        return f'<sup class="pres-note">{superscripts.get(num, num)}</sup>'

    raw = re.sub(r"\[(\d+)\]", replace_num, raw)
    return raw


def build_contact_items(contact: dict) -> list[str]:
    items = []
    if contact.get("email"):
        items.append(
            f'<span class="contact-item"><a href="mailto:{contact["email"]}" target="_blank" rel="noopener noreferrer">Email</a></span>'
        )
    if contact.get("personal_website"):
        items.append(
            f'<span class="contact-item"><a href="{contact["personal_website"]}" target="_blank" rel="noopener noreferrer">Website</a></span>'
        )
    if contact.get("linkedin"):
        items.append(
            f'<span class="contact-item"><a href="{contact["linkedin"]}" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>'
        )
    if contact.get("google_scholar"):
        items.append(
            f'<span class="contact-item"><a href="{contact["google_scholar"]}" target="_blank" rel="noopener noreferrer">Google Scholar</a></span>'
        )
    return items


def underline_name(authors: str, name: str) -> str:
    """Return HTML with the user's name wrapped in a span for underlining."""
    parts = re.split(r",\s*", authors)
    result = []
    for i, part in enumerate(parts):
        stripped = part.strip()
        if not stripped:
            continue
        if i > 0:
            result.append(", ")
        if stripped == name:
            result.append(f'<span class="underline-self">{escape(stripped)}</span>')
        else:
            result.append(escape(stripped))
    return "".join(result)


def render_authors_with_tags(authors: str, name: str) -> dict:
    """Parse author tags and render authors with symbol superscripts.

    Tags:
        [FA] - First author marker (before a name)
        [CF] - Co-first author marker (before a name)
        [A]  - Authors listed in alphabetical order (at the start)

    Symbols:
        * - First/co-first author
        † - Co-first author
        ‡ - Alphabetical order

    Returns dict with:
        - 'authors_html': authors string with symbol superscripts
        - 'has_fa': True if any FA tag present
        - 'has_cf': True if any CF tag present
        - 'has_alpha': True if A tag present
    """
    SYMBOL_FA = '<sup class="author-symbol">*</sup>'
    SYMBOL_CF = '<sup class="author-symbol">†</sup>'
    SYMBOL_ALPHA = '<sup class="author-symbol">‡</sup>'

    raw = authors.strip()
    has_alpha = False

    # Check for [A] alphabetical marker at start
    if raw.startswith("[A]"):
        has_alpha = True
        raw = raw[3:].strip()

    has_fa = False
    has_cf = False

    # Split on commas to get individual authors
    parts = re.split(r",\s*", raw)
    result = []
    for i, part in enumerate(parts):
        stripped = part.strip()
        if not stripped:
            continue
        if i > 0:
            result.append(", ")

        # Check for [FA] or [CF] tag at start of this author
        if stripped.startswith("[FA]"):
            has_fa = True
            stripped = stripped[4:].strip()
            if stripped == name:
                result.append(
                    f'<span class="underline-self">{escape(stripped)}</span>{SYMBOL_FA}'
                )
            else:
                result.append(f"{escape(stripped)}{SYMBOL_FA}")
        elif stripped.startswith("[CF]"):
            has_cf = True
            stripped = stripped[4:].strip()
            if stripped == name:
                result.append(
                    f'<span class="underline-self">{escape(stripped)}</span>{SYMBOL_CF}'
                )
            else:
                result.append(f"{escape(stripped)}{SYMBOL_CF}")
        else:
            if stripped == name:
                result.append(f'<span class="underline-self">{escape(stripped)}</span>')
            else:
                result.append(escape(stripped))

    authors_html = "".join(result)

    if has_alpha:
        authors_html = SYMBOL_ALPHA + authors_html

    return {
        "authors_html": authors_html,
        "has_fa": has_fa,
        "has_cf": has_cf,
        "has_alpha": has_alpha,
    }


def make_dashed_entry(date: str, content: str) -> dict:
    return {"type": "dashed_entry", "date": date, "content": content}


def _style(css_style: str) -> str:
    """Convert style code to CSS value: B->bold, I->italic, ''->normal."""
    if css_style == "B":
        return "bold"
    if css_style == "I":
        return "italic"
    return "normal"


# ---------------------------------------------------------------------------
# Compute max first-column width for aligned vertical borders
# ---------------------------------------------------------------------------

# Approximate pt-to-px ratio for common fonts (Conservative estimate)
_FONT_WIDTH_FACTOR = 6.0  # average chars in px per pt for Segoe UI (conservative)


def _max_char_width(values: list[str]) -> int:
    """Return the max string length (chars) from a list."""
    return max(len(str(v)) for v in values) if values else 0


def compute_border_width(data: dict) -> float:
    """Compute the fixed border column width based on all first-column entries."""
    entries = []

    # Education dates
    if section_exists(data, "education"):
        for item in data["education"]:
            date_str = f"{item.get('year_start', '')} - {item.get('year_end', '')}"
            entries.append(date_str)

    # Research interest / professional service labels
    for key in ("research_interests", "professional_service"):
        if section_exists(data, key):
            for label in data[key].keys():
                entries.append(label.capitalize())

    if not entries:
        return 70.0  # fallback

    max_chars = _max_char_width(entries)
    # Use school size font (10.5pt) for width calculation since dates/schools drive it
    text_width = max_chars * _FONT_WIDTH_FACTOR * (10.5 / 12.0)
    white_space = 12  # pt of padding between text and border
    return round(text_width + white_space, 1)


# ---------------------------------------------------------------------------
# Build section list from blueprint data
# ---------------------------------------------------------------------------


def build_sections(data: dict, note_map: dict = None) -> list[dict]:
    """Build a flat list of section dicts from the blueprint."""
    sections = []
    personal_info = data.get("personal_info") or data.get("personal", {})
    contact = personal_info.get("contact", {})

    # Personal
    contact_items = build_contact_items(contact)
    sections.append(
        {
            "type": "personal",
            "data": {
                "full_name": escape(personal_info.get("full_name", "")),
                "contact_items": contact_items,
                "notes": [format_text(n) for n in personal_info.get("notes", [])],
            },
        }
    )

    # Education
    if section_exists(data, "education"):
        sections.append({"type": "heading", "title": "Education"})
        for item in data["education"]:
            item["school"] = format_text(f"[b]{item['school']}[/b]")
            item["program"] = format_text(f"[i]{item['program']}[/i]")
            if item.get("advisor"):
                item["advisor"] = format_text(item["advisor"])
            if item.get("notes"):
                item["notes"] = [format_text(n) for n in item["notes"]]
            if item.get("location"):
                item["location"] = format_text(item["location"])
        sections.append({"type": "education", "data": data["education"]})

    # Research Interests
    if section_exists(data, "research_interests"):
        sections.append({"type": "heading", "title": "Research Interests"})
        for label, items in data["research_interests"].items():
            if items:
                interest_entries = []
                for item in items:
                    interest_entries.append(
                        {
                            "item": format_text(item),
                        }
                    )
                sections.append(
                    {
                        "type": "research_interests",
                        "label": format_text(f"[b]{label.capitalize()}[/b]"),
                        "data": interest_entries,
                    }
                )

    # Research
    if section_exists(data, "research"):
        sections.append({"type": "heading", "title": "Research"})

        section_labels = {
            "working_drafts": "Working Drafts",
            "publications": "Publications",
            "works_in_progress": "Works in Progress",
        }

        # First pass: collect all author types across all entries
        all_has_fa = False
        all_has_cf = False
        all_has_alpha = False
        for entry in data["research"]:
            result = render_authors_with_tags(entry.get("authors", ""), "")
            if result["has_fa"]:
                all_has_fa = True
            if result["has_cf"]:
                all_has_cf = True
            if result["has_alpha"]:
                all_has_alpha = True

        # Build legend if any author tags found
        legend_entries = []
        if all_has_fa:
            legend_entries.append('<sup class="author-symbol">*</sup> First author')
        if all_has_cf:
            legend_entries.append('<sup class="author-symbol">†</sup> Co-first author')
        if all_has_alpha:
            legend_entries.append('<sup class="author-symbol">‡</sup> α-β order')

        if legend_entries:
            sections.append(
                {
                    "type": "research_legend",
                    "data": {"legend": " | ".join(legend_entries)},
                }
            )

        # Group entries by category, preserving label order
        grouped = {}
        for entry in data["research"]:
            cat = entry.get("category", "working_drafts")
            grouped.setdefault(cat, []).append(entry)

        for cat_key, label in section_labels.items():
            entries = grouped.get(cat_key, [])
            if not entries:
                continue

            sections.append({"type": "sub_heading", "title": label})

            def sort_key(entry):
                if "sort_order" in entry:
                    return -entry["sort_order"]
                year = extract_year(entry.get("status", ""))
                if year is None:
                    year = extract_year(entry.get("title", ""))
                return year if year else 0

            entries = sorted(entries, key=sort_key, reverse=True)

            user_name = personal_info.get("full_name", USER_NAME_PLACEHOLDER)

            research_entries = []
            for num, entry in enumerate(entries, 1):
                title = format_text(entry.get("title", ""))
                authors_raw = entry.get("authors", "")
                author_result = render_authors_with_tags(authors_raw, user_name)
                authors_html = author_result["authors_html"]
                status = format_text(entry.get("status", ""))
                raw_notes = entry.get("notes", [])
                if isinstance(raw_notes, str):
                    raw_notes = [raw_notes]
                notes = [format_text(n) for n in raw_notes if n]

                research_entries.append(
                    {
                        "number": num,
                        "title": title,
                        "authors_html": authors_html,
                        "status": status,
                        "notes": notes,
                        "links": entry.get("links", []),
                    }
                )

            sections.append(
                {
                    "type": "research",
                    "data": research_entries,
                }
            )

        # Consolidated Invited Talks (grouped by parent paper)
        talk_map = {}
        for entry in data["research"]:
            parent_title = entry.get("title", "")
            parent_authors = entry.get("authors", "")
            for talk in entry.get("invited_talks", []):
                talk_map.setdefault(parent_title, []).append(
                    {
                        **talk,
                        "parent_authors": parent_authors,
                    }
                )

        if talk_map:
            sections.append({"type": "heading", "title": "Invited Talks"})
            for parent_title, talks in talk_map.items():
                author_result = render_authors_with_tags(
                    talks[0]["parent_authors"], user_name
                )
                parent_authors_html = re.sub(
                    r'<sup class="author-symbol">[^<]*</sup>',
                    "",
                    author_result["authors_html"],
                )
                talk_entries = []
                for t in talks:
                    month = str(t.get("month", "")).strip()
                    year_str = str(t.get("year", "")).strip()
                    date = (
                        f"{month} {year_str}".strip()
                        if month and year_str
                        else year_str
                    )
                    venue = format_text(t.get("venue", ""))
                    talk_entries.append({"date": date, "venue": venue})
                sections.append(
                    {
                        "type": "invited_talks_group",
                        "data": {
                            "title": format_text(parent_title),
                            "authors": parent_authors_html,
                            "talks": talk_entries,
                        },
                    }
                )

        # Consolidated Conference Presentations (grouped by parent paper)
        pres_map = {}
        for entry in data["research"]:
            parent_title = entry.get("title", "")
            parent_authors = entry.get("authors", "")
            for pres in entry.get("conference_workshop_presentations", []):
                pres_map.setdefault(parent_title, []).append(
                    {
                        **pres,
                        "parent_authors": parent_authors,
                    }
                )

        if pres_map:
            sections.append(
                {"type": "heading", "title": "Conference & Workshop Presentations"}
            )

            # Build legend for presentation notes
            legend_parts = []
            symbols = ["*", "†", "‡", "§", "||", "¶", "‖", "**", "‡†"]
            for idx, num in enumerate(sorted(note_map.keys(), key=int)):
                symbol = symbols[idx] if idx < len(symbols) else num
                legend_parts.append(
                    f'<sup class="pres-note">{symbol}</sup> {escape(note_map[num])}'
                )
            legend_html = " | ".join(legend_parts) if legend_parts else ""
            sections.append(
                {"type": "conference_legend", "data": {"legend": legend_html}}
            )

            for parent_title, pres_list in pres_map.items():
                author_result = render_authors_with_tags(
                    pres_list[0]["parent_authors"], user_name
                )
                parent_authors_html = re.sub(
                    r'<sup class="author-symbol">[^<]*</sup>',
                    "",
                    author_result["authors_html"],
                )
                pres_entries = []
                for p in pres_list:
                    month = str(p.get("month", "")).strip()
                    year_str = str(p.get("year", "")).strip()
                    date = (
                        f"{month} {year_str}".strip()
                        if month and year_str
                        else year_str
                    )
                    conference_raw = p.get("conference", "")
                    notes = p.get("notes", "")
                    conference_html = format_text(conference_raw)
                    notes_html = ""
                    if notes:
                        # Only map [1] and [2] to superscript symbols
                        mapped_notes = []
                        unmatched_notes = []
                        symbols = ["*", "†", "‡", "§", "||", "¶", "‖", "**", "‡†"]
                        for idx, num in enumerate(sorted(note_map.keys(), key=int)):
                            tag = f"[{num}]"
                            if tag in notes:
                                symbol = symbols[idx] if idx < len(symbols) else num
                                mapped_notes.append(
                                    f'<sup class="pres-note">{symbol}</sup>'
                                )
                                notes = notes.replace(tag, "")
                        # Match bracketed content - capture everything between first [ and last ]
                        bracket_match = re.search(r"\[(.+)\]", notes)
                        if bracket_match:
                            full_match = bracket_match.group(0)
                            content = bracket_match.group(1)
                            if content and not content.isdigit():
                                # Strip bracket characters
                                content = (
                                    content.replace("[", "").replace("]", "").strip()
                                )
                                # Remove leading/trailing HTML-like tags (e.g., b, /b, i, /i, etc.)
                                content = re.sub(
                                    r"^(b|i|u|em|strong)\s*",
                                    "",
                                    content,
                                    flags=re.IGNORECASE,
                                )
                                content = re.sub(
                                    r"\s*/\s*(b|i|u|em|strong)$",
                                    "",
                                    content,
                                    flags=re.IGNORECASE,
                                )
                                content = content.strip()
                                if content:
                                    # Re-wrap with [b] tags so format_text() can process them
                                    unmatched_notes.append(
                                        format_text(f"[b]{content}[/b]")
                                    )
                            notes = notes.replace(full_match, "").strip()
                        # Remaining text after removing all tags
                        remaining = format_text(notes) if notes.strip() else ""
                        conference_html = (
                            "".join(mapped_notes) + conference_html
                            if mapped_notes
                            else conference_html
                        )
                        if remaining:
                            conference_html = conference_html + " " + remaining
                        notes_html = unmatched_notes
                    pres_entries.append(
                        {
                            "date": date,
                            "conference": conference_html,
                            "location": format_text(p.get("location", ""))
                            if p.get("location")
                            else "",
                            "unmatched_notes": notes_html,
                        }
                    )
                sections.append(
                    {
                        "type": "conference_pres_group",
                        "data": {
                            "title": format_text(parent_title),
                            "authors": parent_authors_html,
                            "pres": pres_entries,
                        },
                    }
                )

    # Awards
    if section_exists(data, "awards"):
        sections.append({"type": "heading", "title": "Awards"})
        awards = sorted(
            data["awards"],
            key=lambda a: extract_year(str(a.get("year", ""))) or 0,
            reverse=True,
        )
        award_entries = []
        for a in awards:
            year = str(a.get("year", "")).strip()
            month = str(a.get("month", "")).strip()
            title = format_text(a.get("title", ""))
            date = f"{month} {year}".strip() if month and year else year
            award_entries.append({"date": date, "title": title})
        sections.append({"type": "awards", "data": award_entries})

    # Professional Service
    if section_exists(data, "professional_service"):
        sections.append({"type": "heading", "title": "Professional Service"})
        for label, items in data["professional_service"].items():
            if items:
                service_entries = []
                for item in items:
                    service_entries.append(
                        {
                            "item": format_text(item),
                        }
                    )
                sections.append(
                    {
                        "type": "professional_service",
                        "label": format_text(f"[b]{label.capitalize()}[/b]"),
                        "data": service_entries,
                    }
                )

    # Teaching Experience
    if section_exists(data, "teaching"):
        sections.append({"type": "heading", "title": "Teaching Experience"})
        teaching = sorted(
            data["teaching"], key=lambda t: t.get("year", 0), reverse=True
        )
        teaching_items = []
        for t in teaching:
            semester = str(t.get("semester", "")).strip()
            year = str(t.get("year", "")).strip()
            date = f"{semester} {year}".strip() if semester and year else year
            course = format_text(f"[b]{t.get('course', '')}[/b]")
            role = format_text(f"[i]{t.get('role', '')}[/i]")
            rating = t.get("rating", "")
            notes = t.get("notes", "")
            item = {
                "date": date,
                "course": course,
                "role": role,
                "rating": escape(rating) if rating else "",
                "notes": [format_text(notes)] if notes else [],
            }
            teaching_items.append(item)
        sections.append({"type": "teaching", "data": teaching_items})

    # Industry Experience
    if section_exists(data, "industry_experience"):
        sections.append({"type": "heading", "title": "Industry Experience"})
        for entry in data["industry_experience"]:
            year_start = entry.get("year_start", "")
            year_end = entry.get("year_end", "")
            location = format_text(entry.get("location", ""))
            title = format_text(entry.get("title", ""))
            org = format_text(entry.get("organization", ""))
            notes_raw = entry.get("notes", "")
            if isinstance(notes_raw, str):
                notes = [notes_raw] if notes_raw else []
            else:
                notes = notes_raw if notes_raw else []
            sections.append(
                {
                    "type": "industry",
                    "data": {
                        "year_start": year_start,
                        "year_end": year_end,
                        "title": title,
                        "organization": org,
                        "location": location,
                        "notes": [format_text(n) for n in notes],
                    },
                }
            )

    # Skills
    if section_exists(data, "skills"):
        sections.append({"type": "heading", "title": "Skills"})
        for label, items in data["skills"].items():
            if items:
                skill_text = format_text(", ".join(items))
                sections.append(
                    {
                        "type": "skills",
                        "label": format_text(f"[b]{label[0].upper() + label[1:]}[/b]"),
                        "data": skill_text,
                    }
                )

    # References
    if section_exists(data, "references"):
        sections.append({"type": "heading", "title": "References"})
        for ref in data["references"]:
            sections.append(
                {
                    "type": "reference",
                    "data": {
                        "name": format_text(ref.get("name", "")),
                        "title": format_text(ref.get("title", "")),
                        "department": format_text(ref.get("department", "")),
                        "school": format_text(ref.get("school", "")),
                        "email": ref.get("email", ""),
                    },
                }
            )

    return sections


# ---------------------------------------------------------------------------
# Render
# ---------------------------------------------------------------------------


def _style(raw: str) -> str:
    """Convert style code to CSS value: B->bold, I->italic, ''->normal."""
    if raw == "B":
        return "bold"
    if raw == "I":
        return "italic"
    return "normal"


def render_cv(data: dict, style: dict) -> str:
    """Render the Jinja2 template with data and style variables."""
    s = style

    # Build CSS variable context
    context = {
        "font_family": s["fonts"]["family"],
        "color_text": f"#{s['colors']['text'][0]:02x}{s['colors']['text'][1]:02x}{s['colors']['text'][2]:02x}",
        "color_muted": f"#{s['colors']['muted'][0]:02x}{s['colors']['muted'][1]:02x}{s['colors']['muted'][2]:02x}",
        "color_heading": f"#{s['colors']['heading'][0]:02x}{s['colors']['heading'][1]:02x}{s['colors']['heading'][2]:02x}",
        "color_border": f"#{s['colors']['border'][0]:02x}{s['colors']['border'][1]:02x}{s['colors']['border'][2]:02x}",
        "color_link": f"#{s['colors']['link'][0]:02x}{s['colors']['link'][1]:02x}{s['colors']['link'][2]:02x}",
        "margin_top": s["page"]["margins"]["top"],
        "margin_bottom": s["page"]["margins"]["bottom"],
        "margin_left": s["page"]["margins"]["left"],
        "margin_right": s["page"]["margins"]["right"],
        "page_format": s["page"]["format"],
        "page_orientation": s["page"].get("orientation", "portrait"),
        "section_heading_size": s["section_heading"]["size"],
        "section_heading_spacing_after": s["section_heading"]["spacing_after"],
        "section_heading_border_width": s["section_heading"]["border_width"],
        "sub_heading_size": s["sub_heading"]["size"],
        "personal_name_size": s["personal"]["name"]["size"],
        "personal_name_style": _style(s["personal"]["name"]["style"]),
        "personal_contact_size": s["personal"]["contact"]["size"],
        "personal_contact_style": _style(s["personal"]["contact"]["style"]),
        "personal_notes_size": s["personal"]["notes"]["size"],
        "personal_notes_style": _style(s["personal"]["notes"]["style"]),
        "education_school_size": s["education"]["school"]["size"],
        "education_school_style": _style(s["education"]["school"]["style"]),
        "education_program_size": s["education"]["program"]["size"],
        "education_program_style": _style(s["education"]["program"]["style"]),
        "education_detail_size": s["education"]["detail"]["size"],
        "education_detail_style": _style(s["education"]["detail"]["style"]),
        "education_detail_indent": s["education"]["detail"]["indent"],
        "research_title_size": s["research"]["title"]["size"],
        "research_title_style": _style(s["research"]["title"]["style"]),
        "research_authors_size": s["research"]["authors"]["size"],
        "research_authors_style": _style(s["research"]["authors"]["style"]),
        "research_status_size": s["research"]["status"]["size"],
        "research_status_style": _style(s["research"]["status"]["style"]),
        "research_detail_size": s["research"]["detail"]["size"],
        "research_detail_style": _style(s["research"]["detail"]["style"]),
        "research_detail_indent": s["research"]["detail"]["indent"],
        "skills_item_size": s["skills"]["item_size"],
        "dashed_entry_size": s["dashed_entry"]["size"],
        "dashed_entry_style": _style(s["dashed_entry"]["style"]),
        "indent": s["indent"],
        "item_gap": s["item_gap"],
        "references_name_size": s["references"]["name"]["size"],
        "references_name_style": _style(s["references"]["name"]["style"]),
        "references_detail_size": s["references"]["detail"]["size"],
        "references_detail_style": _style(s["references"]["detail"]["style"]),
        "references_email_size": s["references"]["email"]["size"],
        "references_email_style": _style(s["references"]["email"]["style"]),
        "border_width": compute_border_width(data),
    }

    note_map = s.get("presentation_notes", {})

    # Build sections
    all_sections = build_sections(data, note_map)

    # Extract personal data for template
    personal_section = next((s for s in all_sections if s["type"] == "personal"), None)
    context["personal"] = personal_section["data"] if personal_section else None
    context["name"] = (
        personal_section["data"]["full_name"] if personal_section else "CV"
    )

    # Remove personal from sections list (rendered separately in template)
    context["sections"] = [s for s in all_sections if s["type"] != "personal"]

    # Render Jinja2 template
    env = Environment(loader=FileSystemLoader(SCRIPT_DIR))
    template = env.from_string(TEMPLATE_PATH.read_text(encoding="utf-8"))
    return template.render(**context)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    # Load inputs
    if not BLUEPRINTS_DIR.exists():
        print(f"Error: {BLUEPRINTS_DIR} not found.", file=sys.stderr)
        sys.exit(1)

    if not STYLE_PATH.exists():
        print(f"Error: {STYLE_PATH} not found.", file=sys.stderr)
        sys.exit(1)

    try:
        data = load_blueprints()
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in blueprint: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        style = load_yaml(STYLE_PATH)
    except yaml.YAMLError as e:
        print(f"Error: Invalid YAML in style: {e}", file=sys.stderr)
        sys.exit(1)

    # Render
    html = render_cv(data, style)

    # Write
    OUTPUT_PATH.write_text(html, encoding="utf-8")
    print(f"CV generated: {OUTPUT_PATH}")

    # Open in browser
    url = OUTPUT_PATH.as_uri()
    webbrowser.open(url)
    print("Opened in browser. Use Ctrl+P to save as PDF.")


if __name__ == "__main__":
    main()
