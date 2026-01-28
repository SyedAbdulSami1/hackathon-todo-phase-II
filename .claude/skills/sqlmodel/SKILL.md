---
name: "sqlmodel"
description: "Expert guidance for SQLModel: defining models, CRUD operations, relationships (one-to-many, many-to-many), sessions (sync/async), engines, migrations, best practices, type safety, Pydantic/SQLAlchemy integration. Use when user mentions SQLModel, SQL databases in Python, table models, Field, Session, select/exec, relationships, cascade delete, sqlmodel_update, or related workflows. Updated for 2026 features (Pydantic 2+, SQLAlchemy 2+, UUID, no auto-indexes)."
version: "1.0.0-2026"
---

# SQLModel Skill – Python SQL Databases Expert

## When to Use
- User mentions SQLModel, tiangolo/fastapi/sqlmodel, or SQL databases with type hints
- Needs help defining table models, data models, or hybrid models
- CRUD operations: create, read (select/exec), update (.sqlmodel_update()), delete
- Relationships: one-to-one, one-to-many, many-to-many, back_populates, cascade_delete
- Engine creation, Session management (sync/async), transactions
- Async support with async_engine, async_session
- Migrations (Alembic integration tips)
- Best practices: type safety, editor support, validation, avoiding common pitfalls
- Troubleshooting: type errors, relationship recursion, session scoping, no data validation in table models

## Core Concepts
SQLModel = SQLAlchemy (ORM power) + Pydantic (validation + type hints) with clean API.

- **Table Model** — class SQLModel(table=True): represents DB table
- **Data Model** — class SQLModel(): pure Pydantic for request/response
- Single model can do both, but for API safety use separate Hero vs HeroCreate/HeroPublic
- Type annotations everywhere → editor autocompletion + error checking
- Powered by Pydantic v2+ & SQLAlchemy 2+
- 2026 updates: .sqlmodel_update(), cascade_delete/ondelete/passive_deletes, official UUID, no auto indexes (opt-in)

## Procedure
1. Gather context: sync/async? database URL? relationships needed? create/update/read patterns?
2. Recommend model separation for APIs: Base + Create + Public + Table
3. Guide engine/session creation (sync/async)
4. Show CRUD with select/exec (type-safe)
5. Handle relationships: sa_relationship_kwargs for advanced
6. Use .sqlmodel_update() for safe in-place updates
7. Best practices: use Field for constraints/indexes, avoid table=True for response models
8. Warnings: table models don't validate data by default (use .model_validate() if needed)

## Output Format

**Model Definition**
```python
from sqlmodel import SQLModel, Field
from typing import Optional
```

**Engine & Session Setup**
```python
from sqlmodel import create_engine, Session, select
# or async equivalents
```

**CRUD Examples**
- Create: session.add(), commit(), refresh()
- Read: session.exec(select(Model)).all() / .first() / .one()
- Update: model.sqlmodel_update(data_dict)
- Delete: session.delete(model)

**Relationships Example**
```python
class Team(SQLModel, table=True):
    ...
    heroes: list["Hero"] = Relationship(back_populates="team")
```

**Best Practices & Tips**
- Bullet list

**Common Pitfalls & Fixes**
- List

## Quality Criteria
- Always use modern syntax: int | None instead of Optional[int], ConfigDict for Pydantic
- Prefer exec(select(Model)) over query (SQLAlchemy 2+ style)
- Separate table models from create/read models for API safety
- Use Field(sa_column_args=..., index=True, sa_type=...) for custom control
- Never return table models directly in APIs without .from_orm() or Public model
- Include engine dispose in lifespan/shutdown
- Async: use async_engine, async_sessionmaker, await session.exec(...)

## Examples

**Basic Hero Table Model**
```python
from sqlmodel import SQLModel, Field
from typing import Optional

class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    secret_name: str
    age: Optional[int] = Field(default=None, index=True)
```

**Create & Read**
```python
engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)

with Session(engine) as session:
    hero = Hero(name="Deadpond", secret_name="Dive Wilson")
    session.add(hero)
    session.commit()
    session.refresh(hero)

    heroes = session.exec(select(Hero)).all()
```

**Update with .sqlmodel_update() – 2026 feature**
```python
hero.sqlmodel_update({"age": 42, "secret_name": "New Secret"})
session.add(hero)
session.commit()
```

**One-to-Many Relationship**
```python
from sqlmodel import Relationship

class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    heroes: list["Hero"] = Relationship(back_populates="team")

class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    team_id: Optional[int] = Field(default=None, foreign_key="team.id")
    team: Optional[Team] = Relationship(back_populates="heroes")
```

**Cascade Delete (new in recent releases)**
```python
heroes: list["Hero"] = Relationship(
    back_populates="team",
    cascade_delete=True,  # or ondelete="CASCADE"
)
```

**Async Example**
```python
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("sqlite+aiosqlite:///database.db")
async_session = async_sessionmaker(engine, class_=AsyncSession)

async with async_session() as session:
    result = await session.exec(select(Hero))
    heroes = result.all()
```

**Best Practices**
- Use table=True only for DB models
- Create separate classes for Create/Update/Public to avoid exposing secrets
- Add indexes selectively with Field(index=True)
- Use sa_column=Column(...) for advanced SQLAlchemy features
- Always refresh after create/update if you need DB-generated values
- For large apps: use Alembic for migrations (SQLModel compatible)
- Avoid raw SQL unless necessary — exec() gives type safety

**Pitfalls**
- Table models don't auto-validate → use .model_validate() for input
- Relationship recursion → use string annotations ("Hero") or separate models
- No auto indexes anymore → explicitly add Field(index=True)
- SQLite check_same_thread=False only for dev
