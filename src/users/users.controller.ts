import { Body, Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}
    
    @Get('/')
    public async getAll(): Promise<any> {
        Logger.log("Request : /users/" );
        return await this.usersService.getAllUsers();
    }

    @Get(':username')
    public async getOne(@Param() param): Promise<any> {
        Logger.log("Requests : /users/" + param.username);
        return await this.usersService.findByUsername(param.username);
    }
    
}
