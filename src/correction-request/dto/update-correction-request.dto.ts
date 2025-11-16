import { PartialType } from '@nestjs/mapped-types';
import { CreateCorrectionRequestDto } from './create-correction-request.dto';

export class UpdateCorrectionRequestDto extends PartialType(CreateCorrectionRequestDto) {}
