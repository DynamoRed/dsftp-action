import { endAction } from "./action.util";
import { IParams } from './interfaces/params.interface';

const validateParams = (runner: string, params: IParams) => {
	if(params.host.length < 4) return endAction(`[dSFTP] Upload ${runner} failed. Invalid host !`);
	if(params.user.length < 1) return endAction(`[dSFTP] Upload ${runner} failed. Invalid user name !`);

	return;
}

export { validateParams }