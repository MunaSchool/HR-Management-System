import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class AuthorizationMiddleware implements NestMiddleware {
    private allowedRoles;
    constructor(allowedRoles: string[]);
    use(req: Request, res: Response, next: NextFunction): void;
}
