# JD Document Review

A responsive, browser-only Word editor with deterministic writing suggestions. It runs on GitHub Pages with no backend, AI service, account or API key. Branding reuses the orange `jd` mark and JD TECHNOLOGY wordmark from the JD Technologies project.

## Local setup

Use Node.js 22 or newer and pnpm 11.25.0:

```sh
npm install -g pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm dev
```

Open the printed localhost URL. `pnpm test` runs the rule and Word round-trip/security tests. `pnpm build` produces `dist/`. For the browser smoke test, install Microsoft Edge and run `node tests/browser.mjs` while the dev server is running. The browser test uses headless Edge and saves screenshots in `docs/screenshots/`. On systems without Edge, change its Playwright launch channel or install a supported browser.

## GitHub Pages

The `.github/workflows/pages.yml` workflow installs locked dependencies, tests, builds and deploys on pushes to `main`, or through a manual workflow dispatch. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The repository Pages address is expected to be `https://jonnyd99-max.github.io/AI-Detection/`; it is only live after a successful deployment. Relative Vite asset paths also support custom domains. No deployment secrets are needed.

## Editing and review

Upload a `.docx`, paste text, start a blank document or load the demo. Edit headings, paragraphs, bold, italic and lists with keyboard shortcuts or the toolbar. Findings recalculate on edits and decorations never become document content. Click a finding or highlight, review alternatives, enter your own replacement, ignore an occurrence or rule, or preview a rule’s replacements before applying them together. Overlapping replacements are rejected for individual review. Undo/redo includes typing, replacements and cleanup. Replacing a document clears history after an unsaved-edit warning. The session change summary lists editing actions, including undo/redo; it is not Word tracked changes.

The editable phrase list and all ignore preferences last for this tab. Rule matches use Unicode word boundaries and case-aware alternatives. Rules flag long sentences (over 35 words), repeated three-word phrases and sentence openings (at least three occurrences), and optional excessive punctuation. Suggestions may be inappropriate in context and are never evidence of AI authorship. There is no authorship score or bypass claim.

Invisible-character review covers zero-width spaces, non-breaking spaces, narrow non-breaking spaces, word joiners, soft hyphens, embedded FEFF, joiners/non-joiners and bidirectional controls. Inspection labels are view-only. Previewed cleanup initially selects zero-width spaces, ordinary non-breaking spaces, soft hyphens and embedded FEFF. Deselect any that you need. Initial FEFF, narrow spaces, word joiners, emoji/language joiners and direction controls are preserved by default and can be reviewed individually. Cleanup is not removal of statistical text watermarks.

## Word support and limitations

Import/export preserves basic headings, paragraphs, bold, italic and bullet/numbered lists. Word is converted to a simplified editable document; exact font, colour, spacing, page layout, nested numbering style and pagination fidelity are not promised. Complex layouts, tables, images, headers/footers, footnotes/endnotes, comments, hyperlinks, fields and tracked changes are unsupported. Import detects common unsupported structures and warns before importing simplified content; it also always shows the general limitations. Check the result against your original and keep the original file. Some table text may remain as paragraphs; structure is omitted. Numbered list continuation/start fidelity can vary on import. Plain text downloads omit all formatting. Older `.doc` files must be saved as `.docx` in Word.

Upload limit: 10 MB, 2,000 ZIP entries and 30 MB expanded content. Pasted text is limited to 150,000 characters; very long documents or heavily repetitive text can be slow. The panel displays the first 250 findings in a filter; resolving them reveals more. Encrypted, corrupted or non-Word archives produce helpful errors. This is a focused wording editor, not a full Microsoft Word replacement.

## Privacy and security

Documents are processed in browser memory, never uploaded or automatically saved. Closing or reloading the tab loses the document. There are no analytics, remote fonts or runtime CDN dependencies. Imported and pasted HTML is sanitised with DOMPurify and restricted to the supported editor structure; embedded scripts, attributes, links and images are removed. Mammoth external-file access is disabled. Dictionary/thesaurus links open Merriam-Webster in a new tab with `noopener noreferrer` and send only the selected word. External providers have their own privacy policies; synonyms can change meaning.

The app works without internet once its assets have loaded in the current tab; it does not install a service worker or guarantee offline reload. Optional writing-sample comparison is not implemented. No document persistence is included.
