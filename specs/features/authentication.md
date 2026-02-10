# Authentication

## FastAPI Authentication & Authorization

### SignUp

#### Step 1: Installing packages
```bash
uv add fastapi uvicorn[standard] pyjwt pwdlib[bcrypt]
```

#### Step 2: User model creation
```python
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=50, unique=True)
    email: EmailStr = Field(unique=True)
    password_hash: str
    full_name: Optional[str] = None
    role: str = "student"  # default role
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### Password hashing explanation
- **Why plain-text passwords are dangerous**:
  - If database is compromised, attackers get all passwords directly
  - Users often reuse passwords across sites
  - Can lead to identity theft and data breaches

- **Conceptual explanation of hashing**:
  - One-way mathematical function
  - Same input always produces same output
  - Cannot reverse the process
  - Small change in input creates completely different output

- **Example transformation**:
  ```
  "abc123" → hash → "$2b$12$KIXx8u.9a4Z9v7Y6w3E2d1C0b9a8Z7y6X5w4V3u2T1s0R9q8P7o6N5m4L3k2J1i0H"
  ```

### Login

#### Step 3: JWT Token creation and verification
```python
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

#### JWT Flow diagram
```
User logs in → password verification → token creation → token usage → token decoding
     ↓                    ↓                       ↓              ↓              ↓
  POST /login     Check password hash    Return JWT    Include in     Validate JWT
                     in database          token         headers       and extract user
```

### JWT Concepts

#### SECRET_KEY
- **What it is**: A random string used to sign and verify JWT tokens
- **Why it is required**: Ensures tokens cannot be forged or tampered with
- **Analogy**: Like a wax seal on a letter - proves it came from the sender
- **How to generate**:
  ```bash
  openssl rand -hex 32
  ```
- **Warning**: Never hardcode in production, use `.env` file instead

#### ALGORITHM = HS256
- HMAC with SHA-256
- Symmetric algorithm (same key for signing and verification)
- Fast and secure for most use cases

#### ACCESS_TOKEN_EXPIRE_MINUTES = 30
- Token validity period
- Balance between security and user experience
- Shorter time = more secure, longer time = better UX

#### Token creation vs verification
- **Creation**: Encode user data + expiration + sign with SECRET_KEY
- **Verification**: Decode, check signature, validate expiration

### Demo Users
```json
{"username": "ali", "password": "pass123", "role": "student"}
{"username": "sir_ahmed", "password": "pass123", "role": "teacher"}
{"username": "boss", "password": "pass123", "role": "admin"}
```

### RBAC Route Access Table

| Route | Student | Teacher | Admin |
|-------|---------|---------|-------|
| GET /me | ✅ | ✅ | ✅ |
| GET /results | ✅ | ✅ | ✅ |
| POST /results | ✅ | ✅ | ✅ |
| GET /admin/users | ❌ | ❌ | ✅ |

### Role-Based Access Control Implementation

#### Role definitions
```python
ROLE_PERMISSIONS = {
    "student": ["get_me", "get_results", "post_results"],
    "teacher": ["get_me", "get_results", "post_results"],
    "admin": ["get_me", "get_results", "post_results", "get_admin_users"],
}
```

#### Dependency injection for role checking
```python
from fastapi import HTTPException, Depends, status
from typing import Callable, TypeVar

RoleDependency = Callable[..., bool]

async def require_role(required_role: str):
    async def role_checker(token: str = Depends(oauth2_scheme)):
        username = verify_token(token)
        # Here you would fetch user from database
        # user = get_user_from_db(username)
        # if required_role not in ROLE_PERMISSIONS.get(user.role, []):
        #     raise HTTPException(
        #         status_code=status.HTTP_403_FORBIDDEN,
        #         detail="Not enough permissions"
        #     )
        return True
    return Depends(role_checker)
```

### Security Best Practices

1. **Password policies**:
   - Minimum length: 8 characters
   - Require uppercase, lowercase, numbers, special characters
   - Password strength validation

2. **Rate limiting**:
   - Limit login attempts per IP
   - Lock account after multiple failed attempts
   - Implement exponential backoff

3. **Secure headers**:
   - Use HTTPS only
   - Set secure cookie flags
   - Implement CORS policies

4. **Token security**:
   - Store tokens securely (HTTP-only cookies or secure storage)
   - Implement token revocation
   - Use refresh tokens for long-lived sessions

### Error Handling

```python
class AuthException(Exception):
    pass

class InvalidCredentials(AuthException):
    pass

class TokenExpired(AuthException):
    pass

class InsufficientPermissions(AuthException):
    pass
```

### Testing Authentication

#### Test cases
1. **Successful login**
   - Valid credentials → returns JWT token

2. **Failed login**
   - Invalid password → 401 Unauthorized
   - Non-existent user → 401 Unauthorized

3. **Token validation**
   - Valid token → access granted
   - Expired token → 401 Unauthorized
   - Tampered token → 401 Unauthorized

4. **Role-based access**
   - Student accessing student routes → allowed
   - Student accessing admin routes → forbidden
   - Admin accessing any route → allowed