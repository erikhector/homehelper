# REQUIREMENTS.md

This file is the single source of truth for AI coding agents (and humans) about **what to implement** for HomeHelper. It covers both Frontend and Backend concerns. Update this file whenever product decisions change, and keep it in sync with what is actually implemented.

## Product Summary

HomeHelper helps parents track which clothes/items their children have left at kindergarden and what still needs to be brought. A child's profile can be shared between multiple parents/guardians so everyone stays in sync, and a parent can manage multiple children.

## Data Source Rule

- Never hard-code application data, including children, items, users, statuses shown for records, or sample lists in frontend or backend code. Read persistent data from the backend/database and create or update it through API operations. Test fixtures are the only exception and must be isolated to test code.

## Data Model

Entities (names are suggestions, adjust casing to backend conventions):

- **User** (parent/guardian account)
  - Id, Email (unique, verified), PasswordHash, DisplayName, CreatedAt, EmailVerifiedAt, LastLoginAt
  - A user is the account holder; not necessarily a biological parent (e.g. guardian, grandparent with access)
- **Child**
  - Id, FirstName, LastName, DateOfBirth (optional), KindergardenName/GroupName (optional)
  - No unnecessary sensitive fields — keep the profile minimal (GDPR data minimization)
- **ParentChildLink** (join table enabling sharing)
  - Id, UserId, ChildId, Role (e.g. `Owner`, `Guardian`), CreatedAt
  - A Child can have multiple linked Users; a User can have multiple linked Children
  - `Owner` can invite/remove other guardians; `Guardian` has read/write access to items but cannot remove the child or other guardians
- **Item** (a clothing item or belonging tracked for a child)
  - Id, ChildId, Name, Category (e.g. Outerwear, Footwear, Accessories, Other), Status (`AtKindergarden` | `NeedsToBring` | `AtHome`), Notes (optional), UpdatedAt, UpdatedByUserId
- **Invitation** (for sharing a child profile with another parent)
  - Id, ChildId, InvitedByUserId, InviteeEmail, Token, Status (`Pending` | `Accepted` | `Declined` | `Expired`), CreatedAt, ExpiresAt

Relationships:

- User 1—_ ParentChildLink _—1 Child (many-to-many between User and Child)
- Child 1—\* Item
- Child 1—\* Invitation

## UI Framework

