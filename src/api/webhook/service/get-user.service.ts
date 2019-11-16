import { DynamoDB } from 'aws-sdk';
import config from '../../../config/environment';
import { ddbClient } from '../../../component/aws';
import { LoggerManager } from '../../../component/logger';
import { User } from '../interfaces';

const TABLE_NAME = `claude.${config.env}.user`;
const logger = LoggerManager.getLogger('get-user.service');

export const exec = async (uid: string): Promise<User | null> => {
    const payload: DynamoDB.DocumentClient.QueryInput = {
        TableName: TABLE_NAME,
        KeyConditionExpression: '#uid = :uid',
        ExpressionAttributeNames: {
            '#uid': 'uid',
        },
        ExpressionAttributeValues: {
            ':uid': uid,
        },
        Limit: 1,
    };

    return ddbClient.query(payload).promise()
        .then(result => {
            const user = result?.Items?.[0];
            if (user) {
                return user as User;
            }
            return null;
        })
        .catch(err => {
            logger.error('유저 데이터 조회 실패', { err, stack: err.stack });
            return null;
        });
};
