import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { MongoDbModule } from './mongo-db/mongo-db.module';
import { HttpModule } from './http/http.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [MongoDbModule, HttpModule],
})
export class SharedModule {}
