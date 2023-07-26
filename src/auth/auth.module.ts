import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleModule } from 'src/role/role.module';

@Global()
@Module({
    imports: [RoleModule],
    providers: [AuthService],
    exports: [AuthService],

})
export class AuthModule { }
