import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class JwtTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlkIjoiNjNmMzFmNDg4ODUzMzc1YWMyNGRiZTJiIiwiaWF0IjoxNjc2OTk5ODYyLCJleHAiOjE2NzcwMDcwNjJ9.pd-N0xQ984xiyXR7-lC0-WjmHXkVhzl3Hl0XWjX98ZU',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/, {
    message: `The token doesn't match with jwt structure`,
  })
  token: string;
}
