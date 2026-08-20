#!/usr/bin/env python3
"""
Generate small real PDF demo files for the study materials section.
Pure-python minimal PDF writer (no dependencies). Files are clearly demo
content that gets replaced by real uploads through the dashboard.
"""

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "demo-files"


def esc(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_pdf(title: str, lines: list[str]) -> bytes:
    """Build a one-page PDF with Helvetica text lines."""
    content_lines = [
        "BT",
        "/F1 20 Tf",
        "50 760 Td",
        f"({esc(title)}) Tj",
        "0 -30 Td",
        "/F1 11 Tf",
    ]
    for line in lines:
        content_lines.append(f"({esc(line)}) Tj")
        content_lines.append("0 -18 Td")
    content_lines.append("ET")

    stream = "\n".join(content_lines).encode("latin-1", errors="replace")

    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        b"<< /Length %d >>\nstream\n%s\nendstream" % (len(stream), stream),
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]

    pdf = b"%PDF-1.4\n"
    offsets = []
    for i, obj in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf += b"%d 0 obj\n" % i
        pdf += obj + b"\nendobj\n"
    xref_pos = len(pdf)
    pdf += b"xref\n0 %d\n" % (len(objects) + 1)
    pdf += b"0000000000 65535 f \n"
    for off in offsets:
        pdf += b"%010d 00000 n \n" % off
    pdf += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (
        len(objects) + 1,
        xref_pos,
    )
    return pdf


FILES = [
    (
        "algebra-summary-1st.pdf",
        "Complete Algebra Summary — 1st Secondary",
        [
            "DEMO FILE — replace with the real document from the dashboard.",
            "",
            "Laws of exponents:",
            "  a^m x a^n = a^(m+n)      (a^m)^n = a^(m*n)      a^0 = 1",
            "",
            "Solving linear equations:",
            "  Isolate the variable using inverse operations on both sides.",
            "",
            "Slope of a line through (x1,y1), (x2,y2):",
            "  m = (y2 - y1) / (x2 - x1)",
            "",
            "Trigonometric ratios (right triangle):",
            "  sin A = opposite / hypotenuse",
            "  cos A = adjacent / hypotenuse",
            "  tan A = opposite / adjacent",
            "",
            "Practice questions with answers are provided in class.",
        ],
    ),
    (
        "calculus-model-answers.pdf",
        "Model Answers — Calculus Exam",
        [
            "DEMO FILE — replace with the real document from the dashboard.",
            "",
            "Q1. lim(x->0) sin(x)/x = 1",
            "    Standard limit result.",
            "",
            "Q2. d/dx (x^3) = 3x^2",
            "    Power rule: d/dx (x^n) = n*x^(n-1).",
            "",
            "Q3. Integral of 2x dx = x^2 + C",
            "    Since d/dx (x^2) = 2x.",
            "",
            "Q4. Slope of tangent to y = x^2 at x = 1:",
            "    dy/dx = 2x, so m = 2.",
            "",
            "Full worked solutions for every question are covered in the",
            "revision sessions.",
        ],
    ),
    (
        "trig-laws-sheet.pdf",
        "Trigonometry Laws — Complete Sheet",
        [
            "DEMO FILE — replace with the real document from the dashboard.",
            "",
            "Standard values:",
            "  sin 30 = 1/2   sin 45 = 1/sqrt(2)   sin 60 = sqrt(3)/2",
            "  cos 30 = sqrt(3)/2  cos 45 = 1/sqrt(2)  cos 60 = 1/2",
            "",
            "Basic identities:",
            "  sin^2 A + cos^2 A = 1",
            "  tan A = sin A / cos A",
            "",
            "Solving right triangles:",
            "  Pythagorean theorem: a^2 + b^2 = c^2",
            "",
            "Use this sheet during revision — not during the exam!",
        ],
    ),
    (
        "exam-night-review.pdf",
        "Exam-Night Review — 3rd Secondary",
        [
            "DEMO FILE — replace with the real document from the dashboard.",
            "",
            "THE NIGHT BEFORE THE EXAM:",
            "  1. Review the formula sheet (10 minutes).",
            "  2. Solve ONE short mock exam under time pressure.",
            "  3. Read the most common mistakes list.",
            "  4. Sleep early — a rested mind solves faster.",
            "",
            "Common mistakes to avoid:",
            "  - Forgetting to write units in word problems.",
            "  - Sign errors when moving terms across =.",
            "  - Skipping the verification step in equations.",
        ],
    ),
    (
        "functions-exercises.pdf",
        "Functions Exercises — With Full Solutions",
        [
            "DEMO FILE — replace with the real document from the dashboard.",
            "",
            "Exercise set (graded by difficulty):",
            "  1. If f(x) = 2x + 1, find f(3).        [Answer: 7]",
            "  2. Find the domain of f(x) = sqrt(x - 2). [Answer: x >= 2]",
            "  3. Sketch y = x^2 - 4 and find its roots. [Roots: -2, 2]",
            "",
            "Full worked solutions follow on the next pages.",
        ],
    ),
    (
        "midyear-schedule.pdf",
        "Mid-Year Revision Schedule",
        [
            "DEMO FILE — replace with the real document from the dashboard.",
            "",
            "Week 1: Algebra (30 min/day) + Trigonometry (20 min/day)",
            "Week 2: Geometry proofs + Solid geometry basics",
            "Week 3: Past exam papers, one per day, timed",
            "Week 4: Mistakes notebook review + light practice only",
            "",
            "Tip: revise in 45-minute blocks with 10-minute breaks.",
        ],
    ),
]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, title, lines in FILES:
        (OUT / name).write_bytes(build_pdf(title, lines))
        print(f"OK {name} ({OUT / name} size={ (OUT / name).stat().st_size } bytes)")


if __name__ == "__main__":
    main()
