import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../user/user.module';
import { TypeOrmConfig } from '../typeorm-config.testing';
import { AuthService } from './auth.service';
import { forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import constants from '../shared/security/constants';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { AuthModule } from './auth.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...TypeOrmConfig,
        forwardRef(() => UserModule),
        PassportModule,
        JwtModule.register({
          secret: constants.JWT_SECRET,
          signOptions: { expiresIn: constants.JWT_EXPIRES_IN },
        }),
      ],
      providers: [
        AuthService,
        UserService,
        JwtService,
        LocalStrategy,
        JwtStrategy,
        AuthModule,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
