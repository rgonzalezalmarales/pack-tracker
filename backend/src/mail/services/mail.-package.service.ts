import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config';

@Injectable()
export class MailPackageService {
  private base_url: string;
  constructor(private mailerService: MailerService, config: ConfigService) {
    this.base_url = config.get(Env.LinkStatus);
  }

  async sendUserNotification(email: string, identifier: string) {
    const url = `${this.base_url}/${identifier}/status`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Envío de paquete',
      template: './confirmation',
      context: {
        url,
        identifier,
      },
    });
  }
}
