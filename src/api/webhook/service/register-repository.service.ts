import { DynamoDB } from 'aws-sdk';
import moment from 'moment';
import config from '../../../config/environment';
import { ddbClient } from '../../../component/aws';
import { LoggerManager } from '../../../component/logger';
import { PingEvent } from '../interfaces';

const TABLE_NAME = `claude.${config.env}.repository`;
const logger = LoggerManager.getLogger('register-repository.service');

export const exec = async (data: PingEvent): Promise<void> => {
    const { repository } = data;
    const now = moment();

    const payload: DynamoDB.DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: {
            repoId: repository.node_id,
            name: repository.name,
            description: repository.description,
            createdAt: now.valueOf(),
            active: false,
        },
    };

    const result = await ddbClient.put(payload).promise();
    logger.info('리포지터리 추가 결과', { result });
};
