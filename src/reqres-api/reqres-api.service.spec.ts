import { Test, TestingModule } from '@nestjs/testing';
import { ReqresApiService } from './reqres-api.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
jest.mock('../config/configuration', () => ({
  __esModule: true,
  default: jest.fn(),
}));
import configuration from '../config/configuration';

describe('ReqresApiService', () => {
  let service: ReqresApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReqresApiService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReqresApiService>(ReqresApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  jest.mock('../config/configuration');

  describe('ReqresApiService', () => {
    let service: ReqresApiService;
    let httpService: HttpService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReqresApiService,
          {
            provide: HttpService,
            useValue: {
              get: jest.fn(),
            },
          },
        ],
      }).compile();

      service = module.get<ReqresApiService>(ReqresApiService);
      httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    describe('fetchDataFromApi', () => {
      it('should call HttpService.get with the correct URL and config', () => {
        const mockResponse: AxiosResponse<any> = {
          data: {},
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: {} as AxiosHeaders,
          },
        };

        const baseUrl = 'https://reqres.in/api';
        (
          configuration as jest.MockedFunction<typeof configuration>
        ).mockReturnValue({
          reqresApiUrl: baseUrl,
          mongoDbUrl: '',
          port: 31,
          rabbitMQExchange: '',
          rabbitMQRoutingKey: '',
          rabbitMQUrl: '',
        });
        const extendedPath = '/users';
        const config = { headers: { Authorization: 'Bearer token' } };
        // (configuration as jest.Mock).mockReturnValue({ reqresApiUrl: baseUrl });
        jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));

        service.fetchDataFromApi(extendedPath, config).subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

        const expectedUrl = baseUrl.concat(extendedPath);
        expect(httpService.get).toHaveBeenCalledWith(expectedUrl, config);
      });
    });
  });
});
