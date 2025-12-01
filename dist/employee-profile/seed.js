"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const mongoose_1 = require("@nestjs/mongoose");
const employee_profile_schema_1 = require("./models/employee-profile.schema");
const employee_system_role_schema_1 = require("./models/employee-system-role.schema");
const employee_profile_enums_1 = require("./enums/employee-profile.enums");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const employeeProfileModel = app.get((0, mongoose_1.getModelToken)(employee_profile_schema_1.EmployeeProfile.name));
    const employeeSystemRoleModel = app.get((0, mongoose_1.getModelToken)(employee_system_role_schema_1.EmployeeSystemRole.name));
    try {
        await employeeProfileModel.deleteMany({});
        await employeeSystemRoleModel.deleteMany({});
        console.log('Cleared existing employee profile and role data');
        const hashedPassword = await bcrypt.hash('password123', 10);
        const employee1 = await employeeProfileModel.create({
            employeeNumber: 'EMP001',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            nationalId: '29005151234567',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.MALE,
            dateOfBirth: new Date('1990-05-15'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.SINGLE,
            workEmail: 'john.doe@company.com',
            personalEmail: 'john.doe@email.com',
            mobilePhone: '+201234567890',
            dateOfHire: new Date('2020-01-15'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const employee2 = await employeeProfileModel.create({
            employeeNumber: 'EMP002',
            firstName: 'Sarah',
            lastName: 'Smith',
            fullName: 'Sarah Smith',
            nationalId: '28808221234568',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.FEMALE,
            dateOfBirth: new Date('1988-08-22'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.MARRIED,
            workEmail: 'sarah.smith@company.com',
            personalEmail: 'sarah.smith@email.com',
            mobilePhone: '+201234567891',
            dateOfHire: new Date('2019-03-10'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const employee3 = await employeeProfileModel.create({
            employeeNumber: 'EMP003',
            firstName: 'Ahmed',
            lastName: 'Hassan',
            fullName: 'Ahmed Hassan',
            nationalId: '29212031234569',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.MALE,
            dateOfBirth: new Date('1992-12-03'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.SINGLE,
            workEmail: 'ahmed.hassan@company.com',
            personalEmail: 'ahmed.hassan@email.com',
            mobilePhone: '+201234567892',
            dateOfHire: new Date('2021-06-01'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const employee4 = await employeeProfileModel.create({
            employeeNumber: 'EMP004',
            firstName: 'Fatima',
            lastName: 'Ali',
            fullName: 'Fatima Ali',
            nationalId: '29503181234570',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.FEMALE,
            dateOfBirth: new Date('1995-03-18'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.SINGLE,
            workEmail: 'fatima.ali@company.com',
            personalEmail: 'fatima.ali@email.com',
            mobilePhone: '+201234567893',
            dateOfHire: new Date('2022-01-20'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const hrAdmin = await employeeProfileModel.create({
            employeeNumber: 'HR001',
            firstName: 'Mohamed',
            lastName: 'Ibrahim',
            fullName: 'Mohamed Ibrahim',
            nationalId: '28507101234571',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.MALE,
            dateOfBirth: new Date('1985-07-10'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.MARRIED,
            workEmail: 'mohamed.ibrahim@company.com',
            personalEmail: 'mohamed.ibrahim@email.com',
            mobilePhone: '+201234567894',
            dateOfHire: new Date('2018-01-05'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const hrManager = await employeeProfileModel.create({
            employeeNumber: 'HR002',
            firstName: 'Layla',
            lastName: 'Ahmed',
            fullName: 'Layla Ahmed',
            nationalId: '28711251234572',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.FEMALE,
            dateOfBirth: new Date('1987-11-25'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.MARRIED,
            workEmail: 'layla.ahmed@company.com',
            personalEmail: 'layla.ahmed@email.com',
            mobilePhone: '+201234567895',
            dateOfHire: new Date('2017-09-12'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const sysAdmin = await employeeProfileModel.create({
            employeeNumber: 'SYS001',
            firstName: 'Omar',
            lastName: 'Mahmoud',
            fullName: 'Omar Mahmoud',
            nationalId: '29004151234573',
            password: hashedPassword,
            gender: employee_profile_enums_1.Gender.MALE,
            dateOfBirth: new Date('1990-04-15'),
            maritalStatus: employee_profile_enums_1.MaritalStatus.SINGLE,
            workEmail: 'omar.mahmoud@company.com',
            personalEmail: 'omar.mahmoud@email.com',
            mobilePhone: '+201234567896',
            dateOfHire: new Date('2019-05-20'),
            status: employee_profile_enums_1.EmployeeStatus.ACTIVE,
        });
        const emp1Role = await employeeSystemRoleModel.create({
            employeeProfileId: employee1._id,
            roles: [employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE],
            isActive: true,
        });
        const emp2Role = await employeeSystemRoleModel.create({
            employeeProfileId: employee2._id,
            roles: [employee_profile_enums_1.SystemRole.DEPARTMENT_HEAD],
            isActive: true,
        });
        const emp3Role = await employeeSystemRoleModel.create({
            employeeProfileId: employee3._id,
            roles: [employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE],
            isActive: true,
        });
        const emp4Role = await employeeSystemRoleModel.create({
            employeeProfileId: employee4._id,
            roles: [employee_profile_enums_1.SystemRole.DEPARTMENT_EMPLOYEE],
            isActive: true,
        });
        const hrAdminRole = await employeeSystemRoleModel.create({
            employeeProfileId: hrAdmin._id,
            roles: [employee_profile_enums_1.SystemRole.HR_ADMIN, employee_profile_enums_1.SystemRole.HR_EMPLOYEE],
            isActive: true,
        });
        const hrManagerRole = await employeeSystemRoleModel.create({
            employeeProfileId: hrManager._id,
            roles: [employee_profile_enums_1.SystemRole.HR_MANAGER, employee_profile_enums_1.SystemRole.HR_EMPLOYEE],
            isActive: true,
        });
        const sysAdminRole = await employeeSystemRoleModel.create({
            employeeProfileId: sysAdmin._id,
            roles: [employee_profile_enums_1.SystemRole.SYSTEM_ADMIN],
            isActive: true,
        });
        await employeeProfileModel.findByIdAndUpdate(employee1._id, { accessProfileId: emp1Role._id });
        await employeeProfileModel.findByIdAndUpdate(employee2._id, { accessProfileId: emp2Role._id });
        await employeeProfileModel.findByIdAndUpdate(employee3._id, { accessProfileId: emp3Role._id });
        await employeeProfileModel.findByIdAndUpdate(employee4._id, { accessProfileId: emp4Role._id });
        await employeeProfileModel.findByIdAndUpdate(hrAdmin._id, { accessProfileId: hrAdminRole._id });
        await employeeProfileModel.findByIdAndUpdate(hrManager._id, { accessProfileId: hrManagerRole._id });
        await employeeProfileModel.findByIdAndUpdate(sysAdmin._id, { accessProfileId: sysAdminRole._id });
        console.log('\n✅ Employee profiles and roles seed completed successfully!');
        console.log('\nSample Employee IDs for testing:');
        console.log('  Employee 1 (John Doe):', employee1._id);
        console.log('  Employee 2 (Sarah Smith - Manager):', employee2._id);
        console.log('  Employee 3 (Ahmed Hassan):', employee3._id);
        console.log('  Employee 4 (Fatima Ali):', employee4._id);
        console.log('  HR Admin (Mohamed Ibrahim):', hrAdmin._id);
        console.log('  HR Manager (Layla Ahmed):', hrManager._id);
        console.log('  System Admin (Omar Mahmoud):', sysAdmin._id);
        console.log('\nYou can test the API with these employee IDs!');
    }
    catch (error) {
        console.error('Error seeding employee profiles:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map