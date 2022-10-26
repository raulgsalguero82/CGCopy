import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { RoleType, User } from '../../user/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const jwt = request.headers.authorization.replace('Bearer ', '');

    if (!jwt) {
      console.log("Bearer not found");
      new Error("Bearer not found");
      return false;
    }

    const json: any = this.jwtService.decode(jwt, { json: true });

    if (!json) {
      return false;
    }

    const user: User = json.user;

    if (!user) {
      return false;
    }

    const found = roles.some((x) => user.roles.includes(x));

    if (found) return true;
    else return false;
  }
}
