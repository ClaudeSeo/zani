import { getUser, registerRepository, upsertCommitHistory, validateSignature } from './service';
import { GithubEvent, PingEvent, PushEvent, User } from './interfaces';
import { LoggerManager } from '../../component/logger';

const logger = LoggerManager.getLogger('webhook');

interface HTTPResponse {
    statusCode: number,
    body: string
}

interface Header {
    'User-Agent': string;
    'X-GitHub-Delivery': string;
    'X-GitHub-Event'?: GithubEvent;
    'X-Hub-Signature'?: string;
}

interface Event {
    body: string;
    headers: Header;
    httpMethod: string;
    path: string;
    pathParameters: null | {
        [key: string]: any;
    };
    queryStringParameters: null | {
        [key: string]: any;
    };
    resource: string;
    isOffline: boolean;
}

const buildResponse = (resp: any, statusCode: number = 200): HTTPResponse => {
    const body = JSON.stringify(resp);
    return {
        body,
        statusCode,
    };
};

export const exec = async (event: Event, context: any): Promise<any> => {
    const { headers, pathParameters } = event;
    const body = JSON.parse(event.body);
    const eventType = headers?.['X-GitHub-Event'];
    const signature = headers?.['X-Hub-Signature'];
    const uid = pathParameters?.uid;

    logger.info({ message: 'Request Event', body, headers, uid });

    if (!uid || !signature) {
        return buildResponse({ ok: false }, 401);
    }

    const user: User | null = await getUser(uid);
    if (!user) {
        return buildResponse({ ok: false }, 404);
    }

    const isValid = validateSignature(user.secrets, event.body, signature);
    if (!isValid) {
        return buildResponse({ ok: false }, 401);
    }

    let fn: Promise<any>;
    switch (eventType) {
        case 'ping':
            fn = registerRepository(body as PingEvent);
            break;
        case 'push':
            fn = upsertCommitHistory(body as PushEvent);
            break;
        default:
            return buildResponse({ ok: false }, 400);
    }

    return fn.then(() => buildResponse({ ok: true }))
        .catch(err => {
            logger.error(err.message, { err });
            return buildResponse({ ok: false }, 400);
        });
};
