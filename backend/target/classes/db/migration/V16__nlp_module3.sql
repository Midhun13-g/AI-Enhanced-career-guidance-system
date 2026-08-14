-- Module 3: Resume NLP Intelligence Engine

CREATE TABLE IF NOT EXISTS resume_entity (
    id            BIGSERIAL PRIMARY KEY,
    resume_id     BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    entity_type   VARCHAR(50)  NOT NULL,
    entity_value  TEXT         NOT NULL,
    confidence_score DOUBLE PRECISION DEFAULT 0.0,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_resume_entity_resume ON resume_entity(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_entity_type   ON resume_entity(entity_type);

CREATE TABLE IF NOT EXISTS skill_taxonomy (
    id              BIGSERIAL PRIMARY KEY,
    skill_name      VARCHAR(255) NOT NULL,
    normalized_name VARCHAR(255) NOT NULL,
    category        VARCHAR(100),
    description     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_skill_taxonomy_name UNIQUE (skill_name)
);

CREATE TABLE IF NOT EXISTS student_skill (
    id          BIGSERIAL PRIMARY KEY,
    student_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id    BIGINT NOT NULL REFERENCES skill_taxonomy(id) ON DELETE CASCADE,
    source      VARCHAR(50) NOT NULL DEFAULT 'RESUME',
    confidence  DOUBLE PRECISION DEFAULT 0.0,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_skill UNIQUE (student_id, skill_id, source)
);
CREATE INDEX IF NOT EXISTS idx_student_skill_student ON student_skill(student_id);

CREATE TABLE IF NOT EXISTS resume_analysis_report (
    id              BIGSERIAL PRIMARY KEY,
    resume_id       BIGINT NOT NULL UNIQUE REFERENCES resumes(id) ON DELETE CASCADE,
    overall_score   DOUBLE PRECISION DEFAULT 0.0,
    ats_score       DOUBLE PRECISION DEFAULT 0.0,
    skill_score     DOUBLE PRECISION DEFAULT 0.0,
    project_score   DOUBLE PRECISION DEFAULT 0.0,
    education_score DOUBLE PRECISION DEFAULT 0.0,
    ai_feedback     TEXT,
    generated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profile_vector (
    id                  BIGSERIAL PRIMARY KEY,
    student_id          BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    academic_vector     JSONB,
    resume_vector       JSONB,
    assessment_vector   JSONB,
    interest_vector     JSONB,
    certification_vector JSONB,
    overall_vector      JSONB,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed core skill taxonomy entries
INSERT INTO skill_taxonomy (skill_name, normalized_name, category, description) VALUES
('ReactJS',       'React.js',     'Frontend',  'JavaScript UI library'),
('React JS',      'React.js',     'Frontend',  'JavaScript UI library'),
('NodeJS',        'Node.js',      'Backend',   'JavaScript runtime'),
('Node JS',       'Node.js',      'Backend',   'JavaScript runtime'),
('PostgresSQL',   'PostgreSQL',   'Database',  'Relational database'),
('Postgres',      'PostgreSQL',   'Database',  'Relational database'),
('SpringBoot',    'Spring Boot',  'Backend',   'Java framework'),
('Spring boot',   'Spring Boot',  'Backend',   'Java framework'),
('ML',            'Machine Learning', 'AI/ML', 'Machine learning'),
('Deep Learning', 'Deep Learning','AI/ML',     'Neural network techniques'),
('TensorFlow',    'TensorFlow',   'AI/ML',     'ML framework'),
('PyTorch',       'PyTorch',      'AI/ML',     'ML framework'),
('Docker',        'Docker',       'DevOps',    'Containerization'),
('Kubernetes',    'Kubernetes',   'DevOps',    'Container orchestration'),
('AWS',           'AWS',          'Cloud',     'Amazon Web Services'),
('GCP',           'Google Cloud', 'Cloud',     'Google Cloud Platform'),
('Azure',         'Microsoft Azure','Cloud',   'Microsoft Azure'),
('Python',        'Python',       'Language',  'Programming language'),
('Java',          'Java',         'Language',  'Programming language'),
('JavaScript',    'JavaScript',   'Language',  'Programming language'),
('TypeScript',    'TypeScript',   'Language',  'Programming language'),
('C++',           'C++',          'Language',  'Programming language'),
('SQL',           'SQL',          'Database',  'Query language'),
('MongoDB',       'MongoDB',      'Database',  'NoSQL database'),
('Redis',         'Redis',        'Database',  'In-memory data store'),
('Git',           'Git',          'Tools',     'Version control'),
('REST API',      'REST API',     'Backend',   'RESTful web services'),
('GraphQL',       'GraphQL',      'Backend',   'Query language for APIs'),
('Microservices', 'Microservices','Architecture','Microservice architecture'),
('CI/CD',         'CI/CD',        'DevOps',    'Continuous integration/delivery')
ON CONFLICT (skill_name) DO NOTHING;
