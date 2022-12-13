import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Neo4jModule } from 'nest-neo4j'
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface';


const NEO4J_PORT = process.env.NEO4J_PORT;
const NEO4J_HOST = process.env.NEO4J_HOST;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

@Module({
  imports: [
    UsersModule,
    AuthModule,
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) : Neo4jConfig => ({
        scheme: "bolt+s",
        host: NEO4J_HOST,
        port: NEO4J_PORT,
        username: NEO4J_USERNAME,
        password: NEO4J_PASSWORD,
        database: '',
      })
    }),
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}