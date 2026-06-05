# 23BQ1A4735
# Campus Notifications Microservice Portal

A production-ready, highly optimized frontend dashboard built using React, TypeScript, and Material-UI. This portal interfaces with a secure campus evaluation backend to retrieve, process, rank, and track real-time academic, placement, and event bulletins.

---

## 🚀 Key Architectural Features

### 1. Stage 1: Algorithmic Priority Ranking
Instead of relying on heavy database sorting queries, the platform processes incoming notification arrays instantly in memory using an optimized deterministic sort matrix:
- **Chronological Primary Sort:** Bulletins are parsed into epoch millisecond integers to guarantee true real-world recency delivery.
- **Categorization Weight Tie-Breaking:** If multiple campus updates share an identical timestamp, an immutable tie-breaking weight handles the precedence mapping:
  - `Placement` (Weight = 3)
  - `Result` (Weight = 2)
  - `Event` (Weight = 1)
- **Render Frame Optimization:** Pre-maps categories and dates into a localized sorting collection prior to computation cycles, eliminating expensive garbage-collection and recalculation overhead on active UI render frames.

### 2. Stage 2: Dual-Tab Dashboard
- **Priority Inbox:** Surfaces the exact **Top 10** highest ranking, most critical campus records dynamically calculated by the Stage 1 sorting algorithm.
- **All Bulletins Feed:** Provides a comprehensive stream layout featuring localized categorical dropdown filters to drill down into historical records.
- **Persistent State Tracking:** Implements an in-memory lifecycle state engine that instantly tracks user read actions, triggering dynamic visual transitions (color strip and text opacity changes) to signal read/unread records.

### 3. Production Middleware Logger & CORS Proxy Integration
- **Zero-Trust Token Auth:** Attaches secure session JWT bearer authentication headers to both data fetch frames and outgoing system log telemetry pipes.
- **Vite Reverse Proxy Engine:** Configures an internal `/api-gateway` dev intercept proxy to cleanly bypass browser Cross-Origin Resource Sharing (CORS) policy sandboxing, eliminating cross-origin connection failures.
- **Granular Activity Tracking:** Directly maps into the localized console framework and updates a remote evaluation service log repository during critical operational lifecycles (initial app boot, dashboard tab swiping, logging filter modifications, and user card select intents).

---

## 📂 Directory Structure

```text
23BQ1A4735/
├── logging_middleware/       # System log parser utilities
│   └── logger.ts             # Auth-validated console & remote server log pipe
├── notification_app_be/      # Backend microservice track reference
│   └── README.md             # Functional placeholder document
├── notification_app_fe/      # Core frontend dashboard track implementation
│   ├── src/
│   │   ├── utils/
│   │   │   └── prioritySort.ts # Stage 1 weight-chronological algorithm
│   │   ├── App.tsx           # Stage 2 responsive portal and interface hooks
│   │   └── main.tsx          # React application bootstrapping root
│   ├── vite.config.ts        # Port 3000 mapping and proxy intercept gateway rules
│   └── tsconfig.json         # TypeScript compiler configurations
└── notification_system_design.md # Full system architecture, database, & scalability document
