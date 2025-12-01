"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const employee_profile_schema_1 = require("../employee-profile/models/employee-profile.schema");
const employee_system_role_schema_1 = require("../employee-profile/models/employee-system-role.schema");
const authentication_middleware_1 = require("./middleware/authentication.middleware");
const auth_guard_1 = require("./guards/auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: employee_profile_schema_1.EmployeeProfile.name, schema: employee_profile_schema_1.EmployeeProfileSchema },
                { name: employee_system_role_schema_1.EmployeeSystemRole.name, schema: employee_system_role_schema_1.EmployeeSystemRoleSchema },
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        providers: [auth_service_1.AuthService, authentication_middleware_1.AuthenticationMiddleware, auth_guard_1.AuthGuard, roles_guard_1.RolesGuard],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule, authentication_middleware_1.AuthenticationMiddleware, auth_guard_1.AuthGuard, roles_guard_1.RolesGuard],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map