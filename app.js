var express = require('express');                                    //подключаем модули, с которыми будем работать
var http = require('http');
var path = require('path');
var nconf = require('config');
var pattern = require('ejs-locals');
var mongoose = require('config/schema');

var app = express();


//конфигурация: пусть к фаилу с настроиками
/*nconf.argv()
    .env()
    .file({ file: "config/config.json" });  */



app.engine('ejs', pattern);                  //используем шаблонизатор ejs-local для обработки файлоф с расширением.ejs
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.set('port', nconf.get('port'));
http.createServer(app).listen(app.get('port'), function(){                          //создаем сервер, считываем настроики с config.json
    console.log('Express server listening on port ' + nconf.get('port'));
});

// all environments
///------cookie settings
app.use(express.cookieParser());                             //подключаем возможность работы с куками

var MongoStore = require('connect-mongo')(express);                         //подключаем этот модуль для возможности записи куков в mongodb
app.use(express.session({
    secret: nconf.get('session:secret'),    //random generation, unique               //задаем настроики куков, считывая их из config
    key: nconf.get('session:key'),
    cookie: nconf.get('session:cookie'),
    store: new MongoStore({ mongoose_connection: mongoose.connection })
})); //set cookie connect.sid
/////---------------------
app.use(express.favicon());                                                  //подключаем остальные модули инфа тут http://nodeguide.ru/doc/modules-you-should-know/express/
app.use(express.logger('dev'));                                              //
app.use(express.json());                                                     // возможность работы с json запросами
app.use(express.urlencoded());                                               //работа с url
app.use(express.methodOverride());
app.use(express.bodyParser());                                               //модуль для работы с POST запросами
//app.use(express.multipart());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(app.router);                                                        //так как мы вынесли работу со ссылками целиком в route - нужно его подключить
require('./routes/routes')(app);


