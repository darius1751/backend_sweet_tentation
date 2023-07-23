import { SetMetadata } from '@nestjs/common';
import { Permission as PermissionEnum} from '../permission.enum';

export const Permission = (...args: PermissionEnum[]) => SetMetadata('permission', args);
