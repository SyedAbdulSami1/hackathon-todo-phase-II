# Debugging Comprehensive Skill

A complete, production-ready debugging system for modern web applications with comprehensive error handling, performance monitoring, and development tools.

## Features

- 🔍 **Multi-Layer Debugging**: Application, network, database, and performance debugging
- 🐛 **Error Classification**: Runtime, syntax, logical, and integration errors
- 📊 **Performance Profiling**: CPU, memory, network, and database performance analysis
- 🔌 **Development Tools**: Console, network, storage, and application debugging
- 🔒 **Security Debugging**: Authentication, authorization, and security vulnerability detection
- 🛠️ **Production Debugging**: Error tracking, monitoring, and alerting systems
- 📱 **Mobile Debugging**: Responsive debugging and mobile-specific issues
- 🌐 **Cross-Platform**: Browser, mobile, and server-side debugging

## Quick Start

```typescript
import { Debugger, useDebugger, createDebugger } from '@/components/debugger'

// Initialize debugger
const debugger = createDebugger({
  level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
  enabled: process.env.NODE_ENV === 'development',
  captureErrors: true,
  performanceMonitoring: true,
})

// Use debugger hook
function DebugComponent() {
  const { log, error, warn, info } = useDebugger()

  // Log messages
  log('Component mounted')

  // Handle errors
  try {
    riskyOperation()
  } catch (err) {
    error('Operation failed', { error: err, context: 'user-action' })
  }

  return <DebugPanel />
}
```

## Core Concepts

### 1. Debugging Levels

#### Debug Level
```typescript
// Debug level: Detailed information for development
debugger.log('User clicked button', {
  userId: user.id,
  buttonId: 'submit-btn',
  timestamp: Date.now()
})
```

#### Info Level
```typescript
// Info level: General application flow information
debugger.info('User session started', {
  sessionId: session.id,
  userId: user.id,
  ipAddress: req.ip
})
```

#### Warning Level
```typescript
// Warning level: Potential issues that don't break functionality
debugger.warn('Slow API response', {
  endpoint: '/api/users',
  duration: 2500,
  statusCode: 200
})
```

#### Error Level
```typescript
// Error level: Application errors that need attention
debugger.error('Database connection failed', {
  error: err,
  query: 'SELECT * FROM users',
  retryAttempts: 3
})
```

### 2. Error Classification

#### Runtime Errors
```typescript
// Runtime error handling
try {
  const result = riskyOperation()
  return result
} catch (error) {
  // Classify error type
  if (error instanceof TypeError) {
    debugger.error('Type error occurred', {
      error,
      context: 'data-processing'
    })
  } else if (error instanceof ReferenceError) {
    debugger.error('Reference error occurred', {
      error,
      context: 'variable-access'
    })
  } else {
    debugger.error('Unexpected error', {
      error,
      context: 'unknown'
    })
  }

  // Re-throw or handle appropriately
  throw error
}
```

#### Logical Errors
```typescript
// Logical error detection
function calculateTotal(items: Item[]): number {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Validate logical correctness
  if (total < 0) {
    debugger.error('Negative total calculated', {
      items,
      total,
      context: 'checkout-calculation'
    })

    // Handle logical error
    return Math.abs(total)
  }

  return total
}
```

#### Integration Errors
```typescript
// Integration error handling
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await api.get(`/users/${userId}`)

    if (!response.ok) {
      // Integration error
      debugger.error('API integration error', {
        endpoint: `/users/${userId}`,
        status: response.status,
        response: await response.json(),
        context: 'user-data-fetch'
      })

      throw new Error(`API error: ${response.status}`)
    }

    return response.data
  } catch (error) {
    debugger.error('Network error', {
      error,
      userId,
      context: 'user-data-fetch-network'
    })

    throw error
  }
}
```

### 3. Performance Profiling

#### CPU Profiling
```typescript
// CPU performance monitoring
const profiler = debugger.createProfiler('expensive-operation')

// Start profiling
profiler.start()

// Execute operation
const result = expensiveOperation()

// Stop profiling
const profile = profiler.stop()

// Log performance
debugger.info('Operation completed', {
  duration: profile.duration,
  memoryUsage: profile.memoryUsage,
  context: 'performance-critical'
})
```

