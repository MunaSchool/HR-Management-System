import { Injectable } from '@nestjs/common';
import { CreateOffboardingDto } from './dto/create-offboarding.dto';
import { UpdateOffboardingDto } from './dto/update-offboarding.dto';

@Injectable()
export class OffboardingService {
  create(createOffboardingDto: CreateOffboardingDto) {
    return 'This action adds a new offboarding';
  }

  findAll() {
    return `This action returns all offboarding`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offboarding`;
  }

  update(id: number, updateOffboardingDto: UpdateOffboardingDto) {
    return `This action updates a #${id} offboarding`;
  }

  remove(id: number) {
    return `This action removes a #${id} offboarding`;
  }
}
