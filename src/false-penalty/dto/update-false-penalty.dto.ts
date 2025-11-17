import { PartialType } from '@nestjs/mapped-types';
import { CreateFalsePenaltyDto } from './create-false-penalty.dto';

export class UpdateFalsePenaltyDto extends PartialType(CreateFalsePenaltyDto) {}
