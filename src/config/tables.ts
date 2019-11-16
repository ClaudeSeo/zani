import config from './environment';

export const USER_TABLE_NAME = `claude.${config.env}.user`;
export const REPOSITORY_TABLE_NAME = `claude.${config.env}.repository`;
export const COMMIT_TABLE_NAME = `claude.${config.env}.commit`;
