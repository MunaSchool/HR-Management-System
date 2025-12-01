import { OrganizationStructureService } from './organization-structure.service';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';
export declare class OrganizationStructureController {
    private readonly organizationStructureService;
    constructor(organizationStructureService: OrganizationStructureService);
    createDepartment(dto: CreateDepartmentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAllDepartments(includeInactive?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getDepartmentById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    deactivateDepartment(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    createPosition(dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getAllPositions(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getPositionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updatePosition(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateReportingLine(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    movePosition(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    delimitPosition(id: string, dto: any): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    submitChangeRequest(dto: any, user: CurrentUserData): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllChangeRequests(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getChangeRequestById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    approveChangeRequest(id: string, user: CurrentUserData): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    rejectChangeRequest(id: string, dto: any, user: CurrentUserData): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/structure-change-request.schema").StructureChangeRequest, {}, {}> & import("./models/structure-change-request.schema").StructureChangeRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getOrganizationHierarchy(): Promise<{
        departments: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
        positions: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getDepartmentHierarchy(departmentId: string): Promise<{
        department: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/department.schema").Department, {}, {}> & import("./models/department.schema").Department & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        positions: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getMyTeamHierarchy(user: CurrentUserData): Promise<{
        manager: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../employee-profile/models/employee-profile.schema").EmployeeProfile, {}, {}> & import("../employee-profile/models/employee-profile.schema").EmployeeProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../employee-profile/models/employee-profile.schema").EmployeeProfile, {}, {}> & import("../employee-profile/models/employee-profile.schema").EmployeeProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        teamPositions: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    getMyStructure(user: CurrentUserData): Promise<{
        employee: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../employee-profile/models/employee-profile.schema").EmployeeProfile, {}, {}> & import("../employee-profile/models/employee-profile.schema").EmployeeProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("../employee-profile/models/employee-profile.schema").EmployeeProfile, {}, {}> & import("../employee-profile/models/employee-profile.schema").EmployeeProfile & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
        position: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./models/position.schema").Position, {}, {}> & import("./models/position.schema").Position & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>) | null;
        department: import("mongoose").Types.ObjectId | undefined;
        reportsTo: import("mongoose").Types.ObjectId | undefined;
    }>;
}
