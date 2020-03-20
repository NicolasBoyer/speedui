const executeSync = require('child_process').execSync
const util = require('util')
const executeAsync = util.promisify(require('child_process').exec)

module.exports = {
    runCommandSync: (cmd, options = {}) => {
        const folderExec = options.cwd || null
        if (!options.noOutput) console.log('\n' + cmd + '\n')
        const execOptions = { cwd: folderExec, stdio: 'inherit' }
        if (options.noOutput) execOptions.stdio = 'ignore'
        executeSync(cmd, execOptions)
    },

    runCommandAsync: async (cmd, options = {}) => {
        const folderExec = options.cwd || null
        if (!options.noOutput) console.log('\n' + cmd + '\n')
        const { stdout, stderr } = await executeAsync(cmd, { cwd: folderExec })
        if (!options.noOutput) {
            console.log(stdout)
            console.error(stderr)
        }
    }
}
