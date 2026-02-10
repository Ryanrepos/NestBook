import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import UserSchema from '../../schemas/User.model';

@Module({
  imports: [
    // User model (AuthService ichida kerak bo'ladi)
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    
    // JWT configuration
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService],
  /*
  Auth service ni AuthModule dan tashqarida ishlatish uchun export qilyabmiz.
  User service'da va boshqa joylarda AuthService kerak bo'ladi.
  */
  exports: [AuthService],
})
export class AuthModule {}