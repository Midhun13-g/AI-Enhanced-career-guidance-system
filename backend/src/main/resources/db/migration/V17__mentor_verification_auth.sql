ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE';

CREATE TABLE IF NOT EXISTS mentor_profiles (
  id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT, experience_years INTEGER NOT NULL, company VARCHAR(255), job_title VARCHAR(255),
  expertise TEXT, linkedin_url VARCHAR(500), github_url VARCHAR(500), portfolio_url VARCHAR(500), resume_url VARCHAR(500),
  verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_VERIFICATION', verified_at TIMESTAMP, verified_by BIGINT REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS mentor_documents (
  id BIGSERIAL PRIMARY KEY, mentor_id BIGINT NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(64) NOT NULL, file_url VARCHAR(500) NOT NULL, verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_VERIFICATION',
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, verified_at TIMESTAMP, verified_by BIGINT REFERENCES users(id), remarks TEXT
);
CREATE TABLE IF NOT EXISTS mentor_verification_logs (
  id BIGSERIAL PRIMARY KEY, mentor_id BIGINT NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  action VARCHAR(32) NOT NULL, admin_id BIGINT REFERENCES users(id), remarks TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_status ON mentor_profiles(verification_status);
