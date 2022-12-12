import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
    imports: [],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService],
}) 

export class EventsModule {}
