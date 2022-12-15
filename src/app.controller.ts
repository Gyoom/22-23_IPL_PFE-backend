import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Neo4jService } from 'nest-neo4j/dist';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly neo4jService: Neo4jService,
    ) {}

  @Get()
  async getHello(): Promise<any> {
    const res = await this.appService.getHello()
    return res    

   }

}