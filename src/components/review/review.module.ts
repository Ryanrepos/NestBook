import { Module } from '@nestjs/common';
import { ReviewResolver } from './review.resolver';

@Module({
  providers: [ReviewResolver]
})
export class ReviewModule {}
