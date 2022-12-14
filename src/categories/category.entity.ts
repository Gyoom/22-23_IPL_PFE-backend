import { Node } from "neo4j-driver";

export class CategoryEntity {  

    constructor(private readonly node: Node) {}

    getName(): string {
        return (<Record<string, any>> this.node.properties).name
    }

    getDescription(): string {
        return (<Record<string, any>> this.node.properties).description
    }

}
