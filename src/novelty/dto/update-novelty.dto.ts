import { PartialType } from '@nestjs/mapped-types';
import { CreateNoveltyDto } from './create-novelty.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNoveltyDto extends PartialType(CreateNoveltyDto) {
    
    @IsBoolean()
    @IsOptional()
    public readonly active?: boolean;
}
