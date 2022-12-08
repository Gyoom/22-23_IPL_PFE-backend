import { Module } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [],
    providers: [UsersService],
    exports: [UsersService],
}) export class UsersModule {}
