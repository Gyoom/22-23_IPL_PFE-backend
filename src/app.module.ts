import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Neo4jConfig, Neo4jModule } from 'nest-neo4j'
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UsersController } from './users/users.controller';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jScheme } from 'nest-neo4j';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';
import { InvitesController } from './invites/invites.controller';
import { InvitesService } from './invites/invites.service';
import { InvitesModule } from './invites/invites.module';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { CategoriesModule } from './categories/categories.module';


@Module({
  imports: [
    UsersModule,
    AuthModule,
    EventsModule,
    InvitesModule,
    CategoriesModule,
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) : Neo4jConfig => ({
        scheme: configService.get<Neo4jScheme>('NEO4J_SCHEME'),
        host: configService.get<string>('NEO4J_HOST'),
        port: configService.get<string>('NEO4J_PORT'),
        username: configService.get<string>('NEO4J_USERNAME'),
        password: configService.get<string>('NEO4J_PASSWORD'),
        database: '',
      })
    }),
  ],
  controllers: [AppController, AuthController, UsersController, EventsController, InvitesController, CategoriesController],
  providers: [AppService, AuthService, UsersService, EventsService, InvitesService, CategoriesService],
})
export class AppModule {}