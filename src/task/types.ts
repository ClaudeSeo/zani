export interface Notification {
    type: string | null;
    chatId?: string;
    token?: string;
}

export interface Repository {
    repoId: string;
    name: string;
    description?: string | null;
    createdAt: number;
    active: boolean;
    notification: Notification;
}

export interface Commit {
    repoId: string;
    createdAt: number;
    hash: string;
    message: string;
    commitTimestamp: string;
}

export interface TelegramPayload {
    chat_id: string;
    text: string;
    reply_to?: number;
    no_preview?: boolean;
    keyboard?: any;
}
