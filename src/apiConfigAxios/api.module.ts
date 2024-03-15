import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import axios from 'axios';
import { SharedModule } from 'src/shared/shared.module';
import { StoreService } from 'src/store/store.service';
import { generateBasicAuthHeader } from 'src/utils/generateBasicAuthHeader';

@Module({
  imports: [HttpModule, SharedModule],
  providers: [
    {
      provide: 'P88_INSTANCE',
      useFactory: (storeService: StoreService) => {
        const axiosInstance = axios.create({
          baseURL: process.env?.P88_SERVICE_BASE_URL,
          timeout: 30000,
        });

        axiosInstance.interceptors.request.use(
          (config) => {
            const userName = storeService.getUserName();
            const passWord = storeService.getPassWord();
            if (userName && passWord) {
              const authHeader = generateBasicAuthHeader(userName, passWord);
              config.headers['Authorization'] = authHeader;
            }
            return config;
          },
          (error) => Promise.reject(error),
        );

        return axiosInstance;
      },
      inject: [StoreService],
    },
    {
      provide: 'TELEGRAM_INSTANCE',
      useFactory: () => {
        const axiosInstance = axios.create({
          baseURL: `https://api.telegram.org/bot${process.env?.TELEGRAM_BOT_TOKEN}`,
          timeout: 30000,
        });

        return axiosInstance;
      },
    },
    {
      provide: 'AI_INSTANCE',
      useFactory: () => {
        const axiosInstance = axios.create({
          baseURL: process.env?.AI_SERVICE_BASE_URL,
          timeout: 120000,
        });

        return axiosInstance;
      },
    },
  ],
  exports: ['P88_INSTANCE', 'TELEGRAM_INSTANCE', 'AI_INSTANCE'],
})
export class ApiModule {}
