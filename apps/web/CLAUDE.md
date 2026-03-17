# Base Application Web

This is a standalone React frontend application that serves as a reference implementation for applications using the Copera SDK. This application will be extracted from the monorepo and published as open-source.

## Technology Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 + CVA (Class Variance Authority)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Server State**: React Query (TanStack Query 5)
- **Client State**: Zustand 4
- **Forms**: React Hook Form 7
- **HTTP Client**: Axios
- **Internationalization**: i18next
- **Routing**: React Router 7

## Project Structure

```
src/
├── auth/                 # Authentication system
│   ├── context/          # AuthProvider and context
│   ├── guard/            # AuthGuard, GuestGuard
│   ├── hooks/            # useAuth hook
│   └── types.ts          # Auth type definitions
├── components/           # UI components
│   ├── ui/               # shadcn/ui base components
│   └── tickets/          # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Core utilities
│   ├── react-query.ts    # React Query config + QueryKey
│   └── utils.ts          # cn() utility for Tailwind
├── pages/                # Page components
├── requests/             # API request functions
├── routes/               # Router configuration
├── stores/               # Zustand stores
├── types/                # TypeScript definitions
├── utils/                # Utilities
│   ├── session.ts        # Session management
│   ├── storage.ts        # localStorage wrapper
│   └── error-message.ts  # Error extraction
├── config.ts             # App configuration
├── app.tsx               # App wrapper with providers
├── main.tsx              # Entry point
└── style.css             # Global styles + Tailwind theme
```

## Development Commands

```bash
pnpm dev          # Start dev server (port 8081)
pnpm build        # Build for production
pnpm lint         # Run linter
pnpm lint:fix     # Auto-fix lint issues
pnpm fm:fix       # Format with Prettier
```

## Environment Variables

```env
VITE_SERVER_URL=http://localhost:7071/api
```

## React Query Patterns

### Query Keys

Use centralized QueryKey enum for consistent cache keys:

```typescript
// lib/react-query.ts
export const QueryKey = {
  TICKET_LIST: () => ['tickets', 'list'] as const,
  TICKET_DETAIL: (id: string) => ['tickets', 'detail', id] as const,
};
```

### Query Hook Pattern

```typescript
// hooks/useTickets.ts
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'src/lib/react-query';
import { TicketRequests } from 'src/requests/ticket.requests';

export function useTicketList() {
  return useQuery({
    queryKey: QueryKey.TICKET_LIST(),
    queryFn: TicketRequests.listTickets,
    refetchOnWindowFocus: true,
  });
}

export function useTicketDetail(ticketId: string | null) {
  return useQuery({
    queryKey: QueryKey.TICKET_DETAIL(ticketId!),
    queryFn: () => TicketRequests.getTicketDetail(ticketId!),
    enabled: !!ticketId,
  });
}
```

### Mutation Hook Pattern

```typescript
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TicketRequests.createTicket,
    onSuccess: (newTicket) => {
      // Update cache with new ticket
      queryClient.setQueryData(
        QueryKey.TICKET_LIST(),
        (old: Ticket[] | undefined) => (old ? [newTicket, ...old] : [newTicket])
      );
    },
  });
}
```

### Optimistic Updates

```typescript
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TicketRequests.updateTicket,
    async onMutate(updated) {
      await queryClient.cancelQueries({ queryKey: QueryKey.TICKET_LIST() });
      const previous = queryClient.getQueryData(QueryKey.TICKET_LIST());

      // Optimistic update
      queryClient.setQueryData(QueryKey.TICKET_LIST(), (old: Ticket[]) =>
        old.map((t) => (t._id === updated._id ? { ...t, ...updated } : t))
      );

      return { previous };
    },
    onError(err, newData, context) {
      queryClient.setQueryData(QueryKey.TICKET_LIST(), context?.previous);
    },
    onSettled() {
      queryClient.invalidateQueries({ queryKey: QueryKey.TICKET_LIST() });
    },
  });
}
```

## Zustand Store Pattern

### Store Definition

```typescript
// stores/app.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    { name: 'app-store' }
  )
);
```

### Store Usage

```typescript
// Use selectors for performance
const sidebarOpen = useAppStore((state) => state.sidebarOpen);
const toggleSidebar = useAppStore((state) => state.toggleSidebar);

// Or destructure multiple values
const { sidebarOpen, toggleSidebar } = useAppStore();
```

## API Request Layer

### Request Function Pattern

