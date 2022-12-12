import { Injectable, Logger, Param } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { Neo4jService } from '../neo4j/neo4j.service';
import { v4 as uuidv4 } from 'uuid';
import { EventDtoWithUsername } from './dto/eventWithUsername.dto';

@Injectable()
export class EventsService {
    constructor(
        private readonly neo4jService: Neo4jService
    ) {}
    
    async findById(@Param('id') idFromParam: string): Promise<Event>{
        Logger.log(idFromParam);
        const res = await this.neo4jService.read('MATCH (u:EVENT{id:$id}) RETURN u AS event', {id:idFromParam});

        return res.records[0].get('event');
    }

    async createEvent(event: EventDtoWithUsername): Promise<Event>{
        const res = await this.neo4jService.write(
            'CREATE (event:EVENT{id:$id, name: $name, starting_date: $starting_date, ending_date: $ending_date, description: $description}) RETURN event',            
             {id: uuidv4.v4(), name: event.name, starting_date: event.starting_date, ending_date: event.ending_date, description: event.description})
             
        if ( !res.records.length ) {
            return null;
        }
        else{
            await this.neo4jService.write(
                'CREATE(organised_By:$eventCreated)-[:ORGANISE_PAR]->(user:$username) ',           
                 {eventCreated: res, username: event.username})
                 return res.records[0].get('event');
        }
        
    }
}