#### Memory Profiling
```typescript
// Memory usage monitoring
const memoryMonitor = debugger.createMemoryMonitor()

// Monitor memory leaks
memoryMonitor.startMonitoring()

// Execute memory-intensive operations
const largeData = generateLargeDataset()

// Check memory usage
const memoryUsage = memoryMonitor.getMemoryUsage()

// Log memory usage
debugger.info('Memory usage after operation', {
  usedMemory: memoryUsage.used,
  totalMemory: memoryUsage.total,
  context: 'memory-intensive'
})
```

#### Network Profiling
```typescript
// Network performance monitoring
const networkMonitor = debugger.createNetworkMonitor()

// Monitor network requests
networkMonitor.startMonitoring()

// Make API calls
await api.get('/api/data')
await api.post('/api/submit', data)

// Get network statistics
const networkStats = networkMonitor.getStats()

// Log network performance
debugger.info('Network performance', {
  totalRequests: networkStats.total,
  failedRequests: networkStats.failed,
  averageResponseTime: networkStats.averageResponseTime,
  context: 'network-monitoring'
})
```

### 4. Development Tools

#### Console Debugging
```typescript
// Enhanced console debugging
const consoleDebugger = debugger.createConsoleDebugger()

// Log with context
consoleDebugger.log('Component rendered', {
  component: 'UserList',
  props: { items: userList },
  renderTime: performance.now()
})

// Error logging with stack trace
consoleDebugger.error('Failed to load data', {
  error: new Error('Network error'),
  component: 'UserList',
  retryCount: 3
})
```

#### Network Debugging
```typescript
// Network debugging tools
const networkDebugger = debugger.createNetworkDebugger()

// Monitor network requests
networkDebugger.monitorRequests()

// Log request details
networkDebugger.onRequest((request) => {
  debugger.info('Network request', {
    method: request.method,
    url: request.url,
    headers: request.headers,
    context: 'network-debugging'
  })
})

// Monitor response
debugger.onResponse((response) => {
  debugger.info('Network response', {
    status: response.status,
    url: response.url,
    duration: response.duration,
    context: 'network-debugging'
  })
})
```

#### Storage Debugging
```typescript
// Storage debugging tools
const storageDebugger = debugger.createStorageDebugger()

// Monitor localStorage changes
storageDebugger.monitorLocalStorage()

// Log storage operations
storageDebugger.onSetItem((key, value) => {
  debugger.info('localStorage set', {
    key,
    value,
    size: value.length,
    context: 'storage-debugging'
  })
})

// Monitor sessionStorage
storageDebugger.monitorSessionStorage()
```

### 5. Security Debugging

#### Authentication Debugging
```typescript
// Authentication debugging
const authDebugger = debugger.createAuthDebugger()

// Monitor login attempts
authDebugger.onLoginAttempt((attempt) => {
  debugger.info('Login attempt', {
    userId: attempt.userId,
    method: attempt.method,
    success: attempt.success,
    timestamp: attempt.timestamp,
    context: 'auth-debugging'
  })
})

// Monitor token validation
authDebugger.onTokenValidation((validation) => {
  debugger.info('Token validation', {
    tokenId: validation.tokenId,
    valid: validation.valid,
    expiration: validation.expiration,
    context: 'auth-debugging'
  })
})
```

#### Authorization Debugging
```typescript
// Authorization debugging
const authzDebugger = debugger.createAuthorizationDebugger()

// Monitor permission checks
authzDebugger.onPermissionCheck((check) => {
  debugger.info('Permission check', {
    userId: check.userId,
    resource: check.resource,
    permission: check.permission,
    granted: check.granted,
    context: 'authz-debugging'
  })
})

// Monitor role assignments
authzDebugger.onRoleAssignment((assignment) => {
  debugger.info('Role assignment', {
    userId: assignment.userId,
    role: assignment.role,
    granted: assignment.granted,
    timestamp: assignment.timestamp,
    context: 'authz-debugging'
  })
})
```

