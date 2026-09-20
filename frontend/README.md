# OreVision - Frontend

The frontend for the OreVision (formerly Mn-Sight) AI/ML decision-support platform for manganese exploration and production-risk planning.

## Tech Stack
- **Framework:** React + TypeScript + Vite
- **Mapping:** MapLibre GL JS + `react-map-gl`
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Charts:** Recharts

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Production Build

To build the application for production:
```bash
npm run build
```
The output will be generated in the `dist` directory.

## Map Rendering Note
The production build is explicitly configured to import the MapLibre web worker to correctly render GeoJSON vector sources. See `src/components/map/MapView.tsx` for the worker configuration.
