import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

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

      return {
        ...json,
        token: this.getJwtToken(this.toJwtPayload(user)),
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
      .select('-__v');

    const { password, ...data } = user.toJSON();

    if (!user)
      throw new UnauthorizedException(`Credentials are not valid (email)`);

    if (!bcrypt.compareSync(pass, password))
      throw new UnauthorizedException(`Credentials are not valid (password)`);

    // const json = user.toJSON();
    return {
      ...data,
      token: this.getJwtToken(this.toJwtPayload(user)),
    };
    //TODO: Retornar el JWT
  }

  checkAuthStatus(user: User) {
    const json = user.toJSON();
    return {
      ...json,
      token: this.getJwtToken(this.toJwtPayload(user)),
    };
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
    // console.log('Payload: ', payload);
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
