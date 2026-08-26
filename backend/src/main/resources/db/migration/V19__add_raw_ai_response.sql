-- V19: Add raw_ai_response column to store full un-truncated JSON from Hugging Face Space

ALTER TABLE ai_career_analysis ADD COLUMN IF NOT EXISTS raw_ai_response TEXT;
