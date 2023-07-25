import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [RoleModule],
    providers: [AuthService],
    exports: [AuthService],

})
export class AuthModule { }
