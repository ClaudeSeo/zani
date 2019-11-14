import { Repository } from './types';
import { sendTelegramMessage, getTarget } from './service';

type ServiceType = 'nudge'|'warning'|'detect';

interface Props {
    type: ServiceType;
}

const MESSAGES = Object.freeze({
    nudge: '벌써 시간이 22시 30분입니다. 커밋 시간까지 얼마 안남았는걸요?',
    warning: '23시 50분입니다. 10분 내로 커밋을 못한다면 아웃백을 사셔야해요.',
    detect: '축하합니다. 아웃백을 사셔야겠어요 ^^',
});

const sendMessages = (type: ServiceType) => async (target: Repository): Promise<void> => {
    const message = MESSAGES[type];

    switch (target.notification.type) {
        case 'telegram':
            await sendTelegramMessage({
                chatId: target.notification.chatId!,
                text: message,
                token: target.notification.token!,
            });
            break;
        default:
            console.warn('지원하지 않는 메신저 타입입니다.', target);
            return;
    }
};

export const exec = async (props: Props): Promise<void> => {
    const { type = 'nudge' } = props;

    const targets = await getTarget();
    if (targets.length === 0) {
        return;
    }

    await Promise.all(targets.map(sendMessages(type)));
};
