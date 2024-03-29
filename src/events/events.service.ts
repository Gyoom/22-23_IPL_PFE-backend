import { Injectable, Logger, Param } from '@nestjs/common';
import { EventDto } from './dto/event.dto';
import { v4 as uuidv4 } from 'uuid';
import { EventDtoWithUsername } from './dto/eventWithUsername.dto';
import { Neo4jService } from 'nest-neo4j/dist';
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
        
        const res = await this.neo4jService.read('MATCH (u:EVENT:PUBLIC) RETURN u');
        
        Logger.log("length records :" + res.records.length)
        res.records.forEach( u => Logger.log("one event from all :" + u))

        return res.records;        
    }

    async createEvent(event: EventDtoWithUsername): Promise<Event>{

        //object category
        /*//check if category exists
        const check1 = await this.neo4jService.read('MATCH (u:CATEGORY {name: $name}) RETURN u AS category',
        {name: event.category});

        if(!check1.records.length){
            Logger.log("check 1 failed, category does not exist");
            return undefined;

        }*/

        //check event not with same name
        const check1 = await this.neo4jService.read('MATCH (n:EVENT {name: $name}) RETURN n AS event',
        {name: event.name})

        if(check1.records.length){
            Logger.log("check 1, event already exists");
            return undefined;
        }


        const id = uuidv4();
        var res;

        //Try to make the create event in one query with statut
        if(event.statut == "public") {
            Logger.log("create public event")
             res = await this.neo4jService.write(
                'CREATE (event:EVENT:PUBLIC {id:$id, name: $name, starting_date: $starting_date, ending_date: $ending_date, creation_date: $creation_date, description: $description}) RETURN event',
                {id: id, name: event.name, starting_date: event.starting_date, ending_date: event.ending_date, creation_date: event.creation_date, description: event.description});       
        }
        if(event.statut == "private") {
            Logger.log("create private event")
            res = await this.neo4jService.write(
                'CREATE (event:EVENT:PRIVATE {id:$id, name: $name, starting_date: $starting_date, ending_date: $ending_date, creation_date: $creation_date, description: $description}) RETURN event',
                {id: id, name: event.name, starting_date: event.starting_date, ending_date: event.ending_date, creation_date: event.creation_date, description: event.description});       
        }
        
        
        //Event not created    
        if ( !res.records.length ) {
            Logger.log("Event creation failed");
            return null;
        }
        else{

            Logger.log("creation of relation ORGANISED_BY");
            //creation of relation "ORGANISED_BY"
            const res2 = await this.neo4jService.write(
                'MATCH (a:EVENT), (b:USER) WHERE a.id = $id AND b.username = $username CREATE (a)-[:ORGANIZED_BY]->(b)',
                {id: id, username: event.username})

            if(res2.records.length){
                Logger.log("relation 'ORGANIZED_BY' not created");
                return undefined;
            }

            //object category
            /*Logger.log("creation of relation HAS_FOR_CATEGORY");
            //creation of relation "HAS_FOR_CATEGORY"
            const res3 = await this.neo4jService.write('MATCH (a:EVENT), (b:CATEGORY) WHERE a.id = $id AND b.name = $category CREATE (a)-[:HAS_FOR_CATEGORY]->(b)',
            {id: id, category: event.category, event: event.id})

            if(res3.records.length){
                Logger.log("relation 'ORGANIZED_BY' not created");
                return undefined;
            }*/
            
            return res.records[0].get('event');

        }
        
    }

    async deleteEvent(eventWithUsername : EventDtoWithUsername) {

        //check if organiser
        const check1 = await this.neo4jService.write(
            'MATCH (b:USER {username: $usernameInvited})<-[:ORGANIZED_BY]-(a:EVENT {id:$id})  RETURN a',
            {usernameInvited: eventWithUsername.username, id: eventWithUsername.id}
        )
        if(!check1.records.length){
            Logger.log("check1 failed : is not the organisator");
            return undefined;
        }


        //check que l'event existe
        const res = await this.neo4jService.write(
            'MATCH (a:EVENT) WHERE a.id = $id RETURN a AS event',
            {id: eventWithUsername.id}
        )
        if(!res.records.length){
            Logger.log("event does not exist");
            return undefined;
        }



        Logger.log("delete de l'event avec l'id : "+ eventWithUsername.id);
        const res2 = await this.neo4jService.write(
            'MATCH (a:EVENT) WHERE a.id = $id DETACH DELETE a RETURN a AS event',
            {id: eventWithUsername.id}
        )
        return res.records[0].get('event');

            
    }

    
    async getAllEventParticipating(@Param('username') username: string){

        const res = await this.neo4jService.read('MATCH (a:EVENT)<-[:PARTICIPATE]-(b:USER {username: $username})  RETURN a as event UNION ALL MATCH (c:USER{username: $username})<-[:ORGANIZED_BY]-(d:EVENT) RETURN d as event',
        {username: username}
        )
        return res;
    }

    async participate(eventDtoWithUsername: EventDtoWithUsername){

        //check que l'event existe

        const check1 = await this.neo4jService.read('MATCH (n:EVENT {id: $id}) RETURN n AS event',
        {id: eventDtoWithUsername.id})

        if(!check1.records.length){
            Logger.log("check 1, event does not exists");
            return undefined;
        }

        //check if organiser
        const check2 = await this.neo4jService.write(
            'MATCH (b:USER {username: $usernameInvited})<-[:ORGANIZED_BY]-(a:EVENT {id:$id})  RETURN a',
            {usernameInvited: eventDtoWithUsername.username, id: eventDtoWithUsername.id}
        )
        if(check2.records.length){
            Logger.log("check2 failed : is the organisator");
            return undefined;
        }

        //check que participe pas déjà

        const check3 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:PARTICIPATE]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id});
        
        if(check3.records.length){
            Logger.log("check 3 failed, already participating to "+eventDtoWithUsername.id);
            return undefined;
        }   

       

        //check if event is private
        const check4 = await this.neo4jService.read('MATCH (a:EVENT:PRIVATE) WHERE a.id=$idEvent RETURN a.name',
        {idEvent: eventDtoWithUsername.id});
        
        if(check4.records.length){

            Logger.log("Event is private");

            //check if invited
            const check5 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:INVITED_TO {response: $response}]-(b:USER {username: $usernameInvited})  RETURN a',
            {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id, response: "waiting"});
        
            if(check5.records.length){

                Logger.log("check 5 , there is an invitation to : "+eventDtoWithUsername.id);
                const res = await this.neo4jService.write('MATCH (a:EVENT)<-[c:INVITED_TO]-(b:USER {username: $usernameInvited})  SET c.response = "accepted" RETURN c',
                {usernameInvited: eventDtoWithUsername.username}
                )
            }else{
                Logger.log("check 5 ,no invitation for the private event");
                return undefined
            } 

            //create relation
            const res = await this.neo4jService.write('MATCH (a:USER), (b:EVENT) WHERE a.username = $usernameInvited AND b.id = $idEvent CREATE (a)-[c:PARTICIPATE]->(b) RETURN c',
            {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id});
        
            return res;

        } else{

            //create relation

            Logger.log("check 4, event is not private. Creating participation")
            const res = await this.neo4jService.write('MATCH (a:USER), (b:EVENT) WHERE a.username = $usernameInvited AND b.id = $idEvent CREATE (a)-[c:PARTICIPATE]->(b) RETURN c',
            {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id});
        
            return res;
        }
    }

    async unparticipate(eventDtoWithUsername: EventDtoWithUsername){
       
        
   
        //check que l'invitation existe

        const check1 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:INVITED_TO]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id});
        
        if(check1.records.length){

                    
            //update la réponse de l'invitation
            Logger.log("has an invitation "+eventDtoWithUsername.id);
            const res = await this.neo4jService.write('MATCH (a:EVENT)<-[c:INVITED_TO]-(b:USER {username: $usernameInvited})  SET c.response = "refused" RETURN c',
            {usernameInvited: eventDtoWithUsername.username}
            )
            

            if(!res.records.length){
                Logger.log("change response in invitation failed");
                return undefined;
            }
            Logger.log("change response in invitation to refused");
        }   






        //check if participate
        const check2 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:PARTICIPATE]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id});

        if(check2.records.length){
            Logger.log("is participating to "+eventDtoWithUsername.id);
            //delete relation
                const res2 = await this.neo4jService.write('MATCH (a:EVENT {id:$idEvent})<-[c:PARTICIPATE]-(b:USER {username: $usernameInvited})  DELETE c RETURN b',
                {usernameInvited: eventDtoWithUsername.username, idEvent: eventDtoWithUsername.id});
               
                if(!res2.records.length){
                    Logger.log("delete relation failed");
                    return undefined;
                }
                Logger.log("unparticipate succesful");

                return res2;

        }     

        
    }
    
    /*async getAllEventByCategory(@Param('category') category: string){
        const res = await this.neo4jService.read('MATCH (a:CATEGORY {name: $category})<-[:HAS_FOR_CATEGORY]-(b:EVENT)  RETURN a',
        {category: category}
        )
        return res;
    }*/


   //update event
    /*
    async updateEvent(event : EventDto) {

        //check if organiser

        //check if event exists
        const previousEvent = await this.neo4jService.read('MATCH (n:EVENT {id: $id}) RETURN n AS event',
        {id: event.id})

        if(!previousEvent.records.length){
            Logger.log("event does not exists");
            return undefined;
        }

        //check dates
        //TO DO

        //update user
        //check if statut changed
        //TO DO

        //category object
        //check if category changed
        //if category different check it exists

        Logger.log("update de l'event avec l'id : "+ event.id);
        const res = await this.neo4jService.write(
        'MATCH (a:EVENT) WHERE a.id=$id SET a={name: $name, starting_date: $starting_date, ending_date: $ending_date, description: $description, id: $id} RETURN a AS event',
        {id: event.id, name: event.name, starting_date: event.starting_date, ending_date: event.ending_date, description: event.description}
        )
        return res.records[0].get('event');
    }
    */

}



