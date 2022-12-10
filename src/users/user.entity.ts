import { Node } from "neo4j-driver";

export class UserEntity {  

    constructor(private readonly node: Node) {}

    getId(): string {
        return (<Record<string, any>> this.node.properties).id
    }

    getPassword(): string {
        return (<Record<string, any>> this.node.properties).password
    }

    getUsername(): string {
        return (<Record<string, any>> this.node.properties).username
    }

    getEmail(): string {
        return (<Record<string, any>> this.node.properties).email
    }
  
}
