import { createHash } from 'crypto';

import { Notification, Repository } from './types';
import { sendTelegramMessage, getTarget } from './service';

type ServiceType = 'nudge' | 'warning' | 'detect';

interface Props {
    type: ServiceType;
}

interface TargetItem {
    message: string[];
    notification: Notification;
}

interface TargetGroup {
    [key: string]: TargetItem;
}

const MESSAGES = Object.freeze({
    nudge: '커밋 마감까지 1시간 30분 남았습니다.',
    warning: '커밋 마감 10분 전입니다.',
    detect: '1일 1커밋 미션을 수행하지 못했습니다.',
});

const sendMessages = async (target: TargetItem): Promise<void> => {
    switch (target.notification.type) {
        case 'telegram':
            await sendTelegramMessage({
                chatId: target.notification.chatId!,
                text: target.message.join('\n'),
                token: target.notification.token!,
            });
            break;
        default:
            console.warn('지원하지 않는 메신저 타입입니다.', target);
            return;
    }
};

const groupByMessages = (targets: Repository[], type: ServiceType) => targets.reduce<TargetGroup>((prev, curr) => {
    const hashKey = `${curr.notification.type}${curr.notification.token}${curr.notification.chatId}`;
    const hash = createHash('sha1').update(hashKey).digest('hex');

    if (!prev[hash]) {
        prev[hash] = {
            message: [ MESSAGES[type], '*** 미션을 성공하지 못한 저장소 목록 ***' ],
            notification: curr.notification,
        };
    }

    prev[hash].message.push(`- ${curr.name}`);
    return prev;
}, {});

export const exec = async (props: Props): Promise<void> => {
    const { type = 'nudge' } = props;

    const targets = await getTarget();
    if (targets.length === 0) {
        return;
    }

    const messages = groupByMessages(targets, type);
    await Promise.all(Object.values(messages).map(sendMessages));
};
