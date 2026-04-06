-- DOWNSTREAM Database Schema
-- PostgreSQL + PostGIS
-- Draft schema for Phase 1 — to be refined during data integration

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- GEOGRAPHIES
-- ============================================================

CREATE TABLE geographies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- state, county, census_tract, watershed, zip
    fips_code VARCHAR(12),
    state_fips VARCHAR(2),
    county_fips VARCHAR(5),
    geom GEOMETRY(MultiPolygon, 4326),
    population INTEGER,
    area_sq_km DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_geographies_geom ON geographies USING GIST (geom);
CREATE INDEX idx_geographies_type ON geographies (type);
CREATE INDEX idx_geographies_fips ON geographies (fips_code);

-- ============================================================
-- INDUSTRIAL / CONTAMINATION LAYERS
-- ============================================================

CREATE TABLE industrial_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    facility_type VARCHAR(100),
    tri_facility_id VARCHAR(20),
    naics_code VARCHAR(10),
    sic_code VARCHAR(10),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    county VARCHAR(100),
    zip VARCHAR(10),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    operating_status VARCHAR(50),
    parent_company VARCHAR(255),
    data_source VARCHAR(100) NOT NULL,
    source_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_industrial_sites_geom ON industrial_sites USING GIST (geom);
CREATE INDEX idx_industrial_sites_state ON industrial_sites (state);

CREATE TABLE toxic_release_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES industrial_sites(id),
    reporting_year INTEGER NOT NULL,
    chemical_name VARCHAR(255) NOT NULL,
    cas_number VARCHAR(20),
    release_type VARCHAR(50), -- air, water, land, underground_injection
    quantity_lbs DOUBLE PRECISION,
    unit VARCHAR(20) DEFAULT 'lbs',
    carcinogen BOOLEAN DEFAULT false,
    pbt_chemical BOOLEAN DEFAULT false,
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tri_site ON toxic_release_records (site_id);
CREATE INDEX idx_tri_year ON toxic_release_records (reporting_year);
CREATE INDEX idx_tri_chemical ON toxic_release_records (chemical_name);

CREATE TABLE power_plants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    plant_code VARCHAR(20),
    fuel_type VARCHAR(100),
    capacity_mw DOUBLE PRECISION,
    state VARCHAR(2),
    county VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    operating_status VARCHAR(50),
    emissions_co2_tons DOUBLE PRECISION,
    emissions_so2_tons DOUBLE PRECISION,
    emissions_nox_tons DOUBLE PRECISION,
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_power_plants_geom ON power_plants USING GIST (geom);

CREATE TABLE hazardous_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    epa_id VARCHAR(20),
    site_type VARCHAR(100), -- superfund, brownfield, rcra_corrective_action
    npl_status VARCHAR(50),
    hazard_score DOUBLE PRECISION,
    contaminants TEXT[],
    state VARCHAR(2),
    county VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    cleanup_status VARCHAR(100),
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_hazardous_sites_geom ON hazardous_sites USING GIST (geom);
CREATE INDEX idx_hazardous_sites_type ON hazardous_sites (site_type);

-- ============================================================
-- EMERGING CONTAMINANTS
-- ============================================================

CREATE TABLE pfas_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500),
    site_type VARCHAR(100), -- military, manufacturing, landfill, wastewater, airport
    pfas_compounds TEXT[],
    max_concentration_ppt DOUBLE PRECISION,
    medium_tested VARCHAR(50), -- groundwater, drinking_water, soil, surface_water
    state VARCHAR(2),
    county VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    affected_population INTEGER,
    data_source VARCHAR(100) NOT NULL,
    detection_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pfas_sites_geom ON pfas_sites USING GIST (geom);

CREATE TABLE wastewater_sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    npdes_permit VARCHAR(20),
    facility_type VARCHAR(100),
    design_flow_mgd DOUBLE PRECISION,
    state VARCHAR(2),
    county VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    receiving_water VARCHAR(255),
    violations_count INTEGER DEFAULT 0,
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_wastewater_sites_geom ON wastewater_sites USING GIST (geom);

-- ============================================================
-- REPRODUCTIVE HEALTH INDICATORS
-- ============================================================

CREATE TABLE reproductive_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    geography_id UUID REFERENCES geographies(id),
    metric VARCHAR(100) NOT NULL, -- fertility_rate, birth_rate, low_birth_weight_pct
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50),
    year INTEGER NOT NULL,
    demographic_group VARCHAR(100),
    trend VARCHAR(20), -- increasing, decreasing, stable, unknown
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_repro_geo ON reproductive_indicators (geography_id);
CREATE INDEX idx_repro_metric ON reproductive_indicators (metric);
CREATE INDEX idx_repro_year ON reproductive_indicators (year);

