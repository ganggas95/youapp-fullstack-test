import { UserDocument } from '@/api/user/schemes/user.scheme';

export class AuthenticatedRequest extends Request {
    currentUser: UserDocument | null = null;
    constructor(input: RequestInfo | URL, init?: RequestInit) {
        super(input, init);
    }
}