import { createRemoteJWKSet, jwtVerify } from 'jose';

export class Keycloak {
    private readonly issuerUrl: string;
    private readonly realm: string;
    private readonly clientId: string;
    private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

    constructor(url: string, realm: string, clientId: string) {
        this.issuerUrl = `${url}realms/${realm}`;
		this.realm = realm
        this.clientId = clientId;
        const certsUrl = new URL(`http://keycloak:8080/realms/${realm}/protocol/openid-connect/certs`);
        this.jwks = createRemoteJWKSet(certsUrl);

        console.log(certsUrl);
        fetch(certsUrl, {
            method: 'get',
            mode: 'cors',
        })
            .then((value) => {
                console.log('success');
                console.log(value.json());
            })
            .catch((err) => {
                console.log(err);
                console.log(err.message);
            });
    }

    public verify = async (token: string) => {
		console.log('this.issuerUrl');
		console.log(this.issuerUrl);
        const { payload } = await jwtVerify(token, this.jwks, {
            issuer: [`http://keycloak:8080/realms/${this.realm}`, this.issuerUrl],
            audience: [this.clientId, 'account'],
        });

        return payload;
    };
}