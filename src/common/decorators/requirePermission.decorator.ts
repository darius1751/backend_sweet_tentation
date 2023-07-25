import { SetMetadata } from '@nestjs/common';
import { Permission as PermissionEnum } from '../permission.enum';

export const RequirePermission = (permission: PermissionEnum) => SetMetadata('requirePermission', permission);
