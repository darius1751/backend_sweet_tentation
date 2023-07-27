import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PermissionModule } from 'src/permission/permission.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    CategoryModule,
    PermissionModule
  ],
  controllers: [SeedController],
  providers: [SeedService]
})
export class SeedModule { }
