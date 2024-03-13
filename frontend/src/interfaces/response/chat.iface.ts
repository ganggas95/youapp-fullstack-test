import { UserResponseIface } from './user.iface';

export interface MessageResponseIface {
    id: string;
    message: string
    user: UserResponseIface;
    createdAt: Date
    updatedAt: Date
}
export interface ConversationResponseIface {
    id: string;
    users: UserResponseIface[];
    messages: MessageResponseIface[];
    createdAt: Date
    updatedAt: Date
}

export interface MessageSocketIface {
    id: string;
    message: string
    user: string;
    createdAt: Date
    updatedAt: Date
}

export interface ConversationSocketIface {
    id: string;
    users: UserResponseIface[];
    messages: MessageSocketIface[];
    createdAt: Date
    updatedAt: Date
}

