import ENV from './environment.constant';

export default Object.freeze({
    env: process.env.NODE_ENV ?? ENV.DEVELOPMENT,
    tz: process.env.TZ ?? 'Asia/Seoul',
    awsRegion: process.env.AWS_REGION ?? 'ap-northeast-2',
});
