import { Injectable, Logger, Param } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { Neo4jService } from 'nest-neo4j/src/neo4j.service';
import { v4 as uuidv4 } from 'uuid';
import { EventDtoWithUsername } from './dto/eventWithUsername.dto';
import { identity } from 'rxjs';

@Injectable()
export class EventsService {
    constructor(
        private readonly neo4jService: Neo4jService
    ) {}
    
    async findById(@Param('id') idFromParam: string): Promise<Event>{
        
        const res = await this.neo4jService.read('MATCH (u:EVENT{id:$id}) RETURN u AS event', {id:idFromParam});
        Logger.log("record" + res.records[0].get('event'));
        return res.records[0].get('event');
    }

    async findAll(): Promise<any> {
        
        const res = await this.neo4jService.read('MATCH (u:EVENT) RETURN u');
        
        Logger.log("length records :" + res.records.length)
        res.records.forEach( u => Logger.log("one event from all :" + u))

        return res.records;        
    }

    async createEvent(event: EventDtoWithUsername): Promise<Event>{

        const id = uuidv4();
        const res = await this.neo4jService.write(
            'CREATE (event:EVENT{id:$id, name: $name, starting_date: $starting_date, ending_date: $ending_date, description: $description}) RETURN event',
            {id: id, name: event.name, starting_date: event.starting_date, ending_date: event.ending_date, description: event.description})
             
        if ( !res.records.length ) {
            return null;
        }
        else{
            Logger.log("création de la relation organisé par" + event.username + " event : " + event.name + " event.id " + id)
            await this.neo4jService.write(
                'MATCH (a:EVENT), (b:USER) WHERE a.id = $id AND b.username = $username CREATE (a)-[:ORGANISE_PAR]->(b)',
                {id: id, username: event.username})
            
            return res.records[0].get('event');
        }
        
    }

    async deleteEvent(event : EventDto) {

        Logger.log("delete de l'event avec l'id : "+ event.id);
        await this.neo4jService.write(
            'MATCH (a:EVENT) WHERE a.id = $id DETACH DELETE a',
            {id: event.id}
        )

            
    }

    async updateEvent(event : EventDto) {
        Logger.log("update de l'event avec l'id : "+ event.id);
        await this.neo4jService.write(
        'MATCH (a:EVENT) WHERE a.id=$id SET a={name: $name, starting_date: $starting_date, ending_date: $ending_date, description: $description}',
        {id: event.id, name: event.name, starting_date: event.starting_date, ending_date: event.ending_date, description: event.description}
        )
    }
}



