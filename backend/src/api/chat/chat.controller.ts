import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    UseInterceptors
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { BaseController } from '@/core/controller';
import { ResponseDTO } from '@/core/dto';
import { AuthenticatedRequest } from '@/core/request';
import { AuthRequired } from '@/decorators/auth.decorator';
import { toObjectId } from '@/utils/transformId.utils';

import { ChatService } from './chat.service';
import { ConversationResponseDto } from './dto/conversation.dto';

@Controller('chat')
export class ChatController extends BaseController {
    constructor(
        private readonly chatService: ChatService,
        @Inject(REQUEST)
        private readonly request: AuthenticatedRequest
    ) {
        super();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @AuthRequired()
    @Get("/conversations")
    @HttpCode(HttpStatus.OK)

    async getConversations(): Promise<ResponseDTO<ConversationResponseDto[]>> {
        try {
            const conversations = await this.chatService.getConversations(
                this.request.currentUser._id);
            return this.response({
                data: conversations.map(conversation =>
                    new ConversationResponseDto(conversation)),
                message: 'Get conversations successfully'
            })
        } catch (error) {
            this.errorResponse(error);
        }
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @AuthRequired()
    @Get("/conversations/:friend")
    @HttpCode(HttpStatus.OK)

    async findConversationsWithFriend(
        @Param('friend') friend: string
    ): Promise<ResponseDTO<ConversationResponseDto>> {
        try {
            const conversation = await this.chatService.findConversationWithFriend(
                this.request.currentUser._id, toObjectId(friend));
            return this.response({
                data: conversation ? new ConversationResponseDto(conversation) : null,
                message: 'Get conversations successfully'
            })
        } catch (error) {
            this.errorResponse(error);
        }
    }
}
