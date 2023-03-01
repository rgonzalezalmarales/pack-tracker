import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto, JwtTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>, // configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user: User = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const json = user.toJSON();
      delete json.password;
      delete json.__v;

      const token = this.getJwtToken(this.toJwtPayload(user));
      user.refreshToken = token;
      await user.save();

      return {
        ...json,
        token,
      };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const pass = loginUserDto?.password;
    const email = loginUserDto?.email;

    const user: User = await this.userModel
      .findOne({
        email,
      })
      .select({
        refreshToken: false,
        __v: false,
      });

    if (!user)
      throw new UnauthorizedException(`Credentials are not valid (email)`);

    const { password, ...data } = user.toJSON();

    if (!bcrypt.compareSync(pass, password))
      throw new UnauthorizedException(`Credentials are not valid (password)`);

    const token = this.getJwtToken(this.toJwtPayload(user));
    user.refreshToken = token;
    await user.save();

    return {
      ...data,
      token,
    };
    //TODO: Retornar el JWT
  }

  async logout(id: string) {
    try {
      return this.userModel.findByIdAndUpdate(id, {
        refreshToken: '',
      });
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async checkAuthStatus(jwt: JwtTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(jwt.token);
      const user: User = await this.userModel
        .findOne({
          _id: payload.id,
        })
        .select({
          password: false,
          __v: false,
        });

      const { refreshToken, ...data } = user.toJSON();

      if (jwt.token !== refreshToken)
        throw new UnauthorizedException(`Token are not valid`);

      const token = this.getJwtToken(this.toJwtPayload(user));
      user.refreshToken = token;
      await user.save();

      return {
        ...data,
        token,
      };
    } catch (error) {
      throw new UnauthorizedException(`Token are not valid`);
    }
  }

  private toJwtPayload(user: User): JwtPayload {
    return {
      email: user.email,
      id: user._id,
    };
  }

  private handleExceptions(error: any): never {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists in db ${JSON.stringify(error?.keyValue)}`,
      );
    }

    // Other server error
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create User - Ckeck server logs`,
    );
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async insertManny(users: CreateUserDto[]) {
    this.userModel.insertMany(users);
  }

  async deleteManyById(userId: string[] = []) {
    if (!!userId.length) {
      try {
        await this.userModel.deleteMany({
          _id: { $in: userId },
        });
        return true;
      } catch (error) {
        this.handleExceptions(error);
      }
    }

    try {
      await this.userModel.deleteMany();
      return true;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
