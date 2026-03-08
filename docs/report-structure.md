# Report Structure

## Export flow

1. Load persisted graph via report assembler (`project -> areas -> findings -> images`).
2. Map to export domain model.
3. Map domain to export view model (with warnings).
4. Build DOCX payload via adapter.
5. Save file locally and return `file://` share URI.

## Hebrew DOCX known limitations

- Some DOCX renderers do not fully honor RTL paragraph direction when Hebrew and numerals are mixed in the same run.
- When Hebrew + numbers appear together (example: `2 מ"מ`), punctuation may jump to unexpected positions.
- Embedded image caption alignment can differ between desktop Word and mobile viewers.

## Fallback strategy

- Keep the canonical export view model text plain and un-reordered.
- Emit non-blocking warnings for missing conclusion, cost, missing image links, and missing image files.
- If high-fidelity Hebrew typography is required, provide PDF fallback generated from a browser RTL template while keeping DOCX as editable output.
