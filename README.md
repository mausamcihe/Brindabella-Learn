Brindabella Learn

A production-quality frontend for a fictional Canberra training provider. Learners discover short courses, enrol, and track their progress module by module.

Built for ICT930 Advanced Web Application Development, Assessment 2, against the Education / Training Platform problem domain (option 3).

Live application: https://famous-bunny-981b21.netlify.app/ Repository: https://github.com/mausamcihe/Brindabella-Learn

Team
Member	Student ID	GitHub	Primary responsibility
Mausam Rijal	CIHE260766	@mausamcihe	Routing, application shell, catalogue
Sandesh Chhetri	CIHE231306	@sandeshchhetri926-coder	Design system and UI primitives
Deepsun Sharma	CIHE260645	@whynotcoconut592	Data layer, contexts and hooks
Gaurab Uprety	CIHE260770	@GauravU11	Feature pages, forms and validation

Full role breakdown and individual contributions are in docs/Team-Contribution-Statement.docx.

1. Project overview

Brindabella Learn is the learner-facing frontend for a vocational training provider operating across Braddon, Belconnen, Civic and online. It addresses a problem every training provider has: a learner signs up with enthusiasm, disappears for three weeks, comes back, and cannot remember where they were.

The application answers that question first. The dashboard opens with a resume panel showing the course last worked on, the exact module that comes next, and how far through the learner is. Everything else — the catalogue, the enrolment list, the profile — sits underneath that.

The scenario assumes the backend already exists. This project is the frontend team's deliverable: component architecture, state management, routing, data handling, accessibility and responsive design.

2. Technology stack
Layer	Choice	Why
Framework	React 18 (function components + hooks)	Required by the brief; hooks keep state logic co-located and testable
Build tool	Vite 5	Fast dev server, native ES modules, automatic code splitting
Routing	React Router 6	Nested layout routes, URL-driven filter state, lazy route elements
State	React Context + useState / useMemo	Three small, well-bounded stores; a third-party store would add weight without solving a problem this app has
Styling	Hand-written CSS with custom properties	A design-token layer with no build-time dependency and no utility-class noise in the JSX
Persistence	localStorage via a custom hook	Enrolments survive a refresh without a backend
Quality	ESLint (incl. jsx-a11y) + Prettier	Accessibility problems are caught at lint time, not at marking time
Hosting	Netlify	Continuous deployment from main, with an SPA rewrite rule

No UI component library and no icon library. Both were considered and rejected: the interface needs eleven icons and about a dozen primitives, and writing them keeps the initial route at roughly 62 KB gzipped.

3. Installation

Requires Node.js 18 or newer.

bash
# 1. Clone and enter the project
git clone https://github.com/mausamcihe/Brindabella-Learn.git
cd Brindabella-Learn

# 2. Install dependencies
npm install

# 3. Start the dev server (opens http://localhost:5173)
npm run dev

Other scripts:

bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint across the project
npm run format     # Prettier across src/
Demonstration switches
URL	Effect
/?fail=1	Forces every data request to fail, so the error states and retry buttons can be demonstrated
Profile → Reset to sample data	Clears local changes and restores the seeded learner record
4. Key features

Navigation and routing

Six client-side routes plus a catch-all 404, using nested layout routes
Deep links work on refresh (SPA rewrite configured in netlify.toml)
Focus moves to <main> and scroll resets on every route change
Document title updates per route so screen reader users know navigation occurred

Catalogue

Full-text search across title, summary, stream and tags, debounced at 250 ms
Filter by stream, study mode and level (multi-select)
Five sort orders
Filters live in the URL query string, so a filtered view is shareable and survives a refresh

Course detail

Learning outcomes, module timeline, instructor profile, key facts
Enrolment through a confirmation dialog with a simulated async request
Progress bar and "mark module complete" for enrolled learners
Full intakes disable the enrol action and explain what to do instead

My learning

Enrolments filtered by status through a tab list
Progress ring per enrolment
Withdrawal behind a confirmation dialog

Profile

Nine validated fields, validated on blur and again on submit
Error summary at the top of the form, focused on failed submit
Editing the weekly study target changes the target line on the dashboard chart

Support

Validated form posting to the mock API with sending, error and success states
Returns a reference number on success

Feedback throughout

Skeleton loaders shaped like the content that is coming
Error states with a working retry
Empty states that suggest the next action
Toast confirmations in a polite live region
5. Design decisions
Three contexts, not one store

State is split by who owns it and how often it changes:

