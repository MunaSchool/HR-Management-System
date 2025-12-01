import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { EmployeeProfile } from '../employee-profile/models/employee-profile.schema';
import { EmployeeSystemRole } from '../employee-profile/models/employee-system-role.schema';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private employeeProfileModel;
    private employeeRoleModel;
    private jwtService;
    constructor(employeeProfileModel: Model<EmployeeProfile>, employeeRoleModel: Model<EmployeeSystemRole>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<string>;
    signIn(employeeNumber: string, password: string): Promise<{
        access_token: string;
        payload: {
            userid: Types.ObjectId;
            roles: string[];
            status: string;
        };
    }>;
    findByEmployeeNumber(employeeNumber: string): Promise<(import("mongoose").Document<unknown, {}, EmployeeProfile, {}, {}> & EmployeeProfile & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
