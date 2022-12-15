import { Node } from "neo4j-driver";

export class EventEntity {  

    constructor(private readonly node: Node) {}

    getId(): string {
        return (<Record<string, any>> this.node.properties).id
    }

    getName(): string {
        return (<Record<string, any>> this.node.properties).name
    }

    getStartingDate(): Date {
        return (<Record<string, any>> this.node.properties).starting_date
    }

    getEndingDate(): Date {
        return (<Record<string, any>> this.node.properties).ending_date
    }
e
    getCreationDate(): Date {
        return (<Record<string, any>> this.node.properties).creation_date
    }
  
    getDescription(): string {
        return (<Record<string,any>> this.node.properties).description
    }
}

