import dotenv from 'dotenv';
import { PrismaClient } from '../prisma/client';
import { HubRepository } from './repositories/hubRepository';
import { DeviceRepository } from './repositories/deviceRepository';
import { HubService } from './services/hubService';
import { HubController } from './controllers/hubController'
import { HttpServer } from './httpServer';
import { Keycloak } from './utils'

(async () => {
	dotenv.config();
    const { KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT } = process.env;
    const prismaClient = new PrismaClient();
    await prismaClient.$connect();
    const hubRepository = new HubRepository(prismaClient);
    const deviceRepository = new DeviceRepository(prismaClient);
    const hubService = new HubService(hubRepository, deviceRepository);
    const keycloak = new Keycloak(KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT);
    const hubController = new HubController(keycloak, hubService);

    new HttpServer([hubController], async () => {
        await prismaClient.$disconnect();
    });
})();
