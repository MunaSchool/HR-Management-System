"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProfileModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const employee_profile_controller_1 = require("./employee-profile.controller");
const employee_profile_service_1 = require("./employee-profile.service");
const employee_role_service_1 = require("./services/employee-role.service");
const employee_crud_service_1 = require("./services/employee-crud.service");
const employee_self_service_service_1 = require("./services/employee-self-service.service");
const change_request_service_1 = require("./services/change-request.service");
const file_upload_service_1 = require("./services/file-upload.service");
const hr_admin_service_1 = require("./services/hr-admin.service");
const candidate_registration_service_1 = require("./services/candidate-registration.service");
const candidate_schema_1 = require("./models/candidate.schema");
const employee_profile_schema_1 = require("./models/employee-profile.schema");
const employee_system_role_schema_1 = require("./models/employee-system-role.schema");
const ep_change_request_schema_1 = require("./models/ep-change-request.schema");
const qualification_schema_1 = require("./models/qualification.schema");
const performance_module_1 = require("../performance/performance.module");
const time_management_module_1 = require("../time-management/time-management.module");
let EmployeeProfileModule = class EmployeeProfileModule {
};
exports.EmployeeProfileModule = EmployeeProfileModule;
exports.EmployeeProfileModule = EmployeeProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: candidate_schema_1.Candidate.name, schema: candidate_schema_1.CandidateSchema },
                { name: employee_profile_schema_1.EmployeeProfile.name, schema: employee_profile_schema_1.EmployeeProfileSchema },
                { name: employee_system_role_schema_1.EmployeeSystemRole.name, schema: employee_system_role_schema_1.EmployeeSystemRoleSchema },
                {
                    name: ep_change_request_schema_1.EmployeeProfileChangeRequest.name,
                    schema: ep_change_request_schema_1.EmployeeProfileChangeRequestSchema,
                },
                { name: qualification_schema_1.EmployeeQualification.name, schema: qualification_schema_1.EmployeeQualificationSchema },
            ]),
            (0, common_1.forwardRef)(() => performance_module_1.PerformanceModule),
            time_management_module_1.TimeManagementModule,
        ],
        controllers: [employee_profile_controller_1.EmployeeProfileController],
        providers: [
            employee_profile_service_1.EmployeeProfileService,
            employee_role_service_1.EmployeeRoleService,
            employee_crud_service_1.EmployeeCrudService,
            employee_self_service_service_1.EmployeeSelfServiceService,
            change_request_service_1.ChangeRequestService,
            file_upload_service_1.FileUploadService,
            hr_admin_service_1.HrAdminService,
            candidate_registration_service_1.CandidateRegistrationService,
        ],
        exports: [employee_profile_service_1.EmployeeProfileService, candidate_registration_service_1.CandidateRegistrationService],
    })
], EmployeeProfileModule);
//# sourceMappingURL=employee-profile.module.js.map