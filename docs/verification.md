# Verification

Verified on 11 October 2026 with Node.js 24 and headless Microsoft Edge.

- All 10 unit/integration tests pass: Unicode-aware word boundaries, exact positions across formatting and lists, overlaps, repeated openings/phrases, sentence length, optional punctuation, invisible-character classification and preservation, valid Word package round trip, supported basic formatting, safe sanitisation, malformed/old/oversized/non-Word uploads and unsupported-content warnings.
- Browser smoke test passes: individual and previewed bulk replacement, correct positions after edits, ignored occurrences persisting after edits, selected cleanup, emoji joiner preservation, atomic undo/redo, valid `.docx` export and re-import, plain text download, inspection labels excluded from exported content, unsaved replacement warning, keyboard formatting/focus and no overflow at 390 px.
- Production build passes. Static assets and the editor work under `/AI-Detection/` without failed requests or runtime errors.
- Desktop and mobile screenshots were visually inspected. The review panel stacks below the editor on mobile.
- GitHub Actions also passes dependency installation, all tests and the production build.

Not verified: screen-reader testing, Safari/Firefox, every Word producer or complex Word layout fidelity. Complex Word features are explicitly unsupported. Desktop-browser mobile viewport checks do not replace testing on a physical phone. Optional personal writing-sample comparison is not implemented.
