import neo4j, { Driver } from 'neo4j-driver'
import { Neo4jConfig } from './neo4j-config.interface'

export const createDriver = async (config: Neo4jConfig) => {
    /*const driver: Driver = neo4j.driver(
        `${config.scheme}://${config.host}:${config.port}`,
        neo4j.auth.basic(config.username, config.password)
    );*/

    const driver: Driver = neo4j.driver(
        'neo4j+s://9158a523.databases.neo4j.io',
        neo4j.auth.basic('neo4j', 'Y1PdVbGPHWJQ94wkXbHT9V-ob8mwblMeIi0DmMr6dYk'),
        { disableLosslessIntegers: true }
    );
    
    await driver.verifyConnectivity()

    return driver;
}