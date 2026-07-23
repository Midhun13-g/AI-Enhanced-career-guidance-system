# AI-Enhanced Career Guidance System

A full-stack application that combines a React frontend, Spring Boot backend, Python AI service, and PostgreSQL database to provide AI-powered career guidance.

## Supabase database setup

The backend uses Supabase PostgreSQL through datasource environment variables loaded from `backend/.env`.

Copy `backend/.env.example` to `backend/.env`, then replace `YOUR_SUPABASE_DATABASE_PASSWORD` and the project ref in `SPRING_DATASOURCE_URL` with the values from your Supabase project.

If startup fails with `UnknownHostException` for `db.<project-ref>.supabase.co`, the application configuration loaded correctly but the machine cannot resolve or reach the Supabase database host. Check the project ref, internet/DNS connection, VPN/firewall settings, and whether the Supabase project is paused.
