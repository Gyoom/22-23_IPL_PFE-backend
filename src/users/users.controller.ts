import { Body, Controller, Delete, Get, Inject, Logger, Param, Post, Put } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserFriendDto } from './dto/userFriends.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ){}
    
    //get all users
    @Get()
    public async getAll(): Promise<any> {
        Logger.log("Request : /users" );
        return await this.usersService.getAllUsers();
    }

    //get a user by his username
    @Get(':username')
    public async getOneByName(@Param() param): Promise<any> {
        Logger.log("Requests : /users/" + param.username);
        return await this.usersService.findByUsername(param.username);
    }


    //get a user by his email
    @Get('mail/:mail')
    public async getOneByMail(@Param() param): Promise<any> {
        Logger.log("Requests : /users/" + param.mail);
        return await this.usersService.findBymail(param.mail);
    }

    //get all friend of a user
    @Get('friends/:username')
    public async getAllFriends(@Param() param): Promise<any> {
        Logger.log("Requests : /users/friends" + param.username);
        return await this.usersService.getAllFriends(param.username);
    }

    //get all the users that arent the friend
    @Get('nonfriends/:username')
    public async getAllNonFriends(@Param() param): Promise<any> {
        Logger.log("Requests : /users/nonfriends" + param.username);
        return await this.usersService.getAllNonFriends(param.username);
    }

    //create a friend
    @Post('/newfriends')
    public async putNewFriend(@Body() userFriendDto: UserFriendDto  ){
        Logger.log("request : /newfriend" + userFriendDto);
        return await this.usersService.createFriends(userFriendDto);
    }

    //delte a friend
    @Delete('/removeFriends')
    public async deleteFriend(@Body() userFriendDto: UserFriendDto  ){
        Logger.log("request : /removeFriends" + userFriendDto);
        return await this.usersService.deleteFriends(userFriendDto);
    }

    //update a user
    @Put('/update')
    public async updateUser(@Body() UserDto: UserDto  ){
        Logger.log("request : /removeFriends" + UserDto);
        return await this.usersService.updateUser(UserDto);
    }
}
