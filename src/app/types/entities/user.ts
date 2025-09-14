
export type UserRole = "owner" | "collaborator" | "viewer"

export interface User {
  userName?: string,
  email: string;
  role: UserRole,
  avatarUrl?: string
}
