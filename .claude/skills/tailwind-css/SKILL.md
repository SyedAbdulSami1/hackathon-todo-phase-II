# Tailwind CSS Skill

## Overview
Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing custom CSS. This skill provides comprehensive guidance for using Tailwind CSS in any type of project - web applications, desktop software, mobile apps, or any UI development.

## When to Use This Skill
- User mentions Tailwind CSS, utility-first CSS, or styling
- User wants to implement responsive design
- User asks about styling systems or design systems
- User needs to customize or configure Tailwind
- User wants to optimize CSS performance
- User is building any type of UI (web, desktop, mobile)

## Core Concepts

### 1. Utility-First Approach
- Build designs using pre-built utility classes
- No custom CSS required for most use cases
- Consistent design system across projects
- Rapid development with instant visual feedback

### 2. Responsive Design
- Mobile-first approach
- Responsive breakpoints: sm, md, lg, xl, 2xl
- Responsive variants: `md:bg-blue-500`, `lg:text-xl`

### 3. State Variants
- Hover: `hover:bg-blue-500`
- Focus: `focus:outline-none`
- Active: `active:bg-blue-700`
- Disabled: `disabled:opacity-50`

### 4. Dark Mode
- Class-based: `dark:bg-gray-800`
- System preference: `dark` variant
- Manual toggle with JavaScript

## Installation & Setup

### Web Projects
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Desktop Apps (Electron, Tauri)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### Mobile Apps (React Native, Capacitor)
```bash
npm install tailwindcss
# Configure for your mobile framework
```

## Configuration

### Basic tailwind.config.js
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,vue}",
    "./components/**/*.{html,js,ts,jsx,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981'
      }
    }
  },
  plugins: []
}
```

### Advanced Configuration
```javascript
module.exports = {
  content: [...],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

## Common Patterns

### 1. Layout Components
```jsx
// Container
<div className="container mx-auto px-4">
  {/* Content */}
</div>

// Flexbox
<div className="flex items-center justify-between">
  <div>Logo</div>
  <div className="flex space-x-4">
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      Button
    </button>
  </div>
</div>

// Grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="col-span-1">Card 1</div>
  <div className="col-span-1">Card 2</div>
  <div className="col-span-1">Card 3</div>
</div>
```

### 2. Forms
```jsx
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      type="email"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  <button
    type="submit"
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
  >
    Submit
  </button>
</form>
```

### 3. Cards & Modals
```jsx
// Card
<div className="bg-white rounded-lg shadow-md p-6">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="mt-2 text-gray-600">Card content</p>
</div>

// Modal Overlay
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 max-w-md w-full">
    {/* Modal content */}
  </div>
</div>
```

### 4. Responsive Navigation
```jsx
<nav className="bg-white shadow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center">
          Logo
        </div>
      </div>
      <div className="hidden sm:ml-6 sm:flex sm:items-center">
        {/* Desktop navigation */}
      </div>
      <div className="sm:hidden">
        {/* Mobile menu button */}
      </div>
    </div>
  </div>
</nav>
```

## Best Practices

### 1. Organization
- Group related utilities together
- Use meaningful class names when creating custom classes
- Follow BEM-like conventions for complex components

### 2. Performance
- Use PurgeCSS/Tailwind JIT for production
- Avoid arbitrary values when possible
- Use CSS custom properties for theming

### 3. Accessibility
- Use semantic HTML with Tailwind utilities
- Ensure sufficient color contrast
- Provide proper focus states

### 4. Maintenance
- Create reusable components with consistent styling
- Use design tokens for colors, spacing, and typography
- Document custom components and patterns

## Integration with Frameworks

### React/Next.js
- Use with JSX/TSX
- Component composition with Tailwind classes
- Dynamic classes with template literals

### Vue.js
- Use with Single File Components
- Scoped slots with Tailwind
- Dynamic class binding

### Svelte
- Use with Svelte components
- Class directives
- Style blocks with Tailwind

### Angular
- Use with components
- Class binding with [class]
- Style binding with [style]

## Advanced Features

### 1. Custom Plugins
```javascript
// tailwind.config.js
plugins: [
  function({ addUtilities }) {
    addUtilities({
      '.content-auto': {
        'content': 'auto'
      }
    })
  }
]
```

### 2. Theme Extensions
```javascript
// Extend spacing scale
theme: {
  extend: {
    spacing: {
      '72': '18rem',
      '84': '21rem',
      '96': '24rem',
    }
  }
}
```

### 3. Animation
```css
/* In CSS file */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* In Tailwind config */
theme: {
  extend: {
    animation: {
      spin: 'spin 1s linear infinite'
    }
  }
}
```

## Troubleshooting

### Common Issues
1. **Not seeing styles**: Check content paths in config
2. **Missing utilities**: Verify JIT mode is enabled
3. **Build errors**: Check PostCSS configuration
4. **Large bundle size**: Enable PurgeCSS in production

### Performance Optimization
- Use `@apply` sparingly
- Prefer utility classes over custom CSS
- Use CSS custom properties for dynamic values
- Enable tree-shaking in production

## Resources
- [Official Documentation](https://tailwindcss.com/docs)
- [Play Tailwind](https://play.tailwindcss.com/)
- [Tailwind Components](https://tailwindcomponents.com/)
- [Tailwind UI Templates](https://tailwindui.com/)

## Examples Repository
- [Tailwind CSS Examples](https://github.com/tailwindcss/examples)
- [Tailwind Components](https://github.com/tailwindlabs/tailwindcss)