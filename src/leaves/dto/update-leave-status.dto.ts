import { IsEnum, IsOptional } from 'class-validator';
import { LeaveRequestStatus } from '../models/leave-request.schema';

export class UpdateLeaveStatusDto {
  @IsEnum(LeaveRequestStatus)
  status: LeaveRequestStatus;

  @IsOptional()
  note?: string;
}
  