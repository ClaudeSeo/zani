import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import { REPOSITORY_TABLE_NAME } from '../../../config/tables';
import { ddbClient } from '../../../component/aws';
import { LoggerManager } from '../../../component/logger';
import { PingEvent } from '../interfaces';

const logger = LoggerManager.getLogger('register-repository.service');

export const exec = async (data: PingEvent): Promise<void> => {
    const { repository } = data;
    const now = moment();

    const payload: DynamoDB.DocumentClient.PutItemInput = {
        TableName: REPOSITORY_TABLE_NAME,
        Item: {
            repoId: repository.node_id,
            name: repository.name,
            description: repository.description,
            createdAt: now.valueOf(),
            active: false,
            notification: {
                type: null,
                chatId: null,
                token: null,
            },
        },
    };

    const result = await ddbClient.put(payload).promise();
    logger.info('리포지터리 추가 결과', { result });
};
