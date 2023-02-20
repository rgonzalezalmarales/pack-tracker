import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailPackageService } from './services/mail.-package.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from 'src/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get(Env.EmailServer),
          port: config.get(Env.EmailPort),
          secure: config.get(Env.EmailSecure),
          auth: {
            user: config.get(Env.EmailUser),
            pass: config.get(Env.EmailPassword),
          },
        },
        defaults: {
          from: config.get(Env.EmailFrom),
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailPackageService],
  exports: [MailPackageService],
})
export class MailModule {}
