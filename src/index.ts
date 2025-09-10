import dotenv from 'dotenv';
import { PrismaClient } from '../prisma/client';
import { HubRepository } from './repositories/hubRepository';
import { DeviceRepository } from './repositories/deviceRepository';
import { HubService } from './services/hubService';
import { HubController } from './controllers/hubController'
import { HttpServer } from './httpServer';
import { Keycloak } from './utils/keycloak'

(async () => {
	dotenv.config();
    const { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT } = process.env;
    const prismaClient = new PrismaClient();
    await prismaClient.$connect();
    const hubRepository = new HubRepository(prismaClient);
    const deviceRepository = new DeviceRepository(prismaClient);
    const hubService = new HubService(hubRepository, deviceRepository);
    const hubController = new HubController(hubService);
    const keycloak = new Keycloak(KEYCLOAK_REALM, KEYCLOAK_URL, KEYCLOAK_CLIENT);

    new HttpServer([hubController], keycloak, async () => {
        await prismaClient.$disconnect();
    });

	// const response = await fetch(`http://localhost:8080/realms/konektix_realm/protocol/openid-connect/token `, {
	// 	method: 'POST',
	// 	// body: JSON.stringify({ clientId: 'hub-manager', enabled: true, clientAuthenticatorType: 'client-secret', secret: 'thisissecret' }),
	// 	body: new URLSearchParams({
    //     'grant_type': 'client_credentials',
    //     'client_id': 'hub-manager',
    //     'client_secret': 'nNViRBMUgCbGkRzJiZsu'
    // })
	// })

	// const r = await response.json()
	// console.log(r)
})();
