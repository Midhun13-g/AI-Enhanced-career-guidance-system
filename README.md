# AI-Enhanced Career Guidance System

A full-stack application that combines a React frontend, Spring Boot backend, Python AI service, and PostgreSQL database to provide AI-powered career guidance.

## Hugging Face semantic model

The Python AI service uses `sentence-transformers/all-MiniLM-L6-v2` from Hugging Face for semantic job and course matching. Install the AI-service dependencies before starting it:

```bash
cd ai-service
pip install -r requirements.txt
```

The model downloads automatically on its first semantic-matching request and is cached locally afterwards. To select another compatible Hugging Face SentenceTransformer model, set `HF_EMBEDDING_MODEL` in `.env`.

## Supabase database setup

The backend uses Supabase PostgreSQL through datasource environment variables loaded from `backend/.env`.

Copy `backend/.env.example` to `backend/.env`, then replace `YOUR_SUPABASE_DATABASE_PASSWORD` and the project ref in `SPRING_DATASOURCE_URL` with the values from your Supabase project.

If startup fails with `UnknownHostException` for `db.<project-ref>.supabase.co`, the application configuration loaded correctly but the machine cannot resolve or reach the Supabase database host. Check the project ref, internet/DNS connection, VPN/firewall settings, and whether the Supabase project is paused.
