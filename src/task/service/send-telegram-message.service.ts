import axios from 'axios';

import { TelegramPayload } from '../types';

interface Props {
    chatId: string;
    text: string;
    token: string;
    replyTo?: number;
    noPreview?: boolean;
    keyboard?: any;
}

export const exec = async (props: Props): Promise<any> => {
    const url = `https://api.telegram.org/bot${props.token}/sendMessage`;

    const payload: TelegramPayload = {
        chat_id: props.chatId,
        text: props.text,
        reply_to: props.replyTo,
        no_preview: props.noPreview,
        keyboard: props.keyboard,
    };

    return axios.post(url, payload);
};
