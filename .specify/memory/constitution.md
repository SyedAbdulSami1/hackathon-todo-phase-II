
<!-- Sync Impact Report
Version: 1.0.0
List of modified principles:
Added sections:
Removed sections:
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/commands/sp.constitution.md
Follow-up TODOs:
- TODO(RATIFICATION_DATE): Original ratification date is unknown.
-->

# Hackathon II – Evolution of Todo – Phase II Full-Stack Web App Constitution

## Core Principles

### Strict Spec-Driven Development
Every feature implementation must start from a written specification; Specifications must be clear, testable, and cover all acceptance criteria; Manual coding without a spec is prohibited.

### Monorepo Architecture
The project will use a monorepo structure with frontend (Next.js 14 App Router) and backend (Python FastAPI) components.

### Secure JWT Authentication
All API interactions will be secured using JWT authentication. Backend FastAPI will verify JWTs, and frontend will manage token storage and transmission. Better Auth will be used for token issuance.

### Strict User Data Isolation
Each user's data must be strictly isolated. All database queries and API responses must be filtered by the authenticated user's ID.

### Clean, Testable, Type-Safe Code
Code must be clean, maintainable, and type-safe. Use SQLModel for backend ORM, and TypeScript for frontend. All code should be easily testable.

## Key Standards
All API endpoints must require a valid JWT. Every task and data record must be filtered by the authenticated `user_id`. Use SQLModel with Neon PostgreSQL for the database. The frontend will use Next.js App Router with Server Components as the default. Tailwind CSS will be used for all styling.

## Constraints
No new technologies outside the specified stack. The application must support multiple users from day one. CORS must be properly configured for inter-service communication.

## Development Workflow
Amendments to this constitution require a documented proposal, a review of impact on dependent artifacts, and approval by the project lead. Versioning follows Semantic Versioning rules (MAJOR.MINOR.PATCH). Compliance will be reviewed during integration testing phases.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Original ratification date is unknown. | **Last Amended**: 2026-01-28
