// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';
// import * as dotenv from 'dotenv';
// dotenv.config();

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const authHeader = request.headers.authorization;

//     if (!authHeader) {
//       throw new UnauthorizedException('Authorization header is missing');
//     }

//     const [type, token] = authHeader.split(' ');

//     if (type !== 'Bearer' || !token) {
//       throw new UnauthorizedException('Invalid authorization format');
//     }

//     try {
//       const payload = await this.jwtService.verify(token, {
//         secret: process.env.JWT_SECRET,
//       });

//       const { iat, exp, ...userData } = payload;
//       request['user'] = userData;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid token or token expired');
//     }

//     return true;
//   }
// }

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { decrypt } from 'src/common/crypto';
dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const decryptedToken = decrypt(token);
      const payload = await this.jwtService.verify(decryptedToken, {
        secret: process.env.JWT_SECRET,
      });

      const { iat, exp, ...userData } = payload;
      request['user'] = userData;
      request['payload'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or token expired');
    }

    return true;
  }
}

