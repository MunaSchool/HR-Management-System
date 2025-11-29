import { IsMongoId, IsOptional, IsEnum, IsString } from 'class-validator';
import { DocumentType } from '../enums/document-type.enum';

export class CreateOnboardingDocumentDto {
  @IsMongoId()
  @IsOptional()
  candidateId?: string;

  @IsMongoId()
  @IsOptional()
  employeeId?: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  documentName: string;

  @IsString()
  documentUrl: string;
}
