import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIntPaginationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const { data } = metadata;
    const parseIntNumber = parseInt(value);
    if (Number.isInteger(parseIntNumber) && !Number.isNaN(parseIntNumber)) {
      if (parseIntNumber < 0)
        throw new BadRequestException(`${data}: ${value} must to be positive`)
      if (data == 'take')
        if (parseIntNumber > 100)
          throw new BadRequestException(`${data}: ${value} must to be between 0 and 100`);
      return parseIntNumber;
    } else
      throw new BadRequestException(`${data}: ${value} not is posible convert to int positive number`);
  }
}
