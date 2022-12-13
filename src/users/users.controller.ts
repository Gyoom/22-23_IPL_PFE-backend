import { Body, Controller, Delete, Get, Inject, Logger, Param, Post, Put } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserFriendDto } from './dto/userFriends.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}
    
    @Get()
    public async getAll(): Promise<any> {
        Logger.log("Request : /users" );
        return await this.usersService.getAllUsers();
    }

    @Get(':username')
    public async getOneByName(@Param() param): Promise<any> {
        Logger.log("Requests : /users/" + param.username);
        return await this.usersService.findByUsername(param.username);
    }

    @Get('friends/:username')
    public async getAllFriends(@Param() param): Promise<any> {
        Logger.log("Requests : /users/friends" + param.username);
        return await this.usersService.getAllFriends(param.username);
    }

    @Post('/newfriends')
    public async putNewFriend(@Body() userFriendDto: UserFriendDto  ){
        Logger.log("request : /newfriend" + userFriendDto);
        return await this.usersService.createFriends(userFriendDto);
    }
    @Delete('/removeFriends')
    public async deleteFriend(@Body() userFriendDto: UserFriendDto  ){
        Logger.log("request : /removeFriends" + userFriendDto);
        return await this.usersService.deleteFriends(userFriendDto);
    }
}
