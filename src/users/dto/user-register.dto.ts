import { IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUserDto {  
    @IsNotEmpty()  username: string;
    @IsNotEmpty()  password: string;
    @IsNotEmpty()  @IsEmail()  email: string;
}