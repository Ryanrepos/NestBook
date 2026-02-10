import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { ReviewModule } from './review/review.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BookModule,
    ReviewModule,
    LikeModule,
    ViewModule,
  ],
  exports: [
    AuthModule,
    UserModule,
    BookModule,
    ReviewModule,
    LikeModule,
    ViewModule,
  ],
})
export class ComponentsModule {}