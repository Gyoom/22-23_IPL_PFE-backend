import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer'

export class EventDto {
  @IsNotEmpty() 
  id: string;

  @IsNotEmpty() 
  name: string;

  @IsNotEmpty()  
  @Type( () => Date)
  starting_date: Date;

  @IsNotEmpty()  
  @Type( () => Date)
  ending_date: Date;

  @IsNotEmpty()  
  @Type( () => Date)
  creation_date: Date;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  statut: string;

  @IsNotEmpty()
  category: string;

}
