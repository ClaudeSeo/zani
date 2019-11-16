import { DynamoDB } from 'aws-sdk';
import config from '../../../config/environment';
import { ddbClient } from '../../../component/aws';
import { PushEvent } from '../interfaces';

const TABLE_NAME = `claude.${config.env}.commits`;

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

    await ddbClient.put(params).promise();
};
