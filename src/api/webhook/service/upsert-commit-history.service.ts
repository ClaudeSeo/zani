import { DynamoDB } from 'aws-sdk';
import config from '../../../config/environment';
import { ddbClient } from '../../../component/aws';
import { LoggerManager } from '../../../component/logger';
import { PushEvent } from '../interfaces';

const TABLE_NAME = `claude.${config.env}.commit`;
const logger = LoggerManager.getLogger('upsert-commit-history.service');

export const exec = async (props: PushEvent): Promise<void> => {
    const { head_commit: headCommit, repository } = props;

    if (!headCommit?.id) {
        throw new Error('Latest Commit invalid');
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: {
            repoId: repository.node_id,
            createdAt: new Date().getTime(),
            hash: headCommit.id,
            message: headCommit.message,
            commitTimestamp: headCommit.timestamp,
        },
    };

    const result = await ddbClient.put(params).promise();
    logger.info('커밋 히스토리 작성 결과', { result });
};
