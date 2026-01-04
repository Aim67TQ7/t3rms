# T3RMS - AI Contract Analysis Platform

## Project Overview

T3RMS is an AI-powered contract analysis and legal document generation platform. It helps users identify high-risk language in contracts using traffic light heatmap visualization and generates compliant terms & conditions documents.

**Key Features:**
- Contract risk analysis with AI
- Traffic light heatmap for clause risk levels
- Counter-proposal generation for problematic clauses
- Terms & Conditions document generator
- PDF and text file upload support
- Credit-based freemium model with Stripe payments

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **UI:** shadcn-ui, Tailwind CSS, Radix UI, Lucide icons
- **State:** TanStack React Query, React Hook Form
- **Backend:** Supabase (PostgreSQL, Auth, Edge Functions)
- **Document Processing:** PDF.js, jsPDF
- **Payments:** Stripe

## Directory Structure

```
src/
├── components/
│   ├── analyzer/         # Analysis result display
│   ├── terms-analysis/   # Contract analysis UI (forms, heatmap)
│   ├── auth/             # Authentication components
│   ├── navbar/           # Navigation
│   ├── terms/            # Terms & conditions components
│   └── ui/               # shadcn-ui components
├── pages/                # Route-based page components
├── hooks/                # Custom React hooks
├── integrations/supabase/# Supabase client and types
├── utils/                # Utility functions
├── lib/                  # Helper utilities (cn function)
└── styles/               # Custom CSS

supabase/
├── functions/            # Edge Functions (Deno)
│   ├── analyze-contract/ # Main contract analysis
│   ├── claude-legal-generator/
│   ├── rapid-action/
│   └── create-checkout/  # Stripe integration
└── migrations/           # Database migrations
```

## Development Commands

```bash
npm run dev      # Start dev server (localhost:8080)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Key Files

- `src/main.tsx` - React entry point
- `src/App.tsx` - Main app with routing and providers
- `src/integrations/supabase/client.ts` - Supabase client
- `src/hooks/useContractAnalysis.ts` - Core analysis logic
- `src/hooks/useFileUpload.ts` - File upload handling
- `src/utils/anonymousUsage.ts` - Credit/token management

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | TermAnalysis | Landing/main analysis page |
| `/auth` | Auth | Login page |
| `/auth/callback` | AuthCallback | OAuth callback |
| `/term-analysis` | TermAnalysis | Contract analysis |
| `/pricing` | Pricing | Pricing page |
| `/tcgenerator` | TermsConditionsGenerator | T&C generator |
| `/terms` | TermsAndConditions | Terms of service |
| `/privacy` | PrivacyPolicy | Privacy policy |

## Coding Conventions

### Component Structure
- Functional components with hooks
- Feature-based folder organization
- Custom hooks for shared logic
- PascalCase for components, camelCase for functions

### Styling
- Tailwind CSS utility classes
- Use `cn()` from `@/lib/utils` for conditional classes
- shadcn-ui components from `@/components/ui/`
- Dark mode support via class-based theming

### State Management
- React Query for server state (database queries)
- useState for local component state
- Custom hooks encapsulate feature logic

### Error Handling
- Try-catch in async operations
- Toast notifications via Sonner (`sonner` package)
- Console logging for debugging

### Imports
- Use `@/` path alias for src imports
- Example: `import { Button } from "@/components/ui/button"`

## Supabase Integration

### Client Usage
```typescript
import { supabase } from "@/integrations/supabase/client";

// Database query
const { data, error } = await supabase
  .from('contract_analyses')
  .select('*');

// Edge function call
const { data, error } = await supabase.functions.invoke('analyze-contract', {
  body: { content, fileName }
});
```

### Database Tables
- `contract_analyses` - Stored analysis results
- `profiles` - User profiles
- `clauses` - Extracted contract clauses
- `analytics_events` - Usage analytics
- `anonymous_feedback` - User feedback

## Credit System

- Anonymous users: 3 free analyses (stored in localStorage)
- Authenticated users: Credit-based (stored in database)
- Credit packages via Stripe checkout

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_PROJECT_ID=<project_id>
VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
VITE_SUPABASE_URL=<supabase_url>
```

## Testing

No formal test suite currently. Code quality maintained via:
- TypeScript type checking
- ESLint rules
- Zod schema validation for forms

## Common Tasks

### Adding a New Component
1. Create in appropriate `src/components/` subfolder
2. Use TypeScript interfaces for props
3. Follow existing component patterns
4. Use shadcn-ui primitives where applicable

### Adding a New Page
1. Create in `src/pages/`
2. Add route in `src/App.tsx`
3. Use `<Seo>` component for meta tags

### Adding a Supabase Edge Function
1. Create folder in `supabase/functions/`
2. Add `index.ts` with Deno runtime
3. Deploy via Supabase CLI or Lovable

### Modifying Database Schema
1. Create migration in `supabase/migrations/`
2. Update types in `src/integrations/supabase/types.ts`
