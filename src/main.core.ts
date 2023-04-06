import * as core from '@actions/core';
import Client, { ConnectOptions } from 'ssh2-sftp-client';
import { v4 as uuidV4 } from 'uuid';

import { IParams } from './utils/interfaces/params.interface';
import { validatePaths, uploadPath } from './utils/paths.util';
import { endAction } from './utils/action.util';
import { validateParams } from './utils/params.util';

const runner: string = uuidV4();
const client = new Client(runner);

const params: IParams = {
	host: core.getInput('host').trim(),
	user: core.getInput('user').trim(),
	password: core.getInput('password'),
	paths: validatePaths(runner, core.getInput('paths').trim()),
	port: core.getInput('port') ? Number.parseInt(core.getInput('port')) : 22
}

if(core.getInput('key').length > 0){
	params.key = core.getInput('key');
	if(core.getInput('keyPassphrase').length > 0) params.keyPassphrase = core.getInput('keyPassphrase');
	if(core.getInput('agent').length > 0) params.agent = core.getInput('agent');
}

validateParams(runner, params);

core.info(`[dSFTP] Starting SFTP Upload (${runner}) on ${params.host}:${params.port}`);

const connectionOpts: ConnectOptions = {
	host: params.host,
	port: params.port,
	username: params.user,
	password: params.password,
	agent: params.agent,
	privateKey: params.key,
	passphrase: params.keyPassphrase
}

client.connect(connectionOpts).then(async () => {
	core.info('[dSFTP] Connection OK');
	core.notice('[dSFTP] Starting upload...');

	await Promise.all(
		Object.keys(params.paths).map(async (k) => {
			await uploadPath(runner, client, k, params.paths[k]);
		})
	);
}).then(() => {
	core.notice('[dSFTP] Ending connection...');
	client.end().then(() => core.info('[dSFTP] Upload ended'));
}).catch((e) => endAction(`[dSFTP] Upload ${runner} failed. You will find the error juste above.`, e))