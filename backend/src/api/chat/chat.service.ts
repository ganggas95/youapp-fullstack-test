import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ObjectId } from '@/interfaces/mongo.iface';
import { toObjectId } from '@/utils/transformId.utils';

import { UserDocument } from '../user/schemes/user.scheme';
import { UserService } from '../user/user.service';
import { MessageDto } from './dto/message.dto';
import {
    Conversation,
    ConversationDocument
} from './schemes/conversation.scheme';
import { Message, MessageDocument } from './schemes/message.scheme';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Conversation.name)
        private readonly conversationModel: Model<Conversation>,
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>,
        private readonly userService: UserService
    ) { }

    /**
     * Retrieves the conversations of a user.
     *
     * @param {ObjectId} userId - The ID of the user.
     * @return {Promise<ConversationDocument[]>} An array of ConversationDocument objects.
     */
    async getConversations(userId: ObjectId): Promise<ConversationDocument[]> {
        // Query the database for conversations where the user is included in the users array
        return await this.conversationModel.where({
            users: {
                $in: [userId]
            }
        })
            // Populate the users array with UserDocument objects
            .populate("users")
            // Populate the messages array with MessageDocument objects,
            // selecting only the 'message', 'user', and 'createdAt' fields
            .populate("messages", "message user createdAt")
            // Execute the query and return the result
            .exec();
    }
    
    /**
     * Finds a conversation between two users.
     *
     * @param {ObjectId} userId - The ID of the first user.
     * @param {ObjectId} friendId - The ID of the second user.
     * @return {Promise<ConversationDocument>} The conversation document,
     * or null if no conversation is found.
     */
    async findConversationWithFriend(
        userId: ObjectId,
        friendId: ObjectId
    ): Promise<ConversationDocument> {
        // Find a conversation where both userId and friendId are present.
        // The findOne method returns a Promise that resolves to a
        // ConversationDocument or null if no document is found.
        return this.conversationModel.findOne({
            users: {
                $in: [userId, friendId]
            }
        }).exec()
    }

    /**
     * Finds or creates a conversation between two users.
     *
     * @param {UserDocument} user - The first user.
     * @param {UserDocument} friend - The second user.
     * @return {Promise<ConversationDocument>} The conversation document.
     */
    async findOrCreateConversation(
        user: UserDocument,
        friend: UserDocument
    ): Promise<ConversationDocument> {
        // Try to find an existing conversation between the two users
        const conversation = await this.findConversationWithFriend(user._id, friend.id);

        // If a conversation is found, return it
        if (conversation) return conversation;

        // If no conversation is found, create a new one
        const newConversation = new this.conversationModel();

        // Add the two users to the conversation
        newConversation.users = [user, friend];

        // Initialize the conversation's message array
        newConversation.messages = [];

        // Set the conversation's creation date to the current date
        newConversation.createdAt = new Date();

        // Save the new conversation and return it
        return await newConversation.save();
    }

    /**
     * Creates a new message in a conversation and updates the conversation.
     * 
     * @param userId The ID of the user creating the message.
     * @param messageDto The DTO containing the message content.
     * @returns A tuple with the created message and the updated conversation.
     * @throws {Error} If the friend is not found.
     */
    async createMessage(
        userId: ObjectId,
        messageDto: MessageDto
    ): Promise<[MessageDocument, ConversationDocument]> {
        // Find the friend by ID
        const friend = await this.userService.findUserById(
            toObjectId(messageDto.friendId));
        // Throw an error if the friend is not found
        if (!friend) throw new Error('Friend not found');
        // Find the user by ID
        const user = await this.userService.findUserById(userId);
        // Find or create a conversation between the user and the friend
        let conversation = await this.findOrCreateConversation(
            user,
            friend);
        // Create a new message
        let message = new this.messageModel({
            user: user,
            message: messageDto.message,
            createdAt: new Date()
        });
        // Save the message
        message = await message.save();
        // Add the new message to the conversation
        conversation.messages.push(message);
        // Save the updated conversation
        conversation = await conversation.save();
        // Return the created message and the updated conversation
        return [message, conversation];
    }

}
