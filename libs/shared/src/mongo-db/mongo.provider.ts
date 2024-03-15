import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'MONGODB_CONNECTION',
    inject: [ConfigService],
    useFactory: async function (
      configService: ConfigService,
    ): Promise<typeof mongoose> {
      const dbUrl: string = configService.get<string>('database.url');
      const dbName: string = configService.get<string>('database.name');
      const dbUser: string = configService.get<string>('database.user');
      const dbPass: string = configService.get<string>('database.password');

      if (dbUser && dbPass) {
        return await mongoose.connect(
          `mongodb+srv://${dbUser}:${dbPass}@${dbUrl}/${dbName}?retryWrites=true&w=majority`,
        );
      } else {
        return await mongoose.connect(`mongodb://${dbUrl}/${dbName}`);
      }
    },
  },
];
