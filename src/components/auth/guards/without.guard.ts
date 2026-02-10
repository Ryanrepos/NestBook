import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class WithoutGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    console.info('--- @guard() Authentication [WithoutGuard] ---');

    if (context.contextType === 'graphql') {
      const request = context.getArgByIndex(2).req;
      const bearerToken = request.headers.authorization;

      if (bearerToken) {
        try {
          const token = bearerToken.split(' ')[1];
          const authUser = await this.authService.verifyToken(token);
          request.body.authUser = authUser;
        } catch (err) {
          request.body.authUser = null;
        }
      } else {
        request.body.authUser = null;
      }

      console.log('userNick[without] =>', request.body.authUser?.userNick ?? 'none');
      return true;
    }

    // description => http, rpc, grpc and etc are ignored
    return false;
  }
}