import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
        const { role }: SignInJwt = this.jwtService.decode(accessToken, { json: true }) as SignInJwt;
        await this.roleService.findOneById(role);
        return await this.jwtService.verifyAsync(accessToken);
    }
}
