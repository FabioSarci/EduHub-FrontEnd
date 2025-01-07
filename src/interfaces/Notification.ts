export interface INotification {
    id: number;
    object: string;
    body: string;
    userId: string;
    createdAt: string; // Aggiungo questo per l'ordinamento temporale
} 