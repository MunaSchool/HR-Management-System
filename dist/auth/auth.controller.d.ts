import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        payload: {
            userid: import("mongoose").Types.ObjectId;
            roles: string[];
            status: string;
        };
    }>;
    register(registerDto: RegisterDto): Promise<string>;
    registerFirstAdmin(registerDto: RegisterDto): Promise<string>;
}
