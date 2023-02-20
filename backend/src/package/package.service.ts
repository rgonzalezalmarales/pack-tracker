import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

import { CreatePackageDto, UpdatePackageDto } from './dto';
import { Package, PackStatus } from './entities/package.entity';
import { FiltersDto, PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config';
import { startOfDay, endOfDay } from 'date-fns';
import { MailPackageService } from 'src/mail/services/mail.-package.service';

@Injectable()
export class PackageService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Package.name) private readonly packageModel: Model<Package>,
    configService: ConfigService,
    private readonly mail: MailPackageService,
  ) {
    this.defaultLimit = configService.get<number>(Env.DefaultLimit);
  }
  async create(createPackageDto: CreatePackageDto) {
    try {
      const newItem = {
        ...createPackageDto,
        identifier: uuid(),
        route: [
          {
            address: createPackageDto.address,
          },
        ],
      };

      const pack: Package = await this.packageModel.create(newItem);

      if (pack) {
        this.mail.sendUserNotification(pack.addresseeEmail, pack.identifier);
      }

      return pack;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  private createAndWhere(filters: FiltersDto) {
    const { date } = filters;
    const andWhere = {};

    if (date) {
      andWhere['createdAt'] = {
        $gt: startOfDay(date),
        $lt: endOfDay(date),
      };
    }
    return andWhere;
  }

  findAll(filters: FiltersDto) {
    const { limit = this.defaultLimit, offset = 0, date } = filters;

    const andWhere = this.createAndWhere(filters);

    const result = this.packageModel
      .find(andWhere)
      .limit(limit)
      .skip(offset)
      // .where(andWhere)
      .sort({
        createdAt: -1,
      })
      .select('-__v, -identifier');

    return result;
  }

  async getSatusByIdent(identifier: string) {
    return this.packageModel
      .findOne({
        identifier,
      })
      .select({
        description: true,
        identifier: true,
        route: true,
        status: true,
        _id: false,
      });
  }

  findOne(id: string) {
    return this.packageModel
      .findOne({
        _id: id,
      })
      .select('-identifier');
  }

  async upadte(id: string, address: string) {
    const pack: Package = await this.packageModel.findOne({
      _id: id,
    });

    pack.status = PackStatus.Transit;
    pack.route.push({
      address,
      createdAt: new Date(Date.now()),
    });
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error?.keyValue)}`,
      );
    }

    // Other server error
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Ckeck server logs`,
    );
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    const { finished, address } = updatePackageDto;

    if (!status && !address) return false;

    const pack: Package = await this.packageModel.findOne({
      _id: id,
    });

    if (address) {
      pack.status = PackStatus.Transit;
      pack.route.push({
        createdAt: new Date(Date.now()),
        address,
      });

      await pack.save();

      return true;
    }

    if (finished)
      await this.packageModel.updateOne(
        {
          _id: id,
        },
        {
          status: PackStatus.Received,
        },
      );

    return true;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} package`;
  // }
}
