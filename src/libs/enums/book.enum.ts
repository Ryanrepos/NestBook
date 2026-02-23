import { registerEnumType } from '@nestjs/graphql';

export enum BookStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  DELETE = 'DELETE',
}

registerEnumType(BookStatus, {
  name: 'BookStatus',
  description: 'Book status',
});