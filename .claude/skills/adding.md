# Skill: Adding

## Purpose
This skill defines how new functionality is added to the project in a spec-driven, controlled, and reviewable manner.

No feature, file, API, database change, or UI element may be added unless it is explicitly allowed by the active specification.

## When Adding Is Allowed
Additions are permitted only when:
- The change is explicitly defined in `sp.specify`
- The change is planned in `sp.plan`
- The change does not violate `sp.constitution`
- The change does not introduce undocumented behavior

## Required Pre-Checks
Before adding anything, Claude Code must:
1. Identify which spec section authorizes the addition
2. Confirm whether the addition is:
   - Backend
   - Frontend
   - Authentication
   - Database
3. Verify that the addition does not expand scope

## Adding Backend Elements
- API endpoints must follow REST conventions
- All endpoints must enforce JWT authentication
- Database queries must be user-scoped
- SQLModel must be used for persistence
- Environment variables must be used for secrets

## Adding Frontend Elements
- Must use Next.js App Router
- Must respect authentication state
- Must attach JWT to API requests
- Must not bypass backend validation

## Adding Database Changes
- Schema changes must be minimal
- No breaking migrations unless specified
- All data must be owned by a user

## Prohibited Additions
- Features not listed in specs
- Admin roles or permissions
- Real-time or websocket features
- Third-party services beyond defined stack
- UI features that imply unsupported backend behavior

## Validation After Adding
Every addition must be validated by:
- Matching spec requirement
- Security check
- User isolation check
- No manual code intervention

## Principle
If a feature is not written in the spec, it does not exist.