#### Security Vulnerability Detection
```typescript
// Security vulnerability detection
const securityDebugger = debugger.createSecurityDebugger()

// Monitor XSS attempts
securityDebugger.onXSSAttempt((attempt) => {
  debugger.error('XSS attempt detected', {
    source: attempt.source,
    payload: attempt.payload,
    timestamp: attempt.timestamp,
    context: 'security-debugging'
  })
})

// Monitor SQL injection attempts
securityDebugger.onSQLInjectionAttempt((attempt) => {
  debugger.error('SQL injection attempt detected', {
    query: attempt.query,
    parameters: attempt.parameters,
    timestamp: attempt.timestamp,
    context: 'security-debugging'
  })
})
```

### 6. Production Debugging

#### Error Tracking
```typescript
// Production error tracking
const errorTracker = debugger.createErrorTracker()

// Track unhandled errors
errorTracker.trackUnhandledErrors()

// Monitor error frequency
errorTracker.onFrequentError((error) => {
  debugger.error('Frequent error detected', {
    errorType: error.type,
    count: error.count,
    lastOccurrence: error.lastOccurrence,
    context: 'production-debugging'
  })
})

// Send error reports
afterEach(errorTracker.sendErrorReport())
```

#### Performance Monitoring
```typescript
// Production performance monitoring
const performanceMonitor = debugger.createPerformanceMonitor()

// Monitor application performance
performanceMonitor.startMonitoring()

// Track slow operations
performanceMonitor.onSlowOperation((operation) => {
  debugger.warn('Slow operation detected', {
    operation: operation.name,
    duration: operation.duration,
    threshold: operation.threshold,
    context: 'production-performance'
  })
})

// Monitor memory leaks
performanceMonitor.onMemoryLeak((leak) => {
  debugger.error('Memory leak detected', {
    component: leak.component,
    memoryIncrease: leak.memoryIncrease,
    context: 'production-performance'
  })
})
```

#### User Experience Monitoring
```typescript
// User experience monitoring
const uxMonitor = debugger.createUXMonitor()

// Monitor user interactions
uxMonitor.startMonitoring()

// Track user frustration
uxMonitor.onUserFrustration((frustration) => {
  debugger.warn('User frustration detected', {
    userId: frustration.userId,
    issue: frustration.issue,
    attempts: frustration.attempts,
    context: 'ux-monitoring'
  })
})

// Monitor page load performance
uxMonitor.onSlowPageLoad((page) => {
  debugger.warn('Slow page load', {
    page: page.url,
    loadTime: page.loadTime,
    threshold: page.threshold,
    context: 'ux-monitoring'
  })
})
```

### 7. Mobile Debugging

#### Responsive Debugging
```typescript
// Responsive debugging
const responsiveDebugger = debugger.createResponsiveDebugger()

// Monitor screen size changes
responsiveDebugger.onScreenResize((size) => {
  debugger.info('Screen resized', {
    width: size.width,
    height: size.height,
    breakpoint: size.breakpoint,
    context: 'responsive-debugging'
  })
})

// Test responsive layouts
responsiveDebugger.testResponsiveLayout((layout) => {
  debugger.info('Responsive layout tested', {
    breakpoint: layout.breakpoint,
    components: layout.components,
    issues: layout.issues,
    context: 'responsive-debugging'
  })
})
```

#### Touch Event Debugging
```typescript
// Touch event debugging
const touchDebugger = debugger.createTouchDebugger()

// Monitor touch events
touchDebugger.onTouchEvent((event) => {
  debugger.info('Touch event', {
    type: event.type,
    target: event.target,
    coordinates: event.coordinates,
    duration: event.duration,
    context: 'touch-debugging'
  })
})

// Debug touch gestures
touchDebugger.onGesture((gesture) => {
  debugger.info('Gesture detected', {
    type: gesture.type,
    start: gesture.start,
    end: gesture.end,
    velocity: gesture.velocity,
    context: 'touch-debugging'
  })
})
```

### 8. Cross-Platform Debugging