CREATE TABLE sperm_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    study_name VARCHAR(500) NOT NULL,
    authors TEXT,
    publication_year INTEGER,
    study_region VARCHAR(255),
    sample_size INTEGER,
    mean_concentration DOUBLE PRECISION, -- million/mL
    mean_total_count DOUBLE PRECISION, -- million
    time_period_start INTEGER,
    time_period_end INTEGER,
    percent_change DOUBLE PRECISION,
    study_type VARCHAR(50), -- meta_analysis, cohort, cross_sectional
    data_source VARCHAR(100) NOT NULL,
    doi VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE fertility_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    geography_id UUID REFERENCES geographies(id),
    year INTEGER NOT NULL,
    total_fertility_rate DOUBLE PRECISION,
    general_fertility_rate DOUBLE PRECISION,
    art_cycles_per_capita DOUBLE PRECISION,
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_fertility_geo ON fertility_trends (geography_id);
CREATE INDEX idx_fertility_year ON fertility_trends (year);

CREATE TABLE infertility_prevalence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    geography_id UUID REFERENCES geographies(id),
    year INTEGER NOT NULL,
    prevalence_pct DOUBLE PRECISION,
    age_group VARCHAR(20),
    sex VARCHAR(10),
    measure_type VARCHAR(50), -- self_reported, clinical, modeled
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- WILDLIFE SENTINEL SPECIES
-- ============================================================

CREATE TABLE sentinel_species_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species_common_name VARCHAR(255) NOT NULL,
    species_scientific_name VARCHAR(255),
    taxon_group VARCHAR(50), -- fish, amphibian, bird, mammal, invertebrate
    observation_type VARCHAR(100), -- intersex, deformity, die_off, reproductive_failure, population_decline
    observation_detail TEXT,
    severity VARCHAR(20), -- low, moderate, high, critical
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    location_description VARCHAR(500),
    state VARCHAR(2),
    observation_year INTEGER,
    associated_contaminants TEXT[],
    data_source VARCHAR(100) NOT NULL,
    study_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sentinel_geom ON sentinel_species_records USING GIST (geom);
CREATE INDEX idx_sentinel_taxon ON sentinel_species_records (taxon_group);
CREATE INDEX idx_sentinel_obs ON sentinel_species_records (observation_type);

-- ============================================================
-- HEALTH CONCERN CONTEXT
-- ============================================================

CREATE TABLE health_concern_context (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concern_type VARCHAR(100) NOT NULL, -- endocrine_disruption, cancer_cluster, birth_defect, developmental
    title VARCHAR(500) NOT NULL,
    description TEXT,
    geography_id UUID REFERENCES geographies(id),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    evidence_level VARCHAR(20) NOT NULL, -- direct, proxy, screening, literature, editorial
    associated_chemicals TEXT[],
    population_affected INTEGER,
    time_period VARCHAR(50),
    data_source VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_health_geom ON health_concern_context USING GIST (geom);

-- ============================================================
-- CASE STUDIES
-- ============================================================

CREATE TABLE case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    subtitle TEXT,
    location VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geom GEOMETRY(Point, 4326),
    published_date DATE,
    layer_groups TEXT[] NOT NULL,
    evidence_level VARCHAR(20) NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    key_findings TEXT[],
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_case_studies_slug ON case_studies (slug);
CREATE INDEX idx_case_studies_geom ON case_studies USING GIST (geom);

-- ============================================================
-- SOURCE REGISTRY & UPDATE LOG
-- ============================================================

CREATE TABLE source_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    short_name VARCHAR(100),
    layer_group VARCHAR(50) NOT NULL,
    description TEXT,
    agency VARCHAR(255),
    url VARCHAR(500),
    update_frequency VARCHAR(50), -- annual, quarterly, monthly, irregular
    last_fetched TIMESTAMPTZ,
    last_data_date DATE,
    caveats TEXT,
    license VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE update_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES source_registry(id),
    table_name VARCHAR(100) NOT NULL,
    records_added INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_deleted INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL, -- success, partial, failed
    error_message TEXT,
    duration_seconds INTEGER,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_update_log_source ON update_log (source_id);
CREATE INDEX idx_update_log_started ON update_log (started_at);
