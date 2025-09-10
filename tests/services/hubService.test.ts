import { PrismaClient, Prisma } from '../../prisma/client';
import { DefaultArgs } from '../../prisma/client/runtime/library';
import { HubService } from '../../src/services/hubService'
import { HubRepository } from '../../src/repositories/hubRepository';
import { DeviceRepository } from '../../src/repositories/deviceRepository';
import { DeviceBase, DeviceMessage, UUID } from '../../src/types';
import devicesMessage from './testData/devices.json';

describe('HubService', () => {
    let prismaClient: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    let hubRepository: HubRepository;
    let deviceRepository: DeviceRepository;
    let hubService: HubService;	

    beforeAll(async () => {
        prismaClient = new PrismaClient();
        hubRepository = new HubRepository(prismaClient);
        deviceRepository = new DeviceRepository(prismaClient);
        hubService = new HubService(hubRepository, deviceRepository);

        await prismaClient.$connect();
    });

    afterAll(async () => {
        await prismaClient.$disconnect();
    });

	

	afterEach(async () => {
		
	})

    describe('creating a hub', () => {
		let hubId: UUID;

		beforeEach(async () => {
			const { id } = await hubService.createHub('Test hub');
			hubId = id;
		})

		afterEach(async () => {
            const deleteDevices = prismaClient.device.deleteMany();
            const deleteHubs = prismaClient.hub.deleteMany();

            await prismaClient.$transaction([deleteDevices, deleteHubs]);
        });


        

        // it('should create a new hub successfully', async () => {
        //     const hub = await hubService.createHubWithDevices(hubId, []);

        //     expect(hub.id).toBe(hubId);
        //     expect(hub.devices).toEqual([]);
        // });

        // it('should create a new hub with devices', async () => {
        //     const devices: DeviceBase[] = [
        //         {
        //             ieeeAddress: '123',
        //             vendor: 'vendor_1',
        //             model: 'model_1',
        //             powerSource: 'battery',
        //             description: '',
        //         },
        //         {
        //             ieeeAddress: '456',
        //             vendor: 'vendor_2',
        //             model: 'model_2',
        //             powerSource: 'mains',
        //             description: '',
        //         },
        //     ];

        //     const result = await hubService.createHubWithDevices(hubId, devices);

        //     expect(result.id).toBe(hubId);
        //     expect(result.devices).toHaveLength(2);
        // });

        // it('should update empty hub devices to non empty from mqtt message', async () => {
        //     // Act
		// 	const result = await hubService.updateHubDevicesFromMessage(hubId, devicesMessage);

		// 	// Assert
        //     expect(result.id).toBe(hubId);
        //     expect(result.devices).toHaveLength(2);
        // });

		it('should update non empty hub devices to empty from mqtt message', async () => {
			// Arrange
            await hubService.updateHubDevicesFromMessage(hubId, devicesMessage);

			// Act
			const result = await hubService.updateHubDevicesFromMessage(hubId, []);

			// Assert
            expect(result.id).toBe(hubId);
			result.devices.forEach((device) => {
				expect(device.removed).toBe(true)
			});
        });


        // it('should update non empty hub devices from mqtt message', async () => {
		// 	// Arrange
        //     const devicesMessageWithFirstDevice = devicesMessage.filter(
        //         ({ ieee_address }: DeviceMessage) => ieee_address !== '0x00124b002a557930'
        //     );

        //     const devicesMessageWithSecondDevice = devicesMessage.filter(
        //         ({ ieee_address }: DeviceMessage) => ieee_address !== '0x00124b00258a501d'
        //     );

        //     await hubService.updateHubDevicesFromMessage(hubId, devicesMessageWithFirstDevice);

		// 	// Act
        //     const result = await hubService.updateHubDevicesFromMessage(
        //         hubId,
        //         devicesMessageWithSecondDevice
        //     );

		// 	// Assert
        //     expect(result.devices).toHaveLength(2);
        //     expect(result.devices.find((device) => device.ieeeAddress === '0x00124b002a557930')?.removed).toBe(false);
        //     expect(result.devices.find((device) => device.ieeeAddress === '0x00124b00258a501d')?.removed).toBe(true);
        // });

        
    });
});
