import { AxiosResponse } from 'axios';

import { BaseResponseIface, ProfileResponseIface } from '@/interfaces/response';

import BaseService from './base';

class UserService extends BaseService {

    public async getUsers(): Promise<AxiosResponse<BaseResponseIface<ProfileResponseIface[]>>> {
        return this.get("/user/list");
    }
    public async getUserById(
        userId: string
    ): Promise<AxiosResponse<BaseResponseIface<ProfileResponseIface>>> {
        return this.get(`/user/${userId}/detail`);
    }
}

const userService = new UserService();
export default userService;