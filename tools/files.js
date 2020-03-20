const fsExtra = require('fs-extra')
const fs = require('fs')
const path = require('path')

const files = module.exports = {
    getCurrentDirectoryBase: () => {
        return path.basename(process.cwd())
    },

    directoryExists: (filePath) => {
        try {
            return fs.statSync(filePath).isDirectory()
        } catch (err) {
            return false
        }
    },

    fileExists: (filePath) => {
        try {
            return fs.existsSync(filePath)
        } catch (err) {
            return false
        }
    },

    getFileInCurrentContext: (filePath) => {
        return path.resolve(__dirname, filePath)
    },

    createDir: (name) => {
        var dir = './' + name
        if (!fs.existsSync(dir)) fs.mkdirsSync(dir)
        return dir
    },

    createFile: (filePath) => {
        return fs.writeFileSync(filePath, '')
    },

    appendFile: async (file, text, replace) => {
        try {
            if (replace) {
                if (fs.existsSync(file)) fs.unlinkSync(file)
                await fsExtra.outputFile(file, text)
            } else {
                await fs.promises.appendFile(file, text)
            }
        } catch (error) {
            console.error(error)
        }
    },

    removeDir: (filePath, excludes = []) => {
        if (fs.existsSync(filePath)) {
            try {
                fs.readdirSync(filePath).forEach((file) => {
                    var curPath = filePath + '/' + file
                    if (!excludes.includes(file)) {
                        if (fs.lstatSync(curPath).isDirectory()) files.removeDir(curPath, excludes)
                        else fs.unlinkSync(curPath)
                    }
                })
                fs.rmdirSync(filePath)
            } catch (error) { }
        }
    },

    removeFile: (filePath) => {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    },

    remove: (filePath, excludes = []) => {
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) files.removeDir(filePath, excludes)
        else files.removeFile(filePath)
    },

    readFile: async (filePath) => {
        if (fs.existsSync(filePath)) return fs.promises.readFile(filePath, 'utf8')
    },

    readFileSync: (filePath) => {
        if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf8')
    },

    readDir: async (name) => {
        var dir = './' + name
        if (fs.existsSync(dir)) return fs.promises.readdir(dir)
    },

    getAllFiles: (dir, excludes = [], filelist = { allFiles: [], tsCommonFiles: [], tsPageFiles: [], importFiles: [], cssFiles: [], jsFiles: [], htmlFiles: [], imgFiles: [], mediasFiles: [], attachmentsFiles: [], datasFiles: [], fontsFiles: [] }) => {
        fs.readdirSync(dir).forEach(file => {
            if (fs.statSync(path.join(dir, file)).isDirectory() && !excludes.includes(file)) filelist = files.getAllFiles(path.join(dir, file), excludes, filelist)
            else {
                if (!excludes.includes(file)) filelist.allFiles = filelist.allFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:ts|tsx)$/)) filelist.tsCommonFiles = filelist.tsCommonFiles.concat(path.join(dir, file))
                // if ((file.includes('.ts') || file.includes('.tsx')) && !file.includes('main_core')) filelist.tsCommonFiles = filelist.tsCommonFiles.concat(path.join(dir, file));
                // if ((file.includes('.ts') || file.includes('.tsx')) && file.includes('main_core/ts/pages')) filelist.tsPageFiles = filelist.tsPageFiles.concat(path.join(dir, file));
                if (path.extname(file).toLowerCase().match(/\.(?:ts|tsx)$/) && !file.includes('main_core')) filelist.importFiles = filelist.importFiles.concat({ name: file !== 'svg.js' ? file.substring(0, file.lastIndexOf('.')) : file, path: path.join(dir, file) })
                if (path.extname(file).toLowerCase().match(/\.(?:css)$/)) filelist.cssFiles = filelist.cssFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:js)$/) && !excludes.includes(file)) filelist.jsFiles = filelist.jsFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:html|xhtml)$/)) filelist.htmlFiles = filelist.htmlFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:svg|png|jpg|gif)$/)) filelist.imgFiles = filelist.imgFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:srt|vtt|avi|mov|mp3|mp4|mpg|opus|webm)$/)) filelist.mediasFiles = filelist.mediasFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:doc|docx|odg|odp|ods|odt|pdf|ppt|rtf|xls|xlsx|zip)$/)) filelist.attachmentsFiles = filelist.attachmentsFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:json|txt|xml)$/)) filelist.datasFiles = filelist.datasFiles.concat(path.join(dir, file))
                if (path.extname(file).toLowerCase().match(/\.(?:eot|ttf|woff|woff2|otf)$/)) filelist.fontsFiles = filelist.fontsFiles.concat(path.join(dir, file))
            }
        })
        return filelist
    },

    writeFile: async (filePath, message) => {
        if (fs.existsSync(filePath)) return fs.promises.writeFile(filePath, message)
    },

    createWriteStream: (filePath) => {
        return fs.createWriteStream(filePath)
    },

    createReadStream: (filePath) => {
        return fs.createReadStream(filePath)
    },

    copy: async (oldFile, newFile) => {
        if (fs.existsSync(oldFile)) {
            try {
                await fsExtra.copy(oldFile, newFile)
            } catch (error) {
                console.error(error)
            }
        } else console.log('Le fichier ' + oldFile + " n'existe pas.")
    },

    watchFile: async (filePath) => {
        return fs.promises.watchFile(filePath)
    },

    getModifiedTimeFileSync: (filePath) => {
        return fs.statSync(filePath).mtime
    },

    rename: async (oldName, newName) => {
        try {
            await fs.promises.rename(oldName, newName)
        } catch (error) {
            console.error(error)
        }
    }
}
