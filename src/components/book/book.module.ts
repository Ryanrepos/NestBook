import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import BookSchema from 'src/schemas/Book.model';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import userSchema from 'src/schemas/User.model';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'Book', schema: BookSchema },
    { name: 'User', schema: userSchema }
  ]), 
    AuthModule, UserModule
],
  providers: [BookService, BookResolver],
  exports: [ BookService]
})
export class BookModule {}
