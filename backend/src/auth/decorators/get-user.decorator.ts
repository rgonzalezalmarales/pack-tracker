import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req?.user;

  if (data) {
    const value = user[data];

    if (!value)
      throw new InternalServerErrorException(
        `Property ${data} not exist in User object`,
      );

    return value;
  }

  if (!user)
    throw new InternalServerErrorException('User not foud in object request');

  return user;
});