- Use **Material UI (MUI)** as the component library going forward (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`).
- Prefer MUI components and `sx`/theme-based styling over hand-rolled CSS in `src/styles`; keep global CSS only for resets/base styles.
- Define a shared MUI theme (colors, typography) in one place (e.g. `src/styles/theme.ts`) and provide it via `ThemeProvider` near the app root.

## Frontend Data Fetching

- Use TanStack React Query (`@tanstack/react-query`) for every frontend read of backend data and every backend mutation.
- Provide one shared `QueryClient` at the application root. Define stable query keys, keep server records in the query cache, and invalidate or update the relevant queries after successful mutations.
- Do not use `useEffect` plus component state to fetch or cache server data. Component state is reserved for UI-only concerns such as form inputs, open dialogs, and transient selection.

## Authentication

- **Signup with email**: user registers with email + password; verify email via a signed/expiring token link before granting full access.
- **Login**: email + password, with rate limiting / lockout after repeated failures.
- **Password storage**: hashed with a strong algorithm (e.g. bcrypt/argon2), never stored or logged in plaintext.
- **Sessions/tokens**: use secure, `HttpOnly`, `SameSite` cookies or short-lived JWT + refresh token; tokens must be revocable (e.g. on logout, password change).
- **Password reset**: via emailed, single-use, expiring token — never reveal whether an email exists in the system (avoid user enumeration).
- Transport must be HTTPS only; no credentials in URLs or logs.

## Sharing Child Profiles Between Parents

- The child owner can invite another parent by email to share a child's profile.
- Invitations are sent via email with a single-use, expiring token; invitee must have (or create) a verified account to accept.
- Any linked guardian can view/update item statuses; only the owner can remove guardians or delete the child profile.
- A user can revoke their own access to a shared child at any time.

## Backend Architecture & Conventions

The backend (`Backend/`) follows a generic CRUD-over-EF-Core pattern via the Dekiru toolset (`Dekiru.Hermes`, `Dekiru.ApiGenerator`, `Dekiru.DtoGenerator`, `Dekiru.ApiUtils`). When implementing new entities (Child, ParentChildLink, Item, Invitation, etc.), follow the existing `Placeholder` example:

- **Data/** — Plain EF Core entity classes plus the shared `HomehelperContext` (`DbContext`). Add new entities as classes here and register any relationships via navigation properties; add `DbSet<T>` if needed. Keep entities free of DTO/API concerns.
- **DTO/** — Partial classes annotated with `[DtoFor<TEntity>]` (and e.g. `[OmitKeysByConvention]`) that get source-generated into full create/update DTOs. Add one partial class per entity/operation (e.g. `ChildCreate`, `ChildUpdate`); do not hand-write the generated members.
- **Handler/** — `Dekiru.Hermes` query/command handlers (`[Handler]` classes implementing `IQueryHandler`/`ICommandHandler`). Generic `GetHandler<T>`, `ListHandler<T>`, `CountHandler<T>`, `CreateHandler<TCreate,T>`, `UpdateHandler<TUpdate,T>` already cover standard CRUD for any entity — only add a bespoke handler when custom domain logic is needed (e.g. accepting an invitation, computing item status transitions).
- **Controllers/** — Thin `ControllerBase` classes that inject `IDispatcher` and dispatch requests/commands to handlers; controllers should not contain business logic.
- **Services/** — Cross-cutting services such as `ContextService` (filtering/sorting/pagination/includes over the `DbContext`). Add new services here only for infrastructure concerns, not per-entity logic.

## API Client Generation (client builder)

The frontend `src/api/` folder (`Dto.ts`, `HttpClient.ts`, `Placeholder.ts`, etc.) is **entirely generated** by an internal client builder tool from the backend's controllers/DTOs — generated files are marked `DO NOT EDIT, THIS CODE IS TOOL GENERATED`.

- **No AI agent may create, edit, or delete files inside `Frontend/src/api/`.** To add or change an API method, implement/adjust the corresponding Controller/DTO/Handler in `Backend/`, then let the client builder regenerate the frontend API client (a human/tooling step outside the agent's scope).
- If a frontend feature needs a new API call, prefer implementing the backend endpoint and note that the client builder still needs to run, rather than hand-writing a client call.
- Frontend code must call only the generated API methods and types from `Frontend/src/api/`. Do not create custom API helpers, wrappers, fetch clients, duplicate DTOs, or endpoint strings outside that generated folder. Use React Query to compose generated methods into queries and mutations.

## GDPR & Privacy Considerations

- **Data minimization**: only collect fields required for the feature (e.g. avoid storing a child's DOB unless actually needed).
- **Lawful basis & consent**: account creation implies consent to a clear privacy policy; explicitly surface what data is stored about children (processed on behalf of the parent, who is the data controller for their child's data).
- **Right to access & portability**: users should be able to export their and their children's data.
- **Right to erasure**: users can delete their account and associated children/items; when a child has multiple guardians, deleting one guardian's account must not delete the child unless they are the sole remaining guardian.
- **Data retention**: define and document retention periods for deleted accounts, expired invitations, and logs; purge stale/expired invitation tokens.
- **Security**: encrypt data in transit (HTTPS); avoid storing sensitive data unencrypted at rest where feasible; restrict logging of PII (no emails/names in plain logs).
- **Access control**: enforce authorization checks server-side so a user can only access children/items they are linked to — never trust client-side checks alone.
- **Children's data is sensitive**: treat all child-related data as requiring extra care; avoid third-party trackers/analytics on pages containing child data unless privacy-reviewed.

## Status

This document describes the target design. Check the codebase before assuming a feature is implemented — update this file if the plan changes.
