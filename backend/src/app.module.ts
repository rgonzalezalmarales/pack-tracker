import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Env, EnvConfig, JoiValidationSchema } from './config';
import { PackageModule } from './package/package.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get(Env.MongoDB),
      }),
    }),
    PackageModule,
    CommonModule,
    AuthModule,
    SeedModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
