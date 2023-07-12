import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';
import { CredentialModule } from './credential/credential.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { SweetModule } from './sweet/sweet.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@db:27017/`,{
      dbName:env.MONGO_DATABASE,
      directConnection:true,      
    }),
    CredentialModule,
    UserModule,
    RoleModule,
    SweetModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
