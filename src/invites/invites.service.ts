import { Injectable, Logger, Param } from '@nestjs/common';
import { InvitDto } from './dto/invites.dto';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class InvitesService {
    constructor(
        private readonly neo4jService: Neo4jService
    ) {}

    async inviter(invitDto: InvitDto){

        
        //check user invited exists
        const check1 = await this.neo4jService.read('MATCH (a:USER) WHERE a.username = $username RETURN a',
        {username: invitDto.usernameInvited});        
        
        if(!check1.records.length){
            Logger.log("check 1 failed, invited does not exist");
            return undefined;
        }


        //check if user inviting exists
        const check2 = await this.neo4jService.read('MATCH (a:USER) WHERE a.username = $username RETURN a',
        {username: invitDto.usernameInviting}); 

        if(!check2.records.length){
            Logger.log("check 2 failed, inviting does not exist");
            return undefined;
        }

        
        //check event existing
        const check3 = await this.neo4jService.read('MATCH (a:EVENT) WHERE a.id = $idEvent RETURN a',
        {idEvent: invitDto.idEvent});

        if(!check3.records.length){
            Logger.log("check 3 failed, event does not exist");
            return undefined;
        }

        

        //check not already invited to this event         
        const check4 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:INVITED_TO]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(check4.records.length){
            Logger.log("check 4 failed, already invited to "+invitDto.idEvent);
            return undefined;
        }     
        

        //check user not participating already
        const check5 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:PARTICIPE]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(check5.records.length){
            Logger.log("check 5 failed, already participating to "+invitDto.idEvent);
            return undefined;
        }     

        //check user not the organizer
        const check6 = await this.neo4jService.read('MATCH (b:USER {username: $usernameInvited})<-[:ORGANIZE_BY]-(a:EVENT {id:$idEvent})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(check6.records.length){
            Logger.log("check 6 failed, already organisator to "+invitDto.idEvent);
            return undefined;
        }  

        //check user invited is a friend
        const check7 = await this.neo4jService.read('MATCH (b:USER {username: $usernameInvited})<-[:IS_FRIEND]-(a:USER {username: $usernameInviting})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent, usernameInviting: invitDto.usernameInviting});
        
        if(!check7.records.length){
            Logger.log("check 7 failed, not a friend ");
            return undefined;
        }  


        
        //creating invitation
        const res = await this.neo4jService.write(
            ' MATCH (a:USER), (b:EVENT) WHERE a.username = $usernameInvited AND b.id = $idEvent CREATE (a)-[:INVITED_TO{usernameInviting: $usernameInviting, response: $response}]->(b) RETURN a',
            {usernameInviting: invitDto.usernameInviting, usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent, response: "waiting"}
                )
        return res;
    }

   
    async accepter(invitDto: InvitDto) {

        
        
        //check if invitation already exists
        const check1 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:INVITED_TO]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(!check1.records.length){
            Logger.log("check 1 failed, no invitation "+invitDto.idEvent);
            return undefined;
        }    

        //check if user is already participating
        const check2 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:PARTICIPATE]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(check2.records.length){
            Logger.log("check 2 failed, already participating to "+invitDto.idEvent);
            return undefined;
        }     

        //check if not already refused. To uncoment if a user shouldnot be able to participate to a previously refused event
        /*const check3 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:INVITED_TO {response: "refused"}]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(check3.records.length){
            Logger.log("check 3 failed, already refused to "+invitDto.idEvent);
            return undefined;
        }     */

        //update the response to "accepted"
        const res = await this.neo4jService.write('MATCH (a:EVENT)<-[c:INVITED_TO]-(b:USER {username: $usernameInvited})  SET c.response = "accepted" RETURN c',
        {usernameInvited: invitDto.usernameInvited}
        )

        if(!res.records.length){
            Logger.log("change response in invitation failed");
            return undefined;
        }

        //create relation "PARTICIPATE"
        const res2 = await this.neo4jService.write('MATCH (a:USER), (b:EVENT) WHERE a.username = $usernameInvited AND b.id = $idEvent CREATE (a)-[c:PARTICIPATE]->(b) RETURN c',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        return res2;
        

    }

    
    
    async getAllInvitedTo(@Param('username') username: string) {

        Logger.log("username " + username);
       
        const res = await this.neo4jService.read('MATCH (a:EVENT)<-[:INVITED_TO{response: $response}]-(b:USER {username: $usernameInvited})  RETURN a',
        {response: "waiting", usernameInvited: username});
        
        if(!res.records.length){
            return undefined;
        }

        return res;
        
    }    

    async getAllAccepted(@Param('username') username: string) {

        Logger.log("username " + username);
       
        const res1 = await this.neo4jService.read('MATCH (a:EVENT)<-[:INVITED_TO{response: "accepted"}]-(b:USER {username: "romeo"})  RETURN a as event UNION ALL MATCH (d:USER {username: "romeo"})<-[:ORGANIZED_BY]-(c:EVENT)  RETURN c as event',
        {response: "accepted", usernameInvited: username});
        return res1
       
    } 
    

    /*
    async refused(invitDto: InvitDto) {
       
        //check que l'invitation existe

        const check1 = await this.neo4jService.read('MATCH (a:EVENT {id:$idEvent})<-[:INVITED_TO]-(b:USER {username: $usernameInvited})  RETURN a',
        {usernameInvited: invitDto.usernameInvited, idEvent: invitDto.idEvent});
        
        if(!check1.records.length){
            Logger.log("check 1 failed, no invitation "+invitDto.idEvent);
            return undefined;
        }   


        //update la réponse de l'invitation

        const res = await this.neo4jService.write('MATCH (a:EVENT)<-[c:INVITED_TO]-(b:USER {username: $usernameInvited})  SET c.response = "refused" RETURN c',
        {usernameInvited: invitDto.usernameInvited}
        )

        if(!res.records.length){
            Logger.log("change response in invitation failed");
            return undefined;
        }
    }
    */
    
}



