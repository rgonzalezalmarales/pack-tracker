import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
import { ValidRoles } from '../interfaces';
import { ApiProperty } from '@nestjs/swagger';
// import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Schema()
export class User extends Document {
  @ApiProperty({
    description: 'Email del usuario',
  })
  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
  })
  @Prop()
  password: string;

  @ApiProperty({
    description: 'Nombre del usaurio',
  })
  @Prop()
  fullName: string;

  @ApiProperty({
    description: 'Campo para activar el usuario',
  })
  @Prop({
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'JWT se utiliza para refrescar la sesión',
  })
  @Prop({
    required: false,
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ValidRoles,
  })
  @Prop({ type: [String], default: ['user'], enum: ValidRoles })
  roles: string[];

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

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.email = this.email?.toLocaleLowerCase()?.trim();
  next();
});

export class UserOutput extends OmitType(User, ['__v'] as const) {}
