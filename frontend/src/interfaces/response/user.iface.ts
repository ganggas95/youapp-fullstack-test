
export interface UserResponseIface {
    id: string;
    username: string;
    email: string;
    gender?: string;
}

export interface OnlineUserIface {
    id: string;
    isOnline: boolean;
}