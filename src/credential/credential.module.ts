import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialService } from './credential.service';
import { Credential, CredentialSchema } from './entities/credential.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
  ],
  providers: [CredentialService],
  exports: [CredentialService],
})
export class CredentialModule { }
