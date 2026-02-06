# 🔐 Authentication Skill for React/Next.js

A comprehensive, production-ready authentication system built with React, TypeScript, and modern best practices.

## 🚀 Features

### Core Authentication
- 🔐 Email/Password authentication
- 🔐 JWT token management with refresh tokens
- 🔐 Session persistence (localStorage, sessionStorage, cookies)
- 🔐 Automatic token refresh
- 🔃 Role-Based Access Control (RBAC)
- 🎯 Fine-grained permissions system

### Security Features
- 🔒 Rate limiting
- 🛡️ Password strength validation
- 🔐 Input sanitization
- 🚫 XSS protection
- 🛡️ CSRF protection
- 📱 Mobile-responsive design

### Developer Experience
- 🎨 Beautiful, customizable UI components
- 📦 Zero-config setup
- 🔧 TypeScript support with strict type safety
- 📚 Comprehensive documentation
- 🧪 Ready-to-use examples
- ⚡ Performance optimized

### Social Login
- 🔷 Google OAuth
- 🐙 GitHub OAuth
- 📘 Facebook Login
- 🐦 Twitter Login
- 🪟 Microsoft OAuth
- 🍎 Apple Login
- 🔗 Custom OAuth providers

## 📦 Installation

```bash
# Add the skill to your project
npm install @your-org/auth-skill
```

## 🎯 Quick Start

### 1. Wrap Your App

```typescript
// app/layout.tsx
import { AuthProvider } from '@/components/auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider
      config={{
        apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
        storage: 'localStorage',
        tokenRefreshThreshold: 5 * 60 * 1000,
      }}
    >
      {children}
    </AuthProvider>
  )
}
```

### 2. Create Login Page

```typescript
// app/login/page.tsx
import { useAuth } from '@/components/auth-provider'
import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  const { login } = useAuth()

  const handleSubmit = async (data: LoginData) => {
    await login(data)
    router.push('/dashboard')
  }

  return <AuthForm mode="login" onSubmit={handleSubmit} />
}
```

### 3. Protect Routes

```typescript
// app/dashboard/page.tsx
import { ProtectedRoute } from '@/components/protected-route'

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole="user">
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

### 4. Use Auth Hook

```typescript
// components/some-component.tsx
import { useAuth } from '@/components/auth-provider'

export function SomeComponent() {
  const { user, logout, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

## 📚 Components

### AuthProvider
Main context provider that wraps your application.

```typescript
<AuthProvider
  config={{
    providers: ['email', 'google'],
    storage: 'localStorage',
    tokenRefreshThreshold: 5 * 60 * 1000,
  }}
>
  {children}
</AuthProvider>
```

### AuthForm
Multi-purpose authentication form.

```typescript
<AuthForm
  mode="login" // 'login' | 'register' | 'forgot-password'
  onSubmit={handleAuth}
  providers={['email', 'google']}
  className="auth-form"
/>
```

### ProtectedRoute
Route protection with role/permission checks.

```typescript
<ProtectedRoute
  requiredRole="admin"
  requiredPermissions={['read:admin']}
  redirectTo="/login"
>
  <AdminPanel />
</ProtectedRoute>
```

### AuthProviderButton
Social login buttons.

```typescript
<AuthProviderButton
  provider="google"
  onClick={handleGoogleLogin}
  text="Continue with Google"
/>
```

## 🎨 Customization

### Theme Customization

```typescript
<AuthProvider
  theme={{
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      error: '#EF4444',
    },
    borderRadius: '0.5rem',
  }}
>
  {children}
</AuthProvider>
```

### Custom Validators

```typescript
const customValidators = {
  email: (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  },
  password: (password: string) => {
    return password.length >= 8
  },
}
```

### Custom Providers

```typescript
const customProvider = {
  id: 'custom',
  name: 'Custom Login',
  icon: CustomIcon,
  handler: handleCustomLogin,
}

<AuthProvider providers={[customProvider]} />
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_AUTH_GITHUB_CLIENT_ID=your-github-client-id
```

### API Response Format

```typescript
// Login response
{
  success: true,
  data: {
    user: {
      id: 'user123',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'user',
      permissions: ['read:tasks', 'write:tasks']
    },
    tokens: {
      accessToken: 'jwt-token',
      refreshToken: 'refresh-token',
      expiresAt: '2024-12-31T23:59:59Z'
    }
  }
}
```

## 🛡️ Security Features

### Rate Limiting

```typescript
const rateLimitConfig = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  register: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
  }
}
```

### Session Security

- JWT with configurable expiration
- Refresh token rotation
- Automatic token refresh
- Session timeout detection
- Secure cookie options

### Password Security

- bcrypt password hashing
- Password strength validation
- Rate limiting on auth attempts
- Account lockout after failed attempts
- Password reset tokens with expiration

## 🔄 Migration

### From Firebase Auth

```typescript
// Replace Firebase auth provider
import { FirebaseProvider } from '@/components/auth/firebase'

// Use built-in provider
<AuthProvider providers={['email', 'google']} />
```

### From Auth0

```typescript
// Replace Auth0 configuration
const authConfig = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Token not persisting**: Check storage configuration
2. **OAuth callback error**: Verify redirect URIs in provider settings
3. **Session timeout**: Adjust refresh threshold settings
4. **CORS issues**: Configure CORS on backend

### Debug Mode

```typescript
<AuthProvider debug={process.env.NODE_ENV === 'development'}>
  {children}
</AuthProvider>
```

## 📖 Examples

See the `examples/` directory for complete implementations:

- `examples/login-page.tsx` - Complete login page
- `examples/dashboard-page.tsx` - Protected dashboard
- `examples/admin-panel.tsx` - Admin-only routes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Support

- 📧 Email: support@your-org.com
- 💬 Discord: [Join our community](https://discord.gg/auth-skill)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/auth-skill/issues)

---

Made with ❤️ by your development team