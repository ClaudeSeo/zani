export interface Repository {
    repoId: string;
    notification: {
        type: string | null;
        chatId?: string;
        token?: string;
    }
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
