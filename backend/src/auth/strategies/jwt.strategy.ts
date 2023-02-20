import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Env } from 'src/config';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get(Env.JwtSecret),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      usernameField: 'id',
      passwordField: 'password',
    });
  }

  // https://docs.nestjs.com/security/authentication#implementing-passport-strategies
  // constructor(private authService: AuthService) {
  //   super({
  //     usernameField: 'email',
  //     passwordField: 'password',
  //   });
  // }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.userModel
      .findOne({
        _id: id,
      })
      .select({
        email: true,
        isActive: true,
        roles: true,
        fullName: true,
      });

    if (!user) throw new UnauthorizedException(`Token not valid`);

    if (!user.isActive)
      throw new UnauthorizedException(`User is not active, talk with an admin`);

    return user;
  }
}
