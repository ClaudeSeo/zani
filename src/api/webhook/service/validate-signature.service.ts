import { createHmac } from 'crypto';

export const exec = (secret: string, text: string, signature: string): boolean => {
    const [ algorithm, sig ] = signature.split('=');
    const hash = createHmac(algorithm, secret).update(text).digest('hex');
    return hash === sig;
};
