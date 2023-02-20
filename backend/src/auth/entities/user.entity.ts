import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/mapped-types';
// import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Schema()
export class User extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @Prop()
  password: string;

  @Prop()
  fullName: string;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.email = this.email?.toLocaleLowerCase()?.trim();
  next();
});

export class UserOutput extends OmitType(User, ['__v'] as const) {}