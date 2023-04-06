import { IPaths } from "./paths.interface";

export interface IParams {
	host: string;
	user: string;
	password: string;
	paths: IPaths;

	port?: number;

	agent?: string;
	key?: string;
	keyPassphrase?: string;
}