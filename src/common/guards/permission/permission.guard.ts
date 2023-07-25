import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/common/permission.enum';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requirePermission = this.reflector.get<Permission>('requirePermission', context.getHandler());
    if(!requirePermission)
      return true;
    //Validate permission in role
    return true;
  }
}
