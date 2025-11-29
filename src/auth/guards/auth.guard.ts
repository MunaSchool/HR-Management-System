import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      });

      // BR-3j: Check employee status - only ACTIVE employees can access system
      // Status is included in JWT payload during login
      const allowedStatuses = ['ACTIVE', 'PROBATION'];
      if (payload.status && !allowedStatuses.includes(payload.status)) {
        throw new UnauthorizedException(
          `Access denied. Employee status: ${payload.status}. Only ACTIVE or PROBATION employees can access the system.`,
        );
      }

      // Attach user to request
      request.user = {
        employeeId: payload.userid,
        employeeNumber: payload.employeeNumber,
        email: payload.email,
        roles: payload.roles || ['DEPARTMENT_EMPLOYEE'],
        status: payload.status,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
