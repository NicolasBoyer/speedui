const files = require('./files')
const chalk = require('chalk')

let directory

const parseEnvVars = () => {
    const variables = {}
    const source = files.readFileSync(directory + '/.env')
    source.toString().split(/\n|\r|\r\n/).forEach((line, index) => {
        if (line === '') return
        const parsedLine = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
        // Si match 'KEY=VAL'
        if (parsedLine !== null) {
            const key = parsedLine[1]
            const value = parsedLine[2] || ''
            if (!process.env[key]) process.env[key] = value
            variables[key] = value.trim()
        } else console.log(chalk.red(`La ligne ${index + 1}: ${line} ne respecte pas la forme key=value`))
    })
    return variables
}

const dotenv = module.exports = {
    /**
     * Configure la mise en place du fichier .env et de process.env
     *
     * @export
     * @param {options} { path: string, initVars: [ { x: string } ] }
     */
    config: (options) => {
        directory = options && options.path ? options.path : process.cwd()
        if (!files.fileExists(directory + '/.env')) files.createFile(directory + '/.env')
        else parseEnvVars()
        if (options && options.initVars && options.initVars.length) options.initVars.forEach(async (variable) => dotenv.set(variable))
    },

    /**
     * Assigne une variable dans le fichier .env et dans process.env
     *
     * @export
     * @param {envVar} { x: string }
     */
    set: async (envVar) => {
        if (!files.fileExists(directory + '/.env')) {
            console.log(chalk.red('La methode config() n\'a pas été déclarée lors de l\'initialisation !'))
            return
        }
        const key = Object.keys(envVar)[0]
        const value = Object.values(envVar)[0]
        process.env[key] = value
        const envVars = parseEnvVars()
        envVars[key] = value
        await files.appendFile(directory + '/.env', Object.keys(envVars).map((key) => key + '=' + envVars[key]).join('\n'), true)
    }
}
