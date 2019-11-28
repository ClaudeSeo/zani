import moment from 'moment';
import { DynamoDB } from 'aws-sdk';

import { ddbClient } from '../../component/aws';
import { COMMIT_TABLE_NAME, REPOSITORY_TABLE_NAME } from '../../config/tables';
import { Commit, Repository } from '../types';

const LIMIT = 100;

const getRepositories = async (): Promise<Repository[]> => {
    const repositories: Repository[] = [];
    const payload: DynamoDB.DocumentClient.ScanInput = {
        TableName: REPOSITORY_TABLE_NAME,
        FilterExpression: 'attribute_not_exists(#notiType) and #notiType <> :null and #act = :act',
        ExpressionAttributeNames: {
            '#notiType': 'notification.type',
            '#act': 'active',
        },
        ExpressionAttributeValues: {
            ':null': null,
            ':act': true,
        },
        Limit: LIMIT,
    };
    let hasNext = false;

    do {
        const result = await ddbClient.scan(payload).promise();
        if (!result.Items) {
            break;
        }

        if (result.LastEvaluatedKey) {
            payload['ExclusiveStartKey'] = result.LastEvaluatedKey;
        }

        const items = result.Items.map<Repository>(it => ({
            repoId: it.repoId,
            name: it.name,
            description: it.description,
            createdAt: it.createdAt,
            active: it.active,
            notification: {
                type: it.notification.type,
                ...it.notification,
            },
        }));
        repositories.push(...items);
        hasNext = result.ScannedCount === LIMIT;
    } while ( hasNext );

    return repositories;
};

const getCommit = async (repoId: string): Promise<Commit | null> => {
    const duration = moment().subtract(24, 'hours').valueOf();
    const payload: DynamoDB.DocumentClient.QueryInput = {
        TableName: COMMIT_TABLE_NAME,
        KeyConditionExpression: '#repoId = :repoId and #t >= :t',
        ExpressionAttributeNames: {
            '#repoId': 'repoId',
            '#t': 'createdAt',
        },
        ExpressionAttributeValues: {
            ':repoId': repoId,
            ':t': duration,
        },
        Limit: 1,
    };

    const result = await ddbClient.query(payload).promise();
    if ((result.Items?.length ?? 0) >= 0) {
        return result.Items![0] as Commit;
    }

    return null;
};

export const exec = async (): Promise<Repository[]> => {
    const repositories = await getRepositories();
    return repositories.reduce<Promise<Repository[]>>((prev, curr) => prev.then(async acc => {
        const commit = await getCommit(curr.repoId);
        if (!commit) {
            acc.push(curr);
        }
        return acc;
    }), Promise.resolve([]));
};
