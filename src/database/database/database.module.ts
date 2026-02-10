import { Module } from '@nestjs/common';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('NODE_ENV') === 'production'
            ? configService.get<string>('MONGO_PROD')
            : configService.get<string>('MONGO_DEV'),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {
  constructor(@InjectConnection() private readonly connection: Connection) {
    if (connection.readyState === 1) {
      console.log(
        `✅ MongoDB is connected to ${process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT'} database`,
      );
    } else {
      console.log('❌ MongoDB is NOT connected!');
    }
  }
}