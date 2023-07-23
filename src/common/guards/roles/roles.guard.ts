import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // const request = context
    //   .switchToHttp()
    //   .getRequest() as Request
    // const { access_token } = request.headers;
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log("RolesGuard",{ roles });
    return true;
  }
}
