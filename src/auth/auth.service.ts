// // src/auth/auth.service.ts

// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { Response } from 'express';

// @Injectable()
// export class AuthService {
//   constructor(
//     @InjectRepository(User) private readonly userRepository: Repository<User>,
//     private jwtService: JwtService,
//   ) {}

//   async create(createAuthDto: CreateAuthDto) {
//     const existingUser = await this.userRepository.findOne({
//       where: [
//         { username: createAuthDto.username }
//       ],
//     });

//     if (existingUser) {
//       throw new ConflictException('Username  already exists❌');
//     }

//     const user = this.userRepository.create();
//     user.username = createAuthDto.username;
//     user.password = await bcrypt.hash(createAuthDto.password, 10);

//     await this.userRepository.save(user);
//     return 'You are registered✅';
//   }

//   async login(loginDto: { username: string; password: string }, res: Response) {
//     const user = await this.userRepository.findOneBy({
//       username: loginDto.username,
//     });
//     if (!user) {
//       throw new NotFoundException('User Not Found ⚠️');
//     }
//     const checkPass = await bcrypt.compare(loginDto.password, user.password);
//     if (!checkPass) {
//       throw new NotFoundException('Password Error ⚠️');
//     }

//     const payload = { id: user.id, username: user.username, role: user.role };
//     const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
//     const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

//     res.cookie('refresh_token', refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     const { password, ...userData } = user;
//     return res.json({ userData, access_token: accessToken });
//   }

//   logout(): { message: string } {
//     return { message: 'Logout successfully✅' };
//   }

//   async getAllMyData(payload: any) {
//     const user = await this.userRepository.findOneBy({ id: payload.id });
//     return user;
//   }
// }

// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { User } from 'src/users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { encrypt } from 'src/common/crypto';          // 🔐 AES helper

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  /* ---------------------- Registration ---------------------- */
  async create(dto: CreateAuthDto) {
    const exists = await this.userRepo.findOne({ where: { username: dto.username } });
    if (exists) throw new ConflictException('Username already exists❌');

    const user = this.userRepo.create({
      username: dto.username,
      password: await bcrypt.hash(dto.password, 10),
    });

    await this.userRepo.save(user);
    return 'You are registered✅';
  }

  /* ------------------------- Login -------------------------- */
  async login(
    dto: { username: string; password: string },
    res: Response,
  ) {
    /* 1️⃣  User check */
    const user = await this.userRepo.findOneBy({ username: dto.username });
    if (!user) throw new NotFoundException('User Not Found ⚠️');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new NotFoundException('Password Error ⚠️');

    /* 2️⃣  JWT create */
    const payload = { id: user.id, username: user.username, role: user.role };

    const access  = this.jwt.sign(payload, { expiresIn: '1d' });
    const refresh = this.jwt.sign(payload, { expiresIn: '7d' });

    /* 3️⃣  AES encrypt */
    const accessEnc  = encrypt(access);
    const refreshEnc = encrypt(refresh);

    /* 4️⃣  Set secure cookie */
    res.cookie('refresh_token', refreshEnc, {
      httpOnly: true,
      secure  : process.env.NODE_ENV === 'production',
      maxAge  : 7 * 24 * 60 * 60 * 1000,
    });

    /* 5️⃣  Return data */
    const { password, ...userSafe } = user;
    return res.json({ userData: userSafe, access_token: accessEnc });
  }

  /* ------------------------- Logout ------------------------- */
  logout(): { message: string } {
    return { message: 'Logout successfully✅' };
  }

  /* ------------- Current user (payload-dan) ----------------- */
  async getAllMyData(payload: { id: number }) {
    return this.userRepo.findOneBy({ id: payload.id });
  }
}
