import { DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import config from '../config/environment';

const serviceConfigOptions: ServiceConfigurationOptions = {
    region: config.awsRegion,
};

if (config.awsEndpoint) {
    serviceConfigOptions.endpoint = config.awsEndpoint;
}


export const ddbClient = new DynamoDB.DocumentClient(serviceConfigOptions);
