import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Mock authentication - In production, this would validate JWT token
    // For now, we'll check if there's an authorization header
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    // Mock user extraction - In production, decode JWT and fetch user
    // This is a placeholder for demonstration
    request.user = {
      userId: request.headers['x-user-id'] || 'mock-user-id',
      employeeId: request.headers['x-employee-id'] || 'mock-employee-id',
      role: request.headers['x-user-role'] || 'department employee',
      employeeNumber: request.headers['x-employee-number'] || 'EMP001',
    };

    return true;
  }
}
