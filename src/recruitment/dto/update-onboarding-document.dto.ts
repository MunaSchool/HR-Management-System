import { IsMongoId, IsOptional, IsEnum, IsString } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum'; 

export class UpdateOnboardingDocumentDto {
  @IsMongoId()
  @IsOptional()
  candidateId?: string;

  @IsMongoId()
  @IsOptional()
  employeeId?: string;

  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType;

  @IsString()
  @IsOptional()
  documentName?: string;

  @IsString()
  @IsOptional()
  documentUrl?: string;
}
