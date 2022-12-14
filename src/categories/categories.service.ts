import { Injectable, Logger, Param } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class CategoriesService {
    constructor(
        private readonly neo4jService: Neo4jService
    ) {}
    
    async findByName(@Param('name') nameFromParam: string){        
        
        const res = await this.neo4jService.read('MATCH (u:CATEGORY {name: $name}) RETURN u AS category',
        {name: nameFromParam});
        Logger.log("record" + res);
        return res.records[0].get('category');
    }

    async findAll(){

        const res = await this.neo4jService.read('MATCH (u:CATEGORY) RETURN u');
        Logger.log("record" + res.records);
        return res.records;
    }

    async createCategory(categoryDto: CategoryDto){

        //Check category already existing
        const check1 = await this.neo4jService.read('MATCH (u:CATEGORY {name: $name}) RETURN u AS category',
        {name: categoryDto.name});

        if(check1.records.length){
            Logger.log("check 1 failed, category already exists");
            return undefined;

        }

        const res = await this.neo4jService.write('CREATE (u:CATEGORY{name: $name, description: $description}) RETURN u AS category',
        {name: categoryDto.name, description: categoryDto.description});
        return res.records[0].get('category');
    }

    
}