```typescript
// requests/ticket.requests.ts
import axios from './api';
import type { Ticket, CreateTicketParams } from 'src/types/ticket';

export async function listTickets(): Promise<Ticket[]> {
  const { data } = await axios.get<Ticket[]>('/tickets');
  return data;
}

export async function createTicket(params: CreateTicketParams): Promise<Ticket> {
  const { data } = await axios.post<Ticket>('/tickets', params);
  return data;
}

export async function getTicketDetail(ticketId: string): Promise<Ticket> {
  const { data } = await axios.get<Ticket>(`/tickets/${ticketId}`);
  return data;
}
```

### Namespace Export

```typescript
// requests/index.ts
export * as TicketRequests from './ticket.requests';
export * as UserRequests from './user.requests';
export * as SystemRequests from './system.requests';
```

### Axios Configuration

```typescript
// requests/api.ts
import axios from 'axios';
import { CONFIG } from 'src/config';
import { Session } from 'src/utils/session';

const instance = axios.create({
  baseURL: CONFIG.serverUrl,
});

// Add auth token to requests
instance.interceptors.request.use((config) => {
  const token = Session.getSessionToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Session.logout();
      window.location.href = CONFIG.auth.signInPath;
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default instance;
```

## Form Patterns (React Hook Form)

### Basic Form

```typescript
import { useForm } from 'react-hook-form';

interface FormValues {
  title: string;
  details: string;
}

export function CreateTicketForm({ onSuccess }: Props) {
  const { mutate: createTicket, isPending } = useCreateTicket();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: '', details: '' },
  });

  const onSubmit = (data: FormValues) => {
    createTicket(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('title', { required: 'Title is required' })} />
      {errors.title && <span>{errors.title.message}</span>}

      <Textarea {...register('details')} />

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
```

## Styling Patterns

### Tailwind CSS with CVA

```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-10 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

### cn() Utility

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
className={cn(
  'base-classes',
  isActive && 'active-class',
  className // allow prop overrides
)}
```

### Theme Configuration

Theme is defined in `style.css` using Tailwind v4 @theme:

```css
@theme {
  --color-primary: #6449cc;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f1f5f9;
  --color-destructive: #ef4444;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-border: #e2e8f0;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}
```

## Authentication

### AuthProvider

```typescript
// auth/context/AuthProvider.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  const signIn = async (email: string, password: string) => {
    const { token, user } = await SystemRequests.signIn({ email, password });
    Session.setSessionToken(token);
    setState({ user, loading: false });
  };

  const signOut = () => {
    Session.logout();
    setState({ user: null, loading: false });
  };

  // Check session on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Route Guards

```typescript
// AuthGuard - redirects to sign-in if not authenticated
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to={CONFIG.auth.signInPath} />;

  return <>{children}</>;
}

// GuestGuard - redirects to home if already authenticated
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={CONFIG.auth.redirectPath} />;

  return <>{children}</>;
}
```

### useAuth Hook

```typescript
// auth/hooks/useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Component Organization

### Page Components

Pages handle routing and orchestration:

```typescript
// pages/dashboard/index.tsx
export default function Dashboard() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const { data: tickets, isLoading } = useTicketList();

  return (
    <AuthGuard>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <TicketList
            tickets={tickets}
            isLoading={isLoading}
            selectedId={selectedTicketId}
            onSelect={setSelectedTicketId}
          />
        </div>
        <div className="col-span-8">
          <TicketDetail ticketId={selectedTicketId} />
        </div>
      </div>
    </AuthGuard>
  );
}
```

### Feature Components

Feature components are presentational and receive props:

```typescript
// components/tickets/TicketList.tsx
interface TicketListProps {
  tickets: Ticket[] | undefined;
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TicketList({ tickets, isLoading, selectedId, onSelect }: TicketListProps) {
  if (isLoading) return <Skeleton />;

  return (
    <ul>
      {tickets?.map((ticket) => (
        <li
          key={ticket._id}
          className={cn('cursor-pointer', selectedId === ticket._id && 'bg-accent')}
          onClick={() => onSelect(ticket._id)}
        >
          {ticket.title}
        </li>
      ))}
    </ul>
  );
}
```

## Error Handling

### Error Message Extraction

```typescript
// utils/error-message.ts
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return fallback;
}

// Usage
catch (err) {
  const message = getErrorMessage(err, 'Something went wrong');
  enqueueSnackbar(message, { variant: 'error' });
}
```

## Type Definitions

### Domain Types

```typescript
// types/ticket.ts
export interface Ticket {
  _id: string;
  title: string;
  details?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TicketStatus {
  label: string;
  color: string;
}

export interface CreateTicketParams {
  title: string;
  details?: string;
}
```

## Dependencies Note

This application is designed to be standalone with no @copera/* dependencies. All functionality is self-contained using standard React ecosystem libraries.
