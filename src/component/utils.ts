import { v4 } from 'uuid';

export const makeSecret = (): string => {
    const uuid = v4().split('-');
    return `${uuid[2]}${uuid[1]}${uuid[0]}${uuid[4]}${uuid[3]}`;
};
