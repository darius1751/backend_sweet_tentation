import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { Permission } from 'src/common/permission.enum';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
    private readonly authService: AuthService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const { access_token } = request.headers;
    const requirePermission = this.reflector.get<Permission>('requirePermission', context.getHandler());
    if (!requirePermission)
      return true;
    const { role } = await this.authService.verifyAccessToken(access_token as string);
    const { permissions } = await this.roleService.findOneById(role);
    const hasPermission = permissions.filter(({ name }) => name === requirePermission).length != 0;
    return hasPermission;
  }
}
