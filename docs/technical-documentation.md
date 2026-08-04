# Student Project Resource Hub — System Architecture Document

**Stack:** React Native (Expo) · TanStack Query · NativeWind · Node.js (Express) · PostgreSQL · S3-compatible object storage
**Audience:** Engineering team, supervisor review, technical documentation archive

---

## 1. Architectural Style

The system follows a **decoupled client-server architecture** with a **layered (n-tier) backend** and a **client-driven cache architecture** on the mobile client. This is documented at three levels of abstraction, loosely following the **C4 model** (Context → Container → Component), which is the appropriate level of rigor for a system with distinct user roles, a moderation workflow, and asynchronous file handling.

- **Context** — how the system fits among its users and external systems.
- **Container** — the deployable units (mobile app, API, database, storage, moderation queue).
- **Component** — internal structure of the API server and mobile client.

---

## 2. Level 1 — System Context Diagram

```mermaid
graph TD
    Student[Student]
    Contributor[Graduating Student / Contributor]
    Faculty[Faculty / Admin]

    SPRH[Student Project Resource Hub]

    ObjectStore[(Object Storage<br/>S3-compatible)]
    EmailSvc[Transactional Email Service]
    IdP[Institutional Auth / SSO<br/>optional future integration]

    Student -->|searches, browses, downloads| SPRH
    Contributor -->|submits project + metadata| SPRH
    Faculty -->|reviews, approves, rejects| SPRH

    SPRH -->|stores/retrieves PDFs| ObjectStore
    SPRH -->|submission & moderation notifications| EmailSvc
    SPRH -.->|future: institutional login| IdP
```

**Notes:** The system is intentionally bounded — no live code execution environment, no plagiarism engine, no external LMS integration in v1. Auth is self-contained (JWT-based) with SSO left as a future extension point, not a dependency.

---

## 3. Level 2 — Container Diagram

```mermaid
graph LR
    subgraph Client["Mobile Client (React Native / Expo)"]
        RN["React Native App<br/>NativeWind (styling)<br/>TanStack Query (server state)<br/>Zustand/Context (UI state)"]
    end

    subgraph Backend["Backend (Node.js)"]
        API["Express API<br/>REST, versioned /api/v1"]
        Auth["Auth Service<br/>JWT issuing/refresh"]
        Ingest["Ingestion Service"]
        Search["Search/Query Service"]
        Mod["Moderation Service"]
    end

    DB[(PostgreSQL<br/>Users, Projects, Tags, Project_Tags)]
    S3[(Object Storage<br/>PDF reports)]
    Queue[["Background Job Queue<br/>(BullMQ/Redis) — thumbnailing,<br/>virus scan, email dispatch"]]

    RN -->|HTTPS / JSON| API
    API --> Auth
    API --> Ingest
    API --> Search
    API --> Mod

    Auth --> DB
    Ingest --> DB
    Ingest --> S3
    Ingest --> Queue
    Search --> DB
    Mod --> DB
    Mod --> Queue
```

**Container responsibilities:**

| Container            | Responsibility                                                            |
| -------------------- | ------------------------------------------------------------------------- |
| Mobile Client        | Presentation, client-side validation, optimistic UI, server-state caching |
| Express API          | Request routing, auth guards, input validation, orchestration             |
| Auth Service         | Credential verification, JWT issue/refresh, role claims                   |
| Ingestion Service    | Metadata validation, file upload orchestration, draft/pending state       |
| Search/Query Service | Full-text + faceted filtering, pagination                                 |
| Moderation Service   | Approve/reject transitions, audit logging                                 |
| PostgreSQL           | System of record                                                          |
| Object Storage       | Binary PDF storage, signed URL generation                                 |
| Job Queue            | Async, non-blocking side effects off the request path                     |

---

## 4. Level 3 — Backend Component Architecture

A layered architecture keeps HTTP concerns, business rules, and persistence independent — this matters for testability and for swapping PostgreSQL/S3 details without touching business logic.

```mermaid
graph TD
    subgraph "Express API Container"
        R[Routes<br/>/auth /projects /tags /moderation]
        MW[Middleware<br/>authGuard, roleGuard, validateBody, rateLimiter]
        C[Controllers<br/>thin, request/response shaping only]
        S[Services<br/>business logic: ProjectService, ModerationService, AuthService]
        Rep[Repositories<br/>Prisma/Knex data access layer]
        DTO[DTO / Validation Schemas<br/>Zod]
    end

    R --> MW --> C --> DTO --> S --> Rep
    Rep --> PG[(PostgreSQL)]
    S --> S3Client[S3 Client]
    S --> QClient[Queue Client]
```

**Suggested backend folder structure:**

