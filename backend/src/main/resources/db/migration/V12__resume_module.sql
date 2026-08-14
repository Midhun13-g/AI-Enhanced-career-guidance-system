CREATE TABLE IF NOT EXISTS resumes (
 id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 original_file_name VARCHAR(500) NOT NULL, stored_file_name VARCHAR(500) NOT NULL UNIQUE,
 file_type VARCHAR(150) NOT NULL, file_size BIGINT NOT NULL, file_path TEXT NOT NULL,
 status VARCHAR(30) NOT NULL, upload_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_resumes_user_uploaded ON resumes(user_id, upload_time DESC);
CREATE TABLE IF NOT EXISTS resume_skills (id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE, skill_name VARCHAR(255) NOT NULL, skill_category VARCHAR(100), confidence_score DOUBLE PRECISION);
CREATE TABLE IF NOT EXISTS resume_projects (id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE, project_name VARCHAR(255) NOT NULL, description TEXT, technologies TEXT, duration VARCHAR(100));
CREATE TABLE IF NOT EXISTS resume_experience (id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE, company VARCHAR(255), designation VARCHAR(255), duration VARCHAR(100), description TEXT);
CREATE TABLE IF NOT EXISTS resume_education (id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE, degree VARCHAR(255), college VARCHAR(255), university VARCHAR(255), cgpa VARCHAR(30), graduation_year INTEGER);
CREATE TABLE IF NOT EXISTS resume_certifications (id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE, certificate_name VARCHAR(255), provider VARCHAR(255), completion_date DATE);
CREATE TABLE IF NOT EXISTS resume_analysis (id BIGSERIAL PRIMARY KEY, resume_id BIGINT NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE, resume_score DOUBLE PRECISION, ats_score DOUBLE PRECISION, skills_detected INTEGER NOT NULL DEFAULT 0, projects_detected INTEGER NOT NULL DEFAULT 0, experience_detected INTEGER NOT NULL DEFAULT 0, education_detected INTEGER NOT NULL DEFAULT 0, certification_count INTEGER NOT NULL DEFAULT 0, strengths TEXT, weaknesses TEXT, missing_information TEXT, recommendations TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);
