import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isMongoId } from 'class-validator';
import { RoleService } from 'src/role/role.service';

export type SignInJwt = {
    user: string,
    role: string
}

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private roleService: RoleService
    ) { }

    async createAccessToken(signInJwt: SignInJwt) {
        return await this.jwtService.signAsync(signInJwt);
    }

    async verifyAccessToken(accessToken: string) {
        if(!accessToken)
            throw new UnauthorizedException(`Require accessToken for operation`);
        const { role }: SignInJwt = this.jwtService.decode(accessToken, { json: true }) as SignInJwt;
        if (!isMongoId(role))
            throw new UnauthorizedException(`Not is a accessToken valid`);
        await this.roleService.findOneById(role);
        return await this.jwtService.verifyAsync<SignInJwt>(accessToken);
    }
}
