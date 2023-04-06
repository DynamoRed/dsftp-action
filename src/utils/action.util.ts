import * as core from '@actions/core';

const endAction = (message: string, error?: string) => {
	if(error) core.error(error);
	core.setFailed(message);
	process.exit(1);
}

export { endAction }