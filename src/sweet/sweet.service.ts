import { Injectable } from '@nestjs/common';
import { CreateSweetDto } from './dto/create-sweet.dto';
import { UpdateSweetDto } from './dto/update-sweet.dto';

@Injectable()
export class SweetService {
  create(createSweetDto: CreateSweetDto) {
    return 'This action adds a new sweet';
  }

  findAll() {
    return `This action returns all sweet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sweet`;
  }

  update(id: number, updateSweetDto: UpdateSweetDto) {
    return `This action updates a #${id} sweet`;
  }

  remove(id: number) {
    return `This action removes a #${id} sweet`;
  }
}
