

import { ProfileDto } from '@/interfaces/dto/profile.dto';
import { BaseResponseIface, ProfileResponseIface } from '@/interfaces/response';

import BaseService from './base';

class ProfileService extends BaseService {

    public async getProfile(): Promise<ProfileResponseIface> {
        try {
            const { data: response } = await this.get<BaseResponseIface<ProfileResponseIface>>(
                "/profile");
            return Promise.resolve(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async createOrUpdateProfile(payload: ProfileDto): Promise<ProfileResponseIface> {
        try {
            const { data: response } = await this.post<BaseResponseIface<ProfileResponseIface>>(
                "/profile", payload);
            return Promise.resolve(response.data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

const profileService = new ProfileService();
export default profileService;