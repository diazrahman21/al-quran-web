# Al-Quran Website - Next.js Project

## Project Setup Progress

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Next.js Al-Quran website
- [x] Scaffold the Project - Manual structure created
- [x] Customize the Project - Al-Quran homepage and types added
- [x] Install Required Extensions - Not needed
- [x] Compile the Project - Dependencies installed successfully
- [x] Create and Run Task - Dev server running at http://localhost:3000
- [x] Launch the Project - Application is live
- [x] Ensure Documentation is Complete - README.md created

## Project Overview
This is a modern Al-Quran website built with Next.js featuring:
- Quran text display with Arabic script
- Translations in multiple languages
- Audio recitation player
- Search functionality
- Responsive design
- Dark/light mode support

## Technology Stack
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- API: Al-Quran Cloud API or similar


## vexp <!-- vexp v3.5.1 -->

### Context strategy: call run_pipeline ONCE at task start
If the task already names the files/symbols to touch, skip run_pipeline. Otherwise one
`run_pipeline({ "task": "..." })` returns ranked pivot files with line ranges and
blast radius. Do NOT open files one by one to find your way around - every extra
tool call costs a turn. Call it again ONLY when the task moves to a new area.
`get_skeleton` for files to understand, not edit. `verify_done` before calling a
multi-file task complete, then RUN the tests it names.

### Query shape (do this)
Anchor the task on real identifiers (ClassName, functionName) or file paths:
`run_pipeline({ "task": "fix JWT expiry in AuthService.validateToken" })`

vexp runs entirely on this machine, index in `.vexp/`;
`run_pipeline` transmits nothing to any external service.
On `status: "degraded"` or 0 pivots the index is still building - use your own tools.
For literal string sweeps use your native search - do NOT route text sweeps through vexp.
Repo SOURCE only: logs, dist/, node_modules/ and files outside the repo are NOT indexed.
<!-- /vexp -->