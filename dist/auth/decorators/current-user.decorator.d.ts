export interface CurrentUserData {
    userId: string;
    employeeId: string;
    employeeNumber?: string;
    email?: string;
    roles?: string[];
    [key: string]: any;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
