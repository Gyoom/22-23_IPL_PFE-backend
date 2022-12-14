import { Body, Controller, Get, Inject, Logger, Param, Post, Delete, Put } from '@nestjs/common';
import { UpdateDateColumn } from 'typeorm';
import { InvitDto } from './dto/invites.dto';
import { InvitesService } from './invites.service';


@Controller('invites')
export class InvitesController {
    constructor(private readonly invitesService: InvitesService){}    

    //invit a friend
    //TO DO
    //check invited is not the organizer
    @Post('/invit')
    public async inviter(@Body() invitDto: InvitDto) {
        Logger.log("Request : /invites/inviter" + invitDto);
        return await this.invitesService.inviter(invitDto);

    }

    //accept an invitation
    @Put('/accept')
    public async accepter(@Body() invitDto: InvitDto) {
        Logger.log("Request : /invites/accepter" + invitDto);
        return await this.invitesService.accepter(invitDto);

    }

    //refuse an invitation
    @Put('/refuse')
    public async refuser(@Body() invitDto: InvitDto) {
        Logger.log("Request : /invites/refuser" + invitDto);
        return await this.invitesService.refuser(invitDto);

    }
   
    //get all invitations for an user
    @Get('/:username')
    public async getAllInvitedTo(@Param () param) {
        Logger.log("Request : /invites/" + param.username);
        return await this.invitesService.getAllInvitedTo(param.username);

    }

    
}


