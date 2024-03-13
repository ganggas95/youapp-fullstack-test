import { shallow } from '@/utils/shallow.utils';

import { MessageDocument } from '../schemes/message.scheme';

export class MessageDto {
    friendId: string;
    message: string;
}

export class MessageResponseDto {
    id: string;
    message: string
    user: string;
    createdAt: Date
    updatedAt: Date
    constructor(message: MessageDocument) {
        const result = shallow({
            source: message,
            fields: ["message", "createdAt", "user", "updatedAt"],
        })
        this.id = message._id.toString()
        Object.assign(this, result);
        // this.user = new UserResponseDto(message.user)
    }
}