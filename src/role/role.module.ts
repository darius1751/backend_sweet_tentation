import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role, RoleSchema } from './entities/role.entity';
import { PermissionModule } from 'src/permission/permission.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PermissionModule
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RoleModule { }
