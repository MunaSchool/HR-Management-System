import { IsMongoId, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateClearanceChecklistDto {
  @IsMongoId()
  @IsNotEmpty()
  terminationId: string;

  @IsArray()
  @IsOptional()
  items?: any[];

  @IsArray()
  @IsOptional()
  equipmentList?: any[];

  @IsBoolean()
  @IsOptional()
  cardReturned?: boolean;
}
