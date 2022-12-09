import { Body, Controller, Get } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}
    
    @Get()
    public async getOne(@Body() username: String): Promise<UserDto> {
        return await this.usersService.findOne(username);
    }
}
