import { IsString, IsDate, IsEnum, IsOptional, IsMongoId} from 'class-validator';
import { Type } from 'class-transformer';
import { OnboardingTaskStatus } from '../enums/onboarding-task-status.enum';

export class CreateOnboardingTaskDto {
  @IsMongoId()
  employeeId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsEnum(OnboardingTaskStatus)
  @IsOptional()
  status?: OnboardingTaskStatus;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  deadline?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  completedAt?: Date;

  @IsMongoId()
  @IsOptional()
  documentId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}