Context	Holds	Changes
CatalogueContext	Courses and instructors	Once, on load
LearnerContext	Profile and enrolments	On user action
ToastContext	Queued confirmations	Frequently, briefly

A single store would mean every course card re-renders whenever a toast appears. Redux Toolkit and Zustand were considered; with three stores this small they would have added a dependency and a layer of indirection without removing a real problem.

Filter state in the URL

The catalogue's filters are held in the query string rather than component state. This makes a filtered result shareable as a link, restorable on refresh, and navigable with the browser's back button — behaviour people already expect of search results. The search text is mirrored in local state so typing stays instant, then debounced before it reaches the URL.

Route-level code splitting

Only the shell and dashboard are in the initial bundle. Every other route is loaded on demand with React.lazy, so a visitor who only browses the catalogue never downloads the profile form or the support page.

One design system, no framework

Colour, type, spacing and shape all come from custom properties in src/styles/tokens.css. The palette is eucalypt green with a wattle-gold accent on a cool paper grey — drawn from the Canberra bush the institute is named after, and chosen partly because gold reads clearly as a focus ring against both the green surfaces and the light background, which a green ring would not.

Deliberate restraint

One element in the interface is loud: the resume panel on the dashboard, a deep eucalypt slab with a progress ring. Everything else is flat surfaces with hairline borders. Elevation is reserved for things that genuinely float (dialogs, toasts), and numbered markers appear in exactly one place — the module timeline — because modules genuinely are a sequence.

Bottom tab bar on mobile

Mobile navigation is a bottom tab bar rather than a hamburger menu. Destinations stay visible, they are reachable one-handed, and there is no open/close state to manage.

6. Accessibility

Targeting WCAG 2.2 level AA.

Semantic landmarks: header, nav, main, footer, one h1 per route
Skip link to main content as the first focusable element
Every control has a visible label; hints and errors wired via aria-describedby
Invalid fields carry aria-invalid and a role="alert" message
Error summaries take focus on failed submit (WCAG 3.3.1)
Dialogs: role="dialog", aria-modal, focus trapped, Escape closes, focus returns
A single high-contrast focus ring, never removed
Progress bars and rings expose role="progressbar" with current value
The dashboard chart has a screen-reader-only data table alongside it
prefers-reduced-motion respected globally
Body text meets 4.5:1 contrast; the gold accent is used for fills and borders only, never as text on a light background
7. Responsive design
Breakpoint	Behaviour
< 40rem (640px)	Single-column cards, bottom tab bar, stacked forms
40–60rem	Two-column catalogue grid, side-by-side form fields
≥ 60rem (960px)	Left navigation rail replaces the tab bar
≥ 62rem	Course detail and forms gain a sticky sidebar
≥ 68rem	Three-column catalogue grid

Tested at 320px, 375px, 768px, 1024px and 1440px.

8. Project structure
src/
├── components/
│   ├── layout/       AppShell, NavRail, TabBar, PageHeader, footer, brand
│   ├── ui/           Button, Badge, Field, Progress, Modal, States, Icon, Toast
│   └── features/
│       ├── catalog/  CourseCard, CourseGrid, CatalogueToolbar
│       ├── dashboard/ResumePanel, StatRow, ActivityChart
│       └── learning/ ModuleSpine, EnrolmentRow
├── context/          CatalogueContext, LearnerContext, ToastContext
├── hooks/            useAsync, useDebouncedValue, useLocalStorage,
│                     useDocumentTitle, useFocusTrap
├── pages/            One component per route
├── services/         api.js, the single network boundary
├── styles/           tokens, base, layout, ui, features
└── utils/            format.js, validation.js

Three layers, one direction: pages compose feature components, which compose UI primitives. Nothing below reaches back up.

9. Data

Mock JSON is served from public/data/ and fetched over the network, so the app talks to fetch exactly as it would against a real backend, same async boundary, same failure modes, same abort semantics. Swapping in a real API is a change to BASE_URL in src/services/api.js and nothing else.

Twelve courses across six streams, six instructors, one seeded learner with four enrolments in three different states.

10. Deployment

Deployed to Netlify with continuous deployment from main.

Setting	Value
Build command	npm run build
Publish directory	dist
Node version	18+

The SPA rewrite in netlify.toml is what makes /courses/cloud-foundations work on a direct visit or a refresh. Without it the host returns 404 for every route except /.

11. Known limitations
No real backend: enrolments persist to localStorage in one browser only
No authentication; the learner is seeded rather than signed in
Lesson content is represented by module metadata, not delivered
No automated test suite, verification was manual, plus ESLint and a route render check
