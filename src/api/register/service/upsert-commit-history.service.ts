import { DynamoDB } from 'aws-sdk';

import config from '../../../config/environment';

import { PushEvent } from '../types';

const TABLE_NAME = `claude.${config.env}.go-to-outback`;
const docClient = new DynamoDB.DocumentClient({
    region: config.awsRegion,
});

export const exec = async (props: PushEvent) => {
    const { head_commit: headCommit, repository } = props;

    if (!headCommit?.id) {
        throw new Error('Latest Commit invalid');
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: {
            repoId: repository.node_id,
            hash: headCommit.id,
            message: headCommit.message,
            commitTimestamp: headCommit.timestamp,
            createdAt: new Date().getTime(),
        },
    };

    return docClient.put(params).promise();
};
