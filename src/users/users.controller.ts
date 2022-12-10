import { Body, Controller, Get, Inject, Logger, Param } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ){}
    
    @Get(':username')
    public async getOne(@Param() param): Promise<any> {
        Logger.log("Requests : /users/" + param.username);
        return await this.usersService.findByUsername(param.username);
    }
}
