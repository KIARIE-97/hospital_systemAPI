import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as Bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService, // Assuming ConfigService is imported and configured
  ) {}
  private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return Bcrypt.hash(data, salt);
  }
  //a method to help generate access and refresh tokens for the users
  private async getTokens(user_id: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user_id,
          email: email,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user_id,
          email: email,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_SECRET',
          ),
          expiresIn: this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
          ),
        },
      ),
    ]);
    return { accessToken: at, refreshToken: rt };
  }

  //helper method for saving refresh token in the database
  private async saveRefreshToken(user_id: number, refreshToken: string) {
    //hash the refresh token
    const hashedRefreshToken = await this.hashData(refreshToken);

    //save the hashed refresh token in the datadase
    await this.userRepository.update(user_id, {
      hashedRefreshToken: hashedRefreshToken,
    });
    return hashedRefreshToken;
  }

  async signIn(createAuthDto: CreateAuthDto) {
    const founduser = await this.userRepository.findOne({
      where: { email: createAuthDto.email },
      select: ['id', 'email', 'password'],
    });
    if (!founduser) {
      throw new Error(`User with email ${createAuthDto.email} not found`);
    }
    // compare hashed password with the one in the database
    console.log('found user',founduser.password);
    console.log('passed',createAuthDto.password);
    const foundpassword = await Bcrypt.compare(
      createAuthDto.password,
      founduser.password,
    );
    if (!foundpassword) {
      throw new NotFoundException(
        `wrong credentials for user with email ${createAuthDto.email}`,
      );
    }
    // if the user is found and the password matches
    const { accessToken, refreshToken } = await this.getTokens(
      founduser.id,
      founduser.email,
    );

    // save the refresh token in the database
    console.log('refresh token', refreshToken);

    await this.saveRefreshToken(founduser.id, refreshToken);

    return { founduser, accessToken, refreshToken };
  }

  async signOut(user_id: number) {
    console.log('SignOut service hit with id:', user_id);
    // const founduser = await this.userRepository.findOne({
    //   where: { id: user_id },
    //   select: ['id', 'email', 'hashedRefreshToken'],
    // });
    // console.log('Found user:', founduser);
    // if (!founduser) {
    //   throw new NotFoundException(`user wth id ${user_id}not found`);
    // }
    const result = await this.userRepository.update(user_id, {
      hashedRefreshToken: null,
    });

    if (result.affected === 0) {
      throw new Error('Signout failed — no user was updated');
    }

    return { message: `User with id: ${user_id} signed out successfully ✔️` };
  }
  async refreshTokens(id: number, refreshToken: string) {
    const founduser = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'hashedRefreshToken'],
    });
    if (!founduser) {
      throw new NotFoundException(`user wth id ${id}not found`);
    }
    //check if user has refresh token
    if (!founduser.hashedRefreshToken) {
      throw new NotFoundException(`user wth id ${id} has no refresh token`);
    }
    //check if refresh token is valid
    const isRefreshTokenValid = await Bcrypt.compare(
      refreshToken,
      founduser.hashedRefreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new NotFoundException(`invalid refresh token with id ${id}`);
    }
    //generate new access tand refresh token
    const { accessToken, refreshToken: newrefreshToken } = await this.getTokens(
      founduser.id,
      founduser.email,
    );
    //update the store refresh token
    await this.saveRefreshToken(founduser.id, newrefreshToken);
    //return the new tokens
    return { accessToken, refreshToken: newrefreshToken };
  }
}
