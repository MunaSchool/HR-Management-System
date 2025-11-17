import { Injectable } from '@nestjs/common';

@Injectable()
export class PayrollTrackingService {
  getAllDummy() {
    return [
      { id: 1, message: 'Dummy payroll tracking record' },
      { id: 2, message: 'Dummy payslip record' },
    ];
  }

  getDummyById(id: string) {
    return { id, message: `Dummy payroll tracking record with ID ${id}` };
  }
}
