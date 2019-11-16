import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Construct, RemovalPolicy } from '@aws-cdk/core';
import { NODE_ENV } from './constants';

export class DynamodbTable extends Construct {
    private readonly commitTable: Table;
    private readonly userTable: Table;
    private readonly repositoryTable: Table;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.commitTable = new Table(this, 'CommitTable', {
            partitionKey: {
                name: 'repoId',
                type: AttributeType.STRING,
            },
            sortKey: {
                name: 'createdAt',
                type: AttributeType.NUMBER,
            },
            tableName: `claude.${NODE_ENV}.commit`,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        this.userTable = new Table(this, 'UserTable', {
            partitionKey: {
                name: 'uid',
                type: AttributeType.STRING,
            },
            tableName: `claude.${NODE_ENV}.user`,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        this.repositoryTable = new Table(this, 'RepositoryTable', {
            partitionKey: {
                name: 'repoId',
                type: AttributeType.STRING,
            },
            tableName: `claude.${NODE_ENV}.repository`,
            removalPolicy: RemovalPolicy.DESTROY,
        });
    }

    commitTableArn() {
        return this.commitTable.tableArn;
    }

    userTableArn() {
        return this.userTable.tableArn;
    }

    repositoryTableArn() {
        return this.repositoryTable.tableArn;
    }
}