```
server/
├── src/
│   ├── modules/
│   │   ├── auth/          (auth.routes.ts, auth.controller.ts, auth.service.ts)
│   │   ├── projects/      (Resource Explorer + Ingestion)
│   │   ├── tags/
│   │   └── moderation/
│   ├── middleware/         (authGuard, roleGuard, errorHandler)
│   ├── db/                 (prisma schema, migrations, repositories)
│   ├── jobs/                (queue workers: scan-upload, notify-faculty)
│   ├── lib/                 (s3Client, jwt, logger)
│   └── app.ts
├── prisma/schema.prisma
└── tests/
```

**Role enforcement pattern (RBAC at the middleware layer, not scattered in controllers):**

```ts
router.post(
  "/projects",
  authGuard,
  roleGuard(["CONTRIBUTOR", "ADMIN"]),
  validateBody(createProjectSchema),
  projectController.create,
);
```

---

## 5. Mobile Client Architecture (React Native + TanStack Query + NativeWind)

The client separates **server state** (owned by the API, cached via TanStack Query) from **UI/local state** (owned by the client). This distinction avoids the classic anti-pattern of mirroring server data into a global store manually.

```mermaid
graph TD
    subgraph "Presentation Layer"
        Screens["Screens<br/>(Explorer, ProjectDetail, Submit, ModerationQueue)"]
        UIComp["Reusable Components<br/>styled with NativeWind"]
    end

    subgraph "State Layer"
        TQ["TanStack Query<br/>useQuery / useMutation / useInfiniteQuery"]
        Cache["Query Cache<br/>(server state, cache-first)"]
        Local["Local UI State<br/>Zustand or Context (filters, form drafts)"]
    end

    subgraph "Data Access Layer"
        API_Client["API Client<br/>(axios/fetch wrapper, interceptors for JWT refresh)"]
        Hooks["Domain Hooks<br/>useProjects(), useProject(id), useSubmitProject()"]
    end

    Screens --> UIComp
    Screens --> Hooks
    Hooks --> TQ
    TQ --> Cache
    Hooks --> API_Client
    Screens --> Local
    API_Client -->|HTTPS| Backend[(Express API)]
```

**Suggested client folder structure:**

```
app/
├── app/                       (expo-router file-based routes)
│   ├── (auth)/
│   ├── (explorer)/
│   ├── (submit)/
│   └── (moderation)/
├── src/
│   ├── api/
│   │   ├── client.ts           (axios instance, auth interceptor)
│   │   └── endpoints/           (projects.ts, tags.ts, moderation.ts)
│   ├── hooks/                   (useProjects, useSubmitProject, useModerationQueue)
│   ├── components/               (NativeWind-styled, presentational only)
│   ├── stores/                    (Zustand: filters, session)
│   └── types/                      (shared DTO/domain types)
```

**Query-key convention (important for cache correctness):**

```ts
// Hierarchical keys enable targeted invalidation
["projects", { year, techStack, supervisor, department, page }][
  ("project", projectId)
][("moderation-queue", { status: "pending" })];

// After approval mutation:
queryClient.invalidateQueries({ queryKey: ["moderation-queue"] });
queryClient.invalidateQueries({ queryKey: ["projects"] });
```

---

