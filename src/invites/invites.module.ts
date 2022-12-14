import { Module } from '@nestjs/common';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

@Module({
    imports: [],
    controllers: [InvitesController],
    providers: [InvitesService],
    exports: [InvitesService],
}) 

export class InvitesModule {}
