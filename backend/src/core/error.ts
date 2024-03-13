export class BaseError extends Error {
    status: number;
    data: any;
    constructor(status: number, data: any, message: string) {
        super(message);
        this.status = status;
        this.data = data;
    }
}
