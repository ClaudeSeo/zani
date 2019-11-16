#!/usr/bin/env node
import { App, CfnOutput, Stack, StackProps } from '@aws-cdk/core';
import { DynamodbTable } from '../lib/dynamodb-table';
import { NODE_ENV } from '../lib/constants';

class ZaniStack extends Stack {
    constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const ddb = new DynamodbTable(this, 'ddb');

        new CfnOutput(this, 'CommitTableArn', { value: ddb.commitTableArn() });
        new CfnOutput(this, 'UserTableArn', { value: ddb.userTableArn() });
        new CfnOutput(this, 'RepositoryTableArn', { value: ddb.repositoryTableArn() });
    }
}

const app = new App();

new ZaniStack(app, `zani-${NODE_ENV}-stack`, {
    env: {
        region: 'ap-northeast-2',
    },
});
