# 🟢 ShellSignal

> A zero-noise, terminal-aesthetic daily dashboard for software engineers.

ShellSignal is an automated newsroom that aggregates the top developer stories, analyzes their open-source health, and uses AI to generate ultra-concise, technical executive summaries. Built completely in the cloud.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![OpenRouter](https://img.shields.io/badge/OpenRouter-AI-blueviolet?style=for-the-badge)

## ✨ Features

* **Daily Automated Briefs:** A Vercel Cron job wakes up every morning to curate the day's top technical news.
* **AI Executive Summaries:** Integrates with OpenRouter (using frontier models like Grok/Llama) to distill hours of reading into 3 sharp, technical bullet points.
* **Dev Health Metrics:** Cross-references trending repositories with the GitHub API to display real-time stars, open issues, and last commit times.
* **Native Markdown Parsing:** Custom React Markdown pipeline maps AI outputs directly to native CSS variables for a seamless terminal aesthetic.
* **Edge-Optimized:** Utilizes Next.js App Router and aggressive caching strategies for instant load times.

## 🏗️ System Architecture

1. **The Cron Trigger:** Vercel fires a secured API route (`/api/cron/daily-brief`) daily.
2. **Data Aggregation:** The backend fetches the top 10 trending stories from Hacker News.
3. **Enrichment:** Links are parsed. If a story points to GitHub, the GitHub API is queried to append repository "health" metrics.
4. **AI Pipeline:** The raw JSON payload is cleaned and passed to OpenRouter. A strict prompt constraint forces the AI to output pure markdown bullets without conversational filler.
5. **Storage:** The enriched data and AI summary are upserted into a **Supabase** PostgreSQL database.
6. **Delivery:** The Next.js frontend fetches the cached daily brief and renders the markdown securely.

## 💻 Tech Stack

* **Framework:** Next.js (App Router) / React
* **Database:** Supabase (PostgreSQL)
* **AI:** OpenRouter API (Auto-routing to the best available free frontier model)
* **Hosting & CI/CD:** Vercel
* **Styling:** Custom Terminal CSS Variables (`var(--bg2)`, `var(--green)`, `var(--amber)`)

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` or Vercel dashboard:

`SUPABASE_URL` - Your Supabase project URL
`SUPABASE_SERVICE_ROLE_KEY` - Supabase admin key for the cron job bypass
`OPENROUTER_API_KEY` - Key for AI summary generation
`CRON_SECRET` - Security token to authorize the daily Vercel cron job
`GITHUB_TOKEN` - (Optional) To bypass GitHub API rate limits

---
*Built with 💻 and ☕ by [Brighto G]*
