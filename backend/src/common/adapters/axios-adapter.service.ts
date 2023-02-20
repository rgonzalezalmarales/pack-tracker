import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IHttpAdpater } from '../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapterService implements IHttpAdpater {
  private axios: AxiosInstance = axios;

  //Profe
  //   async get<T>(url: string): Promise<T> {
  //     const result = await this.axios.get<T>(url);
  //     return result?.data;
  //   }

  //Yo
  async get<T>(url: string): Promise<T> {
    return this.axios
      .get<T>(url)
      .then((result) => {
        return result?.data;
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  }
}
