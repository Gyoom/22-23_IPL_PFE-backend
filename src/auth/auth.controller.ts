import {
  Controller,
  Body,
  Post,
  HttpException,
  HttpStatus,
  UsePipes,
  Get,
  Req,
  UseGuards,
  Logger,
} from '@nestjs/common';

import { RegistrationStatus } from './interfaces/regisration-status.interface';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { UserDto } from '../users/dto/user.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //register a user
  @Post('register')
  public async register(
    @Body() createUserDto: UserDto,
  ): Promise<RegistrationStatus> {
    Logger.log("Request : /auth/register");

    const result: RegistrationStatus = await this.authService.register(
      createUserDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  //login a user
  @Post('login')
  public async login(@Body() loginUserDto: UserDto): Promise<LoginStatus> {
    Logger.log("Request : /auth/login");
    return await this.authService.login(loginUserDto);
  }

}
