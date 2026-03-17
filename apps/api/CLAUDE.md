# Base Application API

This is a standalone Fastify-based REST API that serves as a reference implementation for applications using the Copera SDK. This application will be extracted from the monorepo and published as open-source.

## Technology Stack

- **Framework**: Fastify 4 with fastify-decorators
- **Database**: MongoDB with Typegoose (decorator-based Mongoose)
- **Authentication**: JWT (jsonwebtoken) with AES-CBC encryption (node-forge)
- **Copera Integration**: @copera.ai/sdk for board/table operations
- **Logging**: Pino with pino-pretty
- **Monitoring**: Sentry for error tracking
- **Validation**: Yup and Zod schemas

## Project Structure

```
src/
├── service/              # Controllers and services by domain
│   ├── system/           # Authentication (sign-in)
│   ├── user/             # User info retrieval
│   └── ticket/           # Ticket CRUD operations
├── models/               # Typegoose data models
│   └── Ticket/           # Ticket model definition
├── infra/                # Infrastructure setup
│   ├── server.ts         # Fastify server initialization
│   └── copera.ts         # Copera SDK initialization
├── utils/                # Utilities and helpers
│   ├── hooks/            # Fastify lifecycle hooks
│   │   ├── ErrorHandle/  # Error handling hook
│   │   └── Token/        # JWT token validation hook
│   ├── types/            # TypeScript type definitions
│   ├── decorators/       # Custom decorators (@isPublic)
│   ├── TokenUtils.ts     # Token creation/validation
│   ├── TokenCrypt.ts     # Encryption utilities
│   └── Env.ts            # Environment variables
├── config.ts             # Copera board configuration
├── sentry.ts             # Sentry initialization
├── router.ts             # Router setup
└── main.ts               # Application entry point
```

## Development Commands

```bash
pnpm dev              # Run with development environment
pnpm dev:local        # Run with local environment
pnpm build            # Build for production
pnpm start            # Start production server
pnpm test             # Run tests with Vitest
```

## Environment Variables

```env
MONGODB_URI=<mongodb connection string>
APP_TOKEN=<JWT signing secret key>
COPERA_API_KEY=<Copera API key for SDK>
SENTRY_DSN=<Sentry DSN (optional)>
```

## Architecture Patterns

### Controller Pattern

Controllers use fastify-decorators with class-based routing:

```typescript
import { Controller, GET, POST } from 'fastify-decorators';
import { isPublic } from '~/utils/decorators/isPublic.js';

@Controller('/tickets')
export default class TicketController {
  @GET('/')
  async listTickets(req: Req) {
    const tickets = await TicketService.listTickets({ userId: req.user.userId });
    return tickets;
  }

  @POST('/')
  async createTicket(req: Req) {
    const { title, details } = req.body;
    return TicketService.createTicket({ userId: req.user.userId, title, details });
  }
}
```

### Service Pattern

Services handle business logic and are exported as namespaces:

```typescript
// ticket.service.ts
export async function createTicket(params: CreateTicketParams) {
  // Create in Copera board
  const row = await coperaBoard.tables.tickets.createRow({ ... });

  // Cache in local MongoDB
  const ticket = await TicketModel.create({
    coperaRowId: row._id,
    title: params.title,
    userId: params.userId,
  });

  return ticket;
}

export async function listTickets(params: { userId: string }) {
  return TicketModel.find({ userId: params.userId });
}

// Export as namespace
export * as TicketService from './ticket.service.js';
```

### Public Routes Decorator

Use `@isPublic()` to mark routes that don't require authentication:

```typescript
@Controller('/system')
export default class SystemController {
  @isPublic()
  @POST('/sign-in')
  async signIn(req: Req) {
    // Public route - no token required
  }
}
```

## Authentication

### Token Structure

- JWT tokens with 90-day expiration
- Payload encrypted with AES-CBC before JWT encoding
- Token extracted from `Authorization: Bearer <token>` header

### Token Validation Hook

The `preHandler` hook validates tokens on all non-public routes:

```typescript
// Token is validated and user info is attached to request
req.user = {
  userId: string;
  environment: string;
};
```

## Error Handling

### HTTP Error Classes

Use standard HTTP error classes for consistent error responses:

```typescript
import { HTTP400Error, HTTP401Error, HTTP403Error, HTTP404Error } from '@copera/api-utils';

// Validation error
throw new HTTP400Error('Invalid input', { code: HttpErrorCode.BAD_REQUEST });

// Authentication error
throw new HTTP401Error('Invalid credentials');

// Authorization error
throw new HTTP403Error('Access denied');

// Not found
throw new HTTP404Error('Resource not found');
```

### Validation Error Handling

Yup and Zod validation errors are automatically converted to HTTP400Error:

```typescript
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

// Validation errors become HTTP 400 responses automatically
await schema.validate(req.body);
```

## Copera SDK Integration

### Initialization

```typescript
// infra/copera.ts
import { CoperaBoard } from '@copera.ai/sdk';

export const coperaBoard = new CoperaBoard({
  apiKey: process.env.COPERA_API_KEY,
  boardId: BOARD_CONFIG.boardId,
});
```

### Board Configuration

```typescript
// config.ts
export const BOARD_CONFIG = {
  boardId: 'your-board-id',
  tables: {
    users: 'users-table-id',
    tickets: 'tickets-table-id',
  },
};
```

### Data Operations

```typescript
// Create row in Copera table
const row = await coperaBoard.tables.tickets.createRow({
  title: 'New Ticket',
  status: 'open',
});

// List rows
const rows = await coperaBoard.tables.tickets.listRows({
  filters: { userId: '123' },
});

// Update row
await coperaBoard.tables.tickets.updateRow(rowId, {
  status: 'closed',
});
```

## Data Model Pattern

### Typegoose Model Definition

```typescript
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Ticket {
  @prop({ required: true })
  coperaRowId!: string;

  @prop({ required: true })
  title!: string;

  @prop()
  details?: string;

  @prop({ required: true })
  userId!: string;
}

export const TicketModel = getModelForClass(Ticket);
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/system/sign-in | Public | User authentication |
| GET | /api/user/info | Required | Get current user info |
| POST | /api/tickets | Required | Create new ticket |
| GET | /api/tickets | Required | List user's tickets |
| GET | /api/tickets/:ticketId | Required | Get ticket details |
| GET | /health | Public | Health check |

## Request/Response Types

Define request and response types for type safety:

```typescript
// types/ticket.types.ts
export interface CreateTicketRequest {
  title: string;
  details?: string;
}

export interface TicketResponse {
  _id: string;
  title: string;
  details?: string;
  status: {
    label: string;
    color: string;
  };
  createdAt: string;
}
```

## Testing

Use Vitest for testing with the following patterns:

```typescript
import { describe, test, expect } from 'vitest';

describe('TicketService', () => {
  test('should create a ticket', async () => {
    const result = await TicketService.createTicket({
      userId: 'test-user',
      title: 'Test Ticket',
    });

    expect(result).toMatchObject({
      title: 'Test Ticket',
      userId: 'test-user',
    });
  });
});
```

## Dependencies Note

This application is designed to be standalone. The only @copera/* dependencies used are:
- `@copera/api-utils` - HTTP error classes only
- `@copera/core` - MongoDB connection utilities only

All other functionality should be self-contained or use the `@copera.ai/sdk` package.
