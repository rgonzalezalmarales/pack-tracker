import { Module } from '@nestjs/common';
import { AxiosAdapterService } from './adapters/axios-adapter.service';

@Module({
  providers: [AxiosAdapterService],
  exports: [AxiosAdapterService],
})
export class CommonModule {}
