import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException } from 'nestjs-telegraf';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private storeService: StoreService) {}

  canActivate(context: ExecutionContext): boolean {
    const statusLogin = this.storeService.getStatusLogin();

    if (!statusLogin) {
      throw new TelegrafException('Login to continue !');
    }

    return true;
  }
}
