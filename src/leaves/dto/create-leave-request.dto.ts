import { IsString, IsDateString, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateLeaveRequestDto {
  @IsMongoId()
  employeeId: string;

  @IsMongoId()
  leaveTypeId: string;

  @IsDateString()
  dateFrom: string;

  @IsDateString()
  dateTo: string;

  @IsOptional()
  @IsString()
  justification?: string;

  @IsOptional()
  @IsBoolean()
  isPostLeaveRequest?: boolean;
}
