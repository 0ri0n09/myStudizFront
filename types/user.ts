import type { UUID } from "node:crypto";

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST',
}

export interface User {
    id: UUID
    username: string
    email: string
    country: string
    isEmailVerified: boolean
    role: UserRole
    gender: string
    avatar: string
}