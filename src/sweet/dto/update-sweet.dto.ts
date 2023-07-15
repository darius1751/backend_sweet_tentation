import { PartialType } from '@nestjs/mapped-types';
import { CreateSweetDto } from './create-sweet.dto';

export class UpdateSweetDto extends PartialType(CreateSweetDto) {}
