import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export type SignInJwt = {
    user: string,
    roleId: string
}

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async createAccessToken(signInJwt: SignInJwt) {
        return await this.jwtService.signAsync(signInJwt);
    }    
}
