# ANA Flight Number Practice

Mobile-first quiz app for ANA flight number memorization.

## Local run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Vercel deployment

1. Push this project to GitHub.
2. In Vercel, click **Add New Project**.
3. Import the repository.
4. Framework preset: **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click **Deploy**.

## Replace `questions.json` later

1. Open `src/data/questions.json`.
2. Replace the array content with your new records.
3. Keep each record in the same structure:
   - `id`
   - `destination_japanese`
   - `route`
   - `departure_flight_number`
   - `return_route`
   - `return_flight_number`
   - `category`
   - `source`
4. Run `npm run dev` and verify quiz output.

## Extend later

- Add a settings page for shuffle toggle and mode preferences using `ana_flight_quiz_settings`.
- Add category filter (international/domestic) while preserving raw JSON structure.
- Add spaced repetition metadata in localStorage for frequent wrong entries.
- Add PWA manifest and offline cache for phone home-screen use.
