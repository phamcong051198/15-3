import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();
@Injectable()
export class StoreService {
  private userName: string = 'along123';
  private passWord: string = 'along123';
  private messageIds: number[] = [];
  private locale: string = 'vi';
  private oddsFormat: string = 'HONGKONG';
  private timezone: string = 'GMT';
  private statusLogin: boolean = false;

  getBaseUrl(): string {
    if (
      !configService.get<string>('REDIS_HOST') ||
      configService.get<string>('REDIS_HOST') === 'localhost'
    )
      return '9419-183-91-7-244.ngrok-free.app';

    const baseUrl =
      configService.get<string>('REDIS_HOST') +
      ':' +
      configService.get<string>('REDIS_PORT');
    return baseUrl;
  }

  setStatusLogin() {
    this.statusLogin = !this.statusLogin;
  }
  getStatusLogin(): boolean {
    return this.statusLogin;
  }

  setTimezone(value: string): void {
    this.timezone = value;
  }
  getTimezone(): string {
    return this.timezone;
  }

  setOddsFormat(value: string): void {
    this.oddsFormat = value;
  }
  getOddsFormat(): string {
    return this.oddsFormat;
  }

  setUserName(value: string): void {
    this.userName = value;
  }
  getUserName(): string {
    return this.userName || 'OP1RDNW000';
  }

  setPassWord(value: any): void {
    this.passWord = value;
  }
  getPassWord(): string {
    return this.passWord || '456456qQ';
  }

  setMessageIds(value: any): void {
    this.messageIds = [...this.messageIds, value];
  }
  setMessageIdsAfter(value: any): void {
    this.messageIds = [...value];
  }
  deleteMessageIds(): void {
    this.messageIds = [];
  }
  getMessageIds(): number[] {
    return this.messageIds;
  }

  getLocale(): string {
    return this.locale;
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }
}
