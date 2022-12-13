import { Body, Controller, Get, Inject, Logger, Param, Post } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { EventDtoWithUsername } from './dto/eventWithUsername.dto';
import { EventsService } from './events.service';


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService){}
    
    @Get(':id')
    public async getOne(@Param() param): Promise<Event> {
        Logger.log("Request : /event/" + param.id);
        return await this.eventsService.findById(param.id);
    }

    @Get('/')
    public async getAll(): Promise<any> {
        Logger.log("Request : /events/" );
        return await this.eventsService.findAll();
    }

    @Post('create')
    public async createEvent(@Body() eventDtoWithUsername: EventDtoWithUsername): Promise <Event> {
        Logger.log("Request : /event/create" + eventDtoWithUsername);

        return await this.eventsService.createEvent(eventDtoWithUsername);
    }

}


