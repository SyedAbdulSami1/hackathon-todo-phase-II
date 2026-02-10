# 🎯 Complete Authentication Guide

This guide covers everything you need to build a secure authentication system with JWT tokens and Role-Based Access Control (RBAC).

## 🚀 SignUp

### Step 1: Install Dependencies

First, install the required packages for authentication:

```bash
# Install FastAPI, JWT, and password hashing
uv add fastapi uvicorn[standard] pyjwt passlib[bcrypt]

# For database operations
uv add sqlmodel uvicorn
```

### Step 2: Create User Model with Password Hashing 🔐

#### Why Do We Hash Passwords?

Never store passwords as plain text! If your database gets hacked, all user passwords will be exposed.

Instead, we **hash** passwords — convert them into a format from which the original password cannot be retrieved.

```
"abc123"  →  hash  →  "$2b$12$LJ3m4ys3Gkl0TdXZrF..."
```

The hash looks random and one-way. You can verify if a password matches the hash, but you can't reverse it to get the original password.

#### User Model Implementation

```python
from sqlmodel import SQLModel, Field
from pydantic import constr, EmailStr
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserBase(SQLModel):
    username: str
    email: EmailStr
    full_name: str | None = None

class UserCreate(UserBase):
    password: constr(min_length=6, max_length=100)

class User(UserBase):
    id: int = Field(default=None, primary_key=True)
    hashed_password: str
    is_active: bool = True
    role: str = "user"  # Add role field for RBAC

    class Config:
        table = "users"

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify plain password against hashed password"""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Create a hashed password"""
        return pwd_context.hash(password)
```

# Login
## Step 3: JWT Token Create & Verify 🔐
1. First, Let's Understand — The JWT Token Flow
```
User Logs In
        ↓
Server Checks the Password
        ↓
Password Correct? → Server Creates a JWT Token
        ↓
Server Sends the Token Back to the User
        ↓
User Sends the Token with Every Request
        ↓
Server Decodes the Token and Identifies the User
```

### SECRET_KEY Concept 🔐

#### First, Let's Understand — What Is It?

SECRET_KEY is a random string that only the server knows. Its job is to **sign** the JWT token — so that no one can tamper with the token.

Think of the JWT token as a letter. The SECRET_KEY is a **seal** that only you have. If someone opens the letter and changes something, the seal will break — and the server will know that this token is fake.

---

#### Where Does It Come From?

You generate it yourself! There is no fixed key. Run this command in your terminal:

```bash
openssl rand -hex 32
```

The output will look something like this:

```
09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
```

That's your SECRET_KEY — a **random 64-character hex string**.

---

### How Does It Work?

```
Token CREATE time:
  User data + SECRET_KEY → jwt.encode() → Signed Token ✅

Token VERIFY time:
  Signed Token + SECRET_KEY → jwt.decode() → User Data ✅
  Signed Token + WRONG KEY → jwt.decode() → ❌ Invalid Token!
```

This means the **same key** is used to both sign and verify. If someone doesn't have the key, they **cannot** verify the token — and they also cannot create a fake token.

---

### The Other 2 Variables

| Variable | What It Is | Why We Need It |
|----------|------------|----------------|
| `ALGORITHM = "HS256"` | Hashing algorithm — HMAC + SHA256 | The method used to sign the token |
| `ACCESS_TOKEN_EXPIRE_MINUTES = 30` | Token expires after 30 minutes | Security — if a token leaks, it only works for a limited time |

---

### ⚠️ Important Warning

In production, **never hardcode the SECRET_KEY in your code**. Always keep it in a `.env` file:

```
# .env file
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7

Register these 3 users:

```json
{"username": "ali", "password": "pass123", "role": "student"}
{"username": "sir_ahmed", "password": "pass123", "role": "teacher"}
{"username": "boss", "password": "pass123", "role": "admin"}
```

**Login with each user and test the routes:**

| Route | Student | Teacher | Admin |
|-------|---------|---------|-------|
| `GET /me` | ✅ | ✅ | ✅ |
| `GET /results` | ✅ | ✅ | ✅ |
| `POST /results` | ❌ 403 | ✅ | ✅ |
| `GET /admin/users` | ❌ 403 | ❌ 403 | ✅ |

---

### 6. Behind The Scenes

```
Request → GET /admin/users
    ↓
Depends(oauth2_scheme) → Token extract
    ↓
get_current_user() → Token decode → {username: "ali", role: "student"}
    ↓
