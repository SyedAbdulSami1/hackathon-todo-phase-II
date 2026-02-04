
<!-- Sync Impact Report
Version: 2.0.0
List of modified principles:
- Strict Spec-Driven Development → Spec-Driven Development (Single Source of Truth)
- Monorepo Architecture → Removed (replaced by Technology Constraints)
- Secure JWT Authentication → Security-First Design (JWT + Better Auth)
- Strict User Data Isolation → Enhanced with Production Realism
- Clean, Testable, Type-Safe Code → Merged into Production Realism
Added sections:
- Core Principles (expanded with Agentic Execution, Determinism, Traceability)
- Key Standards (expanded with API endpoint requirements)
- Security Requirements (detailed JWT and isolation requirements)
- Functional Constraints (specific web app requirements)
- Process Constraints (Agentic Dev Stack workflow)
- Success Criteria (completion metrics)
Removed sections:
- Constraints (merged into other sections)
- Development Workflow (moved to Process Constraints)
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/commands/sp.constitution.md
- ⚠ .specify/templates/commands/sp.implement.md (pending)
- ⚠ .specify/templates/commands/sp.plan.md (pending)
Follow-up TODOs:
- None
-->

# Project: AI-native Spec-Driven Transformation of a Console Task App into a Secure Multi-User Web Application Constitution

## Core Principles

### Spec-Driven Development (Single Source of Truth)
Specifications are the single source of truth. All behavior must be defined in specs before implementation. Specifications must be precise enough to generate working code. Manual coding without a spec is prohibited.

### Agentic Execution
Claude Code performs all implementation steps following the Agentic Dev Stack workflow. All code must be generated via Claude Code - no manual coding allowed.

### Determinism and Clarity
Requirements must be unambiguous and testable. No speculative or future features beyond requirements. Each feature maps back to a specific requirement.

### Security-First Design
Authentication, isolation, and least privilege are mandatory. All user data access must be authenticated and user-scoped. Security requirements define all behavior.

### Production Realism
Use real database (Neon PostgreSQL), real authentication (Better Auth + JWT), and real APIs. All CRUD operations must be persistent and multi-user support mandatory.

### Traceability
Every feature and requirement must be traceable. Each API endpoint must have clear inputs, validation rules, auth requirements, and error cases defined in specs.

## Key Standards

### API Requirements
Each API endpoint must have:
- Clear inputs with validation rules
- Authentication requirements
- Error case definitions
- RESTful conventions must be followed strictly

### Data Access
All user data access must be authenticated and user-scoped. Backend must not trust client-supplied user IDs blindly. All database queries must filter by authenticated user's ID.

### Technology Stack
- Frontend: Next.js 16+ with App Router
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (Next.js) + JWT
- Spec workflow: Claude Code + Spec-Kit Plus only

### Code Standards
Environment variables must be used for secrets and configuration. Frontend and backend responsibilities must be clearly separated. Use TypeScript for frontend with proper type safety.

## Security Requirements

### JWT Authentication
- JWT-based stateless authentication is mandatory
- Shared secret between frontend and backend for token verification
- All API routes protected by auth middleware
- Requests without valid JWT return 401
- Better Auth handles token issuance and management

### Data Isolation
- Task ownership enforced at database query level
- No cross-user data leakage under any condition
- Each user can only access their own data
- Database queries must filter by authenticated user ID

### Access Control
- Authentication is required for all protected endpoints
- Authorization enforced at both API and database levels
- Secure token storage and transmission
- Proper CORS configuration for inter-service communication

## Functional Constraints

### Web App Requirements
- All 5 Basic Level features must be implemented as a web app
- CRUD operations must be persistent (real database)
- Multi-user support is mandatory from day one
- UI must be responsive and usable
- Backend must not trust client-supplied user IDs

### Technology Constraints
- No manual coding - all code generated via Claude Code
- No new technologies outside specified stack
- No future or speculative features beyond requirements
- All behavior must be defined in specs before implementation

### Development Workflow
Amendments to this constitution require a documented proposal, a review of impact on dependent artifacts, and approval by the project lead. Versioning follows Semantic Versioning rules (MAJOR.MINOR.PATCH). Compliance will be reviewed during integration testing phases.

## Process Constraints

### Agentic Dev Stack
Follow Spec → Plan → Tasks → Implement → Review workflow. Each phase must be reviewable independently. Specs must be precise enough to generate working code.

### Governance
- Constitution amendments require documented proposal
- Review impact on dependent artifacts
- Approval by project lead required
- Compliance reviewed during integration testing

## Success Criteria

### Completion Metrics
- Application successfully implements all specified features
- Multi-user authentication and data isolation working
- All CRUD operations persistent and secure
- Responsive UI with proper error handling
- No cross-user data leakage
- All requirements traceable to specifications

**Version**: 2.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-02-03
