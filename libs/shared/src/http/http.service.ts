import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  Axios,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  constructor(private readonly configService: ConfigService) {}
  instance(config?: AxiosRequestConfig): Axios {
    const axiosInstance = axios.create(
      [config, { timeout: 5000 }].find(Boolean),
    );
    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        this.logger.log(
          `Outgoing request - ${
            config.data.requestUuid
          } : ${config.method?.toUpperCase()} ${config.url} 
          - Request data: ${JSON.stringify(config.data)} 
          - Request header: ${JSON.stringify({ ...config.headers })}`,
        );
        return config;
      },
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.log(
          `Response of reques : ${response.config.method?.toUpperCase()} ${
            response.config.url
          } - Response data: ${JSON.stringify(response.data)}`,
        );
        return response;
      },
      (error) => {
        this.logger.error(
          `Error response: ${JSON.stringify(error.response?.data)}`,
          { stack: error },
        );
        return Promise.reject(error);
      },
    );

    return axiosInstance;
  }
}
