import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { UsersService } from '../users/users.service';
import { LoginStatus } from './interfaces/login-status.interface';

import { UserDto } from '../users/dto/user.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { isEmpty } from 'class-validator';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(userDto: UserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      // TODO Check if User already exists (username and email must be unique)
      const userByUsername = await this.usersService.findByUsername(userDto.username);
      // const userByEmail = await this.usersService.findByEmail(userDto.email);

      if (!isEmpty(userByUsername)){
        status = {
          success: false,
          message: 'The username already exists'
        }

        return status;
      }

      // if (!isEmpty(userByEmail)){
      //   status = {
      //     success: false,
      //     message: 'The email already exists'
      //   }
          // return status;
      // }
      
      // TODO Hash pwd
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userDto.password, salt);

      userDto.password = hash;

      await this.usersService.create(userDto);
      
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }

    return status;
  }

  async login(loginUserDto: UserDto): Promise<LoginStatus> {
    // find user in db
    //TODO Find by email
    const user = await this.usersService.findByUsername(loginUserDto.username);

    //TODO Check if pwd are the same

    // generate and sign token
    //TODO Use only email in the token
    const token = this._createToken(user);

    //TODO Return all the user except the pwd
    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }: UserDto): any {
    const expiresIn = process.env.EXPIRESIN;

    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
