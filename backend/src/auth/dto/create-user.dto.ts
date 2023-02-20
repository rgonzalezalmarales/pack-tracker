import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidRoles } from '../interfaces';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Thyo1254',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `The pasword must have a Uppercase, lowercase letter and a number`,
  })
  password: string;

  @ApiProperty({
    example: 'Juan Pérez Pérez',
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    example: `[${ValidRoles.Admin}]`,
    enum: ValidRoles,
  })
  @IsOptional()
  @IsArray()
  roles?: string[];
}
