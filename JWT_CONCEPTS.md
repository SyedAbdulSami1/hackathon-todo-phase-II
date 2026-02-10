# JWT Authentication Concepts

## JSON Web Tokens (JWT)

### What is JWT?
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

### JWT Structure

#### Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### Payload
```json
{
  "sub": "username",
  "role": "student",
  "exp": 1234567890
}
```

#### Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### JWT Flow Diagram

```
1. User logs in with credentials

2. Server verifies credentials

3. Server creates JWT token

4. Server returns token to client

5. Client stores token (usually in memory or secure storage)

6. Client includes token in Authorization header for subsequent requests

7. Server validates token and extracts user information

8. Server grants access based on user role and permissions
```

## JWT Security Components

### SECRET_KEY

#### What it is
- A random string used to sign and verify JWT tokens
- Acts as the "seal" that proves the token's authenticity

#### Why it's required
- Ensures tokens cannot be forged or tampered with
- Provides integrity protection for the token
- Prevents unauthorized access

#### How to generate
```bash
# Generate a secure 32-byte secret key
openssl rand -hex 32

# Example output:
your-secret-key-here
```

#### Security considerations
- **Never hardcode** in production code
- Store in environment variables or secure secret management
- Use different keys for different environments (dev/staging/prod)
- Rotate keys periodically in production
- Keep keys confidential and secure

### ALGORITHM = HS256

#### What it is
- HMAC with SHA-256
- Symmetric algorithm (same key for signing and verification)

#### Why it's used
- Fast and secure for most use cases
- Widely supported across platforms
- Good balance between security and performance

#### Alternatives
- RS256: Asymmetric algorithm (public/private key pair)
- ES256: Elliptic Curve Digital Signature Algorithm
- PS256: RSASSA-PSS using SHA-256

### ACCESS_TOKEN_EXPIRE_MINUTES = 30

#### What it is
- Token validity period
- Time after which the token becomes invalid

#### Why 30 minutes?
- **Security**: Limits the window for token misuse if compromised
- **User Experience**: Not too frequent re-authentication
- **Balance**: Good compromise between security and convenience

#### Token Expiry Options
- **Short-lived tokens**: 15-30 minutes (more secure)
- **Medium-lived tokens**: 1-2 hours (better UX)
- **Long-lived tokens**: 24+ hours (riskier)

## Token Creation vs Verification

### Token Creation
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### Token Verification
```python
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

## Security Best Practices

### Token Storage

#### Recommended
- **Memory storage**: Store in JavaScript memory
- **Secure HTTP-only cookies**: Server sets cookies
- **Secure storage**: Use browser's secure storage APIs

#### Not Recommended
- **localStorage**: Vulnerable to XSS attacks
- **sessionStorage**: Vulnerable to XSS attacks
- **URL parameters**: Exposed in browser history

### Token Security

#### HTTPS Only
- Always use HTTPS to prevent token interception
- Set secure cookie flags
- Implement HSTS (HTTP Strict Transport Security)

#### Token Validation
- Verify token signature
- Check token expiry
- Validate token claims
- Implement token revocation

#### Rate Limiting
- Limit login attempts per IP
- Lock accounts after multiple failed attempts
- Implement exponential backoff

### Common Attacks Prevention

#### Replay Attacks
- Use short token expiry times
- Implement token blacklisting
- Use refresh tokens with proper rotation

#### Man-in-the-Middle
- Always use HTTPS
- Implement certificate pinning
- Use secure headers

#### Cross-Site Scripting (XSS)
- Use HTTP-only cookies
- Implement Content Security Policy (CSP)
- Sanitize user inputs

## Token Management

### Token Lifecycle

#### Creation
- User authenticates with valid credentials
- Server generates JWT with user information
- Token includes expiry time
- Token is signed with SECRET_KEY

#### Usage
- Client includes token in Authorization header
- Server validates token signature and expiry
- Server extracts user information from payload
- Server grants access based on permissions

#### Refresh
- Client sends refresh request with valid token
- Server validates token and creates new token
- New token has updated expiry time
- Old token remains valid until expiry

#### Revocation
- Token blacklisting
- Session termination
- User logout
- Password change

### Token Rotation

#### Refresh Tokens
- Long-lived tokens for obtaining new access tokens
- Stored securely on server
- Revoked on logout or password change
- Periodically rotated for security

#### Access Token Rotation
- Short-lived tokens for API access
- Automatically refreshed using refresh tokens
- Invalidated on logout or password change
- Reduced security risk if compromised

## JWT Claims

### Standard Claims

#### Registered Claims
- **iss**: Issuer (who created the token)
- **sub**: Subject (user identifier)
- **aud**: Audience (intended recipient)
- **exp**: Expiration time
- **nbf**: Not before (token becomes valid)
- **iat**: Issued at (creation time)
- **jti**: JWT ID (unique identifier)

#### Custom Claims
- **role**: User role (student, teacher, admin)
- **permissions**: User permissions
- **email**: User email
- **last_login**: Last login timestamp

### Claim Validation

#### Required Claims
- **exp**: Must be in the future
- **iat**: Must be valid timestamp
- **sub**: Must be present and valid

#### Optional Claims
- **role**: Validate against known roles
- **permissions**: Check against allowed permissions
- **email**: Validate email format

## Performance Considerations

### Token Size
- Keep payload minimal
- Avoid large data in tokens
- Use efficient encoding
- Consider token compression

### Validation Performance
- Cache validated tokens
- Use efficient token storage
- Implement token expiration checking
- Use connection pooling for database operations

### Scaling Considerations

#### Stateless JWT
- No server-side session storage needed
- Easy horizontal scaling
- Load balancer friendly
- No session affinity required

#### Token Revocation
- Token blacklisting
- Database lookups for token validation
- Cache invalidation strategies
- Distributed cache usage

## Monitoring and Logging

### Security Events
- Authentication attempts
- Token creation and validation
- Permission checks
- User role changes
- Security incidents

### Performance Metrics
- Token validation time
- Login success/failure rates
- Token expiry patterns
- API response times
- Error rates

### Audit Trail
- User login/logout events
- Token refresh operations
- Permission changes
- Role modifications
- Security policy changes

## Compliance Considerations

### GDPR
- Data minimization
- Right to be forgotten
- Data portability
- Privacy by design

### Security Standards
- OWASP Top 10 compliance
- ISO 27001 security controls
- SOC 2 Type II certification
- Regular penetration testing

### Best Practices
- Regular security audits
- Penetration testing
- Code reviews
- Security training
- Incident response planning