-- ============================================================
-- V14 : Module 4 – Aptitude & Skill Assessment Engine
-- New tables: skill_assessment_vectors, assessment_certificates
-- Enrichment: assessment_results, assessment_sessions,
--             assessment_questions, assessment_answers
-- ============================================================

-- ── Skill Assessment Vector ──────────────────────────────────
CREATE TABLE IF NOT EXISTS skill_assessment_vectors (
    id                      BIGSERIAL PRIMARY KEY,
    user_id                 BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    logical_score           DOUBLE PRECISION NOT NULL DEFAULT 0,
    technical_score         DOUBLE PRECISION NOT NULL DEFAULT 0,
    aptitude_score          DOUBLE PRECISION NOT NULL DEFAULT 0,
    communication_score     DOUBLE PRECISION NOT NULL DEFAULT 0,
    personality_score       DOUBLE PRECISION NOT NULL DEFAULT 0,
    problem_solving_score   DOUBLE PRECISION NOT NULL DEFAULT 0,
    analytical_score        DOUBLE PRECISION NOT NULL DEFAULT 0,
    overall_score           DOUBLE PRECISION NOT NULL DEFAULT 0,
    last_updated            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_vectors_user_id
    ON skill_assessment_vectors(user_id);

-- ── Assessment Certificate ────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_certificates (
    id                BIGSERIAL PRIMARY KEY,
    session_id        BIGINT NOT NULL UNIQUE REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    certificate_url   VARCHAR(500),
    issued_date       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certificates_session_id
    ON assessment_certificates(session_id);

-- ── Enrich assessment_results ────────────────────────────────
ALTER TABLE assessment_results
    ADD COLUMN IF NOT EXISTS correct_answers        INTEGER          NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS wrong_answers          INTEGER          NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS skipped_questions      INTEGER          NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS accuracy               DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS speed                  DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rank                   INTEGER,
    ADD COLUMN IF NOT EXISTS ai_feedback            TEXT,
    ADD COLUMN IF NOT EXISTS career_vector_updated  BOOLEAN          NOT NULL DEFAULT FALSE;

-- ── Enrich assessment_sessions ───────────────────────────────
ALTER TABLE assessment_sessions
    ADD COLUMN IF NOT EXISTS attempt_number   INTEGER          NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS time_taken_secs  INTEGER,
    ADD COLUMN IF NOT EXISTS score            DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS percentage       DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS accuracy         DOUBLE PRECISION;

-- ── Enrich assessment_questions ──────────────────────────────
ALTER TABLE assessment_questions
    ADD COLUMN IF NOT EXISTS marks          INTEGER          NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS negative_marks DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS image_url      VARCHAR(500),
    ADD COLUMN IF NOT EXISTS code_snippet   TEXT,
    ADD COLUMN IF NOT EXISTS explanation    TEXT;

-- ── Enrich assessment_answers ────────────────────────────────
ALTER TABLE assessment_answers
    ADD COLUMN IF NOT EXISTS is_correct     BOOLEAN,
    ADD COLUMN IF NOT EXISTS marks_awarded  DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS answered_at    TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP;
