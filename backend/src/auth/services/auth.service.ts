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

import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto, JwtTokenDto } from '../dto';
import { FiltersUserDto } from '../dto/filters-user-dto';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config';
import { UpdateUserDto } from '../dto/update-user.dto';
import { id } from 'date-fns/locale';

@Injectable()
export class AuthService {
  private defaultLimit: number;
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>, // configService: ConfigService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.defaultLimit = configService.get<number>(Env.DefaultLimit);
  }

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

  private createAndWhere(filters: FiltersUserDto) {
    const { email, fullName, active, role } = filters;
    const andWhere = {};

    if (email) {
      andWhere['email'] = email;
    }

    if (fullName) {
      andWhere['fullName'] = {
        $regex: new RegExp(fullName.toLowerCase()),
        $options: 'i',
      };
    }

    if (role) {
      andWhere['roles'] = { $in: [role] };
    }

    if (typeof active === 'boolean') {
      andWhere['isActive'] = active;
    }

    return andWhere;
  }

  async findAll(filters: FiltersUserDto) {
    const { limit = this.defaultLimit, offset = 0, sort } = filters;

    const andWhere = this.createAndWhere(filters);
    const andSort = sort || '-createdAt';

    const result = await this.userModel
      .find(andWhere)
      .limit(limit)
      .skip(offset)
      .sort(andSort)
      .select('-__v, -password');

    const count = await this.userModel.find(andWhere).countDocuments();

    return {
      total: count,
      items: result,
    };
  }

  findOne(id: string) {
    try {
      return this.userModel
        .findOne({
          _id: id,
        })
        .select('-password');
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

  async deleteById(userId: string) {
    if (!userId.length) return false;

    try {
      await this.userModel.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      this.handleExceptions(error);
    }
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto?.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
      }
      const { email, fullName, roles, isActive, password } = updateUserDto;

      if (
        !email &&
        !fullName &&
        !roles?.length &&
        !password &&
        typeof isActive !== 'boolean'
      )
        return false;

      try {
        const doc = await this.userModel.findByIdAndUpdate(id, {
          ...updateUserDto,
          updatedAt: new Date(Date.now()),
        });
        const userDB = doc.toJSON();
        delete userDB.password;
        delete userDB.__v;

        return { ...userDB, ...updateUserDto };
      } catch (error) {
        this.handleExceptions(error);
      }
    } catch (error) {
      throw error;
    }
  }
}