role_required(["admin"]) → "student" in ["admin"]? → NO!
    ↓
403 Forbidden: Access Denied! ❌


```
{"username": "ali", "password": "pass123", "role": "student"}
{"username": "sir_ahmed", "password": "pass123", "role": "teacher"}
{"username": "boss", "password": "pass123", "role": "admin"}
```

**Login with each user and test the routes:**

| Route | Student | Teacher | Admin |
|-------|---------|---------|-------|
| `GET /me` | ✅ | ✅ | ✅ |
| `GET /results` | ✅ | ✅ | ✅ |
| `POST /results` | ❌ 403 | ✅ | ✅ |
| `GET /admin/users` | ❌ 403 | ❌ 403 | ✅ |

---

## Behind The Scenes: How Authentication Works 🔍

### The Complete Authentication Flow

```
Request → GET /admin/users
    ↓
Depends(oauth2_scheme) → Token extraction
    ↓
get_current_user() → Token decode → {username: "ali", role: "student"}
    ↓
role_required(["admin"]) → "student" in ["admin"]? → NO!
    ↓
403 Forbidden: Access Denied! ❌
```

### Step-by-Step Breakdown

#### 1. Token Extraction

When a user sends a request with their JWT token in the Authorization header:

```python
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The `oauth2_scheme` dependency automatically extracts the token from the header.

#### 2. Token Decoding

```python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        role: str = payload.get("role")
        return {"username": username, "role": role}
    except jwt.JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

#### 3. Role-Based Access Control (RBAC)

```python
def role_required(allowed_roles: list):
    """Dependency to check if user has required role"""
    def role_checker(token_data: dict = Depends(get_current_user)):
        user_role = token_data["role"]
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Forbidden: Insufficient permissions",
            )
        return token_data
    return role_checker
```

#### 4. Route Protection Example

```python
@app.get("/admin/users", dependencies=[Depends(role_required(["admin"]))])
async def get_users():
    # Only admins can access this endpoint
    return [{"username": "boss", "role": "admin"}]
```

### Error Responses

| Status Code | When It Happens | Response |
|-------------|----------------|----------|
| 401 Unauthorized | Invalid or missing token | `{"detail": "Invalid token"}` |
| 403 Forbidden | User doesn't have required role | `{"detail": "Forbidden: Insufficient permissions"}` |
| 400 Bad Request | Token extraction failed | `{"detail": "No authorization header found"}` |

## Summary: Complete Authentication System 🎉

### Recap of All Steps

1. **Sign Up** — We created a secure signup feature with password hashing. Passwords are never stored as plain text, only as secure hashes.

2. **Login** — We built the login process using JWT tokens. When a user logs in, we verify the password against the hashed version. If it matches, we create a signed JWT token containing user data and role information.

3. **JWT Token Management** — We learned about SECRET_KEY, ALGORITHM, and token expiration. The SECRET_KEY is like a digital seal that ensures token authenticity, and tokens expire after 30 minutes for security.

4. **Role-Based Access Control (RBAC)** — We implemented role-based permissions by adding a `role` field to our user model and using dependency injection to protect routes based on user roles.

5. **Role-Based Endpoints** — We created protected endpoints where only specific roles can access certain functionality. For example, only admins can access `/admin/users`.

### Key Security Concepts

- **Password Hashing**: `abc123` → `$2b$12$LJ3m4ys3Gkl0TdXZrF...` (one-way conversion)
- **JWT Tokens**: Contain user data and are signed with SECRET_KEY
- **Role-Based Access**: Control who can access what endpoints
- **Token Expiration**: Limits damage if a token is leaked
- **Dependency Injection**: Clean way to protect routes

### Demo Users for Testing

| Username | Password | Role | Can Access |
|----------|----------|------|------------|
| `ali` | `pass123` | Student | GET /me, GET /results |
| `sir_ahmed` | `pass123` | Teacher | GET /me, GET /results, POST /results |
| `boss` | `pass123` | Admin | All endpoints |

### Production Security Tips

- ✅ Always use environment variables for SECRET_KEY
- ✅ Use HTTPS to prevent token interception
- ✅ Implement token refresh mechanisms
- ✅ Use proper CORS configuration
- ✅ Add rate limiting to prevent brute force attacks
- ✅ Consider using Redis for token blacklisting

Congratulations! You now have a complete, secure authentication system with JWT and RBAC. Your todo app is ready for real users with proper security measures in place! 🚀