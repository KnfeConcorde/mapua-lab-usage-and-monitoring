# mapua-lab-usage-and-monitoring
A repository for the Electronics Lab Usage and Monitoring for Mapua University Library


# juan carlos v. soriano

## Project scaffold

This repository now contains a minimal Node/Express backend and a Vite + React frontend.

Server (backend): `server` — accepts XLSX uploads, parses them with `xlsx`, and stores parsed sheets in `server/db.json` using `lowdb` (JSON file storage).

Client (frontend): `client` — Vite + React app with a simple upload UI that posts files to the server.

Run the server:

```bash
cd server
npm install
npm run dev
```

Run the client:

```bash
cd client
npm install
npm run dev
```

API endpoints:
- `POST /api/upload` — form upload with field name `file` (accepts `.xls`/`.xlsx`), stores parsed JSON.
- `GET /api/data` — returns the stored parsed data.

If you'd like me to add a root-level script to run both concurrently or add a GitHub Actions workflow, tell me and I can add it.
# AI Assistant Use Case

AI tools can help the development team move faster and reduce friction while implementing features and QA. Practical uses for this project include:

- Generate parsers and mapping code: create functions that convert uploaded XLSX sheets into the app's JSON shape, plus sample mappings and validation rules.
- Create frontend components and tests: scaffold React components, forms, and unit/integration tests from user stories.
- Produce API docs and example requests: auto-generate OpenAPI specs, cURL examples, and Postman collections for the backend endpoints.
- Write data validation and sanitization rules: propose and implement rules (e.g., required columns, types, row-level checks) and generate error messages.
- Produce seed data and transformation scripts: synthesize realistic test XLSX files and scripts to transform them into desired formats.
- Code reviews and refactor suggestions: analyze diffs, suggest improvements, and generate small refactor patches or commit messages.
- CI automation and workflow creation: generate GitHub Actions workflows for linting, testing, and deployment.

If you'd like, I can generate specific artifacts now (validation rules, example XLSX, API spec, or CI workflow). Tell me which one to start with.

# mapua-lab-usage-and-monitoring
A repository for the Electronics Lab Usage and Monitoring for Mapua University Library


# juan carlos v. soriano 
