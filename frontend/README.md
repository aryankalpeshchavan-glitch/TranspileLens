# TranspileLens Frontend

The TranspileLens frontend is a React + Vite application that visualizes the results of the Python-based quantum circuit transformation profiler. It provides an interpretable, deterministic, evidence-first dashboard (IBM Carbon inspired).

## Dependencies

You need Node.js installed to build and run the frontend.

```bash
cd frontend
npm install
```

## Data Synchronisation

The frontend is completely static and data-driven. It visualizes data from a `results.json` file.
The Python runner (`scripts/runner.py` in the repository root) writes its output to `<root>/results.json`.

To ensure the frontend uses the latest results, a sync script copies the JSON from the root into `frontend/public/results.json`.
You can run this manually:

```bash
npm run sync:results
```

_Note: `npm run dev` and `npm run build` will automatically run this sync step first._

## Running Locally

To start the development server with Hot Module Replacement:

```bash
npm run dev
```

Visit `http://localhost:5173`.
If you click **"Refresh Results"** in the UI, the dashboard fetches the _latest JSON from the `public` directory_. If you ran a new Python profiling session in the background, you must run `npm run sync:results` in a separate terminal before the frontend can see the updated file!

## Building for Production

To build the static site for production deployment:

```bash
npm run build
```

This generates a highly optimized `dist/` folder containing the HTML, CSS, JavaScript, and `results.json` assets.

## Deployment

The `dist/` directory can be deployed to any static hosting provider (e.g., GitHub Pages, Vercel, Netlify, AWS S3).
**Important:** Deploying the static frontend does _not_ deploy the Python profiler. If you want to update the dashboard with new experiment results later, you must run the Python profiler locally, sync the results (`npm run sync:results`), rebuild the frontend (`npm run build`), and upload the new `dist/` folder to your provider.

## Limitations

- This is a static dashboard, meaning there is no live Python backend running on the web server.
- The `results.json` file is a snapshot in time.
