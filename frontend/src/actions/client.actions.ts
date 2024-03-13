
import { Cookies } from 'react-cookie';

import { jwtDecode } from 'jwt-decode';

class ClientSession extends Cookies {
    private readonly tokenName = 'you-token';

    public getSession(): string | undefined {
        return this.get(this.tokenName);
    }
    public setSession(token: string) {
        const payload = jwtDecode<Record<string, number>>(token);
        const expires = new Date(payload.exp * 1000);
        this.set(this.tokenName, token, {
            expires,
        });
    }

    public removeSession(): void {
        this.set(this.tokenName, "", {
            expires: new Date(0),
        });
    }
}

const clientSession = new ClientSession();

export default clientSession;
