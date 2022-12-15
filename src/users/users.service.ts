import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { Neo4jService } from 'nest-neo4j/dist';
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
        const res = await this.neo4jService.read('MATCH(n:USER)-[:IS_FRIEND]->(n2:USER{username:$name}) RETURN DISTINCT n.username AS username, n.nom AS name, n.prenom AS firstname',{name: username });
    
        return res.records;
    }

    async getAllNonFriends(username: string): Promise<any>{
        const res = await this.neo4jService.read('MATCH(n2:USER{username:$name}), (n:USER) WHERE NOT (n)-[:IS_FRIEND]->(n2) AND n2 <> n  RETURN DISTINCT n.username AS username, n.nom AS name, n.prenom AS firstname',{name: username });
        
        return res.records;
    }

    async getAllOrganized(@Param('username') username: string): Promise<any>{
        const res = await this.neo4jService.read('MATCH (b:USER {username: $username})<-[:ORGANIZED_BY]-(a:EVENT)  RETURN a',
        {username: username});
        return res.records;
    }


    async createFriends(userFriendDto: UserFriendDto ): Promise<any>{
        const verif = await this.neo4jService.write( 'MATCH  (u1:USER{username:$name1}), (u2:USER{username:$name2}) RETURN EXISTS( (u1)-[:IS_FRIEND]->(u2) ) AS isFriend',{name1: userFriendDto.usernameReciever, name2: userFriendDto.usernameSender});
        if(verif.records[0].get('isFriend')){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'users are alredy friends',
              }, HttpStatus.BAD_REQUEST, {
              });
        }
        const res = await this.neo4jService.write('MATCH(u1:USER{username:$name1}), (u2:USER{username:$name2}) CREATE (u1)-[:IS_FRIEND]->(u2), (u2)-[:IS_FRIEND]->(u1)',
        { name1: userFriendDto.usernameReciever, name2: userFriendDto.usernameSender });
        return;
    }

    async deleteFriends(userFriendDto: UserFriendDto ): Promise<any>{
         await this.neo4jService.write('MATCH(u1:USER{username:$name1})-[r1:IS_FRIEND]->(u2:USER{username:$name2})  DELETE r1',
         { name1: userFriendDto.usernameReciever, name2: userFriendDto.usernameSender });
         await this.neo4jService.write('MATCH(u1:USER{username:$name1})-[r1:IS_FRIEND]->(u2:USER{username:$name2})  DELETE r1',
         { name1: userFriendDto.usernameSender, name2: userFriendDto.usernameReciever });
        return;
    }

    async create(user: UserDto){
        
        const res = await this.neo4jService.write('CREATE (user:USER{username: $username, mail: $mail, mdp: $mdp, nom:$nom, prenom:$prenom})', 
        { username: user.username, mail: user.email, mdp: user.password, nom: user.name, prenom: user.firstname })

        return res;
    }

    async findByUsername(username: string){
        const res = await this.neo4jService.read('MATCH (u:USER{username:$name}) RETURN u AS user', 
        { name: username });
        try{
            res.records[0].get('user');
        }catch(error){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'user with this email  does not exist',
              }, HttpStatus.BAD_REQUEST, {
                cause: error
              });
        }
        return res.records[0].get('user').properties;
    } 

    async findBymail(mail: string){
        const res = await this.neo4jService.read('MATCH (u:USER{mail:$mail}) RETURN u AS user', 
        { mail: mail });
        try{
            res.records[0].get('user');
        }catch(error){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'user with this email does not exist',
              }, HttpStatus.BAD_REQUEST, {
                cause: error
              });
        }
        return res.records[0].get('user');
    }

    async updateUser(userDTO: UserDto ): Promise<any>{
        const res = await this.neo4jService.write('MATCH (u:USER{mail:$mail}) SET u.username=$username, u.mdp =$mdp RETURN u AS user', 
        { mail: userDTO.email,username: userDTO.username, mdp: userDTO.password });
        try{
            res.records[0].get('user');
        }catch(error){
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: 'user with this email does not exist',
              }, HttpStatus.BAD_REQUEST, {
                cause: error
              });
        }
        return res.records[0].get('user');
    }

    async findByPayload(options?: object){
        return null;
    }



}
