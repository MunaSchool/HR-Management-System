import { IsString, IsOptional, IsMongoId, IsBoolean } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // 👇 from dropdown (employeeNumber)
  @IsOptional()
  @IsString()
  employeeNumber?: string;

  // 👇 backend-only (resolved from employeeNumber)
  @IsOptional()
  @IsMongoId()
  headPositionId?: string;

  // 👇 THIS fixes the error
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}