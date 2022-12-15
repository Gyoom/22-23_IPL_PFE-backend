import { IsNotEmpty, IsEmail } from 'class-validator';

export class UserDto {
  @IsNotEmpty() 
  id: string;

  @IsNotEmpty() 
  username: string;
  
  @IsNotEmpty() 
  name: string;

  @IsNotEmpty() 
  firstname: string;


  @IsNotEmpty() 
  @IsEmail()  
  email: string;

   @IsNotEmpty()
  password: string;

  createdOn?: Date;
}