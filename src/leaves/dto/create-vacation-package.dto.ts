export class CreateVacationPackageDto {
  name: string;
  annualEntitlement: number;
  accrualEnabled?: boolean;
  accrualRate?: 'monthly' | 'quarterly' | 'annual';
  carryOverLimit?: number;
}
