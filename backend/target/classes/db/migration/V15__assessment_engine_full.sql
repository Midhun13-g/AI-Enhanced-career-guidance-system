-- ============================================================
-- V15 : Module 4 – Full Assessment Engine Tables
-- ============================================================

-- ── Assessment (admin-managed assessments) ──────────────────
CREATE TABLE IF NOT EXISTS assessments (
    id                   BIGSERIAL PRIMARY KEY,
    title                VARCHAR(255)     NOT NULL,
    description          TEXT,
    category             VARCHAR(50)      NOT NULL,
    difficulty           VARCHAR(30)      NOT NULL DEFAULT 'MEDIUM',
    duration_minutes     INTEGER          NOT NULL DEFAULT 30,
    total_questions      INTEGER          NOT NULL DEFAULT 10,
    maximum_attempts     INTEGER          NOT NULL DEFAULT 3,
    passing_percentage   DOUBLE PRECISION NOT NULL DEFAULT 60.0,
    negative_marking     BOOLEAN          NOT NULL DEFAULT FALSE,
    negative_value       DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    shuffle_questions    BOOLEAN          NOT NULL DEFAULT FALSE,
    shuffle_options      BOOLEAN          NOT NULL DEFAULT FALSE,
    status               VARCHAR(30)      NOT NULL DEFAULT 'DRAFT',
    instructions         TEXT,
    created_by           BIGINT           REFERENCES users(id) ON DELETE SET NULL,
    created_at           TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessments_status   ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_category ON assessments(category);

-- ── Assessment Questions (linked to assessments) ─────────────
CREATE TABLE IF NOT EXISTS assessment_items (
    id               BIGSERIAL PRIMARY KEY,
    assessment_id    BIGINT           NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text    TEXT             NOT NULL,
    question_type    VARCHAR(30)      NOT NULL DEFAULT 'MCQ',
    difficulty       VARCHAR(30)      NOT NULL DEFAULT 'MEDIUM',
    marks            DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    negative_marks   DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    image_url        VARCHAR(500),
    code_snippet     TEXT,
    explanation      TEXT,
    display_order    INTEGER          NOT NULL DEFAULT 0,
    is_active        BOOLEAN          NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assessment_items_assessment ON assessment_items(assessment_id);

-- ── Question Options ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_item_options (
    id            BIGSERIAL PRIMARY KEY,
    item_id       BIGINT  NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
    option_text   TEXT    NOT NULL,
    is_correct    BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_item_options_item ON assessment_item_options(item_id);

-- ── Student Assessment Attempt ───────────────────────────────
CREATE TABLE IF NOT EXISTS assessment_attempts (
    id               BIGSERIAL PRIMARY KEY,
    student_id       BIGINT           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id    BIGINT           NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    attempt_number   INTEGER          NOT NULL DEFAULT 1,
    status           VARCHAR(30)      NOT NULL DEFAULT 'IN_PROGRESS',
    started_at       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at     TIMESTAMP,
    score            DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    percentage       DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    correct_answers  INTEGER          NOT NULL DEFAULT 0,
    wrong_answers    INTEGER          NOT NULL DEFAULT 0,
    skipped_answers  INTEGER          NOT NULL DEFAULT 0,
    accuracy         DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    time_taken_secs  INTEGER
);

CREATE INDEX IF NOT EXISTS idx_attempts_student    ON assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON assessment_attempts(assessment_id);

-- ── Student Answers ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attempt_answers (
    id               BIGSERIAL PRIMARY KEY,
    attempt_id       BIGINT           NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    item_id          BIGINT           NOT NULL REFERENCES assessment_items(id) ON DELETE CASCADE,
    selected_option  BIGINT           REFERENCES assessment_item_options(id) ON DELETE SET NULL,
    selected_text    TEXT,
    is_correct       BOOLEAN,
    marks_obtained   DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    answered_at      TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (attempt_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_attempt_answers_attempt ON attempt_answers(attempt_id);

-- ── Assessment Result (detailed analytics) ───────────────────
CREATE TABLE IF NOT EXISTS attempt_results (
    id                    BIGSERIAL PRIMARY KEY,
    attempt_id            BIGINT           NOT NULL UNIQUE REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    total_score           DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    percentage            DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    performance_level     VARCHAR(30)      NOT NULL DEFAULT 'AVERAGE',
    technical_score       DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    aptitude_score        DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    logical_score         DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    communication_score   DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    personality_score     DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    ai_feedback           TEXT,
    career_vector_updated BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ── Student Skill Vector ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_skill_vectors (
    id                   BIGSERIAL PRIMARY KEY,
    student_id           BIGINT           NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    technical_skill      DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    aptitude_skill       DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    logical_reasoning    DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    problem_solving      DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    communication_skill  DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    analytical_skill     DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    adaptability         DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    overall_score        DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    updated_at           TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_skill_vectors_student ON student_skill_vectors(student_id);

-- ── Assessment Certificate ────────────────────────────────────
CREATE TABLE IF NOT EXISTS attempt_certificates (
    id               BIGSERIAL PRIMARY KEY,
    attempt_id       BIGINT       NOT NULL UNIQUE REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    certificate_url  VARCHAR(500),
    issued_date      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
