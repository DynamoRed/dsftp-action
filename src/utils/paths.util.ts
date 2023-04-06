import * as core from '@actions/core';
import Client from 'ssh2-sftp-client';

import * as fs from 'fs';
import * as path from 'path';

import { endAction } from "./action.util";
import { IPaths } from "./interfaces/paths.interface";

const validatePaths = (runner: string, paths: string): IPaths => {
	let formattedPaths = {};
	try {
		formattedPaths = JSON.parse(paths);

	} catch(e){
		endAction(`[dSFTP] Upload ${runner} failed. Invalid 'paths' parameter. Are you sure it is a valid key/value object ?`, e as string);
	}
	return formattedPaths;
}

const uploadPath = async (runner: string, sftp: Client, local: string, remote: string): Promise<string> => {
	const localIsDir: boolean = fs.lstatSync(local).isDirectory();

	if(!(await sftp.stat(remote)).isDirectory){
		endAction(`[dSFTP] Upload ${runner} failed. Remote folder isn't a valid folder !`, 'Not a folder: ' + remote);
		return `Remote folder isn't a valid folder !`;
	}

	const remoteDir = await sftp.realPath(localIsDir ? path.join(remote, path.basename(local)) : remote);
	if(!(await sftp.exists(remoteDir))){
		core.notice(`[dSFTP] ${remoteDir} folder does not exist, creating it...`);
		await sftp.mkdir(remoteDir, true);
	} else if(localIsDir){
		await sftp.rmdir(remoteDir, true);
		await sftp.mkdir(remoteDir, true);
	}

	core.info(`[dSFTP] Uploading '${local}' ${localIsDir ? 'content':''} to '${remoteDir}'...`);

	return localIsDir ? sftp.uploadDir(local, remoteDir) : sftp.put(fs.createReadStream(local), path.join(remote, path.basename(local)));
}

export { validatePaths, uploadPath }