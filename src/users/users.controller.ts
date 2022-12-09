import { Body, Controller, Get, Inject, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ){}
    
    @Get()
    public async getOne(@Body() username: string): Promise<any> {
        Logger.log(username);
        return await this.usersService.findByUsername(username);
    }
}
