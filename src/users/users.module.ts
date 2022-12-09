import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { Neo4jModule } from 'nest-neo4j/dist/neo4j.module';

@Module({
    imports: [
        Neo4jModule.forRoot({
            scheme: 'neo4j',
            host: 'localhost',
            port: 7687,
            username: 'neo4j',
            password: 'admin'
        })
    ],
    controllers: [
        UsersController,],
    providers: [UsersService],
    exports: [UsersService],
}) export class UsersModule { }
