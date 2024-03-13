export interface OnlineUserIface {
    id: string
    socketId: string
    isOnline: boolean
    conversationId?: string
}