import { ApplicationError, DatabaseError } from '@/helpers/errors';
export declare type RegistrationError = UserAlreadyExists | DatabaseError;
export declare type FindUserByIdError = UserNotFound | DatabaseError;
export declare class UserAlreadyExists extends ApplicationError {
    constructor(error: unknown, message?: string);
}
export declare class UserNotFound extends ApplicationError {
    constructor(error: unknown, message?: string);
}
//# sourceMappingURL=accounts.errors.d.ts.map