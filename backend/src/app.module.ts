import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GpxModule } from './gpx/gpx.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://admin:admin@db/webc_mongo_db?authSource=admin", {
      retryAttempts: 5,
      retryDelay: 3000
    }),
    GpxModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
