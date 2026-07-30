-- Expand the initial assessment from 8 to 32 questions (8 per category).
INSERT INTO assessment_questions (category_id, question, question_type, difficulty, display_order, is_active)
SELECT category.id, seed.question, 'LIKERT_SCALE', 'MEDIUM', seed.display_order, TRUE
FROM assessment_categories category
JOIN (VALUES
    ('TECHNICAL_SKILLS', 'How confident are you debugging an unfamiliar codebase?', 3),
    ('TECHNICAL_SKILLS', 'How well can you design a simple database schema?', 4),
    ('TECHNICAL_SKILLS', 'How comfortable are you using Git for collaboration?', 5),
    ('TECHNICAL_SKILLS', 'How well can you build a responsive user interface?', 6),
    ('TECHNICAL_SKILLS', 'How comfortable are you working with APIs?', 7),
    ('TECHNICAL_SKILLS', 'How confident are you testing your code before release?', 8),
    ('APTITUDE', 'How well do you identify the key constraints in a problem?', 3),
    ('APTITUDE', 'How confidently can you compare multiple solution approaches?', 4),
    ('APTITUDE', 'How well do you spot patterns in data or information?', 5),
    ('APTITUDE', 'How confidently can you estimate effort for a task?', 6),
    ('APTITUDE', 'How well do you explain your reasoning step by step?', 7),
    ('APTITUDE', 'How confidently can you make a decision with incomplete information?', 8),
    ('PERSONALITY', 'How comfortable are you sharing ideas with a team?', 3),
    ('PERSONALITY', 'How well do you stay focused when work becomes difficult?', 4),
    ('PERSONALITY', 'How comfortable are you receiving constructive feedback?', 5),
    ('PERSONALITY', 'How confidently do you take ownership of a task?', 6),
    ('PERSONALITY', 'How well do you adapt when priorities change?', 7),
    ('PERSONALITY', 'How often do you seek opportunities to learn new skills?', 8),
    ('INTEREST', 'How interested are you in building web applications?', 3),
    ('INTEREST', 'How interested are you in data science and analytics?', 4),
    ('INTEREST', 'How interested are you in artificial intelligence?', 5),
    ('INTEREST', 'How interested are you in cloud and DevOps work?', 6),
    ('INTEREST', 'How interested are you in cyber security?', 7),
    ('INTEREST', 'How interested are you in product design and user experience?', 8)
) AS seed(category_name, question, display_order) ON category.name = seed.category_name
WHERE NOT EXISTS (
    SELECT 1 FROM assessment_questions existing WHERE existing.question = seed.question
);

INSERT INTO assessment_options (question_id, option_text, score, display_order)
SELECT question.id, option.label, option.score, option.score
FROM assessment_questions question
CROSS JOIN (VALUES
    ('Beginner', 1), ('Basic', 2), ('Intermediate', 3), ('Advanced', 4), ('Expert', 5)
) AS option(label, score)
WHERE question.question IN (
    'How confident are you debugging an unfamiliar codebase?',
    'How well can you design a simple database schema?',
    'How comfortable are you using Git for collaboration?',
    'How well can you build a responsive user interface?',
    'How comfortable are you working with APIs?',
    'How confident are you testing your code before release?',
    'How well do you identify the key constraints in a problem?',
    'How confidently can you compare multiple solution approaches?',
    'How well do you spot patterns in data or information?',
    'How confidently can you estimate effort for a task?',
    'How well do you explain your reasoning step by step?',
    'How confidently can you make a decision with incomplete information?',
    'How comfortable are you sharing ideas with a team?',
    'How well do you stay focused when work becomes difficult?',
    'How comfortable are you receiving constructive feedback?',
    'How confidently do you take ownership of a task?',
    'How well do you adapt when priorities change?',
    'How often do you seek opportunities to learn new skills?',
    'How interested are you in building web applications?',
    'How interested are you in data science and analytics?',
    'How interested are you in artificial intelligence?',
    'How interested are you in cloud and DevOps work?',
    'How interested are you in cyber security?',
    'How interested are you in product design and user experience?'
)
AND NOT EXISTS (
    SELECT 1 FROM assessment_options existing
    WHERE existing.question_id = question.id AND existing.option_text = option.label
);
