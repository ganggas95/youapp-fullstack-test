import { AxiosResponse } from 'axios';

import { BaseResponseIface } from '@/interfaces/response';
import { ConversationResponseIface } from '@/interfaces/response/chat.iface';

import BaseService from './base';

class ChatService extends BaseService {

    public async getConversations(): Promise<AxiosResponse<BaseResponseIface<ConversationResponseIface[]>>> {
        return this.get("/chat/conversations");
    }

    public async getConversationWithFriend(friend: string): Promise<AxiosResponse<BaseResponseIface<ConversationResponseIface>>> {
        return this.get(`/chat/conversations/${friend}`);
    }
}

const chatService = new ChatService();
export default chatService;