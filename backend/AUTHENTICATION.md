# Authentication and Authorization System

## Overview

This system implements comprehensive JWT-based authentication with Role-Based Access Control (RBAC) for the Todo application.

## JWT Authentication Flow

![JWT Flow Diagram](https://miro.medium.com/max/1400/1*d64pdCbjU_BcGi2cygmuBw.png)

### JWT Concepts

#### SECRET_KEY
- **Purpose**: Used to sign and verify JWT tokens
- **Security**: Must be kept secret and secure
- **Generation**: 32-byte hexadecimal string (256-bit)
- **Storage**: Environment variable `SECRET_KEY`

#### ALGORITHM
- **Type**: HS256 (HMAC with SHA-256)
- **Security**: Symmetric algorithm using SECRET_KEY
- **Configuration**: Set in environment variable `ALGORITHM`

#### Token Expiry
- **ACCESS_TOKEN_EXPIRE_MINUTES**: 30 minutes (configurable)
- **Security**: Limits token lifetime to reduce risk
- **Refresh**: Tokens can be refreshed before expiry

## Password Security

### Password Hashing
- **Algorithm**: bcrypt (via passlib)
- **Cost Factor**: Automatically determined by passlib
- **Storage**: Only hashed passwords stored in database
- **Verification**: Secure password comparison

### Security Best Practices
- Never store plain text passwords
- Use strong, unique passwords
- Implement rate limiting on login attempts
- Use HTTPS for all authentication requests

## RBAC System

### Roles
- **student**: Basic user with limited permissions
- **teacher**: Intermediate user with extended permissions
- **admin**: Full access with user management

### Permissions

#### Role-Based Permissions

**Student Permissions**:
- `read:tasks`: View own tasks
- `create:tasks`: Create new tasks
- `update:own-tasks`: Edit own tasks
- `delete:own-tasks`: Delete own tasks

**Teacher Permissions**:
- All student permissions
- `update:all-tasks`: Edit any user's tasks
- `read:all-tasks`: View all users' tasks

**Admin Permissions**:
- All teacher permissions
- `read:users`: View all users
- `create:users`: Create new users
- `update:users`: Edit user accounts
- `delete:users`: Delete user accounts

#### Permission Routes

```
read:tasks:        [GET /api/tasks]
create:tasks:      [POST /api/tasks]
update:tasks:      [PUT /api/tasks/{d+}, PATCH /api/tasks/{d+}/status]
delete:tasks:      [DELETE /api/tasks/{d+}]
read:users:        [GET /api/auth/users, GET /api/auth/users/{d+}]
create:users:      [POST /api/auth/register, POST /api/auth/register-with-role]
update:users:      [PUT /api/auth/users/{d+}, PATCH /api/auth/users/{d+}]
update:own-tasks:  [PUT /api/tasks/{d+}, PATCH /api/tasks/{d+}/status]
delete:own-tasks:  [DELETE /api/tasks/{d+}]
update:all-tasks:  [PUT /api/tasks/{d+}, PATCH /api/tasks/{d+}/status]
read:all-tasks:    [GET /api/tasks]
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password",
  "role": "student"
}
```

**Response**:
```json
{
  "id": 4,
  "username": "new_user",
  "email": "user@example.com",
  "is_active": true,
  "role": "student",
  "last_login": null,
  "created_at": "2026-02-10T10:00:00.000Z",
  "updated_at": "2026-02-10T10:00:00.000Z"
}
```

#### POST /api/auth/register-with-role
```json
{
  "username": "teacher_user",
  "email": "teacher@example.com",
  "password": "secure_password"
}
```

**Query Parameters**:
- `role`: Optional role name (student, teacher, admin)

#### POST /api/auth/login
```json
{
  "username": "ali",
  "password": "pass123"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "student"
}
```

#### POST /api/auth/token/refresh
```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "student"
}
```

#### POST /api/auth/token/validate
```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "valid": true,
  "username": "ali",
  "role": "student",
  "is_active": true
}
```

#### POST /api/auth/logout
```json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

### User Management Endpoints

#### GET /api/auth/users (Admin only)
**Response**:
```json
[
  {
    "id": 1,
    "username": "ali",
    "email": "ali@example.com",
    "is_active": true,
    "role": "student",
    "last_login": "2026-02-10T10:00:00.000Z",
    "created_at": "2026-02-10T09:00:00.000Z",
    "updated_at": "2026-02-10T10:00:00.000Z"
  }
]
```

#### GET /api/auth/users/{user_id} (Admin or self)
**Response**:
```json
{
  "id": 1,
  "username": "ali",
  "email": "ali@example.com",
  "is_active": true,
  "role": "student",
  "last_login": "2026-02-10T10:00:00.000Z",
  "created_at": "2026-02-10T09:00:00.000Z",
  "updated_at": "2026-02-10T10:00:00.000Z"
}
```

### Protected Routes

#### GET /api/auth/me (Authenticated users)
**Response**:
```json
{
  "id": 1,
  "username": "ali",
  "email": "ali@example.com",
  "is_active": true,
  "role": "student",
  "last_login": "2026-02-10T10:00:00.000Z",
  "created_at": "2026-02-10T09:00:00.000Z",
  "updated_at": "2026-02-10T10:00:00.000Z"
}
```

#### GET /api/auth/permissions
**Response**:
```json
{
  "role": "student",
  "permissions": [
    "read:tasks",
    "create:tasks",
    "update:own-tasks",
    "delete:own-tasks"
  ]
}
```

#### POST /api/auth/permissions/setup (Admin only)
**Response**:
```json
{
  "message": "Permissions setup completed"
}
```

## Demo Users

### Pre-configured Users

1. **ali** (student)
   - Username: ali
   - Password: pass123
   - Email: ali@example.com
   - Role: student
   - Permissions: Basic task operations

2. **sir_ahmed** (teacher)
   - Username: sir_ahmed
   - Password: pass123
   - Email: sir_ahmed@example.com
   - Role: teacher
   - Permissions: All student permissions + task management

3. **boss** (admin)
   - Username: boss
   - Password: pass123
   - Email: boss@example.com
   - Role: admin
   - Permissions: Full system access

## Security Features

### Token Management
- **Short-lived tokens**: 30-minute expiry
- **Automatic refresh**: Refresh endpoint available
- **Secure storage**: JWT tokens signed with SECRET_KEY
- **Role-based access**: Role information in token payload

### Authentication Security
- **Password hashing**: bcrypt with automatic cost adjustment
- **Rate limiting**: (To be implemented in production)
- **Session management**: Last login tracking
- **Account status**: Active/inactive user management

### Authorization Security
- **Role-based access**: Fine-grained permission control
- **Route protection**: Dependency-based route protection
- **Permission checking**: Dynamic permission validation
- **Least privilege**: Users only have necessary permissions

## Environment Configuration

### Required Environment Variables

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host/database

# Security Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000"]
```

### Security Best Practices

1. **SECRET_KEY**: Generate a strong 32-byte key
2. **HTTPS**: Always use HTTPS in production
3. **Environment Variables**: Never commit secrets to version control
4. **Rate Limiting**: Implement rate limiting on auth endpoints
5. **Input Validation**: Validate all user inputs
6. **Audit Logging**: Log authentication and authorization events

## Error Handling

### Common Error Responses

#### 400 - Bad Request
```json
{
  "detail": "Invalid input data"
}
```

#### 401 - Unauthorized
```json
{
  "detail": "Could not validate credentials",
  "headers": {
    "WWW-Authenticate": "Bearer"
  }
}
```

#### 403 - Forbidden
```json
{
  "detail": "Permission denied: read:users"
}
```

#### 404 - Not Found
```json
{
  "detail": "User not found"
}
```

## Testing

### Authentication Tests
- Test user registration with valid/invalid data
- Test login with correct/incorrect credentials
- Test token validation and refresh
- Test role-based access control
- Test permission checking

### Security Tests
- Test password hashing and verification
- Test token expiration and refresh
- Test role-based access restrictions
- Test input validation and sanitization

## Maintenance

### Regular Tasks
- Rotate SECRET_KEY periodically
- Monitor authentication logs
- Update dependencies for security patches
- Review and update permissions as needed
- Monitor for suspicious authentication activity

### Database Maintenance
- Backup user data regularly
- Archive old authentication logs
- Monitor database performance
- Clean up expired password reset tokens

## Integration

### Frontend Integration
```typescript
// Example API client integration
import { api } from '@/lib/api'

// Login
const loginResponse = await api.post('/auth/login', {
  username: 'ali',
  password: 'pass123'
})

// Set Authorization header
api.defaults.headers.common["Authorization"] = `Bearer ${loginResponse.data.access_token}`
```

### Middleware Integration
```python
# Example route protection
from fastapi import Depends
from dependencies.auth import get_current_active_user, require_permission

@app.get('/api/tasks')
async def get_tasks(current_user: User = Depends(get_current_active_user)):
    # Only authenticated users can access
    pass

@app.put('/api/tasks/{task_id}')
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(require_permission('update:own-tasks'))
):
    # Only users with update permission can access
    pass
```

## Troubleshooting

### Common Issues

1. **Invalid Token Error**
   - Check SECRET_KEY consistency
   - Verify token wasn't tampered with
   - Ensure token hasn't expired

2. **Permission Denied**
   - Verify user role and permissions
   - Check if user is active
   - Ensure correct permission string is used

3. **Database Connection**
   - Verify DATABASE_URL is correct
   - Check database server status
   - Ensure proper network connectivity

4. **Password Issues**
   - Verify password hashing is working
   - Check password complexity requirements
   - Ensure bcrypt is properly installed

### Debug Tips

- Enable SQLModel echo logging for database queries
- Check environment variable loading
- Verify JWT token structure and claims
- Test with different user roles
- Monitor authentication logs for errors

## Production Considerations

### Deployment
- Use environment-specific configuration
- Implement proper logging and monitoring
- Set up automated backups
- Configure SSL/TLS certificates
- Use a reverse proxy (nginx, Caddy)

### Security Hardening
- Implement rate limiting on auth endpoints
- Use Web Application Firewall (WAF)
- Enable security headers
- Regular security audits
- Penetration testing

### Performance
- Use connection pooling
- Implement caching for frequent queries
- Monitor authentication latency
- Scale database connections appropriately
- Use CDN for static assets