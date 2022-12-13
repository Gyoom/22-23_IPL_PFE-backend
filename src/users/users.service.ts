import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Neo4jService } from '../neo4j/neo4j.service';
import { UserFriendDto } from './dto/userFriends.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly neo4jService: Neo4jService
    ) {}

    async getAllUsers(): Promise<any> {
        const res = await this.neo4jService.read('MATCH(n:USER) RETURN n AS user');
        return res.records;
    }

   async getAllFriends(username: string): Promise<any>{
    const res = await this.neo4jService.read('MATCH(n:USER)-[:EST_AMIS]->(n2:USER{username:$name}) RETURN DISTINCT n.username AS username',{name: username });
    
    return res.records;
    }

    async createFriends(userFriendDto: UserFriendDto ): Promise<any>{
        const res = await this.neo4jService.write('MATCH(u1:USER{username:$name1}), (u2:USER{username:$name2}) CREATE (u1)-[:EST_AMIS]->(u2), (u2)-[:EST_AMIS]->(u1)',{name1: userFriendDto.usernameReciever, name2: userFriendDto.usernameSender})
        return
    }

    async create(user: UserDto){
        // on ne peut pas créer 2 users avec le meme nom
        const res = await this.neo4jService.write('CREATE (user:USER{name: $name, age: $age, mail: $mail, mdp: $mdp})', {name: user.username, age: '22', mail: user.email, mdp: user.password})

        return res;
    }

    async findByUsername(username: string){
        const res = await this.neo4jService.read('MATCH (u:USER{username:$name}) RETURN u AS user', {name: username });
        return res.records[0].get('user');
    }

    async findByPayload(options?: object){
        return null;
    }

        /*
    async getOneByID(id: string){
       
        const res = await this.neo4jService.read('MATCH(n:USER) WHERE ID(n) = $ID RETURN n AS user', {ID: id});
        return res.records[0].get('user');
    }
    */
  


}
