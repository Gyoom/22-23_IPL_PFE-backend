import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Neo4jService } from 'nest-neo4j';
import { toUserDto } from 'src/shared/mapper';

@Injectable()
export class UsersService {
    constructor(
        private readonly neo4jService: Neo4jService
    ) {}

    async findOne(options?: object): Promise<any>{
        const res = await this.neo4jService.read('MATCH (u:USER{name:$name}) RETURN u AS user', {name:'tom'});

        return res.records[0].get('user');
    }

    async create(options?: object){
        return null;
    }

    async findByUsername(username: string){
        const res = await this.neo4jService.read('MATCH (u:USER{name:$name}) RETURN u AS user', {name: { username }});
        Logger.log(res)
        return res.records[0].get('user');
    }

    async findByPayload(options?: object){
        return null;
    }

}
