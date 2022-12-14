import { Body, Controller, Get, Inject, Logger, Param, Post, Delete, Put } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { EventDtoWithUsername } from './dto/eventWithUsername.dto';
import { EventsService } from './events.service';


@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService){}
    

    //get one event if public or invited
    @Get(':id')
    public async getOne(@Param() param): Promise<Event> {
        Logger.log("Request : /event/" + param.id);
        return await this.eventsService.findById(param.id);
    }

    //get all event if public or invited
    @Get('/')
    public async getAll(): Promise<any> {
        Logger.log("Request : /events/" );
        return await this.eventsService.findAll();
    }


    //create event
    @Post('create')
    public async createEvent(@Body() eventDtoWithUsername: EventDtoWithUsername): Promise <Event> {
        Logger.log("Request : /events/create" + eventDtoWithUsername);

        return await this.eventsService.createEvent(eventDtoWithUsername);
    }


    //delete event
    @Delete('/delete')
    public async deleteEvent(@Body() eventDto : EventDto) {
        Logger.log("Request delete : / " + eventDto);
        return await this.eventsService.deleteEvent(eventDto);
    }


    //update event
    @Put('/:id/update')
    public async updateEvent(@Body() eventDto : EventDto, @Param() param) {
        eventDto.id = param.id
        Logger.log("Request : /events/update" + eventDto);
        return await this.eventsService.updateEvent(eventDto);
    }


    //participate to a public or invited private event
    @Put('/:id/participate')
    public async participate(@Body() eventDtoWithUsername: EventDtoWithUsername, @Param() param) {
        eventDtoWithUsername.id = param.id
        Logger.log("Request : /events/"+param.id+"/participate");
        return await this.eventsService.participate(eventDtoWithUsername);
    }

    //get all events where user is participating
    @Get('/register/:username')
    public async getAllEventParticipating(@Param () param){
        Logger.log("Request : /events/register/"+ param.username);
        return await this.eventsService.getAllEventParticipating(param.username);
    }

    /*//get all event by category
    @Get('/categories/:category')
    public async getAllEventByCategory(@Param () param){
        Logger.log("Request : /events/categories/"+ param.category);
        return await this.eventsService.getAllEventByCategory(param.category);
    }*/

}


