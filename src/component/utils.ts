import { v4 } from 'uuid';

export const makeSecret = (): string => {
    const uuid = v4().split('-');
    return `${uuid[3]}${uuid[2]}${uuid[1]}${uuid[5]}${uuid[4]}`;
};
