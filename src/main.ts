import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as i18n from 'i18n-express';
import * as hbs from 'hbs';

const configService: ConfigService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const localesDirectory = join(__dirname, '..', 'public/dist/js/i18n');

  app.use(
    i18n({
      translationsPath: localesDirectory,
      siteLangs: ['en', 'vi'],
      textsVarName: 'translate',
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerHelper('addOne', (index: any) => {
    return index + 1;
  });

  const port = configService.get<number>('REDIS_PORT') || 3000;
  const host = configService.get<string>('REDIS_HOST') || 'localhost';
  await app.listen(port, host);
}
bootstrap();
