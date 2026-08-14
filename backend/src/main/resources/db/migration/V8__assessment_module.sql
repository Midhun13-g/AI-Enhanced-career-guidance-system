CREATE TABLE IF NOT EXISTS assessment_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS assessment_questions (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES assessment_categories(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(40) NOT NULL,
    difficulty VARCHAR(30),
    display_order INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_assessment_questions_category_id ON assessment_questions(category_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_active_order ON assessment_questions(is_active, display_order);

CREATE TABLE IF NOT EXISTS assessment_options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0),
    display_order INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessment_options_question_id ON assessment_options(question_id);

CREATE TABLE IF NOT EXISTS assessment_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS'
);

CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status ON assessment_sessions(status);

CREATE TABLE IF NOT EXISTS assessment_answers (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id BIGINT NOT NULL REFERENCES assessment_questions(id) ON DELETE RESTRICT,
    option_id BIGINT NOT NULL REFERENCES assessment_options(id) ON DELETE RESTRICT,
    score INTEGER NOT NULL CHECK (score >= 0),
    CONSTRAINT uk_assessment_answer_session_question UNIQUE (session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_assessment_answers_session_id ON assessment_answers(session_id);

CREATE TABLE IF NOT EXISTS assessment_results (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL UNIQUE REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    technical_score DOUBLE PRECISION NOT NULL,
    aptitude_score DOUBLE PRECISION NOT NULL,
    personality_score DOUBLE PRECISION NOT NULL,
    interest_score DOUBLE PRECISION NOT NULL,
    overall_score DOUBLE PRECISION NOT NULL,
    personality_type VARCHAR(80) NOT NULL,
    recommended_category VARCHAR(120) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO assessment_categories (name, description) VALUES
('TECHNICAL_SKILLS', 'Programming, engineering, and technology readiness'),
('APTITUDE', 'Reasoning, problem solving, and learning ability'),
('PERSONALITY', 'Preferred collaboration, leadership, and work style'),
('INTEREST', 'Career domain preferences')
ON CONFLICT (name) DO NOTHING;

INSERT INTO assessment_questions (category_id, question, question_type, difficulty, display_order, is_active)
SELECT c.id, q.question, q.question_type, q.difficulty, q.display_order, TRUE
FROM assessment_categories c
JOIN (VALUES
    ('TECHNICAL_SKILLS', 'How comfortable are you with writing code to solve a practical problem?', 'LIKERT_SCALE', 'MEDIUM', 1),
    ('TECHNICAL_SKILLS', 'How well do you understand databases and backend APIs?', 'LIKERT_SCALE', 'MEDIUM', 2),
    ('APTITUDE', 'How confident are you in breaking a complex problem into smaller steps?', 'LIKERT_SCALE', 'MEDIUM', 1),
    ('APTITUDE', 'How quickly do you learn a new technical concept from documentation?', 'LIKERT_SCALE', 'MEDIUM', 2),
    ('PERSONALITY', 'Which work style describes you best?', 'MCQ', 'EASY', 1),
    ('PERSONALITY', 'How do you usually contribute in a team project?', 'MCQ', 'EASY', 2),
    ('INTEREST', 'Which domain are you most excited to explore?', 'MCQ', 'EASY', 1),
    ('INTEREST', 'Which product problem would you most enjoy solving?', 'MCQ', 'EASY', 2)
) AS q(category_name, question, question_type, difficulty, display_order)
ON c.name = q.category_name
WHERE NOT EXISTS (
    SELECT 1 FROM assessment_questions existing WHERE existing.question = q.question
);

INSERT INTO assessment_options (question_id, option_text, score, display_order)
SELECT question_id, option_text, score, display_order
FROM (
    SELECT aq.id AS question_id, option_text, score, option_order AS display_order
    FROM assessment_questions aq
    JOIN (VALUES
        ('How comfortable are you with writing code to solve a practical problem?', 'Beginner', 1, 1),
        ('How comfortable are you with writing code to solve a practical problem?', 'Basic', 2, 2),
        ('How comfortable are you with writing code to solve a practical problem?', 'Intermediate', 3, 3),
        ('How comfortable are you with writing code to solve a practical problem?', 'Advanced', 4, 4),
        ('How comfortable are you with writing code to solve a practical problem?', 'Expert', 5, 5),
        ('How well do you understand databases and backend APIs?', 'Beginner', 1, 1),
        ('How well do you understand databases and backend APIs?', 'Basic', 2, 2),
        ('How well do you understand databases and backend APIs?', 'Intermediate', 3, 3),
        ('How well do you understand databases and backend APIs?', 'Advanced', 4, 4),
        ('How well do you understand databases and backend APIs?', 'Expert', 5, 5),
        ('How confident are you in breaking a complex problem into smaller steps?', 'Rarely confident', 1, 1),
        ('How confident are you in breaking a complex problem into smaller steps?', 'Somewhat confident', 2, 2),
        ('How confident are you in breaking a complex problem into smaller steps?', 'Confident', 3, 3),
        ('How confident are you in breaking a complex problem into smaller steps?', 'Very confident', 4, 4),
        ('How confident are you in breaking a complex problem into smaller steps?', 'Highly confident', 5, 5),
        ('How quickly do you learn a new technical concept from documentation?', 'Slowly', 1, 1),
        ('How quickly do you learn a new technical concept from documentation?', 'With support', 2, 2),
        ('How quickly do you learn a new technical concept from documentation?', 'Steadily', 3, 3),
        ('How quickly do you learn a new technical concept from documentation?', 'Quickly', 4, 4),
        ('How quickly do you learn a new technical concept from documentation?', 'Very quickly', 5, 5),
        ('Which work style describes you best?', 'Researcher: I like depth, evidence, and careful analysis', 2, 1),
        ('Which work style describes you best?', 'Communicator: I like explaining, collaborating, and aligning people', 3, 2),
        ('Which work style describes you best?', 'Creative: I like imagining new ideas and prototypes', 4, 3),
        ('Which work style describes you best?', 'Leader: I like ownership, direction, and decisions', 5, 4),
        ('How do you usually contribute in a team project?', 'Researcher: I investigate options and risks', 2, 1),
        ('How do you usually contribute in a team project?', 'Communicator: I clarify and coordinate', 3, 2),
        ('How do you usually contribute in a team project?', 'Analytical: I structure the problem and test assumptions', 4, 3),
        ('How do you usually contribute in a team project?', 'Leader: I drive execution', 5, 4),
        ('Which domain are you most excited to explore?', 'AI systems and intelligent assistants', 5, 1),
        ('Which domain are you most excited to explore?', 'Software product engineering', 5, 2),
        ('Which domain are you most excited to explore?', 'Data Science and analytics', 5, 3),
        ('Which domain are you most excited to explore?', 'Cyber Security and risk defense', 5, 4),
        ('Which product problem would you most enjoy solving?', 'Cloud platforms and scalable infrastructure', 5, 1),
        ('Which product problem would you most enjoy solving?', 'Business strategy and operations', 5, 2),
        ('Which product problem would you most enjoy solving?', 'Design and user experience', 5, 3),
        ('Which product problem would you most enjoy solving?', 'Software tools for developers', 5, 4)
    ) AS opts(question_text, option_text, score, option_order)
    ON aq.question = opts.question_text
) seeded_options
WHERE NOT EXISTS (
    SELECT 1 FROM assessment_options existing
    WHERE existing.question_id = seeded_options.question_id
      AND existing.option_text = seeded_options.option_text
);
