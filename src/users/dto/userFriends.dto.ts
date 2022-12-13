import { IsNotEmpty } from 'class-validator';

export class UserFriendDto {
  @IsNotEmpty() 
  usernameSender: string;

  @IsNotEmpty() 
  usernameReciever: string;

}