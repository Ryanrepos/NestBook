import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database/database.module';
import { ComponentsModule } from './components/components.module';

@Module({
  imports: [
    DatabaseModule,     
    ComponentsModule,   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}