You are continuing development of the Exhibition Indoor Navigation Admin Panel.

Build Phase 2:
SVG Upload and Preview Module.

Existing Stack:

* React 19
* Vite
* Tailwind
* Zustand
* React Query
* Axios

Objectives:
Build a complete SVG upload workflow.

Features:

* Upload SVG files
* Validate SVG type
* Preview uploaded SVG
* Zoom/pan SVG
* Upload progress state
* API integration
* Error handling

Pages:

* HallUpload.jsx

Components:

* SvgUploader
* SvgPreview
* SvgCanvas
* SvgToolbar

Requirements:

* SVG preview using dangerouslySetInnerHTML
* Prepare architecture for future React-Konva migration
* Responsive layout
* Clean UI
* Proper loading states
* Error handling
* Reusable upload hooks

API:
POST /api/svg/upload

Use:

* Axios
* React Query mutation
* Zustand for SVG state

Deliverables:

* Complete upload workflow
* Modular components
* Hooks
* Store integration
* API service layer
* Modern UI

IMPORTANT:

* Keep code scalable
* Keep upload logic separate from UI
* Use reusable hooks
* Add comments
