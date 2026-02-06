# TypeScript Comprehensive Skill

## Overview
This skill provides complete TypeScript guidance covering type safety, interfaces, generics, and best practices for building robust applications.

## Activation Keywords
- TypeScript
- type safety
- interfaces
- generics
- TypeScript best practices
- React with TypeScript
- Next.js TypeScript
- TypeScript patterns

## Core Principles

### 1. Type Safety First

#### Basic Types
```typescript
// Primitive types
let id: number = 123;
let name: string = "John Doe";
let isActive: boolean = true;
let values: any[] = [1, "hello", true]; // Avoid any when possible

// Type inference
let inferredId = 123; // TypeScript infers as number
let inferredName = "John"; // TypeScript infers as string

// Explicit typing
let explicitId: number = 123;
let explicitName: string = "John";
let explicitActive: boolean = true;
```

#### Union Types
```typescript
// Union types
let userId: string | number = "user123";
let response: string | null = null;

// Type guards
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toString();
}

// Literal types
type Direction = 'north' | 'south' | 'east' | 'west';
let direction: Direction = 'north';
```

#### Null Safety
```typescript
// Strict null checks
let name: string | null = "John";
let length = name?.length ?? 0;

// Non-null assertion operator (use carefully)
const element = document.getElementById('my-element')!;

// Optional chaining
const user = {
  name: "John",
  address: {
    city: "New York",
    country: "USA"
  }
};
const country = user.address?.country; // Safe even if address is missing
```

### 2. Interfaces Deep Dive

#### Basic Interfaces
```typescript
// Interface definition
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Optional property
  readonly createdAt: Date; // Read-only property
}

// Extending interfaces
interface PremiumUser extends User {
  premiumFeatures: string[];
  subscriptionEndDate: Date;
}

// Function interfaces
interface SearchFunction {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunction = (src, sub) => src.includes(sub);
```

#### Indexable Types
```typescript
// String index signature
interface StringDictionary {
  [key: string]: string;
}

// Number index signature
interface NumberDictionary {
  [key: number]: string;
}

// Readonly index signature
interface ReadonlyStringDictionary {
  readonly [key: string]: string;
}
```

#### Class Interfaces
```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
}
```

#### Hybrid Types
```typescript
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

const getCounter = (): Counter => {
  let counter = (start: number) => `${start}`;
  counter.interval = 123;
  counter.reset = () => {};
  return counter;
};
```

### 3. Generics Mastery

#### Generic Functions
```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

// Usage
let output = identity<string>("myString");
let output2 = identity(42); // Type inference

// Generic constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}
```

#### Generic Interfaces
```typescript
interface GenericIdentityFn<T> {
  (arg: T): T;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

#### Generic Classes
```typescript
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;

  constructor(zeroValue: T, addFn: (x: T, y: T) => T) {
    this.zeroValue = zeroValue;
    this.add = addFn;
  }
}

// Usage
const myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
```

#### Generic Constraints with Multiple Types
```typescript
interface WithName {
  name: string;
}

interface WithAge {
  age: number;
}

function getProperty<T extends WithName, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30 };
const name = getProperty(person, "name"); // string
const age = getProperty(person, "age"); // number
```

#### Utility Types
```typescript
// Partial - makes all properties optional
type PartialUser = Partial<User>;

// Required - makes all properties required
type RequiredUser = Required<User>;

// Pick - select properties
type UserName = Pick<User, 'name' | 'email'>;

// Omit - exclude properties
type UserWithoutAge = Omit<User, 'age'>;

// Record - create object type
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;

// Exclude - exclude from union
type Primitive = Exclude<string | number | (() => void), Function>;

// Extract - extract from union
type StringExtract = Extract<string | number | (() => void), string>;

// NonNullable - exclude null and undefined
type NonNullableString = NonNullable<string | null>;
```

### 4. Advanced Type Patterns

#### Conditional Types
```typescript
type ExtractType<T> = T extends { type: infer U } ? U : never;
type StringOrNumber = ExtractType<{ type: string } | { type: number }>;

// Distributive conditional types
type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArray = ToArray<string | number>; // string[] | number[]
```

#### Mapped Types
```typescript
// Basic mapped type
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type ReadonlyUser = Readonly<User>;

