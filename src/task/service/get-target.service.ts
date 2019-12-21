import moment from 'moment';
import { DynamoSelectProvider, OP_SIGN } from 'd2p';

import { ddbClient } from '../../component/aws';
import { COMMIT_TABLE_NAME, REPOSITORY_TABLE_NAME } from '../../config/tables';
import { Commit, Repository } from '../types';

const LIMIT = 100;

const getRepositories = async (): Promise<Repository[]> => {
    let hasNext = false;
    const repositories: Repository[] = [];
    const provider = new DynamoSelectProvider(ddbClient)
        .setTableName(REPOSITORY_TABLE_NAME)
        .addFilterCondition(OP_SIGN.ATTR_NOT_EXISTS, 'notification.type')
        .addFilterCondition(OP_SIGN.NEQ, 'notification.type', null)
        .addFilterCondition(OP_SIGN.EQ, 'active', true)
        .setLimit(LIMIT);

    do {
        const result = await provider.scan<Repository>();
        if (!result.items) {
            break;
        }

        repositories.push(...result.items);

        if (result.lastEvaluatedKey) {
            provider.setExclusiveStartKey(result.lastEvaluatedKey);
            hasNext = true;
        } else {
            hasNext = false;
        }
    } while ( hasNext );

    return repositories;
};

const getCommit = async (repoId: string): Promise<Commit | null> => {
    const duration = moment()
        .subtract(1, 'days')
        .hours(2)
        .startOf('hours')
        .valueOf();
    const result = await new DynamoSelectProvider(ddbClient)
        .setTableName(COMMIT_TABLE_NAME)
        .setPrimaryCondition('repoId', repoId)
        .setSortKeyCondition(OP_SIGN.GT, 'createdAt', duration)
        .setLimit(1)
        .query<Commit>();

    if ((result.items?.length ?? 0) >= 0) {
        return result.items[0];
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
