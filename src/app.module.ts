import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';
import { AuthModule } from './auth/auth.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
<<<<<<< HEAD
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService, ],
      useFactory: (configService: ConfigService) : Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE'),
      })
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,],
=======
    
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: dbHost,
      port: dbPort,
      username: dbUsername,
      password: dbPassword,
      
    })],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService],
>>>>>>> 1ee38ef2edef9ac4817d7534c0881546e4be01e2
})
export class AppModule {}