// Template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
type Events = EventName<'click' | 'scroll'>; // "onClick" | "onScroll"

// Key remapping
type MappedWithRename<T> = {
  [K in keyof T as `original_${string & K}`]: T[K];
};
```

#### Template Literal Types
```typescript
// String literal types
type Greeting = "Hello, " | "Hi, ";
type Name = "John" | "Jane";
type GreetingWithName = `${Greeting}${Name}`;

// Advanced template literals
type CSSValue<T extends string> = `${T}px` | `${T}em` | `${T}rem`;
type Size = CSSValue<"100" | "200">; // "100px" | "100em" | "100rem" | "200px" | "200em" | "200rem"
```

#### Type Guards and Narrowing
```typescript
// Type predicates
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  }
}

// Instanceof type guard
class Dog {
  bark() {
    console.log("Woof!");
  }
}

function getPet() {
  return new Dog();
}

const pet = getPet();
if (pet instanceof Dog) {
  pet.bark();
}

// Discriminated unions
interface Square {
  kind: "square";
  size: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

type Shape = Square | Circle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.size * shape.size;
    case "circle":
      return Math.PI * shape.radius * shape.radius;
  }
}
```

### 5. React with TypeScript

#### Component Props
```typescript
// Basic props interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

#### Custom Hooks with Generics
```typescript
// Generic local storage hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Usage
const [user, setUser] = useLocalStorage<User>('user', {
  id: '',
  name: '',
  email: ''
});
```

#### Context with Generics
```typescript
// Generic context
interface AuthContextType<T> {
  user: T | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType<User> | null>(null);

// Usage in component
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### Generic Components
```typescript
// Generic list component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Usage
const users = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }];
<List
  items={users}
  renderItem={user => <span>{user.name}</span>}
  keyExtractor={user => user.id}
/>
```

### 6. Next.js with TypeScript

#### API Routes
```typescript
// pages/api/users.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { error: string }>
) {
  if (req.method === 'GET') {
    // Get users logic
    res.status(200).json([]);
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
```

#### getServerSideProps
```typescript
// pages/users/[id].tsx
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

interface UserPageProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  error?: string;
}

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (context) => {
  const { id } = context.params!;

  try {
    const response = await fetch(`https://api.example.com/users/${id}`);
    const user = await response.json();

    return {
      props: {
        user
      }
    };
  } catch (error) {
    return {
      props: {
        error: 'User not found'
      }
    };
  }
};

export default function UserPage({ user, error }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) return <div>Error: {error}</div>;
  return <div>User: {user.name}</div>;
}
```

### 7. Error Handling Patterns

#### Custom Errors
```typescript
// Custom error classes
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class DatabaseError extends Error {
  constructor(
    public query: string,
    public originalError: Error
  ) {
    super(`Database error: ${originalError.message}`);
    this.name = 'DatabaseError';
  }
}
```

#### Result Pattern
```typescript
// Result type for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
async function fetchUserData(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### 8. Best Practices Checklist

#### ✅ Do
- Use strict TypeScript configuration
- Prefer type inference where possible
- Always return explicit types for public APIs
- Use interfaces for object shapes
- Use type aliases for unions
- Use readonly for immutable properties
- Use generics for reusable components
- Document complex types with JSDoc

#### ❌ Don't
- Use `any` unless absolutely necessary
- Use type assertions without checking
- Ignore TypeScript errors
- Mix interfaces and type aliases for same use case
- Use `any` in function signatures
- Ignore null safety

### 9. Configuration Tips

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### 10. Performance Optimization

#### Type Performance
```typescript
// ✅ Use object types instead of classes for simple data
interface Point {
  x: number;
  y: number;
}

// ❌ Avoid complex type definitions in hot paths
type ComplexType = {
  // ... very complex type
};

// ✅ Use type assertion for performance-critical code
const elements = document.querySelectorAll('.item') as NodeListOf<HTMLDivElement>;
```

#### Compilation Speed
```typescript
// Use project references for monorepos
// tsconfig.base.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true
  }
}

// tsconfig.app.json
{
  "extends": "./tsconfig.base.json",
  "references": [
    { "path": "./tsconfig.shared.json" }
  ]
}
```

This comprehensive TypeScript guide covers all essential patterns and best practices for building robust, maintainable applications with strong type safety.