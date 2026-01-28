---
name: "neon-db"
description: "Expert guidance for Neon serverless Postgres: connection strings (pooled vs direct), PgBouncer pooling (up to 10k clients, transaction mode), branching (instant copy-on-write, TTL), scale-to-zero (5-min idle, cold starts), CLI (neonctl), Data API, best practices, troubleshooting, production setup, monitoring. Activates on Neon, neon.tech, serverless Postgres, pooling, branching, autosuspend, neonctl, or Neon workflows. Updated for 2026 (Databricks acquisition pricing, PgBouncer metrics, prepared statements support)."
version: "2.0.0-2026"
---

# Neon DB Skill – Serverless Postgres Expert (2026 Updated)

## When to Use
- Mentions Neon, neon.tech, serverless Postgres, or Neon-specific features
- Connection strings, pooled/direct, PgBouncer pooling
- Branching for dev/PR/testing/restore
- Scale-to-zero, autosuspend, cold starts, compute restarts
- neonctl CLI commands, project/branch/db management
- Data API (HTTP queries from edge/serverless)
- Best practices: resilience, monitoring, security
- Troubleshooting: timeouts, relation not found, pool exhaustion, cold start latency

## Core Concepts (2026)
- **Serverless Architecture**: Compute separated from storage → scale-to-zero after 5 min inactivity, instant provisioning, autoscaling.
- **Scale-to-Zero / Autosuspend**: Compute suspends after ~5 min idle → zero cost when inactive. Cold start: few seconds (500ms–few s) on first query after suspend.
- **Branching**: Git-like, instant copy-on-write clones. Zero extra storage until changes. Use for PRs, testing, point-in-time restore (up to 7–30 days depending on plan).
- **Connection Pooling**: PgBouncer (transaction mode) → up to 10,000 client connections, but limited server connections (based on compute CU: 104–4000 max_connections).
- **Pooled vs Direct**:
  - **Pooled** (-pooler in hostname): Recommended for serverless/high-churn apps. Handles many concurrent/short-lived connections.
  - **Direct**: For migrations (pg_dump, Prisma Migrate), long sessions, LISTEN/NOTIFY, replication, persistent session vars (search_path).
- **Prepared Statements**: Supported (protocol-level in drivers), not SQL-level PREPARE in pooled mode.
- **Data API**: REST/HTTP interface for browser/edge queries → no pooling needed.
- **Pricing (post-2025 Databricks acquisition)**: Cheaper compute (15–25% drop), storage ~$0.35/GB-month, free tier 100 CU-hours/month.

## Procedure
1. Gather context: pooled/direct? branch? CLI/console? serverless app? troubleshooting issue?
2. Recommend pooled by default; direct only for specific needs.
3. Generate secure connection string template (never include real password).
4. Guide CLI/console steps for branch/db creation.
5. Explain scale-to-zero implications + resilience tips.
6. Add best practices: retry logic, monitoring, IP allow, protected branches.
7. Troubleshoot common issues.

## Output Format

**Neon Connection Recommendation**
- Type: [Pooled / Direct]
- Hostname: ep-[project]-[id]-[region].aws.neon.tech (direct) or ...-pooler... (pooled)
- Connection String Template: postgresql://[user]:[password]@[hostname]/[dbname]?sslmode=require&channel_binding=require&connect_timeout=15
- Recommended: Pooled for most apps (serverless, web, high concurrency)

**Setup / Next Steps**
1. ...
2. ...

**Neon CLI Commands** (neonctl)
- neon projects list
- neon branches create [name] --parent [parent_branch]
- neon connection-string [branch] [--pooled]
- neon branches restore [branch] --to [timestamp or LSN]
- neon branches delete [branch]

**Key Neon Features**
- Branching: Instant (~1s), copy-on-write, isolated, TTL for temp branches
- Scale-to-Zero: 5-min idle → suspend compute → cold start few seconds
- Bottomless Storage: Auto-scales, no size limits
- Data API: HTTP queries (no driver needed for edge)

**Best Practices & Warnings**
- Use pooled for serverless/edge (Vercel, Cloudflare) → handles 10k+ clients
- Direct for migrations, pg_dump, replication, session persistence
- Add retry logic (connect_timeout=15, pool_timeout=15) for cold starts/restarts
- Monitor: Console graphs (Pooler client/server connections), OpenTelemetry/Datadog export
- Security: IP allow list, protected branches, ?sslmode=require&channel_binding=require
- search_path issue in pooled: Use schema-qualified queries or role-level ALTER
- Avoid long-lived connections; use pool refresh (e.g., maxLifetime)
- Set min compute size to fit working set in memory

**Troubleshooting Tips**
- "No more connections" / pool exhaustion → Use pooled or increase min CU
- "Relation does not exist" → search_path lost in pooled → qualify schema.table
- Cold start delay → Normal; add warmer (periodic ping) if latency-critical
- Timeout errors → Add connect_timeout=15, retry with exponential backoff
- Compute restart → Drivers auto-reconnect; test reconnection logic

## Quality Criteria
- Differentiate pooled/direct clearly with use-cases/table
- Emphasize security: sslmode=require, no hard-coded secrets
- Use latest 2026 info: PgBouncer metrics, prepared statements support, cheaper pricing
- Actionable: CLI syntax, console steps, templates
- No ORM examples unless asked

## Examples

**User**: "Neon connection string for pooled?"

**Output**:
**Neon Connection Recommendation**
- Type: Pooled (default for apps)
- Connection String: postgresql://[user]:[password]@ep-your-project-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=15

**User**: "Create branch for PR testing"

**Output**:
neon branches create pr-123-feature --parent main
neon connection-string pr-123-feature --pooled
→ Instant copy-on-write, isolated, zero cost until changes/compute active.

**User**: "Why scale to zero and cold start?"

**Output**:
Autosuspend after ~5 min idle → zero cost. Cold start: few seconds on next query. Normal serverless behavior; use pooled + retries for resilience.


```