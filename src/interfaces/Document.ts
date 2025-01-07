export interface IFile {
    id: number;
    filename: string;
    path: string;
    mimetype: string;
    size: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IDocument {
    id: number;
    title: string;
    content: string;
    files?: IFile[];
    createdAt: string;
} 