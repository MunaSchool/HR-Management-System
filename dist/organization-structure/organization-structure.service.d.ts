import { Model, Types } from 'mongoose';
import { Department, DepartmentDocument } from './models/department.schema';
import { Position, PositionDocument } from './models/position.schema';
import { StructureChangeRequest, StructureChangeRequestDocument } from './models/structure-change-request.schema';
import { EmployeeProfile, EmployeeProfileDocument } from '../employee-profile/models/employee-profile.schema';
import { NotificationLogService } from '../time-management/services/notification-log.service';
export declare class OrganizationStructureService {
    private readonly departmentModel;
    private readonly positionModel;
    private readonly changeRequestModel;
    private readonly employeeProfileModel;
    private readonly notificationLogService;
    constructor(departmentModel: Model<DepartmentDocument>, positionModel: Model<PositionDocument>, changeRequestModel: Model<StructureChangeRequestDocument>, employeeProfileModel: Model<EmployeeProfileDocument>, notificationLogService: NotificationLogService);
    createDepartment(dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getDepartmentById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getAllDepartments(showInactive?: boolean): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    updateDepartment(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    deactivateDepartment(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    createPosition(dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getAllPositions(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    getPositionById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updatePosition(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    updateReportingLine(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    movePosition(id: string, dto: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    deactivatePosition(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    submitChangeRequest(dto: any, requestedBy: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllChangeRequests(): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getChangeRequestById(id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    delimitPosition(id: string, dto: any): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    approveChangeRequest(id: string, approvedBy: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    rejectChangeRequest(id: string, reason: string, rejectedBy: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, StructureChangeRequest, {}, {}> & StructureChangeRequest & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getOrganizationHierarchy(): Promise<{
        departments: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
        positions: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    getDepartmentHierarchy(departmentId: string): Promise<{
        department: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Department, {}, {}> & Department & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>;
        positions: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    getMyTeamHierarchy(employeeId: string): Promise<{
        manager: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, EmployeeProfile, {}, {}> & EmployeeProfile & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, EmployeeProfile, {}, {}> & EmployeeProfile & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>;
        teamPositions: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    getMyStructure(employeeId: string): Promise<{
        employee: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, EmployeeProfile, {}, {}> & EmployeeProfile & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, EmployeeProfile, {}, {}> & EmployeeProfile & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>;
        position: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, Position, {}, {}> & Position & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: Types.ObjectId;
        }>) | null;
        department: Types.ObjectId | undefined;
        reportsTo: Types.ObjectId | undefined;
    }>;
}
