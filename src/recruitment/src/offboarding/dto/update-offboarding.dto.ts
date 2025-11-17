import { PartialType } from '@nestjs/swagger';
import { CreateOffboardingDto } from './create-offboarding.dto';

export class UpdateOffboardingDto extends PartialType(CreateOffboardingDto) {}
