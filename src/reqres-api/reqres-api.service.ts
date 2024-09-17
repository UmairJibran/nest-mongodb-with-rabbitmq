import { Injectable } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import configuration from '../config/configuration';

@Injectable()
export class ReqresApiService {
  constructor(private readonly httpService: HttpService) {}

  fetchDataFromApi(
    extendedPath: string,
    config?: AxiosRequestConfig,
  ): Observable<AxiosResponse<any>> {
    const baseUrl: string = configuration().reqresApiUrl;
    const url = baseUrl.concat(extendedPath);
    return this.httpService.get(url, config);
  }
}
