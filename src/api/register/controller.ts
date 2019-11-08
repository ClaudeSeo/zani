import { upsertCommitHistory } from './service';

import { PushEvent } from './types';

interface HTTPResponse {
    statusCode: number,
    body: string
}

const buildResponse = (resp: any, statusCode: number = 200): HTTPResponse => {
    const body = JSON.stringify(resp);
    return {
        body,
        statusCode,
    };
};

export const exec = async (event: any, context: any): Promise<any> => {
    const body: PushEvent = JSON.parse(event.body);

    return upsertCommitHistory(body)
        .then(() => buildResponse({ ok: true }))
        .catch((err) => {
            console.error(err);
            return buildResponse({ ok: false }, 400);
        });
};
