import {v4 as uuid} from 'uuid'
import { Device, DeviceBase, DeviceMessage, DevicesMessage, UUID } from '../types';
import { HubRepository } from '../repositories/hubRepository';
import { DeviceRepository } from '../repositories/deviceRepository';
import { NotFoundError } from '../errors';

export class HubService {
    private readonly hubRepository: HubRepository;
    private readonly deviceRepository: DeviceRepository;

    constructor(hubRepository: HubRepository, deviceRepository: DeviceRepository) {
        this.hubRepository = hubRepository;
        this.deviceRepository = deviceRepository;
    }

    private getRemovedAndAddedDevices(currentSet: Device[], newSet: DeviceBase[]) {
        const toRemove = currentSet.filter((device: DeviceBase) => {
            return newSet.every(
                (d: DeviceBase) =>
                    d.ieeeAddress !== device.ieeeAddress || d.model !== device.model || d.vendor !== device.vendor
            );
        });

        const toAdd = newSet.filter((device: DeviceBase) => {
            return currentSet.every(
                (d: DeviceBase) =>
                    d.ieeeAddress !== device.ieeeAddress || d.model !== device.model || d.vendor !== device.vendor
            );
        });

        return { toRemove, toAdd };
    }

    private filterOutConnectorAndMapDevices(message: DevicesMessage) {
        return message.reduce<DeviceBase[]>((acc, device) => {
            if (!device.definition) {
                return acc;
            }

            const {
                definition: { description, vendor, model },
                ieee_address,
                power_source,
            } = device;

            return [
                ...acc,
                {
                    ieeeAddress: ieee_address,
                    vendor,
                    model,
                    powerSource: power_source ?? '',
                    description,
                },
            ];
        }, []);
    }

	async createHub(name: string) {
		const hubId = uuid();
		return await this.hubRepository.create(hubId, name, []);
	}

    async updateHubDevicesFromMessage(hubId: UUID, message: DevicesMessage) {
        const hub = await this.hubRepository.get(hubId);

		if (!hub) {
			throw new NotFoundError(`Hub with id: ${hubId} not found.`);
		}

        const devices = this.filterOutConnectorAndMapDevices(message);

        const { toAdd, toRemove } = this.getRemovedAndAddedDevices(hub.devices, devices);

        return await this.hubRepository.updateHubDevices(hubId, toAdd, toRemove);
    }

    async getHub(id: UUID) {
        return await this.hubRepository.get(id);
    }

    async getAll() {
        return await this.hubRepository.getAll();
    }
}
