import { AxiosError } from 'axios';

import { RegsiterDto } from '@/interfaces/dto';

import BaseService from './base';

class RegisterService extends BaseService {
    async doRegister(payload: RegsiterDto) {
        try {
            return await this.post("/register", payload);
        } catch (error) {
            console.log(error instanceof AxiosError)
            if (error instanceof AxiosError) {
                return Promise.reject(error.response?.data?.data);
            }
            return Promise.reject(error);
        }
    }
}

const registerService = new RegisterService();

export default registerService;
