import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer'

export class CategoryDto {

  @IsNotEmpty() 
  name: string;

  @IsNotEmpty()
  description: string;

}
