# DOWNSTREAM

**The body downstream of industry.**

An investigative public-interest exploration tool examining how industrial contamination, endocrine-disrupting chemicals, PFAS, microplastics, pharmaceutical waste, wildlife sentinel abnormalities, regulatory blind spots, and human reproductive-health warning signals may overlap.

This is not a causation engine. It is an investigative tool that distinguishes between direct measurement, proxy indicators, screening signals, literature evidence, and editorial case studies.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Animation**: Framer Motion
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Map**: MapLibre GL JS, deck.gl
- **Charts**: d3
- **Database**: PostgreSQL + PostGIS
- **ORM**: Drizzle ORM
- **ETL**: Python (pandas, geopandas, shapely, pyarrow)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database (Optional for Phase 1)

Phase 1 uses mock data. For full data integration:

```bash
# Start PostgreSQL with PostGIS
# Apply schema
psql -d downstream -f db/schema.sql

# Set up ETL
cd etl
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    explore/              # Map explorer
    case-studies/         # Case study index + detail
    methodology/          # Scientific methodology
    sources/              # Source registry
    about/                # About the project
  components/
    layout/               # Header, footer, containers
    landing/              # Homepage sections
    explore/              # Map, panels, controls
    shared/               # Badges, states, blocks
  lib/                    # Utilities, constants, motion, fonts
  data/mock/              # Mock data for development
  stores/                 # Zustand state stores
  types/                  # TypeScript type definitions
db/                       # PostgreSQL schema and migrations
etl/                      # Python data pipeline scripts
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/explore` | Interactive map explorer |
| `/case-studies` | Case study index |
| `/case-studies/[slug]` | Individual case study |
| `/methodology` | Scientific methodology |
| `/sources` | Source registry |
| `/about` | About the project |

## License

All rights reserved.
