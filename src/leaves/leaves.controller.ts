import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { CreateLeaveCategoryDto } from './dto/create-leave-category.dto';
import { CreateLeaveTypeDto } from './dto/create-leave-type.dto';
import { CreateVacationPackageDto } from './dto/create-vacation-package.dto';

@Controller('leaves')
export class LeavesController {
  constructor(private readonly service: LeavesService) {}

  // ---- Phase 1 endpoints ----
  @Post('categories') createCategory(@Body() dto: CreateLeaveCategoryDto) { return this.service.createCategory(dto); }
  @Get('categories') getAllCategories() { return this.service.getAllCategories(); }
  @Post('types') createType(@Body() dto: CreateLeaveTypeDto) { return this.service.createLeaveType(dto); }
  @Get('types') getAllTypes() { return this.service.getAllLeaveTypes(); }
  @Post('packages') createPackage(@Body() dto: CreateVacationPackageDto) { return this.service.createPackage(dto); }
  @Get('packages') getAllPackages() { return this.service.getAllPackages(); }

  // ---- Phase 2 endpoints ----
  @Post('requests')
  createLeaveRequest(@Body() dto: CreateLeaveRequestDto) {
    return this.service.createLeaveRequest(dto);
  }

  @Patch('requests/:id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateLeaveStatusDto, @Query('role') role: string) {
    return this.service.updateLeaveStatus(id, dto, role);
  }

  @Get('requests')
  getAll() {
    return this.service.getAllLeaves();
  }

  @Get('requests/employee/:empId')
  getByEmployee(@Param('empId') empId: string) {
    return this.service.getLeavesByEmployee(empId);
  }
}
