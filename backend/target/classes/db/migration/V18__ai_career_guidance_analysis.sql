-- V18: Hugging Face AI Career Guidance Analysis Module

CREATE TABLE IF NOT EXISTS ai_career_analysis (
    id                     BIGSERIAL PRIMARY KEY,
    user_id                BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_file_name     VARCHAR(500) NOT NULL,
    file_type              VARCHAR(150),
    file_size              BIGINT,
    status                 VARCHAR(50) NOT NULL DEFAULT 'PROCESSING',
    hf_request_id          VARCHAR(100),
    error_message          TEXT,
    execution_time         DOUBLE PRECISION DEFAULT 0.0,
    resume_data            TEXT,
    job_matches            TEXT,
    career_analysis        TEXT,
    skill_gaps             TEXT,
    learning_priorities    TEXT,
    course_recommendations TEXT,
    explanations           TEXT,
    career_guidance        TEXT,
    roadmap                TEXT,
    created_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_career_analysis_user_created ON ai_career_analysis(user_id, created_at DESC);