#### Browser Debugging
```typescript
// Browser-specific debugging
const browserDebugger = debugger.createBrowserDebugger()

// Monitor browser compatibility issues
browserDebugger.onCompatibilityIssue((issue) => {
  debugger.warn('Browser compatibility issue', {
    browser: issue.browser,
    version: issue.version,
    feature: issue.feature,
    context: 'browser-debugging'
  })
})

// Debug browser storage
browserDebugger.onStorageIssue((issue) => {
  debugger.error('Browser storage issue', {
    type: issue.type,
    quota: issue.quota,
    used: issue.used,
    context: 'browser-debugging'
  })
})
```

#### Server-Side Debugging
```typescript
// Server-side debugging
const serverDebugger = debugger.createServerDebugger()

// Monitor server errors
serverDebugger.onServerError((error) => {
  debugger.error('Server error', {
    error: error.message,
    statusCode: error.statusCode,
    method: error.method,
    url: error.url,
    context: 'server-debugging'
  })
})

// Debug database queries
serverDebugger.onDatabaseQuery((query) => {
  debugger.info('Database query', {
    query: query.text,
    parameters: query.parameters,
    duration: query.duration,
    rows: query.rows,
    context: 'server-debugging'
  })
})
```

## Components

### DebugPanel
```typescript
// Debug panel component
<DebugPanel
  visible={isDebugPanelVisible}
  level={debugLevel}
  filters={debugFilters}
  onClear={() => debugger.clear()}
  onExport={() => debugger.exportLogs()}
/>
```

### ErrorBoundary
```typescript
// Error boundary component
<ErrorBoundary
  fallback={ErrorFallback}
  onError={(error, info) => debugger.error('Component error', { error, info })}
>
  <YourComponent />
</ErrorBoundary>
```

### PerformanceMonitor
```typescript
// Performance monitor component
<PerformanceMonitor
  threshold={performanceThreshold}
  onSlowOperation={(operation) => debugger.warn('Slow operation', { operation })}
/>
```

## Hooks

### useDebugger
```typescript
// Main debugger hook
const {
  log,
  info,
  warn,
  error,
  createProfiler,
  createMemoryMonitor,
  createNetworkMonitor
} = useDebugger()
```

### useErrorBoundary
```typescript
// Error boundary hook
const {
  hasError,
  error,
  resetError
} = useErrorBoundary()
```

### usePerformanceMonitor
```typescript
// Performance monitoring hook
const {
  isSlow,
  metrics,
  startMonitoring,
  stopMonitoring
} = usePerformanceMonitor()
```

## API Integration

### Backend API Response Format
```typescript
// Debug API response
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-123",
        "level": "error",
        "message": "Database connection failed",
        "timestamp": "2024-01-15T10:30:00Z",
        "context": "database-connection",
        "metadata": {
          "error": "Connection refused",
          "retryAttempts": 3
        }
      }
    ],
    "performance": {
      "cpuUsage": 45.2,
      "memoryUsage": "256MB",
      "responseTime": 120
    },
    "errors": [
      {
        "type": "TypeError",
        "count": 5,
        "lastOccurrence": "2024-01-15T10:29:00Z"
      }
    ]
  }
}
```

### Configure API Client
```typescript
// Debug API configuration
export const debugConfig = {
  apiBaseUrl: process.env.NEXT_PUBLIC_DEBUG_API_URL,
  captureLevel: 'error',
  performanceThreshold: 1000,
  errorReporting: true,
  userTracking: true,
}
```

## Security Features

### Debug Mode Security
```typescript
// Secure debug mode
const secureDebugger = debugger.createSecureDebugger({
  enabled: process.env.NODE_ENV === 'development',
  authenticationRequired: true,
  rateLimit: 100 requests per minute,
  dataSanitization: true,
  sensitiveDataMasking: true,
})
```

### Data Protection
```typescript
// Data protection in debug logs
debugger.setSensitiveDataMasking({
  patterns: [
    /password=(.*?)(&|$)/g,
    /token=(.*?)(&|$)/g,
    /email=(.*?)(&|$)/g,
  ],
  replacement: '[REDACTED]'
})
```

## Customization

### Custom Debug Levels
```typescript
// Custom debug levels
debugger.addCustomLevel('critical', {
  color: '#FF0000',
  priority: 1,
  icon: '🚨',
})

debugger.critical('System failure', {
  component: 'database',
  error: 'Connection lost',
  recoveryAttempts: 0
})
```

