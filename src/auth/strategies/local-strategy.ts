import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Console, debug } from 'console';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    console.info('User login request ' + username+ "/" + password);
    if (!user) {
      console.info('User login failed ' );
      throw new UnauthorizedException();
    }
    console.info('User loggedin ' );
    return user;
  }
}
