import { registerEnumType } from '@nestjs/graphql';

export enum Message {
  // General Messages
  SOMETHING_WENT_WRONG = 'Something went wrong!',
  NO_DATA_FOUND = 'No data found!',
  CREATE_FAILED = 'Create failed!',
  UPDATE_FAILED = 'Update failed!',
  REMOVE_FAILED = 'Remove failed!',
  UPLOAD_FAILED = 'Upload failed!',
  BAD_REQUEST = 'Bad Request!',

  // Authentication Messages
  USED_EMAIL_OR_USERNAME = 'Already used email or username!',
  NO_USER_FOUND = 'No user with that email or username!',
  BLOCKED_USER = 'You have been blocked!',
  WRONG_PASSWORD = 'Wrong password, please try again!',
  NOT_AUTHENTICATED = 'You are not authenticated, please login first!',
  TOKEN_NOT_EXIST = 'Bearer Token is not provided!',
  ONLY_SPECIFIC_ROLES_ALLOWED = 'Allowed only for users with specific roles!',
  NOT_ALLOWED_REQUEST = 'Not allowed request!',

  // Upload Messages
  PROVIDE_ALLOWED_FORMAT = 'Please provide jpg, jpeg, png or webp images!',

  // Book Messages
  BOOK_NOT_FOUND = 'Book not found!',
  BOOK_ALREADY_EXISTS = 'Book with this ISBN already exists!',

  // Review Messages
  REVIEW_NOT_FOUND = 'Review not found!',
  ALREADY_REVIEWED = 'You have already reviewed this book!',

  // Follow Messages
  SELF_SUBSCRIPTION_DENIED = 'Self subscription is denied!',
  ALREADY_FOLLOWED = 'You are already following this user!',
  NOT_FOLLOWED = 'You are not following this user!',
}

export enum Direction {
  ASC = 1,
  DESC = -1,
}

registerEnumType(Direction, {
  name: 'Direction',
  description: 'Sort direction',
});
