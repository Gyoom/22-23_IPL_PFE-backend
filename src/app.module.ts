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

const dbPort = process.env.DBPORT;
const dbHost = process.env.DBHOST;
const dbUsername = process.env.DBUSERNAME;
const dbPassword = process.env.DBPASSWORD;

@Module({
  imports: [
    UsersModule,
    AuthModule,
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword
    })],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService],
})
export class AppModule {}
