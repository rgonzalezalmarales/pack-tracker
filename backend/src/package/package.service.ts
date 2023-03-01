import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

import { CreatePackageDto, UpdatePackageDto } from './dto';
import { Package, PackStatus } from './entities/package.entity';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config';
import { startOfDay, endOfDay } from 'date-fns';
import { MailPackageService } from 'src/mail/services/mail.-package.service';
import { FiltersPackageDto } from './dto/filters-package.dto';

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

  private createAndWhere(filters: FiltersPackageDto) {
    const { dateGte, dateLte, status, description } = filters;
    const andWhere = {};

    if (dateGte) {
      const end = dateLte || dateGte;
      andWhere['createdAt'] = {
        $gt: startOfDay(dateGte),
        $lt: endOfDay(end),
      };
    }

    andWhere['status'] = status ? status : { $ne: PackStatus.Delivered };

    if (description) {
      // $regex: new RegExp('^' + description.toLowerCase(), 'i'),
      andWhere['description'] = {
        $regex: new RegExp(description.toLowerCase()),
        $options: 'i',
      };
    }

    return andWhere;
  }

  async findAll(filters: FiltersPackageDto) {
    const { limit = this.defaultLimit, offset = 0 } = filters;

    const andWhere = this.createAndWhere(filters);

    const result = await this.packageModel
      .find(andWhere)
      .limit(limit)
      .skip(offset)
      .sort({
        createdAt: -1,
      })
      .select('-__v, -identifier');

    const count = await this.packageModel.find(andWhere).countDocuments();

    return {
      total: count,
      items: result,
    };
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

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Package exists in db ${JSON.stringify(error?.keyValue)}`,
      );
    }

    // Other server error
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Package - Ckeck server logs`,
    );
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    try {
      const { finished, address, description } = updatePackageDto;

      if (!finished && !address && !description) return false;

      const pack: Package = await this.packageModel.findOne({
        _id: id,
      });

      if (pack.status == PackStatus.Delivered)
        throw new NotFoundException(
          `The package is blocked by status delivered`,
        );

      const status = finished ? PackStatus.Delivered : PackStatus.Transit;

      pack.status = status;
      pack.route.push({
        createdAt: new Date(Date.now()),
        description,
        address,
        status,
      });

      await pack.save();

      return true;
    } catch (error) {
      throw error;
    }
  }
}
