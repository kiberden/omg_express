var nconf = require('nconf');
var path = require('path');

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, "config.json" )});      //задаем пусть, откуда читать фаил конфигураций
                                                               //имя дериктории + имя фаила
module.exports = nconf;