import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response, Request } from 'express';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';

@Catch()
export class CreateWithFileErrorFilter implements ExceptionFilter {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const files = await readdir('./temp');
    for (let file of files) {
      await unlink(join('temp', file));
    }
    response
      .status(status)
      .json(exception.getResponse());

  }
}
