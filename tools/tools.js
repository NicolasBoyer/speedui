const execute = require('child_process').exec;

var tools = module.exports = {
	runCommand : (cmd, callback, cwd, noOutput) => {
		const folderExec = cwd || null;
		execute(cmd, {cwd: folderExec}, (error, stdout, stderr) => {
			if (!noOutput) {
				console.log(stdout);
				console.log(stderr);
			}
		});
	}
};