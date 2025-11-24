import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { ProfileChangeStatus } from '../enums/employee-profile.enums';

export class ProcessChangeRequestDto {
  @ApiProperty({
    enum: ProfileChangeStatus,
    example: ProfileChangeStatus.APPROVED,
  })
  @IsEnum(ProfileChangeStatus)
  status: ProfileChangeStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
