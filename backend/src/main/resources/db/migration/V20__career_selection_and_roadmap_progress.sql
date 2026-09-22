ALTER TABLE ai_career_analysis
    ADD COLUMN IF NOT EXISTS selected_role_id VARCHAR(120),
    ADD COLUMN IF NOT EXISTS roadmap_task_statuses TEXT;
