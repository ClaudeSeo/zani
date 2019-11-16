import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import config from '../../config/environment';
import { Commit, Repository } from '../types';

const REPOSITORY_TABLE_NAME = `claude.${config.env}.repository`;
const COMMIT_TABLE_NAME = `claude.${config.env}.commits`;
const LIMIT = 100;

const docClient = new DynamoDB.DocumentClient({
    region: config.awsRegion,
});

const getRepositories = async (): Promise<Repository[]> => {
    const repositories: Repository[] = [];
    const payload: DynamoDB.DocumentClient.ScanInput = {
        TableName: REPOSITORY_TABLE_NAME,
        FilterExpression: 'attribute_not_exists(#notiType) and #notiType <> :null',
        ExpressionAttributeNames: {
            '#notiType': 'notification.type',
        },
        ExpressionAttributeValues: {
            ':null': null,
        },
        Limit: LIMIT,
    };
    let hasNext = false;

    do {
        const result = await docClient.scan(payload).promise();
        if (!result.Items) {
            break;
        }

        if (result.LastEvaluatedKey) {
            payload['ExclusiveStartKey'] = result.LastEvaluatedKey;
        }

        const items = result.Items.map<Repository>(it => ({
            repoId: it.repoId,
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

    const result = await docClient.query(payload).promise();
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
