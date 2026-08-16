import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GpxModule } from './gpx/gpx.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/webc_mongo_db"),
    GpxModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
