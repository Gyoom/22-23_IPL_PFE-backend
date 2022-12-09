/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { UserDto } from './dto/user.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService,
        // ici on injecte le service neo4j
        private readonly neo4jService: Neo4jService 
        ) {}

        @Get()
        async getAllUsers(): Promise<any> {
          // read --> permet de faire une requete
          // le mieux est de retourner des champs spécifiques et d'untiliser AS --> plus simple
          const res = await this.neo4jService.read(
          `MATCH (n:USER)
          RETURN ID(n) AS idUser , n.name AS name`
          )
          
          var strReponse = ` liste de tout les users : \n `
          res.records.forEach(i => strReponse = strReponse + `id : ${i.get('idUser')}, nom :  ${i.get('name')}  \n` )
            
          return strReponse
        }

        @Get(':id')
        async getUserById( @Param() param): Promise<any> {
          const res = await this.neo4jService.read(
          `MATCH (n:USER)
          WHERE ID(n) = ${param.id}
          RETURN ID(n) AS idUser , n.name AS name`
          )
          
          var strReponse = ` user avec l'id : ${param.id} \n `
          res.records.forEach(i => strReponse = strReponse + `id : ${i.get('idUser')}, nom :  ${i.get('name')}  \n` )
            
          return strReponse
        }

        @Get('friendsOf/:id')
        async getAllAmis( @Param() param): Promise<any> {
          const res = await this.neo4jService.read(
            `MATCH (n:USER)-[:EST_AMIS]->(n2:USER)
            WHERE ID(n2) = ${param.id}
            RETURN ID(n) AS idUser , n.name AS name`
          )
          
          var strReponse = ` amis de l'user num : ${param.id} \n `
          res.records.forEach(i => strReponse = strReponse + `id : ${i.get('idUser')}, nom :  ${i.get('name')}  \n` )
            
          return strReponse
        }

        @Post()
        async creerUser( @Body() userdto: UserDto ): Promise<any> {
          const res = await this.neo4jService.write(
            `CREATE (n:USER{name:'${userdto.username}', mail:'${userdto.email}'})
            RETURN ID(n) AS idUser , n.name AS name`
          )
          
          var strReponse = ` creation de l'user reussie \n `
          res.records.forEach(i => strReponse = strReponse + `id : ${i.get('idUser')}, nom :  ${i.get('name')}  \n` )
            
          return strReponse
        }

 }
