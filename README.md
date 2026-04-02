# StackGuard — Security Dashboard

This is a frontend assessment project for a security dashboard that helps teams monitor leaked secrets, non-human identities (NHIs), and overall risk across cloud and VCS environments. I built it to match a Figma design as closely as possible while keeping the code clean and easy to follow.

---

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. You'll land on the login page. Use these credentials:

```
Email:    admin@stackguard.io
Password: password123
```

---

## What I built

### Authentication & Route Protection

The login form validates credentials on the client side. On success it sets a cookie called `sg_auth` with a 1-day expiry. There's a Next.js middleware file (`src/middleware.ts`) that runs before every page request and checks for that cookie. If it's missing, it redirects you to `/login` and saves where you were trying to go in a `?next=` query param so you land in the right place after logging in. If you're already logged in and try to visit `/login`, it sends you straight to the dashboard instead.

Logout works it expires the cookie immediately before redirecting, which is the important part. A lot of people just do `router.push('/login')` for logout, but that doesn't actually clear the session token so the middleware just bounces you back. Had to make sure that cookie is gone first.

### Dashboard Overview

The main dashboard page has three sections:

- **Two gauge charts** (Overall risk score and Secrets by severity) — these are hand-rolled SVG arcs, not a charting library component. I did it this way because Recharts' radial chart has a lot of padding and quirks that made it nearly impossible to match the Figma design closely. Drawing the arc paths directly with SVG math gave me full control.

- **Risk trend over time** — a Recharts line chart showing risk score percentage over 5 days. Has proper axis labels, percentage tick formatter, and inner padding on the X-axis so the first data point isn't jammed against the edge.

- **Quick summary panel** — a list of key metrics (monitored tokens, total NHIs, secrets, etc.) with icons and divider lines between rows.

The layout is a 3-column bento grid at `lg:` breakpoint (1024px+), stacking vertically on smaller screens.

### VCS Findings Table

A table of detected secrets across version control systems. Each row shows the repository, detector type (with its icon), severity badge, status, and date. You can sort by columns, filter by severity/status/source, and paginate through results. Clicking "View Blast Radius" on a row deep-links to the graph view with the right detector preselected.

### Blast Radius Visualization

This was the most interesting part to design. The idea is: if a secret is leaked, what's the real damage? The view answers that by showing a directed graph — left to right — of the trust chain:

```
Service → Auth Key → Scopes → Permissions
```

Each detector (Sendgrid, Postman, OpenAI) has completely different raw data shapes, so I wrote a transformation layer in `src/lib/blast-radius.ts` that normalizes all of them into a common `{ nodes, edges }` format that ReactFlow can render.

I used ReactFlow instead of D3 because D3 requires you to manipulate the DOM directly, which fights React's rendering model. ReactFlow is declarative and gives you pan/zoom, minimap, and custom node types for free.

Risk is color-coded per node — full access keys and public workspace exposure get flagged as Critical, write permissions as High, read-only as Low.

The graph page reads a `?id=` query param from the URL so VCS table rows can link directly to the right detector. This also means the URL is shareable — a team member can send a link and the recipient lands on exactly the right blast radius view.

### Sidebar

Collapsible sidebar with main nav items and a Findings sub-navigation tree (VCS, Cloud IAM, Cloud storage, etc.). The collapse animation uses a CSS transition on the width. Sub-items have a subtle vertical line connector to visually show the parent-child relationship.

---

## Design decisions worth mentioning

**Why SVG arcs instead of Recharts for the gauges?**
Recharts' `RadialBarChart` has hardcoded internal padding that was almost impossible to override. After a couple of attempts I just wrote the SVG path directly. It's really not that much code — a single `<path d="M x y A r r 0 0 1 x2 y2 ..." />` — and it was way easier to control exactly where things landed.

**Why cookies for auth instead of localStorage?**
Because the middleware runs on the server/edge, it can't read `localStorage`. Cookies are sent with every request automatically, which is exactly what middleware needs. `localStorage` would only help for client-side route guards, which are much weaker (a user can just delete the guard code in DevTools and access the page anyway).

**Why Recharts for charts at all then?**
The line chart and bar chart are straightforward enough that Recharts handles them well. The tricky gauge shapes are the exception, not the rule.

**Blast Radius graph layout**
Nodes are positioned with a simple deterministic grid: fixed horizontal spacing between trust levels, and vertical positions calculated by centering siblings around `y = 0`. ReactFlow's `fitView` then frames the whole graph automatically. I considered a force-directed layout (like D3-force) for the graph but the DAG structure here is always left-to-right with clear layers, so a grid layout is actually more readable than a force layout would be.

---

## What I'd do with more time

- **Real authentication** — right now credentials are hardcoded in the login form. Properly this would be a POST to a backend endpoint that issues a signed JWT or session token. The cookie would contain that token, not just a hardcoded `"true"` string, and the middleware would verify the signature.

- **Live data** — everything currently uses static mock data in `src/data/`. Swapping to real API calls would just mean replacing the mock imports with fetch calls in server components or React Query hooks on the client side.

- **More blast radius detectors** — only Sendgrid, Postman, and OpenAI are handled. Adding a new detector is straightforward (write a transform function, export it from `getBlastRadiusGraph`), but there are dozens of real-world detectors that would need their own logic.

- **Tests** — nothing is tested right now. At minimum I'd want unit tests on the blast radius transformation functions (they're pure functions that take raw data and return a graph, so they're very easy to test) and integration tests on the middleware redirect logic.

- **Error states** — the table and charts all assume data will load fine. There's no error boundary or fallback UI if something fails.

- **Proper role-based access** — the current auth is binary (logged in or not). A real system would have roles (viewer, admin, etc.) that control what parts of the dashboard you can see or do.

- **The remaining sidebar routes** — Cloud IAM, Cloud storage, Chat applications etc. are in the nav but don't go anywhere. Each would need its own page and table similar to the VCS findings page.

- **Accessibility** — the charts are purely visual right now. Proper `aria-label` attributes, keyboard navigation for the graph canvas, and screen reader descriptions for the gauge values would make it usable for everyone.

---

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS @3**
- **Recharts** — line chart, stacked bar chart
- **ReactFlow** — blast radius graph
- **Lucide React** — icons
