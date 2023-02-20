import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Package, PackageSchema } from './entities/package.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [PackageController],
  providers: [PackageService],
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    AuthModule,
    MailModule,
  ],
})
export class PackageModule {}
