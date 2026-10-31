# Tesla Learning & Performance Reports

SkillWill Swiss College - Front-End Development Final Practical Project
Student: Giorgi Gochitidze
Live Application: https://tesla-learning-performance-reports.vercel.app/

## 1. Project Overview

Tesla Learning & Performance Reports is a responsive learning analytics dashboard designed to track employee progress, quiz completions, and performance metrics in real time. The application operates offline-first using client-side data persistence with zero network latency.

## 2. Technology Stack

* React 19: Declarative UI structure and Virtual DOM reconciliation for smooth updates.
* TypeScript: Strict type safety across data pipelines (FilterState, UserLeaderboardItem, CourseItem, ActivityLogItem).
* Vite 8: Modern bundler with Hot Module Replacement (HMR) and fast build execution.
* Tailwind CSS v4: Utility-first CSS engine using direct @import for zero-runtime CSS overhead.
* GSAP (@gsap/react): High-performance 60fps GPU-accelerated DOM sequence animations.
* Framer Motion (motion/react): Spring gesture physics for mobile navigation drawers and modal transitions.

## 3. Project Implementation Plan

* Phase 1: Requirement gathering, data model definition, and folder architecture setup.
* Phase 2: Core StorageService development, LocalStorage integration, and UI Shell setup.
* Phase 3: Custom SVG chart engines, GSAP timeline integration, and quiz simulator logic.
* Phase 4: WCAG accessibility checks, TypeScript type validation, and Vercel Edge deployment.

## 4. Risk Assessment & Mitigations

* Risk: Heavy array operations causing interface delay.
  Mitigation: Wrapped analytics calculations inside React useMemo hooks.
* Risk: GSAP animation memory leaks on unmount.
  Mitigation: Used useGSAP with scoped container references (containerRef).
* Risk: LocalStorage state synchronization across components.
  Mitigation: Dispatched custom browser events (tesla_storage_updated) on state mutation.
* Risk: SPA 404 routing errors on page refresh in production.
  Mitigation: Configured vercel.json rewrite rules pointing all routes to index.html.

## 5. Directory Architecture

src/
├── components/
│   ├── pages/         (Activities, Library, People, Settings)
│   ├── public/        (Landing, About, Auth)
│   ├── ActivityChart.tsx
│   ├── FiltersBar.tsx
│   ├── Header.tsx
│   ├── MetricCards.tsx
│   ├── Sidebar.tsx
│   └── SparklineChart.tsx
|   |__ etc...
├── services/
│   └── storage.ts     (StorageService & Event Engine)
├── data/              (Mock data seeds)
├── types.ts           (TypeScript interfaces)
├── App.tsx            (Root component)
└── main.tsx           (Application entry point)

## 6. Performance Optimization

1. Zero-dependency custom SVG path rendering instead of heavy chart libraries.
2. GPU hardware compositing using transform3d, opacity, and scale properties.
3. Client-side memoized data transformations (map, filter, reduce) executed on state mutation only.

## 7. Local Setup & Installation

1. Clone the repository:
   git clone https://github.com/GiorgiGochitidze/tesla-learning---performance-reports

2. Install dependencies:
   pnpm install

3. Run development server:
   pnpm run dev

4. Build production bundle:
   pnpm run build

## 8. Deployment

Hosted on Vercel Edge with continuous integration connected to the main branch.
Routing rewrite configuration in vercel.json:

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}