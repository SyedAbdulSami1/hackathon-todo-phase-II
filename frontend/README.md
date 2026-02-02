# Todo App Frontend

Built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   └── input.tsx
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── lib/                   # Utility libraries
│   ├── api.ts             # API client
│   ├── auth.ts            # Authentication utilities
│   └── utils.ts           # Utility functions
├── types/                 # TypeScript type definitions
│   └── index.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
├── postcss.config.js
└── .eslintrc.json
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

- **Task Management**: Create, read, update, and delete tasks
- **Task Filtering**: Filter tasks by status (all, pending, completed)
- **Authentication**: User authentication with JWT tokens
- **Responsive Design**: Mobile-friendly interface
- **Type Safety**: Full TypeScript support
- **Modern UI**: Clean, accessible components with Tailwind CSS

## API Integration

The frontend connects to the backend API at:
- Development: `http://localhost:8000`
- Production: Configurable via `NEXT_PUBLIC_API_URL`

All API calls use axios with automatic JWT token injection and error handling.

## Styling

- Uses Tailwind CSS for utility-first styling
- Custom design tokens for consistent theming
- Dark mode support (CSS variables)
- Responsive breakpoints built-in