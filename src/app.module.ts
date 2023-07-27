import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { v2 as cloudinary } from 'cloudinary';
import { AdditionModule } from './addition/addition.module';
import { OfferModule } from './offer/offer.module';
import { NoveltyModule } from './novelty/novelty.module';
import { OrderModule } from './order/order.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './common/jwt/jwt.middleware';
import { PermissionModule } from './permission/permission.module';
import { SweetController } from './sweet/sweet.controller';
import { SeedModule } from './seed/seed.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: env.JWT_SECRET_KEY,
      signOptions: { algorithm: 'HS256', expiresIn: '5h', mutatePayload: false }
    }),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@db:27017/`, {
      dbName: env.MONGO_DATABASE,
      directConnection: true,
    }),
    CredentialModule,
    UserModule,
    RoleModule,
    SweetModule,
    CategoryModule,
    AdditionModule,
    OfferModule,
    NoveltyModule,
    OrderModule,
    CommonModule,
    AuthModule,
    PermissionModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {

  constructor() {
    cloudinary.config({
      cloud_name: env.CLOUD_NAME,
      api_key: env.CLOUD_API_KEY,
      api_secret: env.CLOUD_API_SECRET
    });
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes(AppController, SweetController)
  }

}