### Custom Formatters
```typescript
// Custom log formatters
debugger.setFormatter('json', (log) => {
  return JSON.stringify({
    timestamp: log.timestamp,
    level: log.level,
    message: log.message,
    context: log.context,
    metadata: log.metadata,
  }, null, 2)
})
```

## Events

### Debug Events
```typescript
// Listen to debug events
debugger.on('log', (log) => {
  console.log('New log:', log)
})

debugger.on('error', (error) => {
  console.error('Error occurred:', error)
})

debugger.on('performance', (performance) => {
  console.log('Performance metric:', performance)
})
```

### Custom Events
```typescript
// Custom debug events
debugger.emit('custom-event', {
  type: 'user-action',
  userId: 'user-123',
  action: 'button-click',
  timestamp: Date.now(),
})
```

## Error Handling

### Error Classification
```typescript
// Error classification
debugger.classifyError(new Error('Network error'), {
  source: 'api-call',
  context: 'user-data-fetch',
  severity: 'high'
})
```

### Error Recovery
```typescript
// Error recovery strategies
debugger.addRecoveryStrategy('network-error', (error) => {
  // Retry logic
  return retryOperation(error.context)
})

debugger.addRecoveryStrategy('database-error', (error) => {
  // Fallback to cache
  return fallbackToCache(error.context)
})
```

## Migration Guide

### From Console Debugging
```typescript
// Replace console.log with debugger
debugger.log('User clicked button')
// Instead of console.log('User clicked button')
```

### From Basic Error Handling
```typescript
// Replace try-catch with debugger
debugger.error('Operation failed', { error: err })
// Instead of console.error(err)
```

## Best Practices

1. **Always use debugger instead of console.log** in production
2. **Set appropriate log levels** based on environment
3. **Monitor performance metrics** regularly
4. **Implement error recovery strategies**
5. **Secure debug data** in production
6. **Use structured logging** for better analysis
7. **Monitor user experience metrics**
8. **Implement rate limiting** for debug endpoints
9. **Use data sanitization** for sensitive information
10. **Regular security audits** for debug systems

## Troubleshooting

### Common Issues

#### Debug Panel Not Showing
```typescript
// Check debug configuration
debugger.getConfig()
// Ensure debug mode is enabled
if (!debugger.isEnabled()) {
  debugger.enable()
}
```

#### Performance Issues
```typescript
// Monitor performance impact
debugger.performanceMonitor.start()
// Check if debug logging is causing slowdowns
if (debugger.performanceMonitor.getImpact() > 0.1) {
  debugger.setLogLevel('warn')
}
```

#### Security Concerns
```typescript
// Check debug security settings
debugger.getSecurityConfig()
// Ensure sensitive data is masked
if (!debugger.isDataSanitized()) {
  debugger.enableDataSanitization()
}
```

### Debug Mode
```typescript
// Enable debug mode for troubleshooting
debugger.enableDebugMode({
  level: 'debug',
  captureAll: true,
  performanceMonitoring: true,
  errorTracking: true,
})
```

## Examples

### Complete Debugging Setup
```typescript
// Complete debugging configuration
const debugger = createDebugger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  enabled: true,
  captureErrors: true,
  performanceMonitoring: true,
  security: {
    authenticationRequired: true,
    dataSanitization: true,
    rateLimit: 100,
  },
  storage: {
    localStorage: true,
    sessionStorage: false,
  },
  integrations: {
    api: true,
    database: true,
    network: true,
  },
})
```

### Advanced Usage
```typescript
// Advanced debugging patterns
const profiler = debugger.createProfiler('complex-operation')

// Monitor operation
profiler.start()
const result = await complexOperation()
profiler.stop()

// Log with context
debugger.info('Operation completed', {
  duration: profiler.getDuration(),
  result: result.length,
  memoryUsage: profiler.getMemoryUsage(),
  context: 'performance-critical',
})

// Handle errors with recovery
debugger.error('Operation failed', {
  error: err,
  context: 'complex-operation',
  recoveryStrategy: 'retry',
})
```

This comprehensive debugging skill provides everything needed for effective debugging in modern web applications, from development to production environments.