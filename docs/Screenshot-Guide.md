# Screenshot capture guide

The brief requires **at least six key screens, desktop and mobile**. Capture these
yourself from the **deployed URL**, not from localhost — a marker checking your
screenshots against the live site should see the same thing.

## How to capture

**Desktop (Chrome):** open the deployed site at 1440 × 900, press `Ctrl/Cmd + Shift + P`,
type `Capture full size screenshot`, press Enter.

**Mobile (Chrome DevTools):** `F12` → device toolbar (`Ctrl/Cmd + Shift + M`) →
iPhone 14 Pro (393 × 852) → same capture command. Or take real screenshots on a phone,
which is better evidence.

## The twelve shots

Save as `screenshots/01-dashboard-desktop.png`, `01-dashboard-mobile.png`, and so on.

| # | Screen | Desktop must show | Mobile must show |
| --- | --- | --- | --- |
| 1 | Dashboard `/` | Resume panel, stats row, activity chart | Stacked layout, bottom tab bar |
| 2 | Catalogue `/courses` | Three-column grid, toolbar | Single column, tab bar |
| 3 | Catalogue, filtered | Chips active, count updated, filters visible in the URL bar | Same, URL visible |
| 4 | Course detail | Two-column layout with sticky sidebar | Sidebar stacked below content |
| 5 | Enrol dialog open | Centred dialog over dimmed page | Dialog anchored to the bottom |
| 6 | My learning | Progress rings, status tabs | Stacked enrolment cards |
| 7 | Profile with validation errors | Error summary plus red fields | Same |
| 8 | Support success state | Reference number visible | Same |

That is eight screens across two viewports — comfortably above the six required.

## Four extras worth including

These are cheap to capture and each one evidences a specific rubric line.

- **Loading state** — throttle to Slow 3G in DevTools and reload; catches the skeletons
- **Error state** — visit `?fail=1`; shows the error UI and retry button
- **Keyboard focus** — tab to a button and capture the gold focus ring
- **Lighthouse report** — run it on the deployed site and screenshot the scores

## Before you submit

- [ ] Every shot is from the deployed URL
- [ ] No personal browser data visible (bookmarks bar, other tabs, extensions)
- [ ] Files named consistently and referenced in the README or reflection
- [ ] Mobile shots really are mobile width, not a narrow desktop window
