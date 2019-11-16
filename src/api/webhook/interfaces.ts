interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
        id: number;
        name: string;
        email: string;
        login: string;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
    };
    description: string;
    created_at: number;
    updated_at: string;
    pushed_at: number;
}

interface Commit {
    id: string;
    tree_id: string;
    distinct: boolean;
    message: string;
    timestamp: string;
    url: string;
    author: {
        name: string;
        email: string;
        username: string;
    };
    commiter: {
        name: string;
        email: string;
        username: string;
    };
    added: string[];
    removed: string[];
    modified: string[];
}

export interface PushEvent {
    ref: string;
    head: string;
    before: string;
    size: number;
    distinct_size: number;
    commits?: Commit[];
    head_commit: Commit;
    repository: Repository;
}

export interface PingEvent {
    zen: string;
    hook_id: string;
    hook: {
        type: string;
        id: number;
        name: string;
        active: boolean;
        created_at: string;
        updated_at: string;
    }
    repository: Repository;
}

export interface User {
    uid: string;
    createdAt: number;
    secrets: string;
}

export type GithubEvent = 'push' | 'ping';
