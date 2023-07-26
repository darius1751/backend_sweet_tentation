import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

  constructor(
    private readonly authService: AuthService
  ) { }

  async use(req: Request, res: Response, next: () => void) {
    const { access_token } = req.headers;
    if (!access_token)
      throw new BadRequestException(`This service require authorization`);
    try {
      const verifyAccessToken = await this.authService.verifyAccessToken(access_token as string);
      if (verifyAccessToken)
        next();
      else
        throw new UnauthorizedException(`AccessToken not is valid`);
    } catch (exception) {
      throw new BadRequestException(`AccessToken no use valid format`);
    }
  }
}
