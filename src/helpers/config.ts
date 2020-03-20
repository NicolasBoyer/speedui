/* eslint-disable @typescript-eslint/naming-convention */
import { UTILS } from 'wapitis'
import conf from '../www/assets/speedui.json'

// export const cloudinary = {
//     cloudName: 'elendil',
//     defaultImage: 'BestWhisky/default',
//     uploadPreset: 'bestwhisky',
//     url: 'https://api.cloudinary.com/v1_1/'
// }

// Marche pas car besoin d'attre en sync !!! ET pas sur de voir comment ça va se passer au final
let WEBSITECONFIG: any = {}
UTILS.getFile(conf).then((fileText) => WEBSITECONFIG = fileText)

// TODO A voir comment gérer les config et l'install de speedui qui abesoin de wapitis -> peut etre necessité d'un speedui.conf.json
// TODO même pb avec le icon.svg qui devra etre spécifique à speedui mais quand même intégré
export const WEBSITE = {
    // firebase: new Firebase(),
    // isSubHeader: true,
    // toast: {},
    // user: null
    homeUrl: location.href.includes('localhost') ? 'http://localhost:4444/' : WEBSITECONFIG.homeUrl
}
