import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export enum PackStatus {
  Received = 'Received',
  Transit = 'Transit',
  Delivered = 'Delivered',
}

@Schema({ _id: false })
export class PackPoint {
  @Prop({
    type: String,
    enum: PackStatus,
    default: PackStatus.Received,
  })
  status: PackStatus;

  @Prop({
    default: 'Recibido en oficinas de Pack Tracker',
  })
  description: string;

  @Prop()
  address: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  createdAt: Date;
}

@Schema()
export class Package extends Document {
  @ApiProperty({
    description: 'Email del receptor del producto',
  })
  @Prop()
  addresseeEmail: string;

  @ApiProperty({
    description: 'Identificador único del producto',
  })
  @Prop({
    unique: true,
    index: true,
  })
  identifier: string;

  @ApiProperty({
    description: 'Descripción del producto',
  })
  @Prop()
  description: string;

  @Prop()
  weight: number;

  @ApiProperty({
    description: 'Estatus del producto',
  })
  @Prop({
    type: String,
    enum: PackStatus,
    default: PackStatus.Received,
  })
  status: PackStatus;

  @Prop([PackPoint])
  route: PackPoint[];

  @ApiProperty({
    description: 'Fecha de creación',
  })
  @Prop({
    type: Date,
    default: Date.now(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
  })
  @Prop({
    type: Date,
    required: false,
  })
  updatedAt?: Date;
}

export const PackageSchema = SchemaFactory.createForClass(Package);
