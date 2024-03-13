import { UserResponseDto } from '@/api/user/dto/user.dto';
import { shallow } from '@/utils/shallow.utils';

import { ConversationDocument } from '../schemes/conversation.scheme';
import { MessageDocument } from '../schemes/message.scheme';
import { MessageResponseDto } from './message.dto';

export class ConversationResponseDto {
    id: string;
    users: UserResponseDto[];
    messages: MessageResponseDto[];

    createdAt: Date
    updatedAt: Date

    constructor(conversation: ConversationDocument) {

        const result = shallow({
            source: conversation,
            fields: ["createdAt", "updatedAt", "users"],
        })
        Object.assign(this, result);
        this.id = conversation._id.toString()
        this.users = conversation?.users.map(user =>
            new UserResponseDto(user)) || []
        this.messages = conversation?.messages.map(message =>
            new MessageResponseDto(message as MessageDocument)) || []
    }
}
