import type { Response } from 'express';
import { EmployeeProfileService } from './employee-profile.service';
import { EmployeeRoleService } from './services/employee-role.service';
import { CandidateRegistrationService } from './services/candidate-registration.service';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
import { SystemRole, EmployeeStatus } from './enums/employee-profile.enums';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { ProcessChangeRequestDto } from './dto/process-change-request.dto';
import { UpdateEmployeeMasterDto } from './dto/update-employee-master.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
export declare class EmployeeProfileController {
    private readonly employeeProfileService;
    private readonly employeeRoleService;
    private readonly candidateRegistrationService;
    constructor(employeeProfileService: EmployeeProfileService, employeeRoleService: EmployeeRoleService, candidateRegistrationService: CandidateRegistrationService);
    registerCandidate(registerDto: any): Promise<{
        success: boolean;
        message: string;
        data: {
            _id: import("mongoose").Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            candidateNumber: string;
            departmentId?: import("mongoose").Types.ObjectId;
            positionId?: import("mongoose").Types.ObjectId;
            applicationDate?: Date;
            status: import("./enums/employee-profile.enums").CandidateStatus;
            resumeUrl?: string;
            notes?: string;
            firstName: string;
            middleName?: string;
            lastName: string;
            fullName?: string;
            nationalId: string;
            gender?: import("./enums/employee-profile.enums").Gender;
            maritalStatus?: import("./enums/employee-profile.enums").MaritalStatus;
            dateOfBirth?: Date;
            personalEmail?: string;
            mobilePhone?: string;
            homePhone?: string;
            address?: import("./models/user-schema").Address;
            profilePictureUrl?: string;
            accessProfileId?: import("mongoose").Types.ObjectId;
            __v: number;
        };
    }>;
    getCandidateProfile(user: CurrentUserData): Promise<{
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        candidateNumber: string;
        departmentId?: import("mongoose").Types.ObjectId;
        positionId?: import("mongoose").Types.ObjectId;
        applicationDate?: Date;
        status: import("./enums/employee-profile.enums").CandidateStatus;
        resumeUrl?: string;
        notes?: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        fullName?: string;
        nationalId: string;
        gender?: import("./enums/employee-profile.enums").Gender;
        maritalStatus?: import("./enums/employee-profile.enums").MaritalStatus;
        dateOfBirth?: Date;
        personalEmail?: string;
        mobilePhone?: string;
        homePhone?: string;
        address?: import("./models/user-schema").Address;
        profilePictureUrl?: string;
        accessProfileId?: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    updateCandidateProfile(user: CurrentUserData, updateDto: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        candidateNumber: string;
        departmentId?: import("mongoose").Types.ObjectId;
        positionId?: import("mongoose").Types.ObjectId;
        applicationDate?: Date;
        status: import("./enums/employee-profile.enums").CandidateStatus;
        resumeUrl?: string;
        notes?: string;
        firstName: string;
        middleName?: string;
        lastName: string;
        fullName?: string;
        nationalId: string;
        gender?: import("./enums/employee-profile.enums").Gender;
        maritalStatus?: import("./enums/employee-profile.enums").MaritalStatus;
        dateOfBirth?: Date;
        personalEmail?: string;
        mobilePhone?: string;
        homePhone?: string;
        address?: import("./models/user-schema").Address;
        profilePictureUrl?: string;
        accessProfileId?: import("mongoose").Types.ObjectId;
        __v: number;
    }>;
    changeCandidatePassword(user: CurrentUserData, passwordDto: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllEmployees(): Promise<(import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    createEmployee(createDto: CreateEmployeeDto): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    searchEmployees(searchQuery?: string, status?: EmployeeStatus, departmentId?: string): Promise<(import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getMyProfile(user: CurrentUserData): Promise<any>;
    updateMyContactInfo(user: CurrentUserData, updateDto: UpdateContactInfoDto): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateMyProfile(user: CurrentUserData, updateDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    createChangeRequest(user: CurrentUserData, createDto: CreateChangeRequestDto): Promise<import("./models/ep-change-request.schema").EmployeeProfileChangeRequest>;
    getMyChangeRequests(user: CurrentUserData): Promise<import("./models/ep-change-request.schema").EmployeeProfileChangeRequest[]>;
    uploadProfilePicture(user: CurrentUserData, file: Express.Multer.File): Promise<{
        message: string;
        url: string;
    }>;
    getTeamMembers(user: CurrentUserData): Promise<(import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getTeamMemberProfile(user: CurrentUserData, id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getPendingChangeRequests(): Promise<import("./models/ep-change-request.schema").EmployeeProfileChangeRequest[]>;
    getChangeRequestById(requestId: string): Promise<import("./models/ep-change-request.schema").EmployeeProfileChangeRequest>;
    processChangeRequest(user: CurrentUserData, requestId: string, processDto: ProcessChangeRequestDto): Promise<import("./models/ep-change-request.schema").EmployeeProfileChangeRequest>;
    getEmployeesByRole(role: SystemRole): Promise<(import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getAllRoleAssignments(user: CurrentUserData): Promise<(import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getProfilePicture(filename: string, res: Response): Promise<void>;
    getEmployeeById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getEmployeeRoles(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    assignRoles(user: CurrentUserData, id: string, assignRoleDto: AssignRoleDto): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    removeRoles(user: CurrentUserData, id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    addPermission(user: CurrentUserData, id: string, permission: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    removePermission(user: CurrentUserData, id: string, permission: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-system-role.schema").EmployeeSystemRole, {}, {}> & import("./models/employee-system-role.schema").EmployeeSystemRole & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateEmployeeStatus(user: CurrentUserData, id: string, statusDto: {
        status: EmployeeStatus;
        effectiveDate?: Date;
    }): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateEmployeeMasterData(user: CurrentUserData, id: string, updateDto: UpdateEmployeeMasterDto): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteEmployee(id: string): Promise<import("mongoose").Document<unknown, {}, import("./models/employee-profile.schema").EmployeeProfile, {}, {}> & import("./models/employee-profile.schema").EmployeeProfile & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
