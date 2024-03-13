import { LoginDto } from '@/interfaces/dto';

import BaseService from './base';

class LoginService extends BaseService {
    doLogin(payload: LoginDto) {
        return this.post("/login", payload);
    }
}

const loginService = new LoginService();

export default loginService;
