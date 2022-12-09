import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Neo4jService } from 'nest-neo4j';
import { toUserDto } from 'src/shared/mapper';

@Injectable()
export class UsersService {
    constructor(private readonly appService: UsersService,
        private readonly neo4jService: Neo4jService
    ) {}

    async findOne(options?: object): Promise<any>{
        const res = await this.neo4jService.read('MATCH (u:USER{name:$name}) RETURN u AS user', {name:'tom'});

        return res.records[0].get('user');
    }

    async create(options?: object){
        return null;
    }

    async findByLogin(options?: string){
        return null;
    }

    async findByPayload(options?: object){
        return null;
    }

}
