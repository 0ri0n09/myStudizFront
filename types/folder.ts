export interface Folder {
    id: string
    ownerId: string;
    folderParentId: string;
    name: string
    description: string
    color: string
    examDate: string
    isPublic: boolean
    tags: string[]
    createdAt: string
    updatedAt: string
}
