import { registerRepository, upsertCommitHistory } from './service';
import { GithubEvent, PingEvent, PushEvent } from './interfaces';
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
    const { headers } = event;
    const body = JSON.parse(event.body);
    const githubEvent = headers?.['X-GitHub-Event'] ?? 'Unknown';

    logger.info({ message: 'Request Event', body, headers });

    // TODO: HMAC Signature Check

    let fn: Promise<any>;

    switch (githubEvent) {
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
