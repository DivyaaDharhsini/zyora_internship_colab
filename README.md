# ⚡ FitTrack

A clean, responsive fitness-tracking web app built with **plain HTML, CSS, and JavaScript** — no frameworks, no build step. Open `index.html` (or serve the folder) and go.

> 4 days to Demo Day — this README reflects the current, working state of the project.

## Pages

| Page | File | What it does |
|---|---|---|
| Home | `index.html` | Hero, quick-link cards, feature highlights |
| Exercise Library | `exercise.html` | 16 built-in exercises with live search, muscle-group filters, detail modal, **live "Discover More" cards fetched from the wger API**, and workout reminders |
| BMI Calculator | `bmi.html` | Validated height/weight form, BMI category + visual scale, tips |
| Daily Log | `dailylog.html` | Validated entry form (activity, duration, calories, water, notes), history with per-entry delete, clear-all, and filter tabs |
| Weekly Summary | `summary.html` | Aggregated stats, calories bar chart, and entries table for 7/14/30 days or all time |

## Data layer (Day 5)

**Fetch API** — the Exercise Library's *Discover More* section pulls live exercises from the free [wger Workout Manager API](https://wger.de/en/software/api). All three states are handled:

- ⏳ **Loading** — animated spinner while fetching
- ✅ **Success** — exercise cards rendered from the API response
- 📡 **Error** — friendly offline message with a **Try Again** button (no silent breakage)

**localStorage** — user data survives a refresh:

| Key | Page | Stores |
|---|---|---|
| `fitTrackLogs` | Daily Log / Summary | All daily log entries (shared by both pages) |
| `fitTrackReminders` | Exercise Library | Workout reminders |
| `fitTrackBmi` | BMI Calculator | Last measurement, restored on load |

## Project structure

```
fittracker/
├── index.html          # Home
├── exercise.html       # Exercise Library (+ wger API section)
├── bmi.html            # BMI Calculator
├── dailylog.html       # Daily Log
├── summary.html        # Weekly Summary
├── css/
│   ├── shared.css      # Design system: tokens, navbar, buttons, forms, footer
│   ├── home.css        # Home-only styles
│   └── exercise.css    # Exercise-page-only styles (incl. spinner/API status)
├── js/
│   ├── shared.js       # Auto-highlights the active nav link on every page
│   ├── exercise.js     # Search/filter/modal + wger fetch + reminders storage
│   ├── bmi.js          # Validation, BMI calc, last-result persistence
│   ├── dailylog.js     # Validation, localStorage CRUD, filter tabs
│   └── summary.js      # Reads fitTrackLogs → stats, chart, table
└── assets/images/      # Exercise photos (emoji fallback if missing)
```

## Running it

Any static server works, e.g.:

```
python -m http.server 5500
```

Then open <http://localhost:5500>. (Opening the files directly also works, but a server is recommended so the wger fetch behaves like production.)

## Team

- **Divyaa Dharhsini** — Home page, Exercise Library (search/filter/modal/reminders), shared design system (`shared.css`/`shared.js`), wger API integration, BMI/reminders persistence
- **Sindhu J** — BMI Calculator, Daily Log (form validation + localStorage CRUD), Weekly Summary (stats/chart/table)

## What works so far ✅

- All 5 pages linked with a consistent navbar/footer and mobile hamburger menu
- Fully responsive (tested at 375 px — single-column grids, no horizontal overflow)
- Form validation with inline error messages (BMI + Daily Log)
- Live API data with loading/success/error states + retry
- All user data persisted in localStorage across refreshes
- Consistent design system (teal/amber palette, Poppins + Inter)

## What's left 📝

- Add real exercise photos to `assets/images/` (emoji fallback currently shows)
- Final cross-browser pass and demo-day polish
- Optional: streak counter on the Weekly Summary
