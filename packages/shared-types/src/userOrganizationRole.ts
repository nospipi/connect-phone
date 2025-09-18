//packages/shared-types/src/userOrganizationRole.ts

export enum UserOrganizationRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
}

// Interfaces: compile away → Node ignores them → no runtime error
// Enums: exist at runtime → Node must load them → fails if you point to .ts
