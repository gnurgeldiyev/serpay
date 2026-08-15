#!/usr/bin/env python3
"""Extract every work from Gurbannazar Ezizow's "Saýlanan eserler" PDF.

The edition has a regular layout: named works start with a 14pt italic
heading, while untitled poems start after a centered ``* * *`` separator.
Book pages 231-262 contain five long poems, where stars are section breaks
rather than new works.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import unicodedata
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

try:
    from pypdf import PdfReader
except ImportError as error:  # pragma: no cover - depends on local tooling
    raise SystemExit("pypdf is required: python3 -m pip install pypdf") from error


FIRST_POETRY_PDF_PAGE = 38
LAST_POETRY_PDF_PAGE = 299
PDF_TO_BOOK_PAGE_OFFSET = 37
LAST_SHORT_POEM_BOOK_PAGE = 230
TITLE_FONT_SIZE = 14.0
BODY_LINE_HEIGHT = 11.95
STANZA_GAP = 17.5


@dataclass
class Fragment:
    text: str
    pdf_page: int
    book_page: int
    x: float
    y: float
    font_size: float
    font_name: str

    @property
    def is_italic(self) -> bool:
        return "italic" in self.font_name.lower()


@dataclass
class Work:
    title: str | None
    title_type: str
    source_book_page: int
    source_pdf_page: int
    fragments: list[Fragment] = field(default_factory=list)


def clean_text(value: str) -> str:
    """Repair known extraction glyphs and return canonical Unicode."""
    return unicodedata.normalize(
        "NFC",
        value.replace("“", "Ş")
        .replace("ﬁ", "fi")
        .replace("ﬂ", "fl")
        .replace("\u00ad", "")
        .replace("/hyphen.alt", ""),
    )


def expand_fragment(fragment: Fragment) -> list[Fragment]:
    """Expand a pypdf text callback containing multiple lines."""
    lines = fragment.text.splitlines()
    return [
        Fragment(
            text=line.rstrip(),
            pdf_page=fragment.pdf_page,
            book_page=fragment.book_page,
            x=fragment.x,
            y=fragment.y - index * BODY_LINE_HEIGHT,
            font_size=fragment.font_size,
            font_name=fragment.font_name,
        )
        for index, line in enumerate(lines)
        if line.strip()
    ]


def extract_fragments(reader: PdfReader) -> list[Fragment]:
    fragments: list[Fragment] = []

    for pdf_page in range(FIRST_POETRY_PDF_PAGE, LAST_POETRY_PDF_PAGE + 1):
        page_fragments: list[Fragment] = []
        book_page = pdf_page - PDF_TO_BOOK_PAGE_OFFSET

        def visitor(
            text: str,
            _cm: list[float],
            tm: list[float],
            font: dict[str, Any] | None,
            font_size: float,
        ) -> None:
            cleaned = clean_text(text)
            if not cleaned.strip() or tm[5] < 40:
                return
            page_fragments.extend(
                expand_fragment(
                    Fragment(
                        text=cleaned,
                        pdf_page=pdf_page,
                        book_page=book_page,
                        x=float(tm[4]),
                        y=float(tm[5]),
                        font_size=float(font_size),
                        font_name=str((font or {}).get("/BaseFont", "")),
                    )
                )
            )

        reader.pages[pdf_page - 1].extract_text(visitor_text=visitor)
        fragments.extend(page_fragments)

    return fragments


def split_works(fragments: list[Fragment]) -> list[Work]:
    works: list[Work] = []
    current: Work | None = None

    for fragment in fragments:
        stripped = fragment.text.strip()
        is_named_title = fragment.font_size >= TITLE_FONT_SIZE
        is_untitled_boundary = (
            stripped == "* * *"
            and fragment.book_page <= LAST_SHORT_POEM_BOOK_PAGE
        )

        if is_named_title or is_untitled_boundary:
            if current is not None:
                works.append(current)
            current = Work(
                title=stripped if is_named_title else None,
                title_type="named" if is_named_title else "first_line",
                source_book_page=fragment.book_page,
                source_pdf_page=fragment.pdf_page,
            )
            continue

        if current is not None:
            current.fragments.append(fragment)

    if current is not None:
        works.append(current)

    return works


def strip_trailing_separator(fragments: list[Fragment]) -> list[Fragment]:
    result = list(fragments)
    while result and result[-1].text.strip() == "* * *":
        result.pop()
    return result


def extract_note_fragments(fragments: list[Fragment]) -> tuple[list[Fragment], list[Fragment]]:
    """Treat leading small italic text as a dedication or epigraph note."""
    notes: list[Fragment] = []
    body = list(fragments)
    while body and body[0].is_italic and body[0].font_size < 12:
        notes.append(body.pop(0))
    return notes, body


def extract_metadata_fragments(
    fragments: list[Fragment],
) -> tuple[list[str], list[Fragment], list[Fragment]]:
    """Separate dates, epigraphs, and footnotes printed in smaller type."""
    years: list[str] = []
    notes: list[Fragment] = []
    body: list[Fragment] = []

    for fragment in fragments:
        text = fragment.text.strip()
        if fragment.font_size >= 9.5:
            body.append(fragment)
            continue
        if re.fullmatch(r"(?:\d{1,2}\.\d{1,2}\.)?\d{4}", text):
            years.append(text)
            continue
        # Superscript footnote references are not part of the verse. Footnote
        # definitions sit in the left page margin, while small centered text is
        # an epigraph and belongs in notes.
        if fragment.font_size < 7.5 and fragment.x >= 100:
            continue
        notes.append(fragment)

    return years, notes, body


def render_fragments(fragments: list[Fragment], preserve_indent: bool = True) -> str:
    if not fragments:
        return ""

    meaningful_x = [fragment.x for fragment in fragments if fragment.text.strip() != "* * *"]
    baseline_x = min(meaningful_x, default=0)
    lines: list[str] = []
    previous: Fragment | None = None

    for fragment in fragments:
        text = fragment.text.strip()
        if not text:
            continue

        indent = 0
        if preserve_indent and text != "* * *":
            indent = max(0, round((fragment.x - baseline_x) / 24))
            # Very large offsets are line-wrap artifacts from the PDF's two
            # column text boxes, not intentional verse indentation. Section
            # numerals in the long poems are headings and should stay flush.
            if indent >= 7 or re.fullmatch(r"[IVXLCDM]+", text):
                indent = 0
        rendered = "\t" * indent + text

        if previous is not None:
            same_page = fragment.pdf_page == previous.pdf_page
            same_line = same_page and abs(fragment.y - previous.y) < 1
            visual_gap = previous.y - fragment.y if same_page else STANZA_GAP + 1

            if same_line:
                separator = "" if lines[-1].endswith((" ", "-", "—", "–")) else " "
                lines[-1] = f"{lines[-1]}{separator}{rendered.lstrip()}"
                previous = fragment
                continue
            if visual_gap > STANZA_GAP and lines and lines[-1] != "":
                lines.append("")

        lines.append(rendered)
        previous = fragment

    return "\n".join(lines).strip()


def untitled_title(content: str) -> str:
    parts: list[str] = []
    total_length = 0

    for raw_line in content.splitlines():
        line = raw_line.strip().replace("«", "").replace("»", "")
        if not line:
            continue
        parts.append(line)
        total_length += len(line)
        # Human-edited first-line titles use one full display line unless it is
        # unusually short; short fragments continue for at most three lines.
        if total_length >= 28 or len(parts) == 3:
            break

    title = " ".join(parts).strip()
    title = title.rstrip(".,;:!?…—–- ")
    return f"{title}..."


def serialize_work(work: Work, position: int) -> dict[str, Any]:
    fragments = strip_trailing_separator(work.fragments)
    years, small_note_fragments, body_fragments = extract_metadata_fragments(fragments)
    leading_note_fragments, body_fragments = extract_note_fragments(body_fragments)
    content = render_fragments(body_fragments)
    small_notes = render_fragments(small_note_fragments, preserve_indent=False)
    leading_notes = render_fragments(leading_note_fragments, preserve_indent=False)
    notes = "\n".join(note for note in (leading_notes, small_notes) if note) or None
    title = work.title.strip("«» ") if work.title else untitled_title(content)

    return {
        "position": position,
        "title": clean_text(title),
        "title_type": work.title_type,
        "content": content,
        "notes": notes,
        "year": ", ".join(years) or None,
        "source_book_page": work.source_book_page,
        "source_pdf_page": work.source_pdf_page,
    }


def extract(pdf_path: Path) -> dict[str, Any]:
    reader = PdfReader(str(pdf_path))
    if len(reader.pages) != 300:
        raise ValueError(f"Expected 300 PDF pages, found {len(reader.pages)}")

    works = [
        serialize_work(work, index)
        for index, work in enumerate(split_works(extract_fragments(reader)), start=1)
    ]
    empty = [work["position"] for work in works if not work["content"]]
    if empty:
        raise ValueError(f"Extracted works without content: {empty}")
    if len(works) != 245:
        raise ValueError(f"Expected 245 works, extracted {len(works)}")

    return {
        "poet": {
            "fullname": "Gurbannazar Ezizow",
            "url": "gurbannazar-ezizow",
        },
        "source": {
            "title": "Saýlanan eserler",
            "publisher": "BEREKET-BINA",
            "publication_year": 1995,
            "pdf_pages": len(reader.pages),
            "poetry_book_pages": "1-262",
        },
        "extraction": {
            "work_count": len(works),
            "named_count": sum(work["title_type"] == "named" for work in works),
            "first_line_title_count": sum(
                work["title_type"] == "first_line" for work in works
            ),
        },
        "poems": works,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("data/pdf/gurbannazar-ezizow-saylanan-eserler.json"),
    )
    args = parser.parse_args()

    if not args.pdf.is_file():
        raise SystemExit(f"PDF not found: {args.pdf}")

    result = extract(args.pdf)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Extracted {result['extraction']['work_count']} works to {args.output} "
        f"({result['extraction']['named_count']} named, "
        f"{result['extraction']['first_line_title_count']} first-line titles)."
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Extraction failed: {error}", file=sys.stderr)
        raise
