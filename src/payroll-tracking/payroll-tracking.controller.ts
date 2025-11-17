import { Controller, Get, Param } from '@nestjs/common';
import { PayrollTrackingService } from './payroll-tracking.service';

@Controller('payroll-tracking')
export class PayrollTrackingController {
  constructor(private readonly payrollTrackingService: PayrollTrackingService) {}

  @Get()
  getAllDummy() {
    return this.payrollTrackingService.getAllDummy();
  }

  @Get(':id')
  getDummyById(@Param('id') id: string) {
    return this.payrollTrackingService.getDummyById(id);
  }
}