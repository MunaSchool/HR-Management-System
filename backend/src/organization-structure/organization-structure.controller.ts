import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrganizationStructureService } from './organization-structure.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/decorators/current-user.decorator';
import { SystemRole } from '../employee-profile/enums/employee-profile.enums';

// Department DTOs
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { UpdateDepartmentDto } from './dtos/update-department.dto';

// Position DTOs
import { CreatePositionDto } from './dtos/create-position.dto';

@Controller('organization-structure')
@UseGuards(AuthGuard, RolesGuard)
export class OrganizationStructureController {
  constructor(
    private readonly organizationStructureService: OrganizationStructureService,
  ) {}

  // ======================
  // 📌 DEPARTMENTS
  // ======================

  @Post('departments')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN) //aded the HRAdmin engy
  createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.organizationStructureService.createDepartment(dto);
  }

  @Get('departments')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD, SystemRole.DEPARTMENT_EMPLOYEE)
  getAllDepartments(@Query('includeInactive') includeInactive?: string) {
    const showInactive = includeInactive === 'true';
    return this.organizationStructureService.getAllDepartments(showInactive);
  }

  @Get('departments/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD, SystemRole.DEPARTMENT_EMPLOYEE)
  getDepartmentById(@Param('id') id: string) {
    return this.organizationStructureService.getDepartmentById(id);
  }

  @Put('departments/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN) // added HRaddmin by engy
  updateDepartment(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.organizationStructureService.updateDepartment(id, dto);
  }

  @Patch('departments/:id/deactivate')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN) //aded the HRAdmin engy
  deactivateDepartment(@Param('id') id: string) {
    return this.organizationStructureService.deactivateDepartment(id);
  }
  // ============================
// 📌 ACTIVATE DEPARTMENT
// ============================
@Patch('departments/:id/activate')
@Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
activateDepartment(@Param('id') id: string) {
  return this.organizationStructureService.activateDepartment(id);
}


  // ======================
  // 📌 POSITIONS
  // ======================

  @Post('positions')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)// added the HRAdmin engy
  createPosition(@Body() dto: CreatePositionDto) {
    return this.organizationStructureService.createPosition(dto);
  }

  @Get('positions')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD)
  getAllPositions() {
    return this.organizationStructureService.getAllPositions();
  }

  @Get('positions/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD)
  getPositionById(@Param('id') id: string) {
    return this.organizationStructureService.getPositionById(id);
  }

  @Put('positions/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN) //added HRAdmin engy
  updatePosition(@Param('id') id: string, @Body() dto: any) {
    return this.organizationStructureService.updatePosition(id, dto);
  }

  @Put('positions/:id/reporting-line')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN) //added HRAdmin engy
  updateReportingLine(@Param('id') id: string, @Body() dto: any) {
    return this.organizationStructureService.updateReportingLine(id, dto);
  }

  @Put('positions/:id/move')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN) //added HRAdmin
  movePosition(@Param('id') id: string, @Body() dto: any) {
    return this.organizationStructureService.movePosition(id, dto);
  }

@Patch('positions/:id/deactivate')
@Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
deactivatePosition(@Param('id') id: string) {
  return this.organizationStructureService.deactivatePosition(id);
}

@Patch('positions/:id/activate')
@Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN)
activatePosition(@Param('id') id: string) {
  return this.organizationStructureService.activatePosition(id);
}

  // ======================
  // 📌 STRUCTURE CHANGE REQUESTS
  // ======================

  @Post('change-requests')
  @Roles(SystemRole.DEPARTMENT_HEAD, SystemRole.HR_MANAGER, SystemRole.HR_ADMIN) // hradmon added by engy
  submitChangeRequest(@Body() dto: any, @CurrentUser() user: CurrentUserData) {
    return this.organizationStructureService.submitChangeRequest(dto, user.employeeId);
  }

  // ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes

  @Get('change-requests/my-requests')
  @Roles(SystemRole.DEPARTMENT_HEAD, SystemRole.HR_MANAGER) // Managers can view their own requests
  getMyChangeRequests(@CurrentUser() user: CurrentUserData) {
    return this.organizationStructureService.getMyChangeRequests(user.employeeId);
  }

  @Get('change-requests')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER) // HR and System Admin can view all organizational structure change requests
  getAllChangeRequests() {
    return this.organizationStructureService.getAllChangeRequests();
  }

  @Get('change-requests/:id')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.DEPARTMENT_HEAD)
  getChangeRequestById(@Param('id') id: string) {
    return this.organizationStructureService.getChangeRequestById(id);
  }

  @Put('change-requests/:id/approve')
  @Roles(SystemRole.SYSTEM_ADMIN) // Only System Admin can approve organizational structure changes (REQ-OSM-04)
  approveChangeRequest(@Param('id') id: string, @CurrentUser() user: CurrentUserData) {
    return this.organizationStructureService.approveChangeRequest(id, user.employeeId);
  }

  @Put('change-requests/:id/reject')
  @Roles(SystemRole.SYSTEM_ADMIN) // Only System Admin can reject organizational structure changes (REQ-OSM-04)
  rejectChangeRequest(@Param('id') id: string, @Body() dto: any, @CurrentUser() user: CurrentUserData) {
    return this.organizationStructureService.rejectChangeRequest(id, dto.reason, user.employeeId);
  }

  // ======================
  // 📌 HIERARCHY VISUALIZATION
  // ======================

  @Get('hierarchy/organization')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD, SystemRole.DEPARTMENT_EMPLOYEE)
  getOrganizationHierarchy() {
    return this.organizationStructureService.getOrganizationHierarchy();
  }

  @Get('hierarchy/department/:departmentId')
  @Roles(SystemRole.SYSTEM_ADMIN, SystemRole.HR_ADMIN, SystemRole.HR_MANAGER, SystemRole.DEPARTMENT_HEAD)
  getDepartmentHierarchy(@Param('departmentId') departmentId: string) {
    return this.organizationStructureService.getDepartmentHierarchy(departmentId);
  }

  @Get('hierarchy/my-team')
  @Roles(SystemRole.DEPARTMENT_HEAD, SystemRole.HR_MANAGER, SystemRole.HR_ADMIN) // added hr amanager THE FRADMIN IS A TEMP FOR TESTING BY ENGY
  getMyTeamHierarchy(@CurrentUser() user: CurrentUserData) {
    return this.organizationStructureService.getMyTeamHierarchy(user.employeeId);
  }

  @Get('hierarchy/my-structure')
  getMyStructure(@CurrentUser() user: CurrentUserData) {
    return this.organizationStructureService.getMyStructure(user.employeeId);
  }
}
