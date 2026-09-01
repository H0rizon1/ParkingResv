# Campus Parking Reservation System

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## File structure

```
src/
  main.jsx              entry point, sets up router + global state
  App.jsx                route definitions (this is your "routes.tsx")
  index.css              global styles + font classes
  context/
    AppContext.jsx        shared state: users, lots, stalls, reservations
  components/
    Navbar.jsx             top nav + tabs (shown on every logged-in page)
    Toast.jsx              notification banner
    StallIcon.jsx           painted-stall visual used in Reserve
    Pill.jsx                small colored badge
  pages/
    Landing.jsx            "/"          — marketing/intro page
    Login.jsx              "/login"     — auth
    Register.jsx           "/register"  — auth
    Dashboard.jsx           "/dashboard" — status + live availability
    Reserve.jsx             "/reserve"   — booking flow
    MyReservations.jsx      "/my-reservations"
    Profile.jsx             "/profile"   — personal info + vehicles
    Admin.jsx               "/admin"     — lot management + all bookings
```

## Notes

- Data is in-memory only (resets on refresh) — swap `AppContext.jsx` for real
  API calls once the backend/database is built.
- Sign up once as a `student` and once as `admin` (role picker on the
  Register page) to see both sides of the system.

## Switching between Campus and Establishment mode

Open `src/config/venueConfig.js` and change:

```js
export const VENUE_TYPE = "campus"; // or "establishment"
```

That single switch changes labels ("Lot" vs "Zone"), the registration
ID field (Student ID vs Phone Number), available roles, zone/tier
options, and whether pricing is shown — without touching any page
component.

## Offline support (PWA)

This site is a Progressive Web App:
- On first visit (with internet), the app shell is cached automatically.
- After that, it keeps working with **no internet connection** — refresh or
  reopen it offline and it still loads.
- On a phone, visiting the site in Chrome/Safari shows an "Add to Home
  Screen" / "Install" option, which makes it launch like a native app icon.
- All reservation/account data is saved to the browser's `localStorage`, so
  it survives refreshes and offline use (per-device, not synced to a server —
  there is no backend yet).

To test: run `npm run build && npm run preview`, load it once, then turn off
Wi-Fi and reload — it should still work.
