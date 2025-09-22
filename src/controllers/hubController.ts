import { Router, Request, Response, NextFunction } from 'express';
import { Keycloak } from '../utils'
import { DevicesMessage, Hub, UUID } from '../types';
import { HubService } from '../services/hubService';
import { BaseController } from './baseController';

export class HubController extends BaseController {
    private readonly url: string = '/hubs';
    private readonly hubService: HubService;

    constructor(keycloak: Keycloak, hubService: HubService) {
        super(keycloak);
        this.hubService = hubService;
    }

    init(router: Router) {
        // router.get(this.url, [keycloak.protect()], this.getHubs);
        router.get(this.url, this.authenticate, this.getHubs);
        router.get(this.url + '/:id', this.getHubById);
        router.post(this.url, this.createHub);
        router.post(this.url + '/:id', this.authenticate, this.updateHubDevicesFromMessage);
    }

    private getHubs = async (req: Request, res: Response<Hub[]>, next: NextFunction) => {
        try {
            const hubs = await this.hubService.getAll();
            res.send(hubs);
        } catch (error) {
            next(error);
        }
    };

    private getHubById = async (req: Request<{ id: UUID }>, res: Response<Hub | null>, next: NextFunction) => {
        try {
            const { id } = req.params;
            const hub = await this.hubService.getHub(id);
            res.send(hub);
        } catch (error) {
            next(error);
        }
    };

	private createHub = async (req: Request<unknown, Hub, { name: string }>, res: Response<Hub>, next: NextFunction) => {
		try {
            const { name } = req.body;
            const hub = await this.hubService.createHub(name)
            res.send(hub);
        } catch (error) {
            next(error);
        }
	}

	private updateHubDevicesFromMessage = async (req: Request<{ id: UUID }, Hub, DevicesMessage>, res: Response<Hub>, next: NextFunction) => {
		try {
			const { id } = req.params
			const message = req.body;
            const hub = await this.hubService.updateHubDevicesFromMessage(id, message);
            res.send(hub);
        } catch (error) {
			console.log(error)
            next(error);
        }
	}
}
