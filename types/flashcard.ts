import type { UUID } from "node:crypto";

export enum FlashcardType {
    SINGLE = 'SINGLE',
    MULTIPLE = 'MULTIPLE',
}

export interface Flashcard {
    id: UUID
    ownerId: UUID
    folderId: UUID
    tip?: string
    note?: string
    question: string;
    answers: Array
    type: FlashcardType
    createdAt: string
    updatedAt: string
}
