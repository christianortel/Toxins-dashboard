# DOWNSTREAM — Phase 1 Implementation Plan

## Overview
Build the premium investigative website shell for DOWNSTREAM: an editorial exploration tool examining the overlap between industrial contamination, endocrine-disrupting chemicals, wildlife sentinel abnormalities, and human reproductive-health warning signals.

## Phase 1 Scope
- Project architecture and folder structure
- Design system (tokens, typography, color, motion)
- App scaffold with all routes
- Premium UI shell (header, footer, navigation)
- Landing page (immersive, editorial)
- Explore page shell (map + panels)
- Case studies index + detail pages
- Methodology page
- Sources page
- About page
- Reusable component library
- Mock data structures
- Database schema draft (PostgreSQL + PostGIS)
- ETL folder scaffold
- README + .env.example

## Tech Stack
- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **State**: Zustand
- **Data fetching**: TanStack Query
- **Map**: MapLibre GL JS + deck.gl
- **Charts**: d3
- **Database**: PostgreSQL + PostGIS (schema draft only)
- **ORM**: Drizzle ORM
- **ETL**: Python (pandas, geopandas, shapely, pyarrow)

## Design System
### Colors
- Background: `#0a0a0b` (near black)
- Surface: `#141417` (deep charcoal)
- Panel: `#1c1c21` (muted graphite)
- Border: `#2a2a32` (slate edge)
- Text primary: `#e8e4df` (warm off-white)
- Text secondary: `#9a9696` (cool gray)
- Text muted: `#6b6767` (muted gray)
- Accent bio: `#6b8f71` (muted moss)
- Accent contamination: `#c4784a` (oxidized orange)
- Accent water: `#7a9eb5` (steel blue)
- Accent warning: `#b5924a` (amber)
- Accent neutral: `#8a8a96` (slate)

### Typography
- Headlines: Cormorant Garamond (serif, editorial)
- Body/UI: Inter (sans-serif, modern)
- Type scale: 12px / 14px / 16px / 18px / 20px / 24px / 32px / 40px / 48px / 64px / 80px

### Motion
- Duration: 300ms-800ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Patterns: fade, slide-up, blur-reveal
- No bounce, no exaggerated scale

## Routes
| Route | Purpose |
|-------|---------|
| `/` | Landing page — immersive editorial hero |
| `/explore` | Map explorer shell with panels |
| `/case-studies` | Case study index |
| `/case-studies/[slug]` | Individual case study |
| `/methodology` | Scientific methodology explanation |
| `/sources` | Source registry |
| `/about` | About the project |

## Folder Structure
```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    explore/page.tsx
    case-studies/page.tsx
    case-studies/[slug]/page.tsx
    methodology/page.tsx
    sources/page.tsx
    about/page.tsx
    api/
  components/
    ui/           — shadcn/ui primitives
    layout/       — header, footer, navigation
    landing/      — hero, featured sections
    explore/      — map shell, panels, controls
    case-studies/ — cards, detail views
    shared/       — badges, chips, states, blocks
  lib/
    utils.ts
    constants.ts
    motion.ts
    fonts.ts
  data/
    mock/         — mock data for all entities
    schema/       — Drizzle schema definitions
  stores/         — Zustand stores
  types/          — TypeScript type definitions
  hooks/          — Custom React hooks
etl/
  scripts/
  config/
  README.md
db/
  schema.sql
  migrations/
  seed/
```

## Component Library
### Layout
- SiteHeader
- SiteFooter
- PageContainer
- SectionContainer

### Landing
- HeroSection
- ThesisBlock
- FeaturedCategories
- FeaturedCaseStudies
- MethodologyPreview
- EditorialTransition

### Explore
- MapShell
- LayerControlPanel
- SearchControl
- TimelineShell
- DetailDrawer
- LegendShell
- FilterChips
- LayerToggleGroup

### Case Studies
- CaseStudyCard
- CaseStudyHeader

### Shared
- DataLayerChip
- EvidenceBadge
- UncertaintyBadge
- SourceBadge
- FeaturedStatistic
- EditorialQuote
- MethodologyAccordion
- EmptyState
- LoadingState
- ErrorState

## Database Tables (Schema Draft)
- geographies
- industrial_sites
- toxic_release_records
- power_plants
- hazardous_sites
- pfas_sites
- wastewater_sites
- reproductive_indicators
- sperm_studies
- fertility_trends
- infertility_prevalence
- sentinel_species_records
- health_concern_context
- case_studies
- source_registry
- update_log

## Milestones
1. Project init + design tokens + theme
2. App scaffold + routes + layout
3. Premium components
4. Landing page
5. Explore page shell
6. Case studies pages
7. Methodology + Sources + About
8. Mock data seeding
9. Polish pass
