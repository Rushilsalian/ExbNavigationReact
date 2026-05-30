Exhibition Indoor Navigation System
Project Overview

The React Admin Panel is a web-based management system for configuring exhibition hall navigation. It allows admins to upload SVG hall layouts, configure booths, define navigation paths, manage exhibitors, and prepare data for kiosk/mobile navigation systems.

Objectives
Upload and manage exhibition hall layouts
Configure booth positioning dynamically
Build navigation graph visually
Manage exhibitors and hall data
Support scalable multi-hall navigation
Provide APIs-ready data for Flutter kiosk/mobile app
Tech Stack
React + Vite
Tailwind CSS
React Router DOM
React Query
Zustand
React-Konva
Axios
Core Modules
1. Authentication (Optional Initial MVP)
Features
Admin login
Session management
Role-based access (future)
2. Dashboard
Features
Exhibition statistics
Total halls
Total booths
Recent uploads
Quick actions
3. Hall Management
Features
Create exhibition halls
Upload SVG layouts
SVG preview
Hall metadata management
Multi-hall support
Requirements
SVG validation
Store hall dimensions
Support large SVG layouts
4. Booth Mapping Module
Features
Interactive SVG booth selection
Drag/drop booth positioning
Resize/edit booths
Booth property editor
Booth coordinate management
Booth Properties
Booth number
Exhibitor name
Position
Width/height
Rotation
Shape type
5. Navigation Graph Editor
Features
Create navigation nodes
Connect graph edges
Define walkable paths
Junction creation
Entry/exit configuration
Multi-hall connectors
Node Types
Walkway
Entry
Exit
Escalator
Lift
Junction
6. Route Preview Module
Features
Simulate navigation routes
Route visualization
Path highlighting
Multi-hall route rendering
7. Exhibitor Management
Features
Add exhibitors
Assign booths
Search exhibitors
Edit exhibitor details
8. SVG Rendering Engine
Features
Zoom/pan support
Touch-friendly interactions
Dynamic SVG overlays
Route overlays
Node overlays
Functional Requirements
SVG Upload
Upload SVG layouts
Validate SVG structure
Parse SVG elements
Preview before saving
Booth Mapping
Dynamic coordinate system
Real-time editing
Persistent booth storage
Navigation System
Graph-based route configuration
Dynamic path generation
Multi-floor/hall routing support
Non-Functional Requirements
Performance
Support very large SVG files
Smooth zoom/pan rendering
Optimized node rendering
Scalability
Multi-exhibition support
Thousands of booths support
Large hall layouts support
Maintainability
Component-based architecture
Modular services
Reusable UI components
Future Enhancements
AI booth recommendations
Crowd heatmaps
QR navigation
Real-time visitor tracking
Analytics dashboard
Multi-user collaboration
Deployment
Frontend Deployment
Vercel
MVP Scope
Included
SVG upload
Hall management
Booth mapping
Navigation graph editor
Route preview
Excluded
AI features
Visitor analytics
Live tracking
QR routing