## 6. Data Architecture — Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ PROJECTS : "submits"
    USERS ||--o{ PROJECTS : "supervises"
    PROJECTS ||--o{ PROJECT_TAGS : "has"
    TAGS ||--o{ PROJECT_TAGS : "applied to"
    USERS ||--o{ MODERATION_LOGS : "actions"
    PROJECTS ||--o{ MODERATION_LOGS : "target of"

    USERS {
        uuid id PK
        string full_name
        string email UK
        string password_hash
        enum role "STUDENT | CONTRIBUTOR | ADMIN"
        timestamp created_at
    }

    PROJECTS {
        uuid id PK
        string title
        text abstract
        uuid submitted_by FK
        uuid supervisor_id FK
        int academic_year
        string department
        string file_url
        string repo_url
        enum status "DRAFT | PENDING | APPROVED | REJECTED"
        timestamp submitted_at
        timestamp reviewed_at
    }

    TAGS {
        uuid id PK
        string name UK
        enum category "LANGUAGE | FRAMEWORK | DOMAIN"
    }

    PROJECT_TAGS {
        uuid project_id FK
        uuid tag_id FK
    }

    MODERATION_LOGS {
        uuid id PK
        uuid project_id FK
        uuid reviewer_id FK
        enum action "APPROVED | REJECTED"
        text comment
        timestamp created_at
    }
```

_(Note: a `MODERATION_LOGS` table is a worthwhile addition beyond the original scope doc — it gives you an auditable trail of who approved/rejected what, which markers/supervisors typically expect to see in a final defense.)_

---

## 7. Sequence Diagram — Submission Workflow (Ingestion)

```mermaid
sequenceDiagram
    actor Contributor
    participant App as Mobile App
    participant API as Express API
    participant S3 as Object Storage
    participant Q as Job Queue
    participant DB as PostgreSQL

    Contributor->>App: Fill metadata form + attach PDF
    App->>API: POST /projects (multipart) [JWT]
    API->>API: authGuard + roleGuard(CONTRIBUTOR)
    API->>API: validate metadata (Zod schema)
    API->>S3: Upload PDF (or request pre-signed URL)
    S3-->>API: file_url
    API->>DB: INSERT project (status=PENDING)
    API->>Q: enqueue(notify-faculty, scan-file)
    API-->>App: 201 Created {project}
    App-->>Contributor: "Submitted — pending review"
    Q->>Q: async virus scan / thumbnail generation
```

## 8. Sequence Diagram — Search & Retrieval

```mermaid
sequenceDiagram
    actor Student
    participant App as Mobile App
    participant TQ as TanStack Query Cache
    participant API as Express API
    participant DB as PostgreSQL

    Student->>App: Enters query + filters (year, stack, supervisor)
    App->>TQ: useQuery(["projects", filters])
    alt cache fresh
        TQ-->>App: return cached results (instant)
    else cache stale/miss
        TQ->>API: GET /projects?year=&tech=&supervisor=&q=
        API->>DB: full-text search + filter (status=APPROVED)
        DB-->>API: paginated results
        API-->>TQ: 200 OK {projects, pageInfo}
        TQ-->>App: render + cache
    end
    Student->>App: Opens project
    App->>API: GET /projects/:id
    API-->>App: project detail + signed preview URL
```

## 9. Sequence Diagram — Moderation Decision

```mermaid
sequenceDiagram
    actor Faculty
    participant App as Mobile App
    participant API as Express API
    participant DB as PostgreSQL
    participant Q as Job Queue

    Faculty->>App: Open Moderation Queue (status=PENDING)
    App->>API: GET /moderation/queue [JWT: ADMIN]
    API->>DB: SELECT projects WHERE status=PENDING
    API-->>App: list of pending projects
    Faculty->>App: Approve / Reject + optional comment
    App->>API: PATCH /moderation/:projectId {action, comment}
    API->>API: roleGuard(ADMIN)
    API->>DB: UPDATE project.status, INSERT moderation_log
    API->>Q: enqueue(notify-contributor)
    API-->>App: 200 OK
```

---

## 10. Security Architecture

| Concern                    | Mechanism                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Authentication             | JWT access token (short-lived, ~15 min) + refresh token (httpOnly-equivalent secure storage on device via `expo-secure-store`) |
| Authorization              | Role claims embedded in JWT; enforced server-side via `roleGuard` middleware — never trust client-side role checks alone       |
| Transport                  | HTTPS everywhere; no plaintext API calls                                                                                       |
| File validation            | MIME-type + magic-byte check on upload, file size cap, async malware scan before a file is marked previewable                  |
| Input validation           | Zod schemas at the API boundary; reject unknown fields                                                                         |
| Least privilege on storage | Pre-signed, time-limited S3 URLs — clients never get long-lived direct bucket access                                           |
| Rate limiting              | Applied to auth and submission endpoints to prevent abuse                                                                      |

---

## 11. Deployment Architecture

```mermaid
graph TD
    subgraph "Client Distribution"
        AppStore[App Store / Play Store]
        Expo[Expo Application Services - EAS Build]
    end

    subgraph "Cloud Environment"
        LB[Load Balancer / Reverse Proxy]
        API1[Node.js API instance]
        Redis[(Redis - queue + session cache)]
        Worker[Background Worker Process]
        PG[(PostgreSQL - managed instance)]
        S3B[(S3 Bucket - project-reports)]
    end

    Expo --> AppStore
    AppStore -.->|installed on| Device[Student Device]
    Device -->|HTTPS| LB --> API1
    API1 --> PG
    API1 --> Redis
    API1 --> S3B
    Redis --> Worker
    Worker --> PG
    Worker --> S3B
```

**Environment separation:** `dev` → `staging` → `production`, each with isolated DB and bucket namespace. Migrations run via Prisma Migrate in CI before deploy, not manually against production.

---

## 12. Non-Functional Architecture Notes

- **Scalability:** stateless API instances behind a load balancer; session/JWT design means horizontal scaling requires no sticky sessions.
- **Observability:** structured logging (pino/winston) + request correlation IDs; moderation actions are logged to `MODERATION_LOGS` for auditability, separate from application logs.
- **Offline tolerance (mobile):** TanStack Query's cache-first strategy allows browsing previously-fetched results with degraded connectivity; mutations (submission, moderation) require connectivity and surface clear pending/error states rather than silent optimistic writes, given the compliance-sensitive nature of moderation actions.
- **Testing strategy alignment:** layered backend architecture supports unit tests at the service layer (mocked repositories), integration tests against a test database, and contract tests on the API surface consumed by the mobile client.

---

_This document is intended to sit alongside Chapter Three (Methodology and System Design) as supporting technical architecture detail, and can be referenced directly in Section 3.5 (System Design) and Section 3.6 (Tools and Technologies) of the project report._
