---
id: "2026-02-03-constitution-update"
title: "Project Constitution Update"
date: "2026-02-03"
stage: "constitution"
feature: "hackathon-todo-phase-II"
---

## Prompt

```text
/sp.constitution
Project: AI-native Spec-Driven Transformation of a Console Task App into a Secure Multi-User Web Application

Core principles:
- Spec-driven development (spec is the single source of truth)
- Agentic execution (Claude Code performs all implementation steps)
- Determinism and clarity (no ambiguous requirements)
- Security-first design (auth, isolation, least privilege)
- Production realism (real database, real auth, real APIs)
- Traceability (every feature maps back to a requirement)

Key standards:
- No manual coding: all code must be generated via Claude Code
- All behavior must be defined in specs before implementation
- Each API endpoint must have:
  - clear inputs
  - validation rules
  - auth requirements
  - error cases
- All user data access must be authenticated and user-scoped
- RESTful conventions must be followed strictly
- Frontend and backend responsibilities must be clearly separated
- Environment variables must be used for secrets and configuration

Technology constraints:
- Frontend: Next.js 16+ with App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (Next.js) + JWT
- Spec workflow: Claude Code + Spec-Kit Plus only

Security requirements:
- JWT-based stateless authentication
- Shared secret between frontend and backend
- All API routes protected by auth middleware
- Requests without valid JWT return 401
- Task ownership enforced at database query level
- No cross-user data leakage under any condition

Functional constraints:
- All 5 Basic Level features must be implemented as a web app
- CRUD operations must be persistent
- Multi-user support is mandatory
- UI must be responsive and usable
- Backend must not trust client-supplied user IDs blindly

Process constraints:
- Follow Agentic Dev Stack:
  Spec → Plan → Tasks → Implement → Review
- Each phase must be reviewable independently
- Specs must be precise enough to generate working code
- No future or speculative features beyond requirements

Success criteria:
- Applic
```

## Response

I successfully updated the project constitution with comprehensive new principles and requirements. The update included:

1. **Enhanced Core Principles** - Expanded from 5 to 6 principles, adding Agentic Execution and Determinism while improving existing ones

2. **Detailed Key Standards** - Specified API requirements, data access rules, technology stack, and code standards

3. **Comprehensive Security Requirements** - Detailed JWT authentication, data isolation, and access control requirements

4. **Clear Functional Constraints** - Defined web app requirements, technology constraints, and development workflow

5. **Process Constraints** - Established the Agentic Dev Stack workflow and governance procedures

6. **Success Criteria** - Added measurable completion metrics

The constitution was updated to version 2.0.0 with proper semantic versioning (MINOR bump due to new principles and sections). I also updated the plan template to include the new constitution check requirements and identified templates that need follow-up updates.

The updated constitution provides a solid foundation for secure, spec-driven development of the multi-user todo web application with clear traceability between requirements and implementation.