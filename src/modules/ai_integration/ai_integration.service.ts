import { Inject, Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { TimeoutError } from 'rxjs';

@Injectable()
export class AiIntegrationService {
  constructor(
    @Inject('AI_INSTANCE')
    private readonly apiAI: AxiosInstance,
  ) {}

  async postMessageAi(message: string) {
    try {
      const resAI = await this.apiAI.post('/', {
        message,
      });
      return resAI.data.reply;
    } catch (error) {
      if (error instanceof TimeoutError) {
        return 'Server quá tải thử lại sau !';
      } else {
        return 'Server quá tải thử lại sau !';
      }
    }
  }
}
