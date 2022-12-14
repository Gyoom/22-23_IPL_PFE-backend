import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer'

export class InvitDto {

  @IsNotEmpty()
  usernameInviting: string;

  @IsNotEmpty() 
  usernameInvited: string;

  @IsNotEmpty()
  idEvent: string;

  @IsNotEmpty()  
  @Type( () => Date)
  creationDate: Date;

  @IsNotEmpty()
  response: string;
  //response = waiting/yes/no

